import express from 'express';
import * as driverController from '../controllers/driverController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { updateStatusSchema } from '../validators/tripValidator.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('driver'));

router.get('/trips', driverController.getMyTrips);
router.get('/trips/:id', driverController.getTripById);
router.patch('/trips/:id/status', validate(updateStatusSchema), driverController.updateTripStatus);

export default router;
