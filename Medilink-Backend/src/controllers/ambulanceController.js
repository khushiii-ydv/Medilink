/**
 * controllers/ambulanceController.js
 */
import * as ambulanceService from '../services/ambulanceService.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const registerAmbulance = async (req, res, next) => {
  try {
    const ambulance = await ambulanceService.createAmbulance(req.body);
    return sendSuccess(res, ambulance, 201, 'Ambulance registered successfully');
  } catch (err) {
    next(err);
  }
};

export const getAmbulanceProfile = async (req, res, next) => {
  try {
    const ambulance = await ambulanceService.getAmbulanceById(req.params.id);
    return sendSuccess(res, ambulance);
  } catch (err) {
    next(err);
  }
};

export const getAllAmbulances = async (req, res, next) => {
  try {
    const ambulances = await ambulanceService.getAllAmbulances();
    return sendSuccess(res, ambulances);
  } catch (err) {
    next(err);
  }
};
