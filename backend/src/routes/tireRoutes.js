import express from 'express';
import * as tireController from '../controllers/tireController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { createTireSchema, updateTireSchema, assignTireSchema } from '../validators/tireValidator.js';

const router = express.Router();

router.use(authenticate);

router.get('/', tireController.getAll);
router.get('/status/:status', tireController.getByStatus);
router.get('/:id', tireController.getById);
router.post('/', authorize('admin'), validate(createTireSchema), tireController.create);
router.put('/:id', authorize('admin'), validate(updateTireSchema), tireController.update);
router.delete('/:id', authorize('admin'), tireController.deleteTire);
router.post('/:id/assign', authorize('admin'), validate(assignTireSchema), tireController.assignToTruck);
router.post('/:id/unassign', authorize('admin'), tireController.unassignFromTruck);

export default router;
