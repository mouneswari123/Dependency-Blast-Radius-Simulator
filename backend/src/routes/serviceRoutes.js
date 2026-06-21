const express = require("express");
const router = express.Router();

const {
  createService,
  getServices,
  updateServiceStatus,
  updateService,
} = require("../controllers/serviceController");

router.post("/", createService);
router.get("/", getServices);
router.patch("/:id/status", updateServiceStatus);
router.patch(
  "/:id",
  updateService
);
module.exports = router;