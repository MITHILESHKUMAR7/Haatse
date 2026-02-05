import { Router } from 'express';
import { googleAuth, loginEmail, register, signupEmail, verifyOtp } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/signup/email', signupEmail);
router.post('/login/email', loginEmail);
router.post('/google', googleAuth);

export default router;
