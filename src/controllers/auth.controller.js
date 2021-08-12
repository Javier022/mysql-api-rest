const { getConnection, querysAuth } = require("../database/index");
const { user } = require("../lib/roles");

// libraries
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const schemaRegister = Joi.object({
  username: Joi.string().min(3).max(100).required(),
  email: Joi.string().min(6).max(100).required().email(),
  password: Joi.string().min(6).max(100).required(),
  rol: Joi.string().min(4).max(100),
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

  let rol = req.body.rol;
  if (rol) {
    const roles = await pool.query(`SELECT * FROM roles`);

    const existRole = roles[0].find((item) => {
      return item.name === rol;
    });

    if (!existRole) {
      return res.status(500).json({
        success: false,
        message: "rol doesn't exist",
      });
    }

    rol = existRole.id;
  } else {
    rol = user;
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  try {
    const { username, email } = req.body;
    await pool.query(querysAuth.createUser, [
      username,
      email,
      hashPassword,
      rol,
    ]);

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
    rol_id: rows[0].rol_id,
    state: rows[0].state,
  };

  const token = jwt.sign(userForToken, process.env.SECRET_KEY, {
    expiresIn: 60 * 60 * 24,
  });

  res.header("auth-token", token).json({
    success: true,
    data: { token },
  });
};

module.exports = {
  userRegister,
  userLogin,
};
