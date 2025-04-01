const { Auction } = require("../models/auctionModel");

const getAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({});
    res.status(200).json({ auctions });
  } catch (error) {
    console.log(error);
  }
};

const getAuction = async (req, res) => {
  try {
    const { id: auctionId } = req.params;
    const auction = await Auction.findOne({ _id: auctionId });
    if (!auction) {
      return res
        .status(404)
        .json({ message: `No auction with id ${auctionId}` });
    }
    res.status(200).json(auction);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong!" });
  }
};

const placeBid = async (req, res) => {
  try {
    const { id: auctionId } = req.params;
    const { bidder, amount } = req.body;
    if (!bidder || !amount) {
      return res
        .status(400)
        .json({ message: "Bidder and amount are required" });
    }
    const auction = await Auction.findOne({ _id: auctionId });

    if (auction.status !== "live") {
      return res
        .status(400)
        .json({ message: "Bidding is not live for this auction." });
    }

    const extractedAmount = parseFloat(
      amount.toString().match(/\d+(\.\d+)?/)?.[0]
    );

    if (isNaN(extractedAmount)) {
      return res.status(200).json({
        message: "No valid bid amount. Auction remains unchanged.",
      });
    }

    if (extractedAmount <= auction.highestBid) {
      return res.status(400).json({
        message: "Bid must be larger than the highest bid",
      });
    }

    const newBid = {
      bidder: bidder,
      amount: extractedAmount,
      timestamp: new Date(),
    };

    auction.bids.push(newBid);
    auction.highestBid = extractedAmount;

    await auction.save();

    res.status(201).json({
      message: "Bid placed succesfully",
      auction,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { getAuctions, getAuction, placeBid };
