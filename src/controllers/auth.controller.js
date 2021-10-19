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

  try {
    const pool = await getConnection();

    const emailAvailable = await pool.query(
      `SELECT * FROM users WHERE email LIKE '${req.body.email}%'`
    );

    if (emailAvailable[0] && emailAvailable[0].length !== 0) {
      pool.end();
      return res.status(200).json({
        success: false,
        message: "Email already registered",
      });
    }

    const usernameAvailable = await pool.query(
      `SELECT * FROM users WHERE username LIKE '${req.body.username}'`
    );

    if (usernameAvailable[0].length !== 0) {
      pool.end();
      return res.status(200).json({
        success: false,
        message: "username not available",
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

    const { username, email } = req.body;
    await pool.query(querysAuth.createUser, [
      username,
      email,
      hashPassword,
      rol,
    ]);

    res.status(200).json({
      success: true,
      message: "registered user",
      data: {
        username,
        email,
      },
    });

    return pool.end();
  } catch (error) {
    return res.status(500).send(error.message);
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

  try {
    const pool = await getConnection();
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE email LIKE '${req.body.email}%'`
    );

    if (!(rows && rows.length !== 0)) {
      // pool.end();
      return res.status(200).json({
        success: false,
        message: "user not found",
      });
    }

    const userPass = rows[0].password;
    const validPassword = await bcrypt.compare(req.body.password, userPass);

    if (!validPassword) {
      pool.end();
      return res.status(200).json({
        success: false,
        message: "incorrect password",
      });
    }

    const payload = {
      id: rows[0].id,
      rol_id: rows[0].rol_id,
      state: rows[0].state,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESH, {
      expiresIn: "30 days",
    });

    res.header("auth-token", token).json({
      success: true,
      token: token,
      refreshToken: refreshToken,
    });

    // return pool.end();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const refreshToken = (req, res) => {
  const { refresh: token } = req.headers;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "something that's wrong",
    });
  }

  let user;

  try {
    user = jwt.verify(token, process.env.SECRET_KEY_REFRESH);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  const payload = {
    id: user.id,
    rol_id: user.rol_id,
    state: user.state,
  };

  const newToken = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

  res.status(200).json({
    success: true,
    token: newToken,
  });
};

module.exports = {
  userRegister,
  userLogin,
  refreshToken,
};
