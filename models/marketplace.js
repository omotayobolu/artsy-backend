const mongoose = require("mongoose");

const marketplaceSchema = new mongoose.Schema({
  name: String,
  image: String,
  category: String,
  price: Number,
  creator: String,
  location: String,
  views: Number,
  isLiked: { type: Boolean, default: false },
  description: String,
  listing: String,
  status: String,
  stripePriceId: String,
});

const Marketplace = mongoose.model("MarketPlace", marketplaceSchema);

module.exports = Marketplace;
