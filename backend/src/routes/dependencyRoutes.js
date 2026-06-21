const express = require("express");
const router = express.Router();

const {
  createDependency,
  getDependencies,deleteDependency,
} = require("../controllers/dependencyController");

router.post("/", createDependency);
router.get("/", getDependencies);
router.delete("/:id", deleteDependency);
module.exports = router;