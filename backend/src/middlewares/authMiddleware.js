// NOTE: This middleware is a placeholder.
// In production, replace this with OTP verification + JWT validation.

export const mockAuth = (req, res, next) => {
  const role = req.headers['x-user-role'];
  const userId = req.headers['x-user-id'];

  if (!role || !userId) {
    return res.status(401).json({
      success: false,
      message: 'Missing auth headers. Send x-user-role and x-user-id.'
    });
  }

  req.user = { id: userId, role };
  next();
};

export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to perform this action.'
      });
    }

    next();
  };
};
