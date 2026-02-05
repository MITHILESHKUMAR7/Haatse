import { createListing, getListings } from '../services/listingService.js';

export const createFarmerListing = async (req, res, next) => {
  try {
    const listing = await createListing({
      farmerId: req.user.id,
      districtId: req.body.districtId,
      cropName: req.body.cropName,
      quantityKg: Number(req.body.quantityKg),
      pricePerKg: Number(req.body.pricePerKg)
    });

    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

export const browseListings = async (req, res, next) => {
  try {
    const listings = await getListings(req.query);
    res.json({ success: true, data: listings });
  } catch (error) {
    next(error);
  }
};
