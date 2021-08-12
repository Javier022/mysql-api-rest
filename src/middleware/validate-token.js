const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token)
    return res.status(400).json({ success: false, message: "access denied" });

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    req.user = payload;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = validateToken;
