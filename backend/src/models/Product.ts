import mongoose, { Document, Schema } from 'mongoose';

export interface IProductVariant {
  name: string; // e.g. "Size", "Weight", "Color"
  options: Array<{
    title: string; // e.g. "500g", "1kg", "XL", "Black"
    price: number;
    stock: number;
    sku?: string;
  }>;
}

export interface IProduct extends Document {
  vendor: mongoose.Types.ObjectId;
  title: string;
  banglaTitle?: string;
  slug: string;
  shortDescription: string;
  description: string;
  banglaDescription?: string;
  category: mongoose.Types.ObjectId | string;
  categorySlug: string;
  subCategory?: string;
  brand?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  soldCount: number;
  sku: string;
  images: string[];
  thumbnail: string;
  videoUrl?: string;
  variants: IProductVariant[];
  attributes: Array<{ name: string; value: string }>;
  tags: string[];
  isOrganic: boolean; // GhorerBazar style tag
  isFeatured: boolean;
  isFlashSale: boolean;
  flashSaleDiscountPercent?: number;
  flashSaleEndsAt?: Date;
  deliveryInsideDhaka: number;
  deliveryOutsideDhaka: number;
  rating: number;
  numReviews: number;
  status: 'active' | 'draft' | 'pending';
  warranty?: string;
  unit?: string; // e.g. "kg", "pcs", "litre", "pack"
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    title: { type: String, required: true, trim: true },
    banglaTitle: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    banglaDescription: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    categorySlug: { type: String, required: true, index: true },
    subCategory: { type: String },
    brand: { type: String, default: 'ShopX BD' },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 10 },
    soldCount: { type: Number, default: 0 },
    sku: { type: String, required: true, unique: true },
    images: [{ type: String, required: true }],
    thumbnail: { type: String, required: true },
    videoUrl: { type: String },
    variants: [
      {
        name: { type: String, required: true },
        options: [
          {
            title: { type: String, required: true },
            price: { type: Number, required: true },
            stock: { type: Number, default: 10 },
            sku: { type: String },
          },
        ],
      },
    ],
    attributes: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    tags: [{ type: String }],
    isOrganic: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isFlashSale: { type: Boolean, default: false },
    flashSaleDiscountPercent: { type: Number, default: 0 },
    flashSaleEndsAt: { type: Date },
    deliveryInsideDhaka: { type: Number, default: 60 },
    deliveryOutsideDhaka: { type: Number, default: 120 },
    rating: { type: Number, default: 4.9, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'draft', 'pending'], default: 'active' },
    warranty: { type: String, default: '7 Days Return & 100% Cash Back' },
    unit: { type: String, default: 'item' },
  },
  { timestamps: true }
);

ProductSchema.index({ title: 'text', banglaTitle: 'text', tags: 'text', shortDescription: 'text' });
ProductSchema.index({ status: 1, createdAt: -1 });
ProductSchema.index({ status: 1, isFlashSale: 1 });
ProductSchema.index({ status: 1, isFeatured: 1 });
ProductSchema.index({ status: 1, categorySlug: 1 });
ProductSchema.index({ status: 1, soldCount: -1 });
ProductSchema.index({ status: 1, price: 1 });
ProductSchema.index({ status: 1, isOrganic: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
