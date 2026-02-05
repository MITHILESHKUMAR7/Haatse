import prisma from '../prismaClient.js';
import {
  DEFAULT_COMMISSION_PERCENT,
  MAX_COMMISSION_PERCENT,
  MINIMUM_ORDER_KG,
  farmerDefaultAction
} from '../utils/businessRules.js';

export const lockDeal = async ({ listingId, buyerId, quantityKg, dueDate }) => {
  if (quantityKg < MINIMUM_ORDER_KG) {
    throw new Error(`Minimum lock quantity is ${MINIMUM_ORDER_KG} kg.`);
  }

  const listing = await prisma.productListing.findUnique({ where: { id: listingId } });
  if (!listing) throw new Error('Listing not found.');
  if (listing.status === 'LOCKED') throw new Error('Listing is already locked.');
  if (quantityKg > listing.quantityKg) throw new Error('Requested quantity is higher than available stock.');

  const config = await prisma.appConfig.findUnique({ where: { key: 'commission_percent' } });
  const commissionPercent = Number(config?.value || DEFAULT_COMMISSION_PERCENT);

  if (commissionPercent > MAX_COMMISSION_PERCENT) {
    throw new Error('Commission percent cannot be above business policy.');
  }

  const totalAmount = Number(listing.pricePerKg) * quantityKg;
  const commissionAmount = (totalAmount * commissionPercent) / 100;
  const finalPayoutAmount = totalAmount - commissionAmount;

  const order = await prisma.order.create({
    data: {
      listingId,
      buyerId,
      farmerId: listing.farmerId,
      lockedQuantityKg: quantityKg,
      lockedPricePerKg: listing.pricePerKg,
      commissionPercent,
      totalAmount,
      commissionAmount,
      finalPayoutAmount,
      lockNotes: 'Deal locked. Price and quantity are final by policy.',
      paymentStatus: {
        create: {
          status: 'PENDING',
          dueDate: new Date(dueDate)
        }
      },
      transactions: {
        create: [
          { type: 'ESCROW_LOGICAL', amount: totalAmount, notes: 'Logical escrow initiated' },
          { type: 'COMMISSION', amount: commissionAmount, notes: 'Commission reserved for HaatSe' }
        ]
      }
    },
    include: {
      paymentStatus: true,
      transactions: true
    }
  });

  const remainingQty = listing.quantityKg - quantityKg;
  await prisma.productListing.update({
    where: { id: listing.id },
    data: {
      quantityKg: remainingQty,
      status: remainingQty === 0 ? 'LOCKED' : 'PARTIALLY_LOCKED'
    }
  });

  return order;
};

export const markFarmerDefault = async ({ farmerUserId }) => {
  const profile = await prisma.farmerProfile.findUnique({ where: { userId: farmerUserId } });
  if (!profile) throw new Error('Farmer profile not found.');

  const newCount = profile.defaultCount + 1;
  const action = farmerDefaultAction(newCount);

  const updateData = { defaultCount: newCount };

  if (action === 'temporary_suspension') {
    updateData.suspensionEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  if (action === 'permanent_ban') {
    updateData.isPermanentlyBanned = true;
  }

  await prisma.farmerProfile.update({
    where: { userId: farmerUserId },
    data: updateData
  });

  if (action !== 'none') {
    await prisma.blacklist.create({
      data: {
        userId: farmerUserId,
        reason: 'FARMER_DEFAULT',
        details: `Farmer default count is now ${newCount}. Action: ${action}.`,
        active: action === 'permanent_ban'
      }
    });
  }

  return { newCount, action };
};

export const markBuyerPaymentDelay = async ({ buyerUserId }) => {
  const profile = await prisma.buyerProfile.findUnique({ where: { userId: buyerUserId } });
  if (!profile) throw new Error('Buyer profile not found.');

  const delayCount = profile.paymentDelayCount + 1;

  await prisma.buyerProfile.update({
    where: { userId: buyerUserId },
    data: {
      paymentDelayCount: delayCount,
      suspensionEndsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    }
  });

  await prisma.blacklist.create({
    data: {
      userId: buyerUserId,
      reason: 'BUYER_PAYMENT_DELAY',
      details: `Buyer payment delay count is now ${delayCount}. Auto-suspended.`
    }
  });

  return { delayCount, action: 'temporary_suspension' };
};
