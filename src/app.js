const express = require("express");
const config = require("./config");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerIU = require("swagger-ui-express");
const swaggerOptions = require("./swaggerOptions");

var corsOptions = {
  origin: "*",
  optionssuccessStatus: 200,
};

// swagger conf
const espesifications = swaggerJSDoc(swaggerOptions);

// settings
app.set("port", config.port);

// body parse
// change format infomation
app.use(express.json());
// capture content form html5
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors(corsOptions));

// morgan
app.use(morgan("dev"));

// swaggers for DOCS
app.use("/docs", swaggerIU.serve, swaggerIU.setup(espesifications));

// routes
const tasksRoutes = require("./routes/tasks.routes");

app.use(tasksRoutes);

module.exports = app;
