/**
 * controllers/hospitalController.js
 * Express route handlers — thin layer that calls service functions
 * and sends back standardized responses.
 */
import * as hospitalService from '../services/hospitalService.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

// GET /api/hospitals
export const listHospitals = async (req, res, next) => {
  try {
    const hospitals = await hospitalService.getAllHospitals();
    return sendSuccess(res, hospitals);
  } catch (err) {
    next(err);
  }
};

// POST /api/hospital
export const createHospital = async (req, res, next) => {
  try {
    const hospital = await hospitalService.createHospital(req.body);
    return sendSuccess(res, hospital, 201, 'Hospital created successfully');
  } catch (err) {
    next(err);
  }
};

// GET /api/hospital/:id
export const getHospital = async (req, res, next) => {
  try {
    const hospital = await hospitalService.getHospitalById(req.params.id);
    return sendSuccess(res, hospital);
  } catch (err) {
    next(err);
  }
};

// PUT /api/hospital/:id
export const updateHospital = async (req, res, next) => {
  try {
    const hospital = await hospitalService.updateHospital(req.params.id, req.body);
    return sendSuccess(res, hospital, 200, 'Hospital profile updated');
  } catch (err) {
    next(err);
  }
};

// GET /api/hospital/:id/resources
export const getHospitalResources = async (req, res, next) => {
  try {
    const data = await hospitalService.getHospitalResources(req.params.id);
    return sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
};

// PUT /api/hospital/:id/resources
export const updateHospitalResources = async (req, res, next) => {
  try {
    const data = await hospitalService.updateHospitalResources(req.params.id, req.body);
    return sendSuccess(res, data, 200, 'Resources updated successfully');
  } catch (err) {
    next(err);
  }
};

// PUT /api/hospital/:id/bloodbank
export const updateBloodBank = async (req, res, next) => {
  try {
    const data = await hospitalService.updateBloodBank(req.params.id, req.body);
    return sendSuccess(res, data, 200, 'Blood bank updated successfully');
  } catch (err) {
    next(err);
  }
};

// GET /api/hospital/:id/dashboard-summary
export const getDashboardSummary = async (req, res, next) => {
  try {
    const summary = await hospitalService.getDashboardSummary(req.params.id);
    return sendSuccess(res, summary);
  } catch (err) {
    next(err);
  }
};

// POST /api/hospital/:id/specialists
export const addSpecialist = async (req, res, next) => {
  try {
    const specialist = await hospitalService.addSpecialist(req.params.id, req.body);
    return sendSuccess(res, specialist, 201, 'Specialist added');
  } catch (err) {
    next(err);
  }
};

// PUT /api/hospital/:id/specialists/:specialistId
export const updateSpecialist = async (req, res, next) => {
  try {
    const specialist = await hospitalService.updateSpecialist(req.params.specialistId, req.body);
    return sendSuccess(res, specialist, 200, 'Specialist updated');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/hospital/:id/specialists/:specialistId
export const deleteSpecialist = async (req, res, next) => {
  try {
    await hospitalService.deleteSpecialist(req.params.specialistId);
    return sendSuccess(res, null, 200, 'Specialist removed');
  } catch (err) {
    next(err);
  }
};
