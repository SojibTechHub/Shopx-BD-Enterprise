import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Order } from '../models/Order.js';
import { sendSMS } from '../config/sms.js';

const findOrderByIdOrCode = async (rawId: any) => {
  if (!rawId) return null;
  const idStr = String(rawId).trim();
  if (mongoose.isValidObjectId(idStr)) {
    const byId = await Order.findById(idStr);
    if (byId) return byId;
  }
  return await Order.findOne({
    $or: [
      { orderId: idStr },
      { orderId: idStr.replace(/^#/, '') },
      { _id: mongoose.isValidObjectId(idStr) ? idStr : undefined },
    ],
  });
};

export const createSteadfastBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.body?.orderId || req.body?.id || req.body?._id || req.query?.orderId;
    if (!rawId) {
      res.status(400).json({ success: false, message: 'Order ID is required' });
      return;
    }

    const order = await findOrderByIdOrCode(rawId);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const consignmentId = `ST-${order.orderId}-${Math.floor(1000 + Math.random() * 9000)}`;

    order.trackingHistory.push({
      status: 'shipped',
      message: `Steadfast কুরিয়ারে বুকিং সম্পন্ন। কনসাইনমেন্ট ট্র্যাকিং আইডি: ${consignmentId}`,
      location: 'Steadfast Tejgaon Hub',
      timestamp: new Date(),
    });
    order.orderStatus = 'shipped';
    await order.save();

    // Trigger SMS to customer
    if (order.customerInfo?.phone) {
      sendSMS({
        to: order.customerInfo.phone,
        message: `ShopX BD: আপনার অর্ডার #${order.orderId} Steadfast কুরিয়ারে শিফট হয়েছে। ট্র্যাকিং কোড: ${consignmentId}। ২৪-৪৮ ঘণ্টায় ডেলিভারি।`,
      }).catch(err => console.warn('SMS dispatch warn:', err));
    }

    res.status(200).json({
      success: true,
      message: 'Steadfast Courier Booking Created Successfully!',
      consignmentId,
      courier: 'Steadfast Courier BD',
      status: 'in_transit',
      estimatedDelivery: '24-48 Hours',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPathaoBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.body?.orderId || req.body?.id || req.body?._id || req.query?.orderId;
    if (!rawId) {
      res.status(400).json({ success: false, message: 'Order ID is required' });
      return;
    }

    const order = await findOrderByIdOrCode(rawId);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const consignmentId = `PTH-${order.orderId}-${Math.floor(1000 + Math.random() * 9000)}`;

    order.trackingHistory.push({
      status: 'shipped',
      message: `Pathao Courier পার্সেল পিকআপ বুকিং তৈরি হয়েছে। ট্র্যাকিং কোড: ${consignmentId}`,
      location: 'Pathao Banani Hub',
      timestamp: new Date(),
    });
    order.orderStatus = 'shipped';
    await order.save();

    // Trigger SMS to customer
    if (order.customerInfo?.phone) {
      sendSMS({
        to: order.customerInfo.phone,
        message: `ShopX BD: আপনার অর্ডার #${order.orderId} Pathao কুরিয়ারে বুক করা হয়েছে। ট্র্যাকিং কোড: ${consignmentId}।`,
      }).catch(err => console.warn('SMS dispatch warn:', err));
    }

    res.status(200).json({
      success: true,
      message: 'Pathao Courier Booking Created Successfully!',
      consignmentId,
      courier: 'Pathao Courier',
      status: 'pickup_requested',
      estimatedDelivery: '24 Hours',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDEXBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.body?.orderId || req.body?.id || req.body?._id || req.query?.orderId;
    if (!rawId) {
      res.status(400).json({ success: false, message: 'Order ID is required' });
      return;
    }

    const order = await findOrderByIdOrCode(rawId);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const consignmentId = `DEX-BD-${order.orderId}-${Math.floor(1000 + Math.random() * 9000)}`;

    order.trackingHistory.push({
      status: 'shipped',
      message: `ShopX DEX Express সর্টিং হাবে পাঠানো হয়েছে। কনসাইনমেন্ট ট্র্যাকিং আইডি: ${consignmentId}`,
      location: 'DEX Tejgaon Mega Sort Center',
      timestamp: new Date(),
    });
    order.orderStatus = 'shipped';
    await order.save();

    if (order.customerInfo?.phone) {
      sendSMS({
        to: order.customerInfo.phone,
        message: `ShopX BD: আপনার অর্ডার #${order.orderId} ShopX DEX Express-এ বুক করা হয়েছে। কনসাইনমেন্ট: ${consignmentId}। দ্রুততম ডেলিভারি নিশ্চিত করা হচ্ছে।`,
      }).catch(err => console.warn('SMS dispatch warn:', err));
    }

    res.status(200).json({
      success: true,
      message: 'ShopX DEX Express Booking Created Successfully!',
      consignmentId,
      courier: 'ShopX DEX Express Logistics',
      status: 'in_transit',
      estimatedDelivery: '24-48 Hours',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

