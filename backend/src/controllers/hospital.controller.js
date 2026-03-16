import prisma from "../config/db.js";

export const getMyHospitalProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const hospital = await prisma.hospital.findUnique({
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
        resources: true,
        bloodInventory: true,
        specialists: true,
        equipments: true,
        ambulances: true,
      },
    });

    if (!hospital) {
      return res.status(404).json({
        status: "error",
        message: "Hospital profile not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Hospital profile fetched successfully",
      data: hospital,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllHospitals = async (req, res, next) => {
  try {
    const hospitals = await prisma.hospital.findMany({
      include: {
        resources: true,
        bloodInventory: true,
        specialists: {
          where: {
            available: true,
          },
          select: {
            id: true,
            name: true,
            specialty: true,
            available: true,
          },
        },
        equipments: {
          select: {
            id: true,
            name: true,
            totalUnits: true,
            availableUnits: true,
            updatedAt: true,
          },
        },
        ambulances: {
          select: {
            id: true,
            driverName: true,
            ambulanceNumber: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedHospitals = hospitals.map((hospital) => ({
      hospital_id: hospital.id,
      name: hospital.name,
      email: hospital.email,
      address: hospital.address,
      contact_number: hospital.contactNumber,
      latitude: hospital.latitude,
      longitude: hospital.longitude,
      resources: hospital.resources
        ? {
            total_beds: hospital.resources.totalBeds,
            available_beds: hospital.resources.availableBeds,
            total_icu_beds: hospital.resources.totalIcuBeds,
            available_icu_beds: hospital.resources.availableIcuBeds,
            total_ventilators: hospital.resources.totalVentilators,
            available_ventilators: hospital.resources.availableVentilators,
            oxygen_units_available: hospital.resources.oxygenUnitsAvailable,
            last_updated: hospital.resources.updatedAt,
          }
        : null,
      blood_bank: hospital.bloodInventory,
      specialists: hospital.specialists,
      equipments: hospital.equipments,
      ambulances: hospital.ambulances,
      ambulance_count: hospital.ambulances.length,
    }));

    return res.status(200).json({
      status: "success",
      message: "Hospitals fetched successfully",
      data: formattedHospitals,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyHospitalResources = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const {
      total_beds,
      available_beds,
      total_icu_beds,
      available_icu_beds,
      total_ventilators,
      available_ventilators,
      oxygen_units_available,
    } = req.body;

    const hospital = await prisma.hospital.findUnique({
      where: {
        userId,
      },
      include: {
        resources: true,
      },
    });

    if (!hospital) {
      return res.status(404).json({
        status: "error",
        message: "Hospital not found",
      });
    }

    if (!hospital.resources) {
      return res.status(404).json({
        status: "error",
        message: "Hospital resources record not found",
      });
    }

    const numericFields = [
      { key: "total_beds", value: total_beds },
      { key: "available_beds", value: available_beds },
      { key: "total_icu_beds", value: total_icu_beds },
      { key: "available_icu_beds", value: available_icu_beds },
      { key: "total_ventilators", value: total_ventilators },
      { key: "available_ventilators", value: available_ventilators },
      { key: "oxygen_units_available", value: oxygen_units_available },
    ];

    for (const field of numericFields) {
      if (field.value !== undefined) {
        if (typeof field.value !== "number" || Number.isNaN(field.value)) {
          return res.status(400).json({
            status: "error",
            message: `${field.key} must be a valid number`,
          });
        }

        if (field.value < 0) {
          return res.status(400).json({
            status: "error",
            message: `${field.key} cannot be negative`,
          });
        }
      }
    }

    const nextTotalBeds =
      total_beds ?? hospital.resources.totalBeds;
    const nextAvailableBeds =
      available_beds ?? hospital.resources.availableBeds;
    const nextTotalIcuBeds =
      total_icu_beds ?? hospital.resources.totalIcuBeds;
    const nextAvailableIcuBeds =
      available_icu_beds ?? hospital.resources.availableIcuBeds;
    const nextTotalVentilators =
      total_ventilators ?? hospital.resources.totalVentilators;
    const nextAvailableVentilators =
      available_ventilators ?? hospital.resources.availableVentilators;

    if (nextAvailableBeds > nextTotalBeds) {
      return res.status(400).json({
        status: "error",
        message: "available_beds cannot be greater than total_beds",
      });
    }

    if (nextAvailableIcuBeds > nextTotalIcuBeds) {
      return res.status(400).json({
        status: "error",
        message: "available_icu_beds cannot be greater than total_icu_beds",
      });
    }

    if (nextAvailableVentilators > nextTotalVentilators) {
      return res.status(400).json({
        status: "error",
        message:
          "available_ventilators cannot be greater than total_ventilators",
      });
    }

    const updatedResources = await prisma.hospitalResource.update({
      where: {
        hospitalId: hospital.id,
      },
      data: {
        totalBeds: nextTotalBeds,
        availableBeds: nextAvailableBeds,
        totalIcuBeds: nextTotalIcuBeds,
        availableIcuBeds: nextAvailableIcuBeds,
        totalVentilators: nextTotalVentilators,
        availableVentilators: nextAvailableVentilators,
        oxygenUnitsAvailable:
          oxygen_units_available ?? hospital.resources.oxygenUnitsAvailable,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Hospital resources updated successfully",
      data: updatedResources,
    });
  } catch (error) {
    next(error);
  }
};

export const getHospitalBloodBank = async (req, res, next) => {
  try {
    const { hospitalId } = req.params;

    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
      select: {
        id: true,
        name: true,
        bloodInventory: {
          orderBy: {
            bloodGroup: "asc",
          },
        },
      },
    });

    if (!hospital) {
      return res.status(404).json({
        status: "error",
        message: "Hospital not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Blood bank data fetched successfully",
      data: hospital,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyHospitalBloodBank = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { blood_group, units_available } = req.body;

    if (!blood_group || units_available === undefined) {
      return res.status(400).json({
        status: "error",
        message: "blood_group and units_available are required",
      });
    }

    if (typeof units_available !== "number" || Number.isNaN(units_available)) {
      return res.status(400).json({
        status: "error",
        message: "units_available must be a valid number",
      });
    }

    if (units_available < 0) {
      return res.status(400).json({
        status: "error",
        message: "units_available cannot be negative",
      });
    }

    const validBloodGroups = [
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-",
    ];

    if (!validBloodGroups.includes(blood_group)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid blood group",
      });
    }

    const hospital = await prisma.hospital.findUnique({
      where: { userId },
    });

    if (!hospital) {
      return res.status(404).json({
        status: "error",
        message: "Hospital not found",
      });
    }

    const bloodRecord = await prisma.bloodInventory.upsert({
      where: {
        hospitalId_bloodGroup: {
          hospitalId: hospital.id,
          bloodGroup: blood_group,
        },
      },
      update: {
        unitsAvailable: units_available,
      },
      create: {
        hospitalId: hospital.id,
        bloodGroup: blood_group,
        unitsAvailable: units_available,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Blood bank updated successfully",
      data: bloodRecord,
    });
  } catch (error) {
    next(error);
  }
};