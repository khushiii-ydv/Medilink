/**
 * controllers/doctorController.js
 */
import * as doctorService from '../services/doctorService.js';
import { sendSuccess } from '../utils/responseHelper.js';

export const getAssignedRequests = async (req, res, next) => {
  try {
    // req.user comes from verifyToken middleware
    const data = await doctorService.getAssignedRequests(req.user.id);
    return sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
};

export const resolveRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { priority } = req.body;
    const data = await doctorService.resolveRequestPriority(requestId, { priority });
    return sendSuccess(res, data, 200, 'Priority resolved and forwarded');
  } catch (err) {
    next(err);
  }
};
