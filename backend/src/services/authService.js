import crypto from 'crypto';
import prisma from '../prismaClient.js';

const sanitizeUser = (user) => {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

const signToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'dev_secret';
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
};

const createAuthResponse = (user) => {
  const token = signToken({
    userId: user.id,
    role: user.role,
    authProvider: user.authProvider,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000
  });

  return {
    token,
    user: sanitizeUser(user)
  };
};

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedHash) => {
  const [salt, hash] = storedHash.split(':');
  const candidateHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(candidateHash, 'hex'));
};

const parseGoogleTokenPayload = (idToken) => {
  try {
    const parts = idToken.split('.');
    if (parts.length < 2) {
      return null;
    }

    const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf8');
    return JSON.parse(payloadJson);
  } catch (error) {
    return null;
  }
};

const createProfileByRole = (role, companyName) => ({
  farmerProfile: role === 'FARMER' ? { create: {} } : undefined,
  buyerProfile: role === 'BUYER' ? { create: { companyName: companyName || 'Unnamed Buyer Company' } } : undefined
});

export const registerUser = async ({ phoneNumber, fullName, role, districtId, companyName, email, password }) => {
  const hasPhoneAuth = Boolean(phoneNumber);
  const hasEmailAuth = Boolean(email && password);

  if (!hasPhoneAuth && !hasEmailAuth) {
    throw new Error('Provide phoneNumber for phone onboarding or email + password for email onboarding.');
  }

  const data = {
    fullName,
    role,
    districtId,
    ...createProfileByRole(role, companyName)
  };

  if (hasPhoneAuth) {
    data.phoneNumber = phoneNumber;
    data.authProvider = 'PHONE';
  }

  if (hasEmailAuth) {
    data.email = email.toLowerCase();
    data.passwordHash = hashPassword(password);
    data.authProvider = 'EMAIL';
  }

  const user = await prisma.user.create({
    data,
    include: {
      farmerProfile: true,
      buyerProfile: true
    }
  });

  return user;
};

export const registerWithEmail = async ({ email, password, fullName, role, districtId, companyName }) => {
  if (!email || !password || !fullName || !role || !districtId) {
    throw new Error('Missing required fields for email signup.');
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    throw new Error('Email is already registered.');
  }

  const user = await registerUser({
    email,
    password,
    fullName,
    role,
    districtId,
    companyName
  });

  return createAuthResponse(user);
};

export const loginWithEmail = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  if (!user || !user.passwordHash) {
    throw new Error('Invalid email or password.');
  }

  const passwordMatches = verifyPassword(password, user.passwordHash);
  if (!passwordMatches) {
    throw new Error('Invalid email or password.');
  }

  return createAuthResponse(user);
};

export const googleSignupOrLogin = async ({ idToken, role, districtId, companyName }) => {
  if (!idToken) {
    throw new Error('Google idToken is required.');
  }

  const payload = parseGoogleTokenPayload(idToken);

  if (!payload?.email || !payload?.sub) {
    throw new Error('Invalid Google token payload.');
  }

  const normalizedEmail = payload.email.toLowerCase();
  let user = await prisma.user.findFirst({
    where: {
      OR: [{ googleId: payload.sub }, { email: normalizedEmail }]
    },
    include: {
      farmerProfile: true,
      buyerProfile: true
    }
  });

  if (!user) {
    if (!role || !districtId) {
      throw new Error('role and districtId are required for first-time Google signup.');
    }

    user = await prisma.user.create({
      data: {
        fullName: payload.name || 'Google User',
        email: normalizedEmail,
        googleId: payload.sub,
        authProvider: 'GOOGLE',
        role,
        districtId,
        ...createProfileByRole(role, companyName)
      },
      include: {
        farmerProfile: true,
        buyerProfile: true
      }
    });
  } else if (!user.googleId || user.authProvider !== 'GOOGLE') {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        googleId: payload.sub,
        authProvider: 'GOOGLE'
      },
      include: {
        farmerProfile: true,
        buyerProfile: true
      }
    });
  }

  return createAuthResponse(user);
};

export const verifyOtpPlaceholder = async ({ phoneNumber }) => {
  const user = await prisma.user.findUnique({ where: { phoneNumber } });
  if (!user) {
    return null;
  }

  return {
    message: 'OTP accepted (placeholder). Replace with real SMS service later.',
    user
  };
};
