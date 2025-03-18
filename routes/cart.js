const express = require("express");
const router = express.Router();

const {
  getCart,
  addOrUpdateCart,
  deleteFromCart,
  updateQuantity,
} = require("../controllers/cart");

router
  .route("/")
  .get(getCart)
  .post(addOrUpdateCart)
  .patch(updateQuantity)
  .delete(deleteFromCart);

module.exports = router;
