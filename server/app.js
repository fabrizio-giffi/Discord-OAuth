const express = require("express");
const app = express();
require("./config")(app);
require("./db");
require("dotenv").config();

// Route handlers
const apiRoutes = require("./routes/api.routes");
app.use("/api", apiRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

require("./error-handling")(app);

module.exports = app;
