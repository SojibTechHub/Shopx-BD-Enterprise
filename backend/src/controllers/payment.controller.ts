import { Request, Response } from 'express';
// @ts-ignore
import SSLCommerzPayment from 'sslcommerz-lts';
import { Order } from '../models/Order.js';

const getStoreId = () => process.env.SSLCOMMERZ_STORE_ID || 'testbox';
const getStorePasswd = () => process.env.SSLCOMMERZ_STORE_PASSWORD || 'qwerty';
const getIsLive = () => process.env.SSLCOMMERZ_SANDBOX === 'false';

export const initSSLPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.body;
    const order = await Order.findOne({ orderId });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const tran_id = `TXN-${order.orderId}-${Date.now()}`;
    order.sslTransactionId = tran_id;
    await order.save();

    const data = {
      total_amount: order.totalAmount,
      currency: 'BDT',
      tran_id: tran_id,
      success_url: process.env.SSLCOMMERZ_SUCCESS_URL || `http://localhost:5000/api/payment/success?tran_id=${tran_id}`,
      fail_url: process.env.SSLCOMMERZ_FAIL_URL || `http://localhost:5000/api/payment/fail?tran_id=${tran_id}`,
      cancel_url: process.env.SSLCOMMERZ_CANCEL_URL || `http://localhost:5000/api/payment/cancel?tran_id=${tran_id}`,
      ipn_url: `http://localhost:5000/api/payment/ipn`,
      shipping_method: 'Courier',
      product_name: order.items.map((i) => i.title).join(', ') || 'ShopX Product',
      product_category: 'General',
      product_profile: 'general',
      cus_name: order.customerInfo.name || 'Valued Customer',
      cus_email: order.customerInfo.email || 'customer@shopxbd.com',
      cus_add1: order.customerInfo.address || 'Dhaka',
      cus_city: order.customerInfo.city || 'Dhaka',
      cus_postcode: (order.customerInfo as any).postcode || '1207',
      cus_country: 'Bangladesh',
      cus_phone: order.customerInfo.phone || '01700000000',
      ship_name: order.customerInfo.name || 'Valued Customer',
      ship_add1: order.customerInfo.address || 'Dhaka',
      ship_city: order.customerInfo.city || 'Dhaka',
      ship_postcode: (order.customerInfo as any).postcode || '1207',
      ship_country: 'Bangladesh',
    };

    const sslcz = new (SSLCommerzPayment as any)(getStoreId(), getStorePasswd(), getIsLive());
    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      res.status(200).json({
        success: true,
        gatewayUrl: apiResponse.GatewayPageURL,
        sessionkey: apiResponse.sessionkey,
      });
    } else {
      res.status(400).json({
        success: false,
        message: apiResponse?.failedreason || 'SSLCommerz payment gateway initialization failed.',
        response: apiResponse,
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sslSuccess = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tran_id, val_id, bank_tran_id } = { ...req.query, ...req.body };

    const order = await Order.findOne({ sslTransactionId: tran_id });
    if (order) {
      order.paymentStatus = 'paid';
      order.sslBankTranId = bank_tran_id || val_id;
      order.trackingHistory.push({
        status: 'paid',
        message: 'SSLCommerz পেমেন্ট সফল হয়েছে (Payment Verified)',
        timestamp: new Date(),
      });
      await order.save();
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/order-success?orderId=${order?.orderId || ''}&status=paid`);
  } catch (error: any) {
    res.status(500).send(`Payment Error: ${error.message}`);
  }
};

export const sslFail = async (req: Request, res: Response): Promise<void> => {
  const { tran_id } = { ...req.query, ...req.body };
  const order = await Order.findOne({ sslTransactionId: tran_id });
  if (order) {
    order.paymentStatus = 'failed';
    await order.save();
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  res.redirect(`${frontendUrl}/checkout?status=failed&orderId=${order?.orderId || ''}`);
};

export const sslCancel = async (req: Request, res: Response): Promise<void> => {
  const { tran_id } = { ...req.query, ...req.body };
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  res.redirect(`${frontendUrl}/cart?status=cancelled`);
};
