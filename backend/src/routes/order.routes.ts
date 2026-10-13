import { Router } from 'express';
import {
  createOrder,
  trackOrder,
  getMyOrders,
  updateOrderStatus,
} from '../controllers/order.controller.js';
import { authenticate, optionalAuth, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/', optionalAuth, createOrder);
router.get('/track', trackOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.put('/:id/status', authenticate, authorize('admin', 'vendor', 'rider'), updateOrderStatus);

export default router;
