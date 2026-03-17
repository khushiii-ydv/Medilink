/**
 * services/hospitalService.js
 * Business logic for hospital operations.
 * Controllers call these functions; they interact with Prisma.
 */
import prisma from '../config/db.js';

// ─── Helper: Shape raw DB output into the nested format the frontend expects ──
const shapeHospital = (hospital) => {
  const r = hospital.resources;
  return {
    id: hospital.id,
    name: hospital.name,
    email: hospital.email,
    phone: hospital.phone,
    address: hospital.address,
    city: hospital.city,
    state: hospital.state,
    pincode: hospital.pincode,
    lat: hospital.lat,
    lng: hospital.lng,
    accreditation: hospital.accreditation,
    createdAt: hospital.createdAt,
    updatedAt: hospital.updatedAt,
    // Nested resource objects matching the frontend shape
    beds: r ? {
      total: r.totalBeds,
      available: r.availableBeds,
      icu: r.totalIcuBeds,
      icuAvailable: r.availableIcuBeds,
    } : null,
    ventilators: r ? {
      total: r.totalVentilators,
      available: r.availableVentilators,
    } : null,
    oxygen: r ? {
      capacity: r.oxygenCapacity,
      available: r.oxygenAvailable,
    } : null,
    bloodBank: r ? {
      'A+': r.bloodAPos,
      'A-': r.bloodANeg,
      'B+': r.bloodBPos,
      'B-': r.bloodBNeg,
      'AB+': r.bloodABPos,
      'AB-': r.bloodABNeg,
      'O+': r.bloodOPos,
      'O-': r.bloodONeg,
    } : null,
    resourcesUpdatedAt: r?.updatedAt ?? null,
    // Relations
    specialists: hospital.specialists ?? [],
    equipment: hospital.equipment ?? [],
  };
};

// ─── Get all hospitals ─────────────────────────────────────────────────────────
export const getAllHospitals = async () => {
  const hospitals = await prisma.hospital.findMany({
    include: { resources: true, specialists: true, equipment: true },
    orderBy: { createdAt: 'desc' },
  });
  return hospitals.map(shapeHospital);
};

// ─── Get single hospital by ID ────────────────────────────────────────────────
export const getHospitalById = async (id) => {
  const hospital = await prisma.hospital.findUnique({
    where: { id },
    include: { resources: true, specialists: true, equipment: true },
  });
  if (!hospital) {
    const err = new Error('Hospital not found');
    err.statusCode = 404;
    throw err;
  }
  return shapeHospital(hospital);
};

// ─── Create a new hospital ────────────────────────────────────────────────────
export const createHospital = async (data) => {
  const { name, email, phone, address, city, state, pincode, lat, lng, accreditation, password } = data;
  const hospital = await prisma.hospital.create({
    data: {
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      accreditation,
      password: password || 'hospital123',
      // auto-create empty resource row
      resources: {
        create: {},
      },
    },
    include: { resources: true, specialists: true, equipment: true },
  });
  return shapeHospital(hospital);
};

// ─── Update hospital profile ──────────────────────────────────────────────────
export const updateHospital = async (id, data) => {
  const { name, email, phone, address, city, state, pincode, lat, lng, accreditation } = data;
  const hospital = await prisma.hospital.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(email && { email }),
      ...(phone !== undefined && { phone }),
      ...(address !== undefined && { address }),
      ...(city !== undefined && { city }),
      ...(state !== undefined && { state }),
      ...(pincode !== undefined && { pincode }),
      ...(lat !== undefined && { lat: parseFloat(lat) }),
      ...(lng !== undefined && { lng: parseFloat(lng) }),
      ...(accreditation !== undefined && { accreditation }),
    },
    include: { resources: true, specialists: true, equipment: true },
  });
  return shapeHospital(hospital);
};

// ─── Get only the resource counts for a hospital ──────────────────────────────
export const getHospitalResources = async (hospitalId) => {
  const hospital = await prisma.hospital.findUnique({
    where: { id: hospitalId },
    include: { resources: true },
  });
  if (!hospital) {
    const err = new Error('Hospital not found');
    err.statusCode = 404;
    throw err;
  }
  return shapeHospital(hospital);
};

