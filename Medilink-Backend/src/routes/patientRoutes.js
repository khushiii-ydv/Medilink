/**
 * routes/patientRoutes.js
 */
import express from 'express';
import * as patientController from '../controllers/patientController.js';

const router = express.Router();

router.post('/register', patientController.registerPatient);
router.get('/:id', patientController.getPatientProfile);

export default router;
