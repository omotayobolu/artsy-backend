const notFound = (res) =>
  res
    .status(400)
    .send("Route does not exist")
    .json({ message: "Route does not exist" });

module.exports = notFound;
