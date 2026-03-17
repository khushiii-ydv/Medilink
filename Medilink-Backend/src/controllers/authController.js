/**
 * controllers/authController.js
 */
import prisma from '../config/db.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

export const login = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    console.log(`[Login Attempt] Name: ${name}, Email: ${email}, Phone: ${phone}`);

    if ((!name && !email && !phone) || !password) {
      return sendError(res, 'Name/Email/Phone and password are required', 400);
    }

    let user = null;
    let role = 'hospital';
    let hospitalId = null;

    // 1. Try finding by hospital name if provided
    if (name) {
      user = await prisma.hospital.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } }
      });
      if (user) {
        hospitalId = user.id;
        role = 'hospital';
      } else {
        // Try Ambulance by driverName (matches Login.jsx name field)
        user = await prisma.ambulance.findFirst({
          where: { driverName: { equals: name, mode: 'insensitive' } }
        });
        if (user) {
          role = 'ambulance';
          hospitalId = user.hospitalId;
        }
      }
    }

    // 2. Try finding by email (Hospital or SystemUser)
    if (!user && email) {
      // Check hospital first
      user = await prisma.hospital.findUnique({ where: { email } });
      if (user) {
        hospitalId = user.id;
        role = 'hospital';
      } else {
        // Check SystemUser
        user = await prisma.systemUser.findUnique({ where: { email } });
        if (user) {
          role = user.role.toLowerCase(); // 'admin' or 'doctor'
        }
      }
    }

    // 3. Try finding by phone (Patient or Ambulance)
    if (!user && phone) {
      const normalizedPhone = phone.replace(/[^\d+]/g, '');
      console.log(`[Login Info] Normalized Phone: ${normalizedPhone}`);
      
      // Check patient
      user = await prisma.patient.findUnique({ where: { phone: normalizedPhone } });
      if (user) {
        role = 'patient';
      } else {
        // Check ambulance
        user = await prisma.ambulance.findFirst({ where: { phone: normalizedPhone } });
        if (user) {
          role = 'ambulance';
          hospitalId = user.hospitalId;
        }
      }
    }

    if (!user) {
      console.log(`[Login Failed] User not found for role: ${role}`);
      return sendError(res, 'Invalid credentials', 401);
    }

    console.log(`[Login Info] User found: ${user.name || user.driverName || user.email}, Role: ${role}`);

    if (user.password !== password) {
      console.log(`[Login Failed] Password mismatch for ${user.id}`);
      // Note: In production, password should be hashed with bcrypt
      return sendError(res, 'Invalid credentials', 401);
    }

    // JWT payload
    const payload = {
      id: user.id,
      name: user.name || user.driverName,
      role: role,
      ...(hospitalId && { hospitalId })
    };

    // Generate token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    // Login successful
    sendSuccess(res, {
      role,
      token,
      name: user.name || user.driverName,
      ...(hospitalId && { hospitalId }),
      id: user.id
    }, 200, 'Login successful');
  } catch (error) {
    next(error);
  }
};
