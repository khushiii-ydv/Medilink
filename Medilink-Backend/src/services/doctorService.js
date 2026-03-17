/**
 * services/doctorService.js
 */
import prisma from '../config/db.js';

export const getAssignedRequests = async (doctorId) => {
  return await prisma.patientRequest.findMany({
    where: { assignedDoctorId: doctorId },
    include: { hospital: true },
    orderBy: { updatedAt: 'desc' }
  });
};

export const resolveRequestPriority = async (requestId, { priority }) => {
  return await prisma.patientRequest.update({
    where: { id: requestId },
    data: { 
      priority,
      status: 'RESOLVED'
    }
  });
};
