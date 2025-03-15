const MarketPlace = require("../models/marketplace");

const getAllMarketplaceProducts = async (req, res) => {
  const { category, creator, priceFilter, sortByPrice, name } = req.query;

  const queryObject = {};

  if (category) {
    queryObject.category = category;
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

  let result = MarketPlace.find(queryObject);

  if (sortByPrice === "ascending") {
    result = result.sort({ price: 1 });
  } else if (sortByPrice === "descending") {
    result = result.sort({ price: -1 });
  }

  const products = await result;
  res.status(200).json({ noOfProducts: products.length, products });
};

module.exports = {
  getAllMarketplaceProducts,
};
