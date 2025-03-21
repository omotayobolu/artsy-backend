const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  isLiked: { type: Boolean, default: false },
  creator: { type: String, required: true },
  currentBid: { type: Number, default: 0 },
  highestBid: { type: Number, default: 0 },
  bids: [
    {
      bidder: { type: String, required: true },
      amount: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  status: {
    type: String,
    enum: ["live", "upcoming", "ended"],
    default: "live",
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

const bidSchema = new mongoose.Schema({
  bidder: { type: String, required: true },
  amount: { type: Number, required: true },
});

const Auction = mongoose.model("Auction", auctionSchema);
const Bid = mongoose.model("Bid", bidSchema);

module.exports = { Auction, Bid };
