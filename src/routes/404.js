module.exports = (req, res, next) => {
  res.status(404);
  res.json({
    message: "404 Not Found"
  });
};
