const express = require("express");
const router = express.Router();
const { getAllMarketplaceProducts } = require("../controllers/marketplace");

router.route("/").get(getAllMarketplaceProducts);

module.exports = router;
