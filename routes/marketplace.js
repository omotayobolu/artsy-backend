const express = require("express");
const router = express.Router();
const {
  getAllMarketplaceProducts,
  getMarketplaceProduct,
} = require("../controllers/marketplace");

router.route("/").get(getAllMarketplaceProducts);
router.route("/:id").get(getMarketplaceProduct);

module.exports = router;
