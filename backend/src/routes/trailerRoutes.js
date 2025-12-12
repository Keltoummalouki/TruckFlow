import express from 'express';
import * as trailerController from '../controllers/trailerController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { createTrailerSchema, updateTrailerSchema, assignTruckSchema } from '../validators/trailerValidator.js';

const router = express.Router();

router.use(authenticate);

router.get('/', trailerController.getAll);
router.get('/available', trailerController.getAvailable);
router.get('/type/:type', trailerController.getByType);
router.get('/:id', trailerController.getById);
router.post('/', authorize('admin'), validate(createTrailerSchema), trailerController.create);
router.put('/:id', authorize('admin'), validate(updateTrailerSchema), trailerController.update);
router.delete('/:id', authorize('admin'), trailerController.deleteTrailer);
router.post('/:id/assign', authorize('admin'), validate(assignTruckSchema), trailerController.assignToTruck);
router.post('/:id/unassign', authorize('admin'), trailerController.unassignFromTruck);

export default router;