import { Router } from 'express';
import {
  createSteadfastBooking,
  createPathaoBooking,
  createDEXBooking,
  createRedXBooking,
  getCourierRates,
} from '../controllers/courier.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Rates comparator
router.get('/rates', getCourierRates);

// Courier 1-click automated booking APIs
router.post('/steadfast/book', authenticate, authorize('admin', 'vendor'), createSteadfastBooking);
router.post('/pathao/book', authenticate, authorize('admin', 'vendor'), createPathaoBooking);
router.post('/dex/book', authenticate, authorize('admin', 'vendor'), createDEXBooking);
router.post('/redx/book', authenticate, authorize('admin', 'vendor'), createRedXBooking);

export default router;
