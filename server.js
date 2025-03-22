require("dotenv").config();

const express = require("express");
const app = express();

const cors = require("cors");
const connectDB = require("./db/connect");
const MarketplaceRouter = require("./routes/marketplace");
const CartRouter = require("./routes/cart");
const AuctionRouter = require("./routes/auction");
const Subscribe = require("./routes/newsletter");

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
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (res) => {
  res.send("Artsy API");
});

app.use("/marketplace", MarketplaceRouter);
app.use("/cart", CartRouter);
app.use("/auctions", AuctionRouter);
app.use("/", Subscribe);

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
