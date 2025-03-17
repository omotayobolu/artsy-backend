const express = require("express");
const router = express.Router();
const {
  getAllMarketplaceProducts,
  getMarketplaceProduct,
  updateMarketplaceProduct,
} = require("../controllers/marketplace");

router.route("/").get(getAllMarketplaceProducts);
router.route("/:id").get(getMarketplaceProduct).patch(updateMarketplaceProduct);

module.exports = router;
