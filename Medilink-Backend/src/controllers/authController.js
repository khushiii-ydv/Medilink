/**
 * controllers/authController.js
 */
import prisma from '../config/db.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

export const login = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if ((!name && !email) || !password) {
      return sendError(res, 'Name/Email and password are required', 400);
    }

    let user = null;
    let role = 'hospital';
    let hospitalId = null;

    // 1. Try finding by hospital name if provided
    if (name) {
      user = await prisma.hospital.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } }
      });
      if (user) hospitalId = user.id;
    }

    // 2. Try finding by email (Hospital or SystemUser)
    if (!user && email) {
      // Check hospital first
      user = await prisma.hospital.findUnique({ where: { email } });
      if (user) {
        hospitalId = user.id;
      } else {
        // Check SystemUser
        user = await prisma.systemUser.findUnique({ where: { email } });
        if (user) {
          role = user.role.toLowerCase(); // 'admin' or 'doctor'
        }
      }
    }

    if (!user) {
      return sendError(res, 'Invalid credentials', 401);
    }

    if (user.password !== password) {
      // Note: In production, password should be hashed with bcrypt
      return sendError(res, 'Invalid credentials', 401);
    }

    // JWT payload
    const payload = {
      id: user.id,
      name: user.name,
      role: role,
      ...(hospitalId && { hospitalId })
    };

    // Generate token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    // Login successful
    sendSuccess(res, {
      role,
      token,
      name: user.name,
      ...(hospitalId && { hospitalId }),
      id: user.id
    }, 200, 'Login successful');
  } catch (error) {
    next(error);
  }
};