// ─── Update resource counts ───────────────────────────────────────────────────
export const updateHospitalResources = async (hospitalId, data) => {
  // Make sure the resource row exists
  const existing = await prisma.hospitalResource.findUnique({ where: { hospitalId } });
  if (!existing) {
    const err = new Error('Hospital resources record not found. Create the hospital first.');
    err.statusCode = 404;
    throw err;
  }

  const {
    totalBeds, availableBeds, totalIcuBeds, availableIcuBeds,
    totalVentilators, availableVentilators,
    oxygenCapacity, oxygenAvailable,
  } = data;

  // Build update payload — only include provided fields
  const updateData = {};
  if (totalBeds !== undefined) updateData.totalBeds = parseInt(totalBeds);
  if (availableBeds !== undefined) updateData.availableBeds = parseInt(availableBeds);
  if (totalIcuBeds !== undefined) updateData.totalIcuBeds = parseInt(totalIcuBeds);
  if (availableIcuBeds !== undefined) updateData.availableIcuBeds = parseInt(availableIcuBeds);
  if (totalVentilators !== undefined) updateData.totalVentilators = parseInt(totalVentilators);
  if (availableVentilators !== undefined) updateData.availableVentilators = parseInt(availableVentilators);
  if (oxygenCapacity !== undefined) updateData.oxygenCapacity = parseInt(oxygenCapacity);
  if (oxygenAvailable !== undefined) updateData.oxygenAvailable = parseInt(oxygenAvailable);

  // Record history for each changed field
  const historyEntries = Object.entries(updateData).map(([key, newVal]) => ({
    hospitalId,
    resourceType: key,
    oldValue: String(existing[key] ?? ''),
    newValue: String(newVal),
  }));

  await prisma.$transaction([
    prisma.hospitalResource.update({ where: { hospitalId }, data: updateData }),
    ...historyEntries.map(entry => prisma.resourceUpdateHistory.create({ data: entry })),
  ]);

  return getHospitalById(hospitalId);
};

// ─── Update blood bank ────────────────────────────────────────────────────────
export const updateBloodBank = async (hospitalId, bloodData) => {
  const BLOOD_MAP = {
    'A+': 'bloodAPos',  'A-': 'bloodANeg',
    'B+': 'bloodBPos',  'B-': 'bloodBNeg',
    'AB+': 'bloodABPos','AB-': 'bloodABNeg',
    'O+': 'bloodOPos',  'O-': 'bloodONeg',
  };

  const existing = await prisma.hospitalResource.findUnique({ where: { hospitalId } });
  if (!existing) {
    const err = new Error('Hospital resource record not found');
    err.statusCode = 404;
    throw err;
  }

  const updateData = {};
  const historyEntries = [];

  for (const [type, units] of Object.entries(bloodData)) {
    const column = BLOOD_MAP[type];
    if (column) {
      updateData[column] = parseInt(units);
      historyEntries.push({
        hospitalId,
        resourceType: `bloodBank.${type}`,
        oldValue: String(existing[column] ?? 0),
        newValue: String(units),
      });
    }
  }

  await prisma.$transaction([
    prisma.hospitalResource.update({ where: { hospitalId }, data: updateData }),
    ...historyEntries.map(entry => prisma.resourceUpdateHistory.create({ data: entry })),
  ]);

  return getHospitalById(hospitalId);
};

// ─── Dashboard summary ────────────────────────────────────────────────────────
export const getDashboardSummary = async (hospitalId) => {
  const hospital = await prisma.hospital.findUnique({
    where: { id: hospitalId },
    include: { resources: true, specialists: true, equipment: true },
  });
  if (!hospital) {
    const err = new Error('Hospital not found');
    err.statusCode = 404;
    throw err;
  }
  const r = hospital.resources;
  return {
    hospitalId,
    hospitalName: hospital.name,
    totalBedsOccupied: r ? r.totalBeds - r.availableBeds : 0,
    availableBeds: r?.availableBeds ?? 0,
    availableIcuBeds: r?.availableIcuBeds ?? 0,
    availableVentilators: r?.availableVentilators ?? 0,
    oxygenAvailable: r?.oxygenAvailable ?? 0,
    specialistsOnline: hospital.specialists.filter(s => s.available).length,
    totalSpecialists: hospital.specialists.length,
    totalBloodUnits: r
      ? r.bloodAPos + r.bloodANeg + r.bloodBPos + r.bloodBNeg +
        r.bloodABPos + r.bloodABNeg + r.bloodOPos + r.bloodONeg
      : 0,
    lastUpdatedAt: r?.updatedAt ?? null,
  };
};

// ─── Specialists ──────────────────────────────────────────────────────────────
export const addSpecialist = async (hospitalId, data) => {
  const { name, specialty, available = true } = data;
  return prisma.specialist.create({ data: { hospitalId, name, specialty, available } });
};

export const updateSpecialist = async (specialistId, data) => {
  return prisma.specialist.update({ where: { id: specialistId }, data });
};

export const deleteSpecialist = async (specialistId) => {
  return prisma.specialist.delete({ where: { id: specialistId } });
};
