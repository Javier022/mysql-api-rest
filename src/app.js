const express = require("express");
const config = require("./config");
const cors = require("cors");
const morgan = require("morgan");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerIU = require("swagger-ui-express");
const swaggerOptions = require("./swaggerOptions");

// routes
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const tasksRoutes = require("./routes/tasks.routes");
const adminRoutes = require("./routes/admin.routes");
const moderatorRoutes = require("./routes/moderator.routes");

// middlewares
const validateToken = require("./middleware/validate-token");
const { isAdmin, isModerator } = require("./middleware/validate-rol");
const { validateState } = require("./middleware/validate-state");

// swagger conf
const espesifications = swaggerJSDoc(swaggerOptions);

// cors conf
var corsOptions = {
  origin: "*",
  optionssuccessStatus: 200,
};

const app = express();

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
app.use("/", authRoutes);

app.use("/profile", profileRoutes);

app.use("/", [validateToken, validateState], tasksRoutes);

app.use("/admin", [validateToken, isAdmin], adminRoutes);

app.use(
  "/moderator",
  [validateToken, isModerator, validateState],
  moderatorRoutes
);

module.exports = app;
