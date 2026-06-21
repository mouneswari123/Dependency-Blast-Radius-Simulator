const prisma = require("../prisma");

const createDependency = async (req, res) => {
  try {
    const { sourceServiceId, targetServiceId } = req.body;

    // Self dependency check
    if (sourceServiceId === targetServiceId) {
      return res.status(400).json({
        message: "Service cannot depend on itself",
      });
    }

    const existingDependency =
  await prisma.dependency.findFirst({
    where: {
      sourceServiceId,
      targetServiceId,
    },
  });

if (existingDependency) {
  return res.status(400).json({
    message: "Dependency already exists",
  });
}

    const dependency = await prisma.dependency.create({
      data: {
        sourceServiceId,
        targetServiceId,
      },
    });

    res.status(201).json(dependency);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getDependencies = async (req, res) => {
  try {
    const dependencies = await prisma.dependency.findMany({
      include: {
        source: true,
        target: true,
      },
    });

    res.status(200).json(dependencies);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const deleteDependency = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    await prisma.dependency.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message:
        "Dependency deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Failed to delete dependency",
    });
  }
};

module.exports = {
  createDependency,
  getDependencies,
  deleteDependency,
};