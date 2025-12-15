import express from 'express';
import * as maintenanceController from '../controllers/maintenanceController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { createMaintenanceSchema, updateMaintenanceSchema, createRuleSchema, updateRuleSchema } from '../validators/maintenanceValidator.js';

const router = express.Router();

router.use(authenticate);

router.get('/', maintenanceController.getAll);
router.get('/upcoming', maintenanceController.getUpcoming);
router.get('/check-needed', authorize('admin'), maintenanceController.checkNeeded);
router.get('/rules', authorize('admin'), maintenanceController.getAllRules);
router.get('/:id', maintenanceController.getById);
router.get('/target/:targetType/:targetId', maintenanceController.getByTarget);

router.post('/', authorize('admin'), validate(createMaintenanceSchema), maintenanceController.create);
router.post('/rules', authorize('admin'), validate(createRuleSchema), maintenanceController.createRule);

router.put('/:id', authorize('admin'), validate(updateMaintenanceSchema), maintenanceController.update);
router.put('/rules/:id', authorize('admin'), validate(updateRuleSchema), maintenanceController.updateRule);

router.delete('/:id', authorize('admin'), maintenanceController.deleteMaintenance);
router.delete('/rules/:id', authorize('admin'), maintenanceController.deleteRule);

export default router;
