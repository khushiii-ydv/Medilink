import prisma from "../config/db.js";

export const getMyAmbulanceProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const ambulance = await prisma.ambulance.findUnique({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            phoneNumber: true,
            role: true,
            createdAt: true,
          },
        },
        hospital: {
          select: {
            id: true,
            name: true,
            address: true,
            contactNumber: true,
            email: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });

    if (!ambulance) {
      return res.status(404).json({
        status: "error",
        message: "Ambulance profile not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Ambulance profile fetched successfully",
      data: ambulance,
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailableAmbulances = async (req, res, next) => {
  try {
    const ambulances = await prisma.ambulance.findMany({
      where: {
        status: "AVAILABLE",
      },
      include: {
        hospital: {
          select: {
            id: true,
            name: true,
            address: true,
            contactNumber: true,
            latitude: true,
            longitude: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Available ambulances fetched successfully",
      data: ambulances,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyAmbulanceLocation = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        status: "error",
        message: "latitude and longitude are required",
      });
    }

    if (typeof latitude !== "number" || Number.isNaN(latitude)) {
      return res.status(400).json({
        status: "error",
        message: "latitude must be a valid number",
      });
    }

    if (typeof longitude !== "number" || Number.isNaN(longitude)) {
      return res.status(400).json({
        status: "error",
        message: "longitude must be a valid number",
      });
    }

    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({
        status: "error",
        message: "latitude must be between -90 and 90",
      });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({
        status: "error",
        message: "longitude must be between -180 and 180",
      });
    }

    const ambulance = await prisma.ambulance.findUnique({
      where: {
        userId,
      },
    });

    if (!ambulance) {
      return res.status(404).json({
        status: "error",
        message: "Ambulance profile not found",
      });
    }

    const updatedAmbulance = await prisma.ambulance.update({
      where: {
        id: ambulance.id,
      },
      data: {
        currentLatitude: latitude,
        currentLongitude: longitude,
        lastLocationAt: new Date(),
      },
      include: {
        hospital: {
          select: {
            id: true,
            name: true,
            address: true,
            contactNumber: true,
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Ambulance location updated successfully",
      data: updatedAmbulance,
    });
  } catch (error) {
    next(error);
  }
};