const prisma = require("../prisma");

const saveSimulation = async (req, res) => {
  try {
    const {
      failedService,
      impactedServices,
      impactedCount,
      severityScore,
    } = req.body;

    const simulation =
      await prisma.simulation.create({
        data: {
          failedService,
          impactedServices,
          impactedCount,
          severityScore,
        },
      });

    res.status(201).json(simulation);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error saving simulation",
    });
  }
};

const getSimulations = async (
  req,
  res
) => {
  try {
    const simulations =
      await prisma.simulation.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    res.json(simulations);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Error getting simulations",
    });
  }
};

module.exports = {
  saveSimulation,
  getSimulations,
};