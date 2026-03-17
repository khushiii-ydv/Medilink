/**
 * services/ambulanceService.js
 */
import prisma from '../config/db.js';

export const createAmbulance = async (data) => {
  return await prisma.ambulance.create({
    data: {
      driverName: data.driverName,
      vehicleNo: data.vehicleNo,
      phone: data.phone,
      password: data.password, // In production, hash this
      hospitalId: data.hospitalId,
      type: data.type || 'BLS',
      status: data.status || 'AVAILABLE'
    }
  });
};

export const getAmbulanceById = async (id) => {
  return await prisma.ambulance.findUnique({
    where: { id },
    include: { hospital: true }
  });
};

export const getAllAmbulances = async () => {
  return await prisma.ambulance.findMany({
    include: { hospital: true }
  });
};

export const updateAmbulance = async (id, data) => {
  return await prisma.ambulance.update({
    where: { id },
    data
  });
};
