const express = require("express");

const router = express.Router();

const {
  getBlastRadius,
} = require("../controllers/blastRadiusController");

router.get("/:serviceId", getBlastRadius);

module.exports = router;