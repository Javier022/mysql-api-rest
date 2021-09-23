const route = require("express").Router();
const { getProfile } = require("../controllers/profile.controller");

route.get("/:id", getProfile);

module.exports = route;
