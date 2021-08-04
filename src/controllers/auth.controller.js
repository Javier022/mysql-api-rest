const { getConnection } = require("../database/index");
const { querysAuth } = require("../database/index");

// libraries
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const schemaRegister = Joi.object({
  username: Joi.string().min(3).max(100).required(),
  email: Joi.string().min(6).max(100).required().email(),
  password: Joi.string().min(6).max(100).required(),
});

const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(100).email().required(),
  password: Joi.string().min(6).max(100).required(),
});

const userRegister = async (req, res) => {
  const { error } = schemaRegister.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const pool = await getConnection();
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE email LIKE '${req.body.email}%'`
  );

  if (rows && rows.length !== 0) {
    return res.status(400).json({
      success: false,
      message: "email ya registrado",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  try {
    const { username, email } = req.body;
    const pool = await getConnection();
    await pool.query(querysAuth.createUser, [username, email, hashPassword]);

    res.status(200).json({
      success: true,
      message: "usuario registrado",
      data: {
        username,
        email,
      },
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const userLogin = async (req, res) => {
  const { error } = schemaLogin.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const pool = await getConnection();
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE email LIKE '${req.body.email}%'`
  );

  if (!(rows && rows.length !== 0)) {
    return res.status(200).json({
      success: false,
      message: "usuario no encontrado",
    });
  }

  const userPass = rows[0].password;
  const validPassword = await bcrypt.compare(req.body.password, userPass);

  if (!validPassword) {
    return res.status(200).json({
      success: false,
      message: "contraseña incorrecta",
    });
  }

  const userForToken = {
    id: rows[0].id,
    username: rows[0].username,
  };

  const token = jwt.sign(userForToken, process.env.SECRET_KEY);

  res.header("auth-token", token).json({
    success: true,
    data: { token },
  });
};

module.exports = {
  userRegister,
  userLogin,
};
