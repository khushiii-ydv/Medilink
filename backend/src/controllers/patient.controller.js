import prisma from "../config/db.js";

export const getPatientProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const patient = await prisma.patient.findUnique({
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
      },
    });

    if (!patient) {
      return res.status(404).json({
        status: "error",
        message: "Patient profile not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Patient profile fetched successfully",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};