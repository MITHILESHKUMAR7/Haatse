import { Router } from 'express';
import {
  createCluster,
  getAnalytics,
  updateCommission,
  verifyPlatformUser
} from '../controllers/adminController.js';
import { allowRoles, mockAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(mockAuth, allowRoles('ADMIN'));
router.patch('/verify-user', verifyPlatformUser);
router.patch('/commission', updateCommission);
router.post('/clusters', createCluster);
router.get('/analytics', getAnalytics);

export default router;
