/**
 * controllers/patientController.js
 */
import * as patientService from '../services/patientService.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const registerPatient = async (req, res, next) => {
  try {
    const patient = await patientService.createPatient(req.body);
    return sendSuccess(res, patient, 201, 'Patient registered successfully');
  } catch (err) {
    next(err);
  }
};

export const getPatientProfile = async (req, res, next) => {
  try {
    const patient = await patientService.getPatientById(req.params.id);
    return sendSuccess(res, patient);
  } catch (err) {
    next(err);
  }
};
