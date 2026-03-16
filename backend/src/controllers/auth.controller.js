import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import { signToken } from "../utils/jwt.js";

// PATIENT REGISTRATION
export const registerPatient = async (req, res, next) => {
  try {
    const { name, phone_number, password } = req.body;

    if (!name || !phone_number || !password) {
      return res.status(400).json({
        status: "error",
        message: "Name, phone number and password are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        phoneNumber: phone_number,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "User already exists with this phone number",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        phoneNumber: phone_number,
        passwordHash: hashedPassword,
        role: "PATIENT",
        patient: {
          create: {
            name,
            phoneNumber: phone_number,
          },
        },
      },
      include: {
        patient: true,
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Patient registered successfully",
      data: {
        user_id: user.id,
        role: user.role,
        patient: user.patient,
      },
    });
  } catch (error) {
    next(error);
  }
};

// HOSPITAL REGISTRATION
export const registerHospital = async (req, res, next) => {
  try {
    const {
      hospital_name,
      admin_phone_number,
      password,
      address,
      contact_number,
      email,
      latitude,
      longitude,
    } = req.body;

    if (
      !hospital_name ||
      !admin_phone_number ||
      !password ||
      !address ||
      !contact_number
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Hospital name, admin phone number, password, address and contact number are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        phoneNumber: admin_phone_number,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "Hospital admin already exists with this phone number",
      });
    }

    if (email) {
      const existingHospitalEmail = await prisma.hospital.findUnique({
        where: {
          email,
        },
      });

      if (existingHospitalEmail) {
        return res.status(409).json({
          status: "error",
          message: "Hospital already exists with this email",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        phoneNumber: admin_phone_number,
        passwordHash: hashedPassword,
        role: "HOSPITAL_ADMIN",
        hospital: {
          create: {
            name: hospital_name,
            email: email || null,
            address,
            contactNumber: contact_number,
            latitude: latitude ?? null,
            longitude: longitude ?? null,
            resources: {
              create: {
                totalBeds: 0,
                availableBeds: 0,
                totalIcuBeds: 0,
                availableIcuBeds: 0,
                totalVentilators: 0,
                availableVentilators: 0,
                oxygenUnitsAvailable: 0,
              },
            },
          },
        },
      },
      include: {
        hospital: {
          include: {
            resources: true,
          },
        },
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Hospital registered successfully",
      data: {
        user_id: user.id,
        role: user.role,
        hospital: user.hospital,
      },
    });
  } catch (error) {
    next(error);
  }
};

// AMBULANCE REGISTRATION
export const registerAmbulance = async (req, res, next) => {
  try {
    const {
      driver_name,
      phone_number,
      password,
      ambulance_number,
      hospital_id,
    } = req.body;

    if (
      !driver_name ||
      !phone_number ||
      !password ||
      !ambulance_number ||
      !hospital_id
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Driver name, phone number, password, ambulance number and hospital ID are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        phoneNumber: phone_number,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "Ambulance driver already exists with this phone number",
      });
    }

    const existingAmbulance = await prisma.ambulance.findUnique({
      where: {
        ambulanceNumber: ambulance_number,
      },
    });

    if (existingAmbulance) {
      return res.status(409).json({
        status: "error",
        message: "Ambulance already exists with this ambulance number",
      });
    }

    const hospital = await prisma.hospital.findUnique({
      where: {
        id: hospital_id,
      },
    });

    if (!hospital) {
      return res.status(404).json({
        status: "error",
        message: "Associated hospital not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        phoneNumber: phone_number,
        passwordHash: hashedPassword,
        role: "AMBULANCE_DRIVER",
        ambulance: {
          create: {
            hospitalId: hospital_id,
            driverName: driver_name,
            phoneNumber: phone_number,
            ambulanceNumber: ambulance_number,
            status: "AVAILABLE",
          },
        },
      },
      include: {
        ambulance: true,
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Ambulance registered successfully",
      data: {
        user_id: user.id,
        role: user.role,
        ambulance: user.ambulance,
      },
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN
export const loginUser = async (req, res, next) => {
  try {
    const { phone_number, password } = req.body;

    if (!phone_number || !password) {
      return res.status(400).json({
        status: "error",
        message: "Phone number and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        phoneNumber: phone_number,
      },
      include: {
        patient: true,
        hospital: {
          include: {
            resources: true,
          },
        },
        ambulance: {
          include: {
            hospital: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    const token = signToken({
      userId: user.id,
      role: user.role,
    });

    let profile = null;

    if (user.role === "PATIENT") {
      profile = user.patient;
    } else if (user.role === "HOSPITAL_ADMIN") {
      profile = user.hospital;
    } else if (user.role === "AMBULANCE_DRIVER") {
      profile = user.ambulance;
    }

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        token,
        user: {
          user_id: user.id,
          phone_number: user.phoneNumber,
          role: user.role,
          profile,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};