const router = require("express").Router();
const { contentAdmin, deleteUser } = require("../controllers/admin.controller");

router.get("/", contentAdmin);

router.delete("/delete-user/:id", deleteUser);

module.exports = router;
