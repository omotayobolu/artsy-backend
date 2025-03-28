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
  const { userId, productId, quantity, price } = req.body;
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId, "products.productId": productId },
      {
        $set: {
          "products.$.quantity": quantity,
          "products.$.price": price * quantity,
        },
      },
      { new: true }
    );

    cart.calculateTotal();

    await cart.save();

    res.status(200).json({ status: "success", cart });
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
