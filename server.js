require("dotenv").config();

const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const app = express();

const cors = require("cors");
const connectDB = require("./db/connect");
const MarketplaceRouter = require("./routes/marketplace");
const CartRouter = require("./routes/cart");
const AuctionRouter = require("./routes/auction");
const Subscribe = require("./routes/newsletter");
const { clearCart } = require("./controllers/cart");

const errorHandlerMiddleware = require("./middlewares/error-handler");
const notFoundMiddleware = require("./middlewares/not-found");

const allowedOrigins = [
  "http://localhost:5173",
  // "https://your-frontend-domain.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PATCH,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/marketplace", MarketplaceRouter);
app.use("/cart", CartRouter);
app.use("/auctions", AuctionRouter);
app.use("/", Subscribe);

app.post("/checkout", async (req, res) => {
  try {
    console.log(req.body);
    const { products, userId } = req.body;
    let lineItems = [];

    if (products.length === 0) {
      return res.status(400).json({ message: "No products provided" });
    }

    if (!userId) {
      return res.status(400).json({ message: "No user Id" });
    }

    products.forEach((product) => {
      lineItems.push({
        price: product.stripePriceId,
        quantity: product.quantity,
      });
    });

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/payment-failure`,
      metadata: {
        userId: userId,
      },
    });

    res.send(JSON.stringify({ url: session.url }));
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/clear-cart", async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ message: "session_id is required" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const userId = session.metadata.userId;
    const result = await clearCart(userId);
    if (result.success) {
      return res
        .status(200)
        .json({ status: "success", message: result.message });
    } else {
      return res.status(500).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Error clearing cart" });
  }
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log(`Server is running on port ${PORT}....`));
  } catch (error) {
    console.error(error);
  }
};

start();
