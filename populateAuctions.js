require("dotenv").config();

const connectDB = require("./db/connect");
const { Auction } = require("./models/auctionModel");

const AuctionsJson = require("./auctions.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Auction.deleteMany();
    await Auction.insertMany(AuctionsJson);
    console.log("Auctions data successfully uploaded");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
