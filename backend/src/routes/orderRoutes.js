import { Router } from 'express';
import { buyerDelay, createLockedDeal, farmerDefault } from '../controllers/orderController.js';
import { allowRoles, mockAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/lock', mockAuth, allowRoles('BUYER'), createLockedDeal);
router.post('/farmer-default', mockAuth, allowRoles('ADMIN'), farmerDefault);
router.post('/buyer-delay', mockAuth, allowRoles('ADMIN'), buyerDelay);

export default router;
