import { Router } from 'express';
import { browseListings, createFarmerListing } from '../controllers/listingController.js';
import { allowRoles, mockAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', browseListings);
router.post('/', mockAuth, allowRoles('FARMER'), createFarmerListing);

export default router;
