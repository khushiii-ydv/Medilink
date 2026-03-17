/**
 * controllers/authController.js
 */
import prisma from '../config/db.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

export const loginHospital = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    
    if (!name || !password) {
      return sendError(res, 'Hospital name and password are required', 400);
    }

    // Try finding by exact name match (case insensitive)
    const hospital = await prisma.hospital.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive' // Requires PostgreSQL
        }
      }
    });

    if (!hospital) {
      return sendError(res, 'Invalid hospital name or password', 401);
    }

    if (hospital.password !== password) {
      // Note: In production, password should be hashed with bcrypt
      return sendError(res, 'Invalid hospital name or password', 401);
    }

    // JWT payload
    const payload = {
      id: hospital.id,
      name: hospital.name,
      role: 'hospital'
    };

    // Generate token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    // Login successful
    sendSuccess(res, {
      role: 'hospital',
      hospitalId: hospital.id,
      name: hospital.name,
      token, // Return the generated JWT
    }, 200);
  } catch (error) {
    next(error);
  }
};
