const router = require("express").Router();
const { contentAdmin } = require("../controllers/admin.controller");

router.get("/", contentAdmin);

module.exports = router;
