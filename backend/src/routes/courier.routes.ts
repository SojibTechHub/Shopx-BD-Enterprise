import { Router } from 'express';
import {
  createSteadfastBooking,
  createPathaoBooking,
  createDEXBooking,
} from '../controllers/courier.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/steadfast/book', authenticate, authorize('admin', 'vendor'), createSteadfastBooking);
router.post('/pathao/book', authenticate, authorize('admin', 'vendor'), createPathaoBooking);
router.post('/dex/book', authenticate, authorize('admin', 'vendor'), createDEXBooking);

export default router;

