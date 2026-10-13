import React from 'react';
import { X, Check, ArrowRight, Trash2, Scale, Star, ShieldCheck, Truck, ShoppingCart } from 'lucide-react';
import { useCompareStore } from '../store/useCompareStore';
import { useCartStore } from '../store/useCartStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { getSafeImage } from '../utils/image';

export const ProductCompareModal: React.FC = () => {
  const { items, isOpen, setIsOpen, removeFromCompare, clearCompare } = useCompareStore();
  const { addItem } = useCartStore();
  const { lang } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();
  const isBn = lang === 'bn';

  if (!isOpen && items.length === 0) return null;

  return (
    <>
      {/* Floating Bottom Dock when items exist and modal is closed */}
      {items.length > 0 && !isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-40 animate-bounce">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-slate-900 text-white shadow-2xl border-2 border-emerald-500 hover:bg-slate-800 transition transform hover:scale-105 group"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs">
              <Scale className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-black uppercase tracking-wider text-emerald-400">
                {isBn ? 'পণ্য তুলনা ডক' : 'Compare Dock'} ({items.length}/4)
              </p>
              <p className="text-[10px] text-slate-400">
                {isBn ? 'পাশাপাশি তুলনা দেখুন' : 'Compare specs side-by-side'}
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Main Fullscreen Comparison Matrix Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-8 max-w-6xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto custom-scrollbar text-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {isBn ? 'পণ্য পাশাপাশি স্পেসিফিকেশন তুলনা' : 'Side-by-Side Product Comparison'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isBn
                      ? 'স্পেক্স, দাম, রেটিং এবং ওয়ারেন্টি সহজে যাচাই করুন।'
                      : 'Compare technical specs, warranty, prices, and customer feedback.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {items.length > 0 && (
                  <button
                    onClick={clearCompare}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-950/40 border border-rose-900 px-3 py-1.5 rounded-xl transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isBn ? 'সব ক্লিয়ার করুন' : 'Clear All'}</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Comparison Grid Table */}
            {items.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-3">
                <Scale className="w-12 h-12 mx-auto text-slate-600" />
                <p className="font-bold text-sm">
                  {isBn ? 'তুলনা করার জন্য কোনো পণ্য যোগ করা হয়নি।' : 'No products added to comparison yet.'}
                </p>
                <p className="text-xs text-slate-500">
                  {isBn
                    ? 'পণ্য কার্ডের "তুলনা" বাটনে ক্লিক করে সর্বোচ্চ ৪টি পণ্য একসাথে তুলনা করুন।'
                    : 'Click the "Compare" icon on any product card to compare up to 4 items.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map((prod) => (
                  <div
                    key={prod._id}
                    className="bg-slate-950 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between space-y-4 relative group"
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCompare(prod._id)}
                      className="absolute top-3 right-3 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400 transition"
                      title={isBn ? 'মুছে ফেলুন' : 'Remove'}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Image & Title */}
                    <div className="space-y-3">
                      <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
                        <img
                          src={getSafeImage(prod.thumbnail || prod.images?.[0])}
                          alt={prod.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-2">
                        {isBn && prod.banglaTitle ? prod.banglaTitle : prod.title}
                      </h4>
                    </div>

                    {/* Attributes Matrix */}
                    <div className="space-y-2 text-xs border-t border-b border-slate-800/80 py-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">{isBn ? 'মূল্য' : 'Price'}:</span>
                        <span className="font-mono font-black text-emerald-400 text-sm">
                          {formatPrice(prod.discountPrice || prod.price)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">{isBn ? 'রেটিং' : 'Rating'}:</span>
                        <span className="text-amber-400 font-bold flex items-center gap-1 font-mono">
                          ★ {prod.rating || 4.9} ({prod.soldCount || 24} {isBn ? 'বিক্রয়' : 'sold'})
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">{isBn ? 'ক্যাটাগরি' : 'Category'}:</span>
                        <span className="text-slate-200 capitalize font-medium">
                          {prod.categorySlug?.replace('-', ' ') || 'General'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">{isBn ? 'ব্র্যান্ড' : 'Brand'}:</span>
                        <span className="text-slate-200 font-bold">
                          {prod.brand || 'Official'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">{isBn ? 'সার্টিফিকেশন' : 'Standard'}:</span>
                        <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {prod.isOrganic ? 'BSTI Lab Certified' : '100% Genuine Official'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">{isBn ? 'ডেলিভারি' : 'Delivery'}:</span>
                        <span className="text-blue-400 font-bold text-[11px] flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5" />
                          24-48h Express
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => {
                        addItem(prod, 1);
                        alert(isBn ? 'কার্টে যোগ করা হয়েছে!' : 'Added to cart successfully!');
                      }}
                      className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{isBn ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
