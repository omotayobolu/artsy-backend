require("dotenv").config();

const connectDB = require("./db/connect");
const MarketPlace = require("./models/MarketPlace");

const MarketPlaceJson = require("./Marketplace.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await MarketPlace.deleteMany();
    await MarketPlace.create(MarketPlaceJson);
    console.log("marketplace json successfully uploaded");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
