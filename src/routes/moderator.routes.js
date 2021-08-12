const router = require("express").Router();
const { contentModerator } = require("../controllers/moderator.controller");

/**
 * @swagger
 *  tags:
 *    name: Moderator
 *    description: moderator routes
 */

/**
 * @swagger
 *  /moderator:
 *  get:
 *    summary: dashboard moderator
 *    tags: [Moderator]
 */
router.get("/", contentModerator);

module.exports = router;
