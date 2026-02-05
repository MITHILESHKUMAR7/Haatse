import {
  lockDeal,
  markFarmerDefault,
  markBuyerPaymentDelay
} from '../services/orderService.js';

export const createLockedDeal = async (req, res, next) => {
  try {
    const order = await lockDeal({
      listingId: req.body.listingId,
      buyerId: req.user.id,
      quantityKg: Number(req.body.quantityKg),
      dueDate: req.body.dueDate
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const farmerDefault = async (req, res, next) => {
  try {
    const result = await markFarmerDefault({ farmerUserId: req.body.farmerUserId });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const buyerDelay = async (req, res, next) => {
  try {
    const result = await markBuyerPaymentDelay({ buyerUserId: req.body.buyerUserId });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
