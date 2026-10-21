import { Router } from 'express';
import {
  getAdminStats,
  getAllVendors,
  updateVendorStatus,
  getAllOrders,
  getAllUsers,
  updateUserRoleAndStatus,
  deleteUser,
  getAllCategoriesAdmin,
  createCategoryAdmin,
  updateCategoryAdmin,
  deleteCategoryAdmin,
  getAllCouponsAdmin,
  createCouponAdmin,
  deleteCouponAdmin,
  getSystemSettingsAdmin,
  updateSystemSettingsAdmin,
  getAnalyticsAdmin,
  getAllReviewsAdmin,
  deleteReviewAdmin,
  replyReviewAdmin,
  getFraudShieldAdmin,
  getSupportInquiriesAdmin,
  getInventoryAdmin,
  updateInventoryStockAdmin,
  getAuditLogsAdmin,
  sendBroadcastAdmin,
  getGatewaysAdmin,
  getAllBannersAdmin,
  createBannerAdmin,
  updateBannerAdmin,
  deleteBannerAdmin,
  getAbandonedCartsAdmin,
  sendAbandonedCartRecoveryAdmin,
} from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/stats', authenticate, authorize('admin'), getAdminStats);
router.get('/analytics', authenticate, authorize('admin'), getAnalyticsAdmin);
router.get('/vendors', authenticate, authorize('admin'), getAllVendors);
router.put('/vendors/:id', authenticate, authorize('admin'), updateVendorStatus);
router.get('/orders', authenticate, authorize('admin'), getAllOrders);
router.get('/users', authenticate, authorize('admin'), getAllUsers);
router.put('/users/:id', authenticate, authorize('admin'), updateUserRoleAndStatus);
router.delete('/users/:id', authenticate, authorize('admin'), deleteUser);

// Reviews Moderation
router.get('/reviews', authenticate, authorize('admin'), getAllReviewsAdmin);
router.delete('/reviews/:id', authenticate, authorize('admin'), deleteReviewAdmin);
router.post('/reviews/:id/reply', authenticate, authorize('admin'), replyReviewAdmin);

// Fraud & Risk Shield
router.get('/fraud-shield', authenticate, authorize('admin'), getFraudShieldAdmin);

// Customer Support Inquiries
router.get('/support-inquiries', authenticate, authorize('admin'), getSupportInquiriesAdmin);

// Inventory & Stock
router.get('/inventory', authenticate, authorize('admin'), getInventoryAdmin);
router.put('/inventory/:id/stock', authenticate, authorize('admin'), updateInventoryStockAdmin);

// Audit Logs & Security
router.get('/audit-logs', authenticate, authorize('admin'), getAuditLogsAdmin);

// Broadcast & Announcements
router.post('/broadcast', authenticate, authorize('admin'), sendBroadcastAdmin);

// Gateways & Logistics Health
router.get('/gateways', authenticate, authorize('admin'), getGatewaysAdmin);

// Banners & Hero Sliders
router.get('/banners', authenticate, authorize('admin'), getAllBannersAdmin);
router.post('/banners', authenticate, authorize('admin'), createBannerAdmin);
router.put('/banners/:id', authenticate, authorize('admin'), updateBannerAdmin);
router.delete('/banners/:id', authenticate, authorize('admin'), deleteBannerAdmin);

// Abandoned Carts
router.get('/abandoned-carts', authenticate, authorize('admin'), getAbandonedCartsAdmin);
router.post('/abandoned-carts/:id/recover', authenticate, authorize('admin'), sendAbandonedCartRecoveryAdmin);

// Categories
router.get('/categories', authenticate, authorize('admin'), getAllCategoriesAdmin);
router.post('/categories', authenticate, authorize('admin'), createCategoryAdmin);
router.put('/categories/:id', authenticate, authorize('admin'), updateCategoryAdmin);
router.delete('/categories/:id', authenticate, authorize('admin'), deleteCategoryAdmin);

// Coupons
router.get('/coupons', authenticate, authorize('admin'), getAllCouponsAdmin);
router.post('/coupons', authenticate, authorize('admin'), createCouponAdmin);
router.delete('/coupons/:id', authenticate, authorize('admin'), deleteCouponAdmin);

// Settings & System Health
router.get('/settings', authenticate, authorize('admin'), getSystemSettingsAdmin);
router.put('/settings', authenticate, authorize('admin'), updateSystemSettingsAdmin);

export default router;
