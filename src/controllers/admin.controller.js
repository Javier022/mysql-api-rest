const contentAdmin = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome ADMIN",
  });
};

module.exports = {
  contentAdmin,
};
