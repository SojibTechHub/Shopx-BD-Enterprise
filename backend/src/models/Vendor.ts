import mongoose, { Document, Schema } from 'mongoose';

export interface IVendor extends Document {
  user: mongoose.Types.ObjectId;
  storeName: string;
  storeSlug: string;
  description?: string;
  logo: string;
  banner?: string;
  phone: string;
  address: string;
  city: string;
  commissionRate: number; // e.g. 5%
  rating: number;
  totalRatings: number;
  totalSales: number;
  balance: number;
  payoutMethod?: 'bkash' | 'nagad' | 'bank';
  payoutNumber?: string;
  bankAccountDetails?: {
    bankName: string;
    branchName: string;
    accountNumber: string;
    accountHolder: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema = new Schema<IVendor>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    storeName: { type: String, required: true, trim: true },
    storeSlug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    logo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&auto=format&fit=crop&q=80',
    },
    banner: {
      type: String,
      default: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
    },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, default: 'Dhaka' },
    commissionRate: { type: Number, default: 5 },
    rating: { type: Number, default: 4.8 },
    totalRatings: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    payoutMethod: { type: String, enum: ['bkash', 'nagad', 'bank'], default: 'bkash' },
    payoutNumber: { type: String },
    bankAccountDetails: {
      bankName: { type: String },
      branchName: { type: String },
      accountNumber: { type: String },
      accountHolder: { type: String },
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'approved',
    },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Vendor = mongoose.model<IVendor>('Vendor', VendorSchema);
