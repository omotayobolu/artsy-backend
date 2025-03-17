require("dotenv").config();

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const MarketplaceRouter = require("./routes/marketplace");

const errorHandlerMiddleware = require("./middlewares/error-handler");
const notFoundMiddleware = require("./middlewares/not-found");

app.use(express.json());

app.get("/", (res) => {
  res.send("Artsy API");
});

app.use("/marketplace", MarketplaceRouter);

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
