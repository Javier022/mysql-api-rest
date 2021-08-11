const validateState = (req, res, next) => {
  const { state } = req.user;

  if (!state) {
    return res.status(404).json({
      success: false,
      message: "user has been deleted",
    });
  }

  next();
};

module.exports = {
  validateState,
};
