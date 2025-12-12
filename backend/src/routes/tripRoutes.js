import express from 'express';
import * as tripController from '../controllers/tripController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { createTripSchema, updateTripSchema, updateStatusSchema } from '../validators/tripValidator.js';
import * as pdfController from '../controllers/pdfController.js';

const router = express.Router();

router.use(authenticate);

router.get('/', tripController.getAll);
router.get('/status/:status', tripController.getByStatus);
router.get('/driver/:driverId', tripController.getByDriver);
router.get('/:id', tripController.getById);
router.post('/', authorize('admin'), validate(createTripSchema), tripController.create);
router.put('/:id', authorize('admin'), validate(updateTripSchema), tripController.update);
router.patch('/:id/status', validate(updateStatusSchema), tripController.updateStatus);
router.delete('/:id', authorize('admin'), tripController.deleteTrip);
router.get('/:id/download-pdf', pdfController.downloadTripPDF);



export default router;
