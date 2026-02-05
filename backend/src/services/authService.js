import prisma from '../prismaClient.js';

// This function creates a user and the correct profile based on role.
export const registerUser = async ({ phoneNumber, fullName, role, districtId, companyName }) => {
  const user = await prisma.user.create({
    data: {
      phoneNumber,
      fullName,
      role,
      districtId,
      farmerProfile: role === 'FARMER' ? { create: {} } : undefined,
      buyerProfile: role === 'BUYER' ? { create: { companyName: companyName || 'Unnamed Buyer Company' } } : undefined
    },
    include: {
      farmerProfile: true,
      buyerProfile: true
    }
  });

  return user;
};

// OTP placeholder: accept any 6 digit code for now.
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
