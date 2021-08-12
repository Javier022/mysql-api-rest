const { admin, moderator } = require("../lib/roles");

const isAdmin = (req, res, next) => {
  const rol = req.user.rol_id;

  if (rol !== admin) {
    return res.status(400).json({
      success: false,
      message: "required admin rol",
    });
  }

  next();
};

const isModerator = async (req, res, next) => {
  const rol = req.user.rol_id;
  if (rol !== moderator) {
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
