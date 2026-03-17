/**
 * services/adminService.js
 */
import prisma from '../config/db.js';

export const listHospitals = async () => {
  return await prisma.hospital.findMany({
    include: { resources: true }
  });
};

export const listSystemDoctors = async () => {
  return await prisma.systemUser.findMany({
    where: { role: 'DOCTOR' },
    select: { id: true, name: true, email: true }
  });
};

export const listAllPatientRequests = async () => {
  return await prisma.patientRequest.findMany({
    include: { 
      hospital: { select: { name: true } },
      assignedDoctor: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const assignRequestToDoctor = async (requestId, doctorId) => {
  return await prisma.patientRequest.update({
    where: { id: requestId },
    data: { 
      assignedDoctorId: doctorId,
      status: 'ASSIGNED'
    },
    include: { assignedDoctor: true }
  });
};
