const { config } = require("dotenv");
config();

const port = process.env.PORT || 3500;

module.exports = { port };
