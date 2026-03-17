/**
 * services/patientService.js
 */
import prisma from '../config/db.js';

export const createPatient = async (data) => {
  return await prisma.patient.create({
    data: {
      name: data.name,
      phone: data.phone,
      password: data.password, // In production, hash this
    }
  });
};

export const getPatientById = async (id) => {
  return await prisma.patient.findUnique({
    where: { id },
    include: { requests: true }
  });
};

export const updatePatient = async (id, data) => {
  return await prisma.patient.update({
    where: { id },
    data
  });
};
