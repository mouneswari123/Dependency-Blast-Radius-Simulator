const prisma = require("../prisma");

const getDashboardSummary = async (req, res) => {
  try {
    const totalServices = await prisma.service.count();

    const healthyServices = await prisma.service.count({
      where: {
        status: "HEALTHY",
      },
    });

    const degradedServices = await prisma.service.count({
      where: {
        status: "DEGRADED",
      },
    });

    const downServices = await prisma.service.count({
      where: {
        status: "DOWN",
      },
    });

    const totalDependencies = await prisma.dependency.count();

    res.status(200).json({
      totalServices,
      healthyServices,
      degradedServices,
      downServices,
      totalDependencies,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  getDashboardSummary,
};