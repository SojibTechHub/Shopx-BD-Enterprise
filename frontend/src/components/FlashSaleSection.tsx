import React, { useState, useEffect } from 'react';
import { Flame, Clock, Zap, ShoppingCart, Eye, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { getSafeImage } from '../utils/image';

interface FlashSaleSectionProps {
  products: Product[];
  onQuickOrder: (p: Product) => void;
  onQuickView: (p: Product) => void;
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({
  products,
  onQuickOrder,
  onQuickView,
}) => {
  const { addItem } = useCartStore();
  const { isInWishlist, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore();
  const { lang } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();

  const calculateTimeLeft = () => {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const diff = Math.max(0, endOfDay.getTime() - now.getTime());
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter((p) => p.isFlashSale).slice(0, 4);
  if (flashProducts.length === 0) return null;

  return (
    <section id="flash-sale-section" className="max-w-7xl mx-auto px-4 py-2">
      {/* Header with Countdown */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-3xl p-5 text-white shadow-md mb-5 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
            <Flame className="w-7 h-7 fill-yellow-300 text-yellow-300 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {lang === 'bn' ? 'ফ্ল্যাশ সেল মেগা অফার' : 'Flash Sale Rush'}
              </h2>
              <span className="bg-yellow-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow">
                {lang === 'bn' ? 'সীমিত স্টক' : 'Limited Stock'}
              </span>
            </div>
            <p className="text-xs text-red-100 mt-0.5">
              {lang === 'bn'
                ? 'অফিসিয়াল ব্র্যান্ড ও প্রিমিয়াম গ্যাজেট এবং অর্গানিক পণ্যে মেগা ডিসকাউন্ট'
                : 'Top authenticated flagships, gadgets & organic foods at rush discounts'}
            </p>
          </div>
        </div>

        {/* Live Countdown Clock */}
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow">
          <Clock className="w-4 h-4 text-yellow-300" />
          <span className="text-xs font-bold text-yellow-100">{lang === 'bn' ? 'শেষ হতে বাকি:' : 'Ends In:'}</span>
          <div className="flex items-center gap-1 font-mono text-sm font-black">
            <span className="bg-white text-slate-950 px-2 py-0.5 rounded-lg shadow-sm">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span>:</span>
            <span className="bg-white text-slate-950 px-2 py-0.5 rounded-lg shadow-sm">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span>:</span>
            <span className="bg-white text-slate-950 px-2 py-0.5 rounded-lg shadow-sm">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Flash Deals with Stock Progress Meter */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {flashProducts.map((product, idx) => {
          const isLiked = isInWishlist(product._id);
          const price = product.price;
          const discountPrice = product.discountPrice;
          const hasDiscount = discountPrice && discountPrice < price;
          const discountPercentage = hasDiscount
            ? Math.round(((price - discountPrice) / price) * 100)
            : 25;
          const percentSold = 75 + ((idx * 7) % 20);

          return (
            <div
              key={product._id}
              className="group relative bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-emerald-300 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Badges */}
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-yellow-300 text-yellow-300" /> -{discountPercentage}%
                </span>
              </div>

              {/* Floating Wishlist Button */}
              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (isLiked) removeWishlist(product._id);
                    else addWishlist(product);
                  }}
                  className={`p-2 rounded-full backdrop-blur-md shadow transition ${
                    isLiked ? 'bg-pink-600 text-white' : 'bg-white/90 text-slate-600 hover:text-pink-500'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Image */}
              <Link to={`/product/${product.slug}`} className="relative block aspect-square bg-slate-50 overflow-hidden">
                <img
                  src={getSafeImage(product.thumbnail || product.images?.[0])}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </Link>

              {/* Body */}
              <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                <div>
                  <Link
                    to={`/product/${product.slug}`}
                    className="block font-bold text-xs sm:text-sm text-slate-800 hover:text-emerald-700 transition line-clamp-2"
                  >
                    {lang === 'bn' && product.banglaTitle ? product.banglaTitle : product.title}
                  </Link>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-base sm:text-lg font-black text-emerald-700">
                      {formatPrice(discountPrice || price)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(price)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock Progress Urgency Bar */}
                <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-amber-700 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-600 fill-amber-600" /> {percentSold}% {lang === 'bn' ? 'বিক্রি হয়েছে' : 'Sold'}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {lang === 'bn' ? `বাকি ${Math.max(2, 15 - idx * 3)}টি` : `${Math.max(2, 15 - idx * 3)} Left`}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentSold}%` }}
                    />
                  </div>
                </div>

                {/* Buy Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onQuickOrder(product)}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2 px-2 rounded-xl transition flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>{lang === 'bn' ? 'সরাসরি কিনুন' : 'Buy Now'}</span>
                  </button>

                  <button
                    onClick={() => addItem(product, 1)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-2 rounded-xl transition flex items-center justify-center gap-1"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? '+ কার্ট' : '+ Cart'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
