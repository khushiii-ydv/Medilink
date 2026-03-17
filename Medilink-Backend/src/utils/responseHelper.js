/**
 * utils/responseHelper.js
 * Standardised JSON response helpers so all API responses follow the same shape:
 * { success: true, data: {...} }  or  { success: false, error: "msg", details: [...] }
 */

export const sendSuccess = (res, data, statusCode = 200, message = 'Success') => {
  return res.status(statusCode).json({ success: true, message, data });
};

export const sendError = (res, message = 'Internal Server Error', statusCode = 500, details = null) => {
  const payload = { success: false, error: message };
  if (details) payload.details = details;
  return res.status(statusCode).json(payload);
};
