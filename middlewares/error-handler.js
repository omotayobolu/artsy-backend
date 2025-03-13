const errorHandlerMiddleware = async (err, res) => {
  console.log(err);
  return res.status(500).json({ message: "Something went wrong. Try again." });
};

module.exports = errorHandlerMiddleware;
