import { Request, Response } from 'express';
import slugify from 'slugify';
import { Product } from '../models/Product.js';
import { Vendor } from '../models/Vendor.js';
import { Category } from '../models/Category.js';
import { redis } from '../config/redis.js';
import { AuthRequest } from '../middleware/auth.js';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      search,
      isOrganic,
      isFlashSale,
      isFeatured,
      filter,
      deals,
      mall,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const cacheKey = `products_${JSON.stringify(req.query)}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      res.status(200).json(cachedData);
      return;
    }

    const query: any = { status: 'active' };

    if (filter === 'deals' || deals === 'true') {
      query.$or = [
        { isFlashSale: true },
        { discountPrice: { $gt: 0 } },
      ];
    }

    if (mall === 'true') {
      query.brand = { $nin: ['Local', 'General', ''] };
    }

    if (category) {
      if (category === 'gaming-consoles') {
        query.categorySlug = { $in: ['gaming-consoles', 'cameras-drones'] };
      } else {
        query.categorySlug = category;
      }
    }

    if (brand) {
      query.brand = brand;
    }

    if (isOrganic === 'true') {
      query.isOrganic = true;
    }

    if (isFlashSale === 'true') {
      query.isFlashSale = true;
    }

    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (search) {
      query.$or = [
        { title: { $regex: String(search), $options: 'i' } },
        { banglaTitle: { $regex: String(search), $options: 'i' } },
        { tags: { $in: [new RegExp(String(search), 'i')] } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort: any = {};
    if (sortBy === 'price_asc') sort.price = 1;
    else if (sortBy === 'price_desc') sort.price = -1;
    else if (sortBy === 'popular') sort.soldCount = -1;
    else if (sortBy === 'rating') sort.rating = -1;
    else sort[String(sortBy)] = sortOrder === 'asc' ? 1 : -1;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('vendor', 'storeName logo rating')
        .populate('category', 'name banglaName slug')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Product.countDocuments(query),
    ]);

    const result = {
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };

    // Cache product queries for 5 minutes
    redis.set(cacheKey, result, 300).catch(() => {});

    // Browser & CDN Edge Cache headers (loads instantly on mobile)
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFlashDeals = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ isFlashSale: true, status: 'active' })
      .populate('vendor', 'storeName logo rating')
      .limit(12);

    res.status(200).json({
      success: true,
      data: products,
      endsAt: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours countdown
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrganicSpecial = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ isOrganic: true, status: 'active' })
      .populate('vendor', 'storeName logo rating')
      .limit(12);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('vendor', 'storeName storeSlug logo banner rating totalSales totalRatings address phone')
      .populate('category', 'name banglaName slug');

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    // Related products in the same category
    const relatedProducts = await Product.find({
      categorySlug: product.categorySlug,
      _id: { $ne: product._id },
      status: 'active',
    }).limit(6);

    res.status(200).json({
      success: true,
      data: product,
      relatedProducts,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchSuggestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = String(req.query.q || '').trim();
    if (!query || query.length < 2) {
      res.status(200).json({ success: true, data: [] });
      return;
    }

    const suggestions = await Product.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { banglaTitle: { $regex: query, $options: 'i' } },
      ],
      status: 'active',
    })
      .select('title banglaTitle slug thumbnail price discountPrice categorySlug')
      .limit(8);

    res.status(200).json({ success: true, data: suggestions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let vendorId: any;

    if (req.userRole === 'admin') {
      const defaultVendor = await Vendor.findOne();
      vendorId = defaultVendor?._id;
    } else {
      const vendor = await Vendor.findOne({ user: req.userId });
      if (!vendor) {
        res.status(400).json({ success: false, message: 'Vendor store not found.' });
        return;
      }
      vendorId = vendor._id;
    }

    const {
      title,
      banglaTitle,
      shortDescription,
      description,
      banglaDescription,
      categorySlug,
      brand,
      price,
      discountPrice,
      stock,
      images,
      thumbnail,
      variants,
      attributes,
      tags,
      isOrganic,
      isFeatured,
      isFlashSale,
      flashSaleDiscountPercent,
      unit,
    } = req.body;

    let category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      category = await Category.findOne();
    }

    const slug = slugify(title, { lower: true, strict: true }) + '-' + Math.floor(1000 + Math.random() * 9000);
    const sku = 'SX-' + Math.floor(100000 + Math.random() * 900000);

    const product = await Product.create({
      vendor: vendorId,
      title,
      banglaTitle,
      slug,
      shortDescription,
      description,
      banglaDescription,
      category: category?._id,
      categorySlug: category?.slug || 'all',
      brand: brand || 'ShopX BD',
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      stock: Number(stock) || 10,
      sku,
      images: images && images.length > 0 ? images : [thumbnail],
      thumbnail: thumbnail || (images && images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=70',
      variants: variants || [],
      attributes: attributes || [],
      tags: tags || [],
      isOrganic: Boolean(isOrganic),
      isFeatured: Boolean(isFeatured),
      isFlashSale: Boolean(isFlashSale),
      flashSaleDiscountPercent: flashSaleDiscountPercent ? Number(flashSaleDiscountPercent) : 0,
      unit: unit || 'item',
      status: 'active',
    });

    res.status(201).json({ success: true, message: 'Product created successfully', data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    Object.assign(product, req.body);
    await product.save();

    res.status(200).json({ success: true, message: 'Product updated successfully', data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
