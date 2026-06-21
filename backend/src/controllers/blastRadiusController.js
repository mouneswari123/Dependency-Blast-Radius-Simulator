const prisma = require("../prisma");

const getBlastRadius = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const dependencies = await prisma.dependency.findMany({
      where: {
        targetServiceId: serviceId,
      },
      include: {
        source: true,
      },
    });
    const impactedServices = dependencies.map(
  (dependency) => dependency.source.name
);

    res.status(200).json({
  totalImpactedServices: impactedServices.length,
  impactedServices,
});
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  getBlastRadius,
};