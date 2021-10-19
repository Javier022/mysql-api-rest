const router = require("express").Router();
const {
  userRegister,
  userLogin,
  refreshToken,
} = require("../controllers/auth.controller");

/**
 * @swagger
 * tags:
 *  name: Authentication
 *  description: auth routes
 */

/**
 * @swagger
 *  /register:
 *  post:
 *    summary: Sign up a user
 *    tags: [Authentication]
 */
router.post("/register", userRegister);

/**
 * @swagger
 *  /login:
 *  post:
 *    summary: Sign in a user
 *    tags: [Authentication]
 */
router.post("/login", userLogin);

router.post("/refresh-token", refreshToken);

module.exports = router;
