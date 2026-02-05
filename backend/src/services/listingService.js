import prisma from '../prismaClient.js';
import { MINIMUM_ORDER_KG } from '../utils/businessRules.js';

export const createListing = async ({ farmerId, districtId, cropName, quantityKg, pricePerKg }) => {
  if (quantityKg < MINIMUM_ORDER_KG) {
    throw new Error(`Minimum order quantity must be at least ${MINIMUM_ORDER_KG} kg.`);
  }

  const listing = await prisma.productListing.create({
    data: {
      farmerId,
      districtId,
      cropName,
      quantityKg,
      pricePerKg,
      minimumOrderKg: MINIMUM_ORDER_KG
    }
  });

  return listing;
};

export const getListings = async ({ district, crop, minQuantity }) => {
  const where = {
    isVerified: true,
    status: { in: ['OPEN', 'PARTIALLY_LOCKED'] },
    district: district ? { name: district } : undefined,
    cropName: crop ? { contains: crop, mode: 'insensitive' } : undefined,
    quantityKg: minQuantity ? { gte: Number(minQuantity) } : undefined
  };

  return prisma.productListing.findMany({
    where,
    include: {
      district: true,
      farmer: {
        select: {
          id: true,
          fullName: true,
          verificationStatus: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};
