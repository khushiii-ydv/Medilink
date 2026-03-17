/**
 * middleware/authMiddleware.js
 * Verifies JWT tokens and roles.
 */
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/responseHelper.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

// ─── Verify JWT Token ──────────────────────────────────────────
export const verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];

  if (!token) {
    return sendError(res, 'No token provided. Access denied.', 401);
  }

  // Remove "Bearer " if present
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // add user payload to request
    next();
  } catch (err) {
    return sendError(res, 'Invalid token.', 401);
  }
};

// ─── Verify Role ───────────────────────────────────────────────
export const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, 'Forbidden. Insufficient permissions.', 403);
    }
    next();
  };
};

// ─── Verify Hospital Identity ──────────────────────────────────
// Ensures the logged-in hospital can only edit their own data
export const verifyHospitalIdentity = (req, res, next) => {
  // We assume the route has an :id param like /api/hospital/:id
  const requestedId = req.params.id;
  
  // If the user is an admin, they can bypass this
  if (req.user.role === 'admin') {
    return next();
  }

  if (req.user.role !== 'hospital' || req.user.id !== requestedId) {
    return sendError(res, 'Forbidden. You can only modify your own profile.', 403);
  }
  
  next();
};
