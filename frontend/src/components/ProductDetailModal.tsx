import React, { useState, useEffect } from 'react';
import { X, Star, ShieldCheck, Truck, ShoppingBag, Zap, Flame, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { getSafeImage } from '../utils/image';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onQuickOrder?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onQuickOrder,
}) => {
  if (!product) return null;
  return (
    <ProductDetailModalContent
      product={product}
      onClose={onClose}
      onQuickOrder={onQuickOrder}
    />
  );
};

const ProductDetailModalContent: React.FC<{
  product: Product;
  onClose: () => void;
  onQuickOrder?: (product: Product) => void;
}> = ({ product, onClose, onQuickOrder }) => {
  const { addItem } = useCartStore();
  const { lang } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();

  const [activeImage, setActiveImage] = useState<string>(
    product.thumbnail || product.images?.[0] || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0]?.options?.[0]?.title || ''
  );

  const title = lang === 'bn' && product.banglaTitle ? product.banglaTitle : product.title;
  const description =
    lang === 'bn' && product.banglaDescription ? product.banglaDescription : product.description;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-100 relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-[#f8fafc] rounded-2xl overflow-hidden border border-slate-100">
              <img
                src={getSafeImage(activeImage || product.thumbnail || product.images?.[0])}
                alt={title}
                className="w-full h-full object-cover object-center transition-all"
              />
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                      activeImage === img ? 'border-emerald-600 scale-105' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={getSafeImage(img)} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {product.isOrganic && (
                  <span className="bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? '১০০% খাঁটি ও নির্ভেজাল' : '100% Pure & Organic'}</span>
                  </span>
                )}
                {product.isFlashSale && (
                  <span className="bg-red-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-white" />
                    <span>{lang === 'bn' ? 'ফ্ল্যাশ ডিল' : 'Flash Deal'}</span>
                  </span>
                )}
                <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? '৫৪ জন এই মুহূর্তে দেখছেন' : '54 people viewing now'}</span>
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {title}
              </h2>

              {/* Brand & Ratings */}
              <div className="flex items-center gap-4 mt-2 text-xs">
                <span className="text-slate-500">
                  {lang === 'bn' ? 'ব্র্যান্ড:' : 'Brand:'} <strong className="text-slate-800">{product.brand || 'ShopX BD'}</strong>
                </span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-800">{product.rating}</span>
                  <span className="text-slate-400">({product.soldCount} {lang === 'bn' ? 'বিক্রিত' : 'sold'})</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono">
                  {formatPrice(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && (
                  <span className="text-sm text-slate-400 line-through font-mono">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed bg-[#f8fafc] p-3 rounded-2xl border border-slate-100">
                {description || product.shortDescription}
              </p>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-bold text-slate-700 mb-2">
                    {lang === 'bn' ? `${product.variants[0].name} সিলেক্ট করুন:` : `Select ${product.variants[0].name}:`}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants[0].options.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedVariant(opt.title)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                          selectedVariant === opt.title
                            ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {opt.title} - {formatPrice(opt.price)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-3 mt-4">
                <span className="text-xs font-bold text-slate-700">{lang === 'bn' ? 'পরিমাণ:' : 'Quantity:'}</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-[#f8fafc]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 hover:bg-slate-200 font-bold text-sm text-slate-700"
                  >
                    -
                  </button>
                  <span className="px-4 font-bold text-xs text-slate-800 font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 hover:bg-slate-200 font-bold text-sm text-slate-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  onClose();
                  if (onQuickOrder) onQuickOrder(product);
                }}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 text-sm"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{lang === 'bn' ? '১-ক্লিকে অর্ডার' : '1-Click Buy Now'}</span>
              </button>

              <button
                onClick={() => {
                  addItem(product, quantity, selectedVariant);
                  onClose();
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 px-4 rounded-2xl transition flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{lang === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
