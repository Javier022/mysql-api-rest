const { urlencoded } = require("express");
const express = require("express");
const config = require("./config");
const app = express();

// settings
app.set("port", config.port);

// body parse
// change format infomation
app.use(express.json());
// capture content form html5
app.use(express.urlencoded({ extended: true }));

// routes
const tasksRoutes = require("./routes/tasks.routes");

app.use(tasksRoutes);

module.exports = app;
