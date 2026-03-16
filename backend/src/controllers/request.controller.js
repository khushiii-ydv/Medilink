import prisma from "../config/db.js";

// PATIENT: create admission request
export const createAdmissionRequest = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { hospital_id, description } = req.body;

    if (!hospital_id) {
      return res.status(400).json({
        status: "error",
        message: "hospital_id is required",
      });
    }

    const patient = await prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      return res.status(404).json({
        status: "error",
        message: "Patient profile not found",
      });
    }

    const hospital = await prisma.hospital.findUnique({
      where: { id: hospital_id },
      include: { resources: true },
    });

    if (!hospital) {
      return res.status(404).json({
        status: "error",
        message: "Hospital not found",
      });
    }

    const existingPendingRequest = await prisma.admissionRequest.findFirst({
      where: {
        patientId: patient.id,
        hospitalId: hospital_id,
        status: "PENDING",
      },
    });

    if (existingPendingRequest) {
      return res.status(409).json({
        status: "error",
        message: "You already have a pending admission request for this hospital",
      });
    }

const admissionRequest = await prisma.admissionRequest.create({
  data: {
    patientId: patient.id,
    hospitalId: hospital_id,
    description: description || null,
    status: "PENDING",
  },
  include: {
    patient: {
      select: {
        id: true,
        name: true,
        phoneNumber: true,
      },
    },
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

const hospitalUser = await prisma.hospital.findUnique({
  where: { id: hospital_id },
  select: { userId: true, name: true },
});

if (hospitalUser) {
  await prisma.notification.create({
    data: {
      userId: hospitalUser.userId,
      type: "ADMISSION_REQUEST",
      message: `New admission request received from patient ${admissionRequest.patient.name}`,
    },
  });
}

return res.status(201).json({
  status: "success",
  message: "Admission request created successfully",
  data: admissionRequest,
});
  } catch (error) {
    next(error);
  }
};

// PATIENT: view own admission requests
export const getMyAdmissionRequests = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const patient = await prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      return res.status(404).json({
        status: "error",
        message: "Patient profile not found",
      });
    }

    const requests = await prisma.admissionRequest.findMany({
      where: {
        patientId: patient.id,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Admission requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// HOSPITAL: update admission request status
export const updateAdmissionRequestStatus = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { requestId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED"];

    if (!status) {
      return res.status(400).json({
        status: "error",
        message: "status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid status value",
      });
    }

    const hospital = await prisma.hospital.findUnique({
      where: { userId },
    });

    if (!hospital) {
      return res.status(404).json({
        status: "error",
        message: "Hospital profile not found",
      });
    }

    const admissionRequest = await prisma.admissionRequest.findUnique({
      where: { id: requestId },
      include: {
        patient: true,
        hospital: true,
      },
    });

    if (!admissionRequest) {
      return res.status(404).json({
        status: "error",
        message: "Admission request not found",
      });
    }

    if (admissionRequest.hospitalId !== hospital.id) {
      return res.status(403).json({
        status: "error",
        message: "You can only manage requests for your own hospital",
      });
    }

    if (admissionRequest.status !== "PENDING") {
      return res.status(400).json({
        status: "error",
        message: `Only pending requests can be updated. Current status is ${admissionRequest.status}`,
      });
    }

    const updatedRequest = await prisma.admissionRequest.update({
      where: { id: requestId },
      data: { status },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
          },
        },
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
    const patientUser = await prisma.patient.findUnique({
  where: { id: updatedRequest.patient.id },
  select: { userId: true },
});

if (patientUser) {
  await prisma.notification.create({
    data: {
      userId: patientUser.userId,
      type: "ADMISSION_REQUEST",
      message: `Your admission request to ${updatedRequest.hospital.name} was ${updatedRequest.status.toLowerCase()}`,
    },
  });
}

    return res.status(200).json({
      status: "success",
      message: "Admission request status updated successfully",
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

export const getHospitalAdmissionRequests = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const hospital = await prisma.hospital.findUnique({
      where: { userId }
    });

    if (!hospital) {
      return res.status(404).json({
        status: "error",
        message: "Hospital not found"
      });
    }

    const requests = await prisma.admissionRequest.findMany({
      where: {
        hospitalId: hospital.id
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            phoneNumber: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.status(200).json({
      status: "success",
      message: "Hospital admission requests fetched successfully",
      data: requests
    });

  } catch (error) {
    next(error);
  }
};

// PATIENT: create ambulance request
export const createAmbulanceRequest = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { pickup_address, latitude, longitude, description } = req.body;

    if (!pickup_address) {
      return res.status(400).json({
        status: "error",
        message: "pickup_address is required",
      });
    }

    const patient = await prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      return res.status(404).json({
        status: "error",
        message: "Patient profile not found",
      });
    }

    const existingPendingRequest = await prisma.ambulanceRequest.findFirst({
      where: {
        patientId: patient.id,
        status: "PENDING",
      },
    });

    if (existingPendingRequest) {
      return res.status(409).json({
        status: "error",
        message: "You already have a pending ambulance request",
      });
    }

    const availableAmbulance = await prisma.ambulance.findFirst({
      where: {
        status: "AVAILABLE",
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!availableAmbulance) {
      return res.status(404).json({
        status: "error",
        message: "No available ambulance found at the moment",
      });
    }

    const ambulanceRequest = await prisma.ambulanceRequest.create({
      data: {
        patientId: patient.id,
        ambulanceId: availableAmbulance.id,
        pickupAddress: pickup_address,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        description: description || null,
        status: "PENDING",
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
          },
        },
        ambulance: {
          select: {
            id: true,
            driverName: true,
            phoneNumber: true,
            ambulanceNumber: true,
            status: true,
            hospital: {
              select: {
                id: true,
                name: true,
                address: true,
                contactNumber: true,
              },
            },
          },
        },
      },
    });

    const ambulanceDriver = await prisma.ambulance.findUnique({
  where: { id: availableAmbulance.id },
  select: {
    userId: true,
    driverName: true,
  },
});

if (ambulanceDriver) {
  await prisma.notification.create({
    data: {
      userId: ambulanceDriver.userId,
      type: "AMBULANCE_REQUEST",
      message: `A new ambulance request has been assigned to you`,
    },
  });
}
    return res.status(201).json({
      status: "success",
      message: "Ambulance request created successfully",
      data: ambulanceRequest,
    });
  } catch (error) {
    next(error);
  }
};

// PATIENT: get own ambulance requests
export const getMyAmbulanceRequests = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const patient = await prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      return res.status(404).json({
        status: "error",
        message: "Patient profile not found",
      });
    }

    const requests = await prisma.ambulanceRequest.findMany({
      where: {
        patientId: patient.id,
      },
      include: {
        ambulance: {
          select: {
            id: true,
            driverName: true,
            phoneNumber: true,
            ambulanceNumber: true,
            status: true,
            hospital: {
              select: {
                id: true,
                name: true,
                address: true,
                contactNumber: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Ambulance requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// AMBULANCE DRIVER: update assigned ambulance request status
export const updateAmbulanceRequestStatus = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { requestId } = req.params;
    const nextStatus = req.body?.status;

    if (!nextStatus) {
      return res.status(400).json({
        status: "error",
        message: "status is required",
      });
    }

    const allowedStatuses = ["ACCEPTED", "REJECTED", "COMPLETED"];

    if (!allowedStatuses.includes(nextStatus)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid status value",
      });
    }

    const ambulance = await prisma.ambulance.findUnique({
      where: { userId },
    });

    if (!ambulance) {
      return res.status(404).json({
        status: "error",
        message: "Ambulance profile not found",
      });
    }

    const ambulanceRequest = await prisma.ambulanceRequest.findUnique({
      where: { id: requestId },
      include: {
        patient: true,
        ambulance: true,
      },
    });

    if (!ambulanceRequest) {
      return res.status(404).json({
        status: "error",
        message: "Ambulance request not found",
      });
    }

    if (ambulanceRequest.ambulanceId !== ambulance.id) {
      return res.status(403).json({
        status: "error",
        message: "You can only update requests assigned to your ambulance",
      });
    }

    if (ambulanceRequest.status === "COMPLETED") {
      return res.status(400).json({
        status: "error",
        message: "Completed request cannot be updated again",
      });
    }

    if (
      ambulanceRequest.status === "REJECTED" &&
      nextStatus !== "REJECTED"
    ) {
      return res.status(400).json({
        status: "error",
        message: "Rejected request cannot be updated again",
      });
    }

    let ambulanceStatus = ambulance.status;

    if (nextStatus === "ACCEPTED") {
      ambulanceStatus = "ON_DUTY";
    } else if (nextStatus === "REJECTED" || nextStatus === "COMPLETED") {
      ambulanceStatus = "AVAILABLE";
    }

    const [updatedRequest, updatedAmbulance] = await Promise.all([
      prisma.ambulanceRequest.update({
        where: { id: requestId },
        data: { status: nextStatus },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              phoneNumber: true,
            },
          },
          ambulance: {
            select: {
              id: true,
              driverName: true,
              phoneNumber: true,
              ambulanceNumber: true,
              status: true,
            },
          },
        },
      }),
      prisma.ambulance.update({
        where: { id: ambulance.id },
        data: { status: ambulanceStatus },
      }),
    ]);
    if (updatedRequest.patient?.id) {
  const patientUser = await prisma.patient.findUnique({
    where: { id: updatedRequest.patient.id },
    select: { userId: true },
  });

  if (patientUser) {
    await prisma.notification.create({
      data: {
        userId: patientUser.userId,
        type: "AMBULANCE_REQUEST",
        message: `Your ambulance request was ${updatedRequest.status.toLowerCase()}`,
      },
    });
  }
}

    return res.status(200).json({
      status: "success",
      message: "Ambulance request status updated successfully",
      data: {
        request: updatedRequest,
        ambulance_status: updatedAmbulance.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// HOSPITAL: create transfer/resource request to another hospital
export const createHospitalTransferRequest = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { receiver_hospital_id, transfer_type, description } = req.body;

    if (!receiver_hospital_id || !transfer_type) {
      return res.status(400).json({
        status: "error",
        message: "receiver_hospital_id and transfer_type are required",
      });
    }

    const validTransferTypes = [
      "PATIENT_TRANSFER",
      "BLOOD_REQUEST",
      "EQUIPMENT_REQUEST",
      "RESOURCE_SUPPORT",
    ];

    if (!validTransferTypes.includes(transfer_type)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid transfer_type",
      });
    }

    const senderHospital = await prisma.hospital.findUnique({
      where: { userId },
    });

    if (!senderHospital) {
      return res.status(404).json({
        status: "error",
        message: "Sender hospital not found",
      });
    }

    if (senderHospital.id === receiver_hospital_id) {
      return res.status(400).json({
        status: "error",
        message: "A hospital cannot send request to itself",
      });
    }

    const receiverHospital = await prisma.hospital.findUnique({
      where: { id: receiver_hospital_id },
    });

    if (!receiverHospital) {
      return res.status(404).json({
        status: "error",
        message: "Receiver hospital not found",
      });
    }

    const transferRequest = await prisma.hospitalTransferRequest.create({
      data: {
        senderHospitalId: senderHospital.id,
        receiverHospitalId: receiver_hospital_id,
        transferType: transfer_type,
        description: description || null,
        status: "PENDING",
      },
      include: {
        senderHospital: {
          select: {
            id: true,
            name: true,
            address: true,
            contactNumber: true,
          },
        },
        receiverHospital: {
          select: {
            id: true,
            name: true,
            address: true,
            contactNumber: true,
          },
        },
      },
    });
    const receiverHospitalUser = await prisma.hospital.findUnique({
  where: { id: receiver_hospital_id },
  select: { userId: true, name: true },
});

if (receiverHospitalUser) {
  await prisma.notification.create({
    data: {
      userId: receiverHospitalUser.userId,
      type: "TRANSFER_REQUEST",
      message: `New ${transfer_type.toLowerCase()} request received from ${transferRequest.senderHospital.name}`,
    },
  });
}
    return res.status(201).json({
      status: "success",
      message: "Hospital transfer request created successfully",
      data: transferRequest,
    });
  } catch (error) {
    next(error);
  }
};

// HOSPITAL: get sent transfer requests
export const getMySentTransferRequests = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const hospital = await prisma.hospital.findUnique({
      where: { userId },
    });

    if (!hospital) {
      return res.status(404).json({
        status: "error",
        message: "Hospital not found",
      });
    }

    const requests = await prisma.hospitalTransferRequest.findMany({
      where: {
        senderHospitalId: hospital.id,
      },
      include: {
        receiverHospital: {
          select: {
            id: true,
            name: true,
            address: true,
            contactNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Sent transfer requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// HOSPITAL: get received transfer requests
export const getMyReceivedTransferRequests = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const hospital = await prisma.hospital.findUnique({
      where: { userId },
    });

    if (!hospital) {
      return res.status(404).json({
        status: "error",
        message: "Hospital not found",
      });
    }

    const requests = await prisma.hospitalTransferRequest.findMany({
      where: {
        receiverHospitalId: hospital.id,
      },
      include: {
        senderHospital: {
          select: {
            id: true,
            name: true,
            address: true,
            contactNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Received transfer requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// HOSPITAL: accept/reject received transfer request
export const updateHospitalTransferRequestStatus = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { requestId } = req.params;
    const nextStatus = req.body?.status;

    if (!nextStatus) {
      return res.status(400).json({
        status: "error",
        message: "status is required",
      });
    }

    const allowedStatuses = ["ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED"];

    if (!allowedStatuses.includes(nextStatus)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid status value",
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

    const transferRequest = await prisma.hospitalTransferRequest.findUnique({
      where: { id: requestId },
      include: {
        senderHospital: true,
        receiverHospital: true,
      },
    });

    if (!transferRequest) {
      return res.status(404).json({
        status: "error",
        message: "Transfer request not found",
      });
    }

    if (transferRequest.receiverHospitalId !== hospital.id) {
      return res.status(403).json({
        status: "error",
        message: "You can only manage requests received by your hospital",
      });
    }

    if (transferRequest.status !== "PENDING") {
      return res.status(400).json({
        status: "error",
        message: `Only pending requests can be updated. Current status is ${transferRequest.status}`,
      });
    }

    const updatedRequest = await prisma.hospitalTransferRequest.update({
      where: { id: requestId },
      data: {
        status: nextStatus,
      },
      include: {
        senderHospital: {
          select: {
            id: true,
            name: true,
            address: true,
            contactNumber: true,
          },
        },
        receiverHospital: {
          select: {
            id: true,
            name: true,
            address: true,
            contactNumber: true,
          },
        },
      },
    });
    const senderHospitalUser = await prisma.hospital.findUnique({
  where: { id: updatedRequest.senderHospital.id },
  select: { userId: true },
});

if (senderHospitalUser) {
  await prisma.notification.create({
    data: {
      userId: senderHospitalUser.userId,
      type: "TRANSFER_REQUEST",
      message: `Your transfer request to ${updatedRequest.receiverHospital.name} was ${updatedRequest.status.toLowerCase()}`,
    },
  });
}

    return res.status(200).json({
      status: "success",
      message: "Transfer request status updated successfully",
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};