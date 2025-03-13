const mongoose = require("mongoose");

const marketplaceSchema = new mongoose.Schema({
  name: String,
  image: String,
  category: String,
  price: Number,
  creator: String,
  location: String,
  views: Number,
  isLiked: { type: Boolean, defult: false },
  description: String,
  listing: String,
  status: String,
});

module.exports = mongoose.model("MarketPlace", marketplaceSchema);
