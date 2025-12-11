import express from 'express';
import * as truckController from '../controllers/truckController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { createTruckSchema, updateTruckSchema, assignDriverSchema } from '../validators/truckValidator.js';

const router = express.Router();

router.use(authenticate);

router.get('/', truckController.getAll);
router.get('/available', truckController.getAvailable);
router.get('/:id', truckController.getById);
router.post('/', authorize('admin'), validate(createTruckSchema), truckController.create);
router.put('/:id', authorize('admin'), validate(updateTruckSchema), truckController.update);
router.delete('/:id', authorize('admin'), truckController.deleteTruck);
router.post('/:id/assign', authorize('admin'), validate(assignDriverSchema), truckController.assignDriver);
router.post('/:id/unassign', authorize('admin'), truckController.unassignDriver);

export default router;
