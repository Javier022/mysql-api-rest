const { config } = require("dotenv");
config();

const port = process.env.PORT || 4000;

module.exports = { port };
