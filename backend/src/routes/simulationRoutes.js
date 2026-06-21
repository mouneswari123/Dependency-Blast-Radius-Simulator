const express = require("express");
const router = express.Router();

const {
  saveSimulation,
  getSimulations,
} = require(
  "../controllers/simulationController"
);

router.post("/", saveSimulation);
router.get("/", getSimulations);

module.exports = router;