// const prisma = require("../prisma");
const prisma = require("../prisma");

const createService = async (req, res) => {
  try {
    const {
      name,
      owner,
      description,
      criticality,
    } = req.body;

    const service = await prisma.service.create({
      data: {
        name,
        owner,
        description,
        criticality,
      },
    });

    res.status(201).json(service);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
const getServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        createdAt: "desc",
      },
      
    });

    res.status(200).json(services);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      owner,
      description,
      criticality,
      status,
    } = req.body;

    const service =
      await prisma.service.update({
        where: {
          id,
        },
        data: {
          name,
          owner,
          description,
          criticality,
          status,
        },
      });

    res.json(service);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Failed to update service",
    });
  }
};

const updateServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const service = await prisma.service.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    res.status(200).json(service);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createService,
  getServices,
  updateServiceStatus,
  updateService,
};

