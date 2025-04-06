const Cart = require("../models/cartModel");

const getCart = async (req, res) => {
  const { userId } = req.query;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Something went wrong" });
    }

    res.status(200).json({ status: "success", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const addOrUpdateCart = async (req, res) => {
  const {
    productId,
    userId,
    name,
    image,
    price,
    quantity,
    category,
    creator,
    location,
    stripePriceId,
  } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [
          {
            productId,
            name,
            price: price * quantity,
            image,
            quantity,
            category,
            creator,
            location,
            stripePriceId,
          },
        ],
      });
    } else {
      const existingProduct = cart.products.find(
        (product) => product.productId.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
        existingProduct.price += quantity * price;
      } else {
        cart.products.push({
          productId,
          name,
          price: price * quantity,
          image,
          quantity,
          category,
          creator,
          location,
          stripePriceId,
        });
      }
    }

    cart.calculateTotal();

    await cart.save();

    res.status(200).json({ status: "success", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteFromCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found!" });
    }

    cart.products = cart.products.filter(
      (product) => product.productId.toString() !== productId
    );

    cart.calculateTotal();

    await cart.save();

    res
      .status(200)
      .json({ status: "success", message: "Product deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateQuantity = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId });

    if (!userId) {
      return res.status(400).json({ message: "userId is required!" });
    }

    if (!productId) {
      return res.status(400).json({ message: "ProductID is required!" });
    }

    const product = cart.products.find(
      (item) => item.productId.toString() === productId
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found in cart!" });
    }

    const unitPrice = product.price / product.quantity;

    product.quantity = quantity;
    product.price = unitPrice * quantity;

    cart.calculateTotal();

    await cart.save();

    res.status(200).json({
      status: "success",
      message: "Quantity updated successfully!",
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "something went wrong!" });
  }
};

module.exports = {
  getCart,
  addOrUpdateCart,
  deleteFromCart,
  updateQuantity,
};
