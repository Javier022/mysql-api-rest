const route = require("express").Router();
const {
  getProfile,
  editProfile,
} = require("../controllers/profile.controller");

route.get("/", getProfile);

route.put("/edit", editProfile);

module.exports = route;
