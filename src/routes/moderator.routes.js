const router = require("express").Router();
const { contentModerator } = require("../controllers/moderator.controller");

router.get("/", contentModerator);

module.exports = router;
