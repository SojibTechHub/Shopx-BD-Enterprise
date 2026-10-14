import mongoose, { Document, Schema } from 'mongoose';

export interface IFlashSaleProduct {
  product: mongoose.Types.ObjectId;
  discountPercentage: number;
  dealPrice: number;
  stockLimit: number;
  soldCount: number;
}

export interface IFlashSale extends Document {
  title: string;
  banglaTitle?: string;
  bannerImage: string;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  products: IFlashSaleProduct[];
  createdAt: Date;
  updatedAt: Date;
}

const FlashSaleSchema = new Schema<IFlashSale>(
  {
    title: { type: String, required: true },
    banglaTitle: { type: String },
    bannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        discountPercentage: { type: Number, required: true },
        dealPrice: { type: Number, required: true },
        stockLimit: { type: Number, default: 20 },
        soldCount: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export const FlashSale = mongoose.model<IFlashSale>('FlashSale', FlashSaleSchema);
