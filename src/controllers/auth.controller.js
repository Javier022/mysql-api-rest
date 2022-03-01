const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

//
const { getConnection, querysAuth } = require("../database/index");
const { user } = require("../lib/roles");
const randomString = require("../lib/randomString");
const sendMail = require("../config/emailer");

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

    const { username, email } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // random text to validate email user regitered
    const randomValue = randomString();

    await pool.query(querysAuth.createUser, [
      username,
      email,
      hashPassword,
      rol,
      randomValue,
    ]);

    sendMail(req.body, randomValue);

    res.status(200).json({
      success: true,
      message: "registered user",
      data: {
        username,
        email,
        randomValue,
      },
    });

    // res.redirect("back");
    return pool.end();
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const resendEmail = (req, res) => {
  const { randomValue } = req.body;

  try {
    sendMail(req.body, randomValue);

    return res.status(200).json({
      success: true,
      message: "email sent",
    });
  } catch (error) {
    res.status(500).send(error.message);
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
    const result = await pool.query(
      `SELECT * FROM users WHERE email LIKE '${req.body.email}%'`
    );

    const user = result[0][0];

    if (!(user && user.length !== 0)) {
      pool.end();
      return res.status(200).json({
        success: false,
        message: "user not found",
      });
    }

    const userPass = user.password;
    const validPassword = await bcrypt.compare(req.body.password, userPass);

    if (!validPassword) {
      pool.end();
      return res.status(200).json({
        success: false,
        message: "incorrect password",
      });
    }

    if (!user.state) {
      pool.end();
      return res.status(403).json({
        success: false,
        message: "user has been deleted",
      });
    }

    if (!user.verified_email) {
      pool.end();
      return res.status(401).json({
        success: false,
        message: "the email has not been verified",
      });
    }

    const payload = {
      id: user.id,
      rol_id: user.rol_id,
      state: user.state,
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

    return pool.end();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const refreshToken = (req, res) => {
  const { refresh: token } = req.headers;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "something went wrong",
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

const verifyEmail = async (req, res) => {
  const { randomValue } = req.params;

  try {
    const pool = await getConnection();

    const userExist = await pool.query(
      `SELECT * FROM users WHERE hash_email LIKE ${randomValue}`
    );

    if (userExist[0][0].verified_email) {
      pool.end();
      return res.status(200).json({
        success: true,
        message: "user has been verified",
      });
    }

    if (userExist[0].length === 0) {
      pool.end();
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    const user = userExist[0][0];

    await pool.query(querysAuth.activeEmail, [user.id]);

    const payload = {
      id: user.id,
      rol_id: user.rol_id,
      state: user.state,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESH, {
      expiresIn: "30 days",
    });

    res.status(200).json({
      success: true,
      token,
      refreshToken,
    });

    return pool.end();
  } catch (error) {
    res.status(500).send("Internal error");
  }
};

const registerWithGoogle = async (req, res) => {
  const { token: googleToken } = req.body;

  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const googleUser = ticket.getPayload();

    // db
    const pool = await getConnection();

    const userAlreadyRegistered = await pool.query(
      `SELECT * FROM users WHERE email LIKE '${googleUser.email}'`
    );

    if (userAlreadyRegistered[0].length !== 0) {
      const userData = userAlreadyRegistered[0][0];

      const payload = {
        id: userData.id,
        rol_id: userData.rol_id,
        state: userData.state,
      };

      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESH, {
        expiresIn: "30 days",
      });

      pool.end();
      return res.status(200).json({
        success: true,
        token,
        refreshToken,
      });
    }

    // save user
    await pool.query(querysAuth.createUserWithGoogle, [
      googleUser.email,
      googleUser.email,
      true,
      user,
      googleUser.email_verified,
      googleUser.picture,
    ]);

    const findUser = await pool.query(
      `SELECT * FROM users WHERE email LIKE '${googleUser.email}'`
    );

    if (findUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    const userData = findUser[0][0];

    const payload = {
      id: userData.id,
      rol_id: userData.rol_id,
      state: userData.state,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESH, {
      expiresIn: "30 days",
    });

    pool.end();
    return res.status(200).json({
      success: true,
      token,
      refreshToken,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

module.exports = {
  userRegister,
  userLogin,
  refreshToken,
  verifyEmail,
  registerWithGoogle,
  resendEmail,
};
