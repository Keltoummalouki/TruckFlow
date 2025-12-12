import express from 'express';
import * as reportController from '../controllers/reportController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/fuel-consumption', reportController.getFuelConsumption);
router.get('/mileage', reportController.getMileage);
router.get('/driver-performance', reportController.getDriverPerformance);
router.get('/tire-status', reportController.getTireStatus);
router.get('/fleet-overview', reportController.getFleetOverview);

export default router;
