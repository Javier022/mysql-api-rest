const isAdmin = (req, res, next) => {
  const rol = req.user.rol_id;

  if (rol !== 1) {
    return res.status(400).json({
      success: false,
      message: "required admin rol",
    });
  }

  next();
};

const isModerator = async (req, res, next) => {
  const rol = req.user.rol_id;
  if (rol !== 2) {
    return res.status(400).json({
      success: false,
      message: "required moderator rol",
    });
  }

  next();
};

module.exports = {
  isAdmin,
  isModerator,
};
