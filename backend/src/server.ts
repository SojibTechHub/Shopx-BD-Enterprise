import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

// Config
dotenv.config();
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { setupSocketIO } from './socket/socketHandler.js';
import { Setting } from './models/Setting.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import vendorRoutes from './routes/vendor.routes.js';
import adminRoutes from './routes/admin.routes.js';
import aiRoutes from './routes/ai.routes.js';
import reviewRoutes from './routes/review.routes.js';
import courierRoutes from './routes/courier.routes.js';
import qaRoutes from './routes/qa.routes.js';
import { riderRouter, uploadRouter } from './routes/rider.routes.js';

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const ADMIN_URL = process.env.ADMIN_URL || 'http://localhost:5174';

const allowedOrigins = [
  FRONTEND_URL,
  ADMIN_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

const io = new SocketIOServer(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during dev
      }
    },
    credentials: true,
  },
});

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// Setup Real-time Sockets
setupSocketIO(io);

// API Health Check & DevTools graceful response
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    platform: 'ShopX BD Multi-Vendor E-Commerce & SaaS',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/settings/public', async (req, res) => {
  try {
    const saved = await Setting.findOne({ key: 'general_settings' });
    const val = saved?.value || {};
    res.status(200).json({
      success: true,
      settings: {
        platformName: val.platformName || 'ShopX BD Enterprise',
        headOffice: val.headOffice || 'Rowmari, Kurigram, Rangpur, Bangladesh',
        banglaHeadOffice: val.banglaHeadOffice || 'রৌমারী, কুড়িগ্রাম, রংপুর বিভাগ, বাংলাদেশ',
        helplinePhone: val.helplinePhone || '+880 1942-791004',
        helplineEmail: val.helplineEmail || 'sojibahmedshorif25@gmail.com',
        allowManualMfsPayment: val.allowManualMfsPayment === true, // Fraud Prevention: OFF by default
        merchantBkashNumber: val.merchantBkashNumber || '01942791004',
        merchantNagadNumber: val.merchantNagadNumber || '01942791004',
        dailyCheckInMaxReward: val.dailyCheckInMaxReward || 100,
        maxCoinDiscountBDT: val.maxCoinDiscountBDT || 25,
      },
    });
  } catch (error: any) {
    res.status(200).json({
      success: true,
      settings: {
        allowManualMfsPayment: false,
        helplinePhone: '+880 1942-791004',
        merchantBkashNumber: '01942791004',
        merchantNagadNumber: '01942791004',
      },
    });
  }
});

app.get(['/.well-known/*', '/favicon.ico'], (req, res) => {
  res.status(204).end();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/courier', courierRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/riders', riderRouter);
app.use('/api/upload', uploadRouter);

// Global Error Handler
app.use(errorHandler);

process.on('uncaughtException', (err) => {
  console.error('🔥 [Uncaught Exception]:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('⚠️ [Unhandled Rejection]:', reason);
});

const PORT = process.env.PORT || 5000;

// Start Server and Connect Database
const startServer = async () => {
  await connectDB();
  server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 [ShopX BD Backend] Running on http://localhost:${PORT} and http://127.0.0.1:${PORT}`);
  });
};

startServer();

