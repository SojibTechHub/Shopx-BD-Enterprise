import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus, Check, Heart, Eye, Scale } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useRecentViewedStore } from '../store/useRecentViewedStore';
import { useCompareStore } from '../store/useCompareStore';
import { getSafeImage } from '../utils/image';

interface ProductCardProps {
  product: Product;
  onQuickOrder?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickOrder,
  onQuickView,
}) => {
  const { addItem } = useCartStore();
  const { isInWishlist, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore();
  const { addToCompare, removeFromCompare, isInCompare } = useCompareStore();
  const { lang } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();
  const { addProduct: recordView } = useRecentViewedStore();

  const [isAdded, setIsAdded] = useState(false);

  const isLiked = isInWishlist(product._id);
  const isCompared = isInCompare(product._id);
  const title = lang === 'bn' && product.banglaTitle ? product.banglaTitle : product.title;
  const price = product.price;
  const discountPrice = product.discountPrice;
  const hasDiscount = discountPrice && discountPrice < price;
  const discountPercentage = hasDiscount
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  // Determine tag badge
  const getBadge = () => {
    if (product.isOrganic) {
      return { text: lang === 'bn' ? 'অর্গানিক' : 'Organic', bg: 'bg-emerald-600 text-white' };
    }
    if (hasDiscount && discountPercentage >= 20) {
      return { text: lang === 'bn' ? `ছাড় -${discountPercentage}%` : `Sale -${discountPercentage}%`, bg: 'bg-rose-500 text-white' };
    }
    if ((product.soldCount || 0) > 30) {
      return { text: lang === 'bn' ? 'বেস্ট সেলার' : 'Best Seller', bg: 'bg-amber-500 text-white' };
    }
    return { text: lang === 'bn' ? 'জেনুইন' : 'Genuine', bg: 'bg-emerald-700 text-white' };
  };

  const badge = getBadge();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  // Category name extraction
  const getCategoryLabel = () => {
    if (typeof product.category === 'object' && product.category) {
      return lang === 'bn' ? (product.category as any).banglaName || (product.category as any).name : (product.category as any).name;
    }
    if (typeof product.category === 'string') {
      return product.category.replace('-', ' ');
    }
    return product.categorySlug ? product.categorySlug.replace('-', ' ') : 'General';
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-100/80 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden p-4 sm:p-5">
      {/* Top Badges & Actions */}
      <div className="flex items-center justify-between mb-2.5">
        <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg shadow-sm ${badge.bg}`}>
          {badge.text}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isCompared) {
                removeFromCompare(product._id);
              } else {
                addToCompare(product);
              }
            }}
            className={`p-1.5 rounded-full transition ${
              isCompared
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-slate-300 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
            title={lang === 'bn' ? 'তুলনা ডকে যোগ করুন' : 'Compare Product'}
          >
            <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isLiked) removeWishlist(product._id);
              else addWishlist(product);
            }}
            className="text-slate-300 hover:text-rose-500 transition p-1.5 rounded-full hover:bg-rose-50"
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Image Link */}
      <Link
        to={`/product/${product.slug}`}
        onClick={() => recordView(product)}
        className="relative block aspect-square bg-[#f8fafc] rounded-2xl overflow-hidden mb-3.5 group-hover:bg-[#f1f5f9] transition-colors"
      >
        <img
          src={getSafeImage(product.thumbnail || product.images?.[0])}
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick View on Hover */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            recordView(product);
            if (onQuickView) onQuickView(product);
          }}
          className="absolute bottom-2.5 right-2.5 bg-white/95 hover:bg-white text-slate-800 p-2.5 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
          title={lang === 'bn' ? 'কুইক ভিউ' : 'Quick View'}
        >
          <Eye className="w-4 h-4 text-slate-700" />
        </button>
      </Link>

      {/* Body Details */}
      <div className="space-y-2 flex-1 flex flex-col justify-between">
        <div>
          {/* Category info */}
          <span className="text-xs text-slate-400 font-semibold capitalize block mb-0.5">
            {getCategoryLabel()}
          </span>

          {/* Title */}
          <Link
            to={`/product/${product.slug}`}
            onClick={() => recordView(product)}
            className="block text-sm sm:text-[15px] font-bold text-slate-800 hover:text-emerald-700 transition line-clamp-2 leading-snug"
          >
            {title}
          </Link>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-amber-500">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-extrabold text-xs text-slate-800">
              {product.rating || 4.9}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              ({product.soldCount || 18} {lang === 'bn' ? 'বিক্রয়' : 'sold'})
            </span>
          </div>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-black text-emerald-800 font-mono tracking-tight">
              {formatPrice(discountPrice || price)}
            </div>
            {hasDiscount && (
              <div className="text-xs text-slate-400 line-through font-mono">
                {formatPrice(price)}
              </div>
            )}
          </div>

          <button
            onClick={handleAdd}
            className={`py-2 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              isAdded
                ? 'bg-emerald-800 text-white shadow-emerald-800/30'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>{lang === 'bn' ? 'যোগ হয়েছে' : 'Added'}</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-white" />
                <span>{lang === 'bn' ? '+ কার্ট' : '+ Add'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
