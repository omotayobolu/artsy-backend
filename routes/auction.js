const express = require("express");
const router = express.Router();

const { getAuctions, getAuction, placeBid } = require("../controllers/auction");

router.route("/").get(getAuctions);
router.route("/:id").get(getAuction).post(placeBid);

module.exports = router;
