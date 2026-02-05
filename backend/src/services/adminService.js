import prisma from '../prismaClient.js';
import { DEFAULT_COMMISSION_PERCENT, MAX_COMMISSION_PERCENT } from '../utils/businessRules.js';

export const verifyUser = async ({ userId, verificationStatus }) => {
  return prisma.user.update({
    where: { id: userId },
    data: { verificationStatus }
  });
};

export const setCommissionPercent = async ({ percent }) => {
  const numberPercent = Number(percent);

  if (![DEFAULT_COMMISSION_PERCENT, MAX_COMMISSION_PERCENT].includes(numberPercent)) {
    throw new Error('Commission can only be set to 2 or 3 percent.');
  }

  return prisma.appConfig.upsert({
    where: { key: 'commission_percent' },
    update: { value: String(numberPercent) },
    create: { key: 'commission_percent', value: String(numberPercent) }
  });
};

export const districtAnalytics = async () => {
  const listings = await prisma.productListing.groupBy({
    by: ['districtId'],
    _count: { id: true },
    _sum: { quantityKg: true }
  });

  const orders = await prisma.order.groupBy({
    by: ['farmerId'],
    _count: { id: true },
    _sum: { totalAmount: true }
  });

  return { listings, orders };
};
