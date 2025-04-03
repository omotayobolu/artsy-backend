const Marketplace = require("../models/marketplace");

const getAllMarketplaceProducts = async (req, res) => {
  const { category, creator, priceFilter, sortByPrice, name } = req.query;

  const queryObject = {};

  if (category) {
    if (category.includes(",")) {
      const categoryArray = category.split(",");
      queryObject.category = { $in: categoryArray };
    } else {
      queryObject.category = category;
    }
  }

  if (creator) {
    queryObject.creator = creator;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  if (priceFilter) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };

    let filters = priceFilter.split("and");

    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    filters.forEach((filter) => {
      const modifiedFilter = filter.replace(
        regEx,
        (match) => `-${operatorMap[match]}-`
      );
      const [field, operator, value] = modifiedFilter.split("-");
      if (field === "price") {
        queryObject[field] = {
          ...queryObject[field],
          [operator]: Number(value),
        };
      }
    });
  }

  let result = Marketplace.find(queryObject);

  if (sortByPrice === "ascending") {
    result = result.sort({ price: 1 });
  } else if (sortByPrice === "descending") {
    result = result.sort({ price: -1 });
  }

  // const limit = Number(req.query.limit) || 9;
  // const offset = Number(req.query.offset) || 0;

  // result = result.skip(offset).limit(limit);

  const products = await result;
  res.status(200).json({ noOfProducts: products.length, products });
};

const getMarketplaceProduct = async (req, res) => {
  try {
    const { id: productID } = req.params;
    const product = await Marketplace.findOne({ _id: productID });
    if (!product) {
      return res.status(404).json(`No task with id: ${productID}`);
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const updateMarketplaceProduct = async (req, res) => {
  try {
    const { id: productID } = req.params;
    const product = await Marketplace.findOneAndUpdate(
      { _id: productID },
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  getAllMarketplaceProducts,
  getMarketplaceProduct,
  updateMarketplaceProduct,
};
