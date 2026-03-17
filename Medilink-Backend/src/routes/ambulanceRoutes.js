/**
 * routes/ambulanceRoutes.js
 */
import express from 'express';
import * as ambulanceController from '../controllers/ambulanceController.js';

const router = express.Router();

router.post('/register', ambulanceController.registerAmbulance);
router.get('/', ambulanceController.getAllAmbulances);
router.get('/:id', ambulanceController.getAmbulanceProfile);

export default router;
