const express = require("express");
const cors = require("cors");
require("dotenv").config();

const serviceRoutes = require("./routes/serviceRoutes");
const dependencyRoutes = require("./routes/dependencyRoutes");
const blastRadiusRoutes = require("./routes/blastRadiusRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const simulationRoutes =
  require("./routes/simulationRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/services", serviceRoutes);
app.use("/api/dependencies", dependencyRoutes);
app.use("/api/blast-radius", blastRadiusRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(
  "/api/simulations",
  simulationRoutes
);
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});