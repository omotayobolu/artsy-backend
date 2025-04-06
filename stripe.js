require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const mongoose = require("mongoose");
const Marketplace = require("./models/marketplace");
const connectDB = require("./db/connect");

async function seedStripePrices() {
  await connectDB(process.env.MONGO_URI);
  const products = await Marketplace.find({
    stripePriceId: { $exists: false },
  });

  for (const product of products) {
    const stripeProduct = await stripe.products.create({
      name: product.name,
      description: `${product.category} by ${product.creator}`,
      images: [product.image],
    });

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: product.price * 100, // in cents
      currency: "usd",
    });

    product.stripePriceId = stripePrice.id;
    await product.save();

    console.log(`✅ Updated ${product.name} with Stripe price ID`);
  }

  mongoose.disconnect();
}

seedStripePrices();
