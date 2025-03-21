const express = require("express");
const Newsletter = require("../models/NewsletterModel");
const router = express.Router();

router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const isExistingSubscriber = await Newsletter.findOne({ email });
    if (isExistingSubscriber) {
      return res.status(400).json({ message: "Email is already subscribed" });
    }
    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();

    res.status(201).json({ message: "Subscribed to get email updates" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
