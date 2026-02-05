import { Router } from 'express';
import { register, verifyOtp } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);

export default router;
