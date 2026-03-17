/**
 * controllers/adminController.js
 */
import * as adminService from '../services/adminService.js';
import { sendSuccess } from '../utils/responseHelper.js';

export const getHospitals = async (req, res, next) => {
  try {
    const data = await adminService.listHospitals();
    return sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
};

export const getSystemDoctors = async (req, res, next) => {
  try {
    const data = await adminService.listSystemDoctors();
    return sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
};

export const getPatientRequests = async (req, res, next) => {
  try {
    const data = await adminService.listAllPatientRequests();
    return sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
};

export const assignRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { doctorId } = req.body;
    const data = await adminService.assignRequestToDoctor(requestId, doctorId);
    return sendSuccess(res, data, 200, 'Request assigned to doctor');
  } catch (err) {
    next(err);
  }
};
