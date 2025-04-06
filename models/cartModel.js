const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      category: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      creator: { type: String },
      location: { type: String },
      stripePriceId: { type: String },
    },
  ],
  totalItems: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  shipping: {
    type: Number,
    default: 0,
  },
  roundedTotal: {
    type: Number,
    default: 0,
  },
});

cartSchema.methods.calculateTotal = function () {
  this.totalPrice = this.products.reduce(
    (total, item) => total + item.price,
    0
  );

  this.totalItems = this.products.reduce(
    (total, item) => total + item.quantity,
    0
  );

  this.shipping = this.totalPrice > 0 ? 20 : 0;
  this.roundedTotal = this.totalPrice + this.shipping;

  return {
    totalPrice: this.totalPrice,
    shipping: this.shipping,
    roundedTotal: this.roundedTotal,
  };
};

module.exports = mongoose.model("Cart", cartSchema);
