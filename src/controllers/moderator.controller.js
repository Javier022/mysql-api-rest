const contentModerator = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Moderator",
  });
};

module.exports = {
  contentModerator,
};
