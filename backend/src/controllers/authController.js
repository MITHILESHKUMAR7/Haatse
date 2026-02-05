import { registerUser, verifyOtpPlaceholder } from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const result = await verifyOtpPlaceholder(req.body);
    if (!result) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
