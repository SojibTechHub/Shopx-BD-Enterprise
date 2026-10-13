import React from 'react';
import { Link } from 'react-router-dom';
import { History, X, Trash2, ShoppingCart, Eye, ArrowRight } from 'lucide-react';
import { useRecentViewedStore } from '../store/useRecentViewedStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useCartStore } from '../store/useCartStore';
import { getSafeImage } from '../utils/image';

export const RecentViewedDrawer: React.FC = () => {
  const { items, isOpen, setIsOpen, clearAll } = useRecentViewedStore();
  const { lang } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();
  const { addItem } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 p-6 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-100">
                  {lang === 'bn' ? 'সম্প্রতি দেখা পণ্যসমূহ' : 'Recently Viewed History'}
                </h3>
                <p className="text-xs text-slate-400">
                  {items.length} {lang === 'bn' ? 'টি পণ্য সংরক্ষিত' : 'items recorded'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {items.length > 0 && (
                <button
                  onClick={clearAll}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title={lang === 'bn' ? 'ইতিহাস মুছুন' : 'Clear all'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3 custom-scrollbar">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500">
                  <Eye className="w-8 h-8" />
                </div>
                <p className="text-slate-400 font-medium text-sm">
                  {lang === 'bn' ? 'কোনো পণ্য দেখা হয়নি' : 'No recently viewed products yet'}
                </p>
                <p className="text-xs text-slate-500 max-w-xs">
                  {lang === 'bn'
                    ? 'যেকোনো পণ্যে ক্লিক করলে তা এখানে দ্রুত দেখার জন্য জমা থাকবে।'
                    : 'Explore products on the catalog and they will automatically appear here for quick access.'}
                </p>
              </div>
            ) : (
              items.map((item) => {
                const currentPrice = item.discountPrice || item.price;
                const isBangla = lang === 'bn';
                const title = isBangla && item.banglaTitle ? item.banglaTitle : item.title;

                return (
                  <div
                    key={item._id}
                    className="group bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-orange-500/30 rounded-xl p-3 flex items-center space-x-3 transition-all duration-200"
                  >
                    <Link
                      to={`/product/${item.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700/50 relative"
                    >
                      <img
                        src={getSafeImage(item.thumbnail || (item as any).images?.[0])}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="text-xs font-semibold text-slate-200 line-clamp-2 hover:text-orange-400 transition-colors"
                      >
                        {title}
                      </Link>
                      <div className="mt-1 flex items-center space-x-2">
                        <span className="text-sm font-bold text-orange-400">
                          {formatPrice(currentPrice)}
                        </span>
                        {item.discountPrice && item.discountPrice < item.price && (
                          <span className="text-[11px] text-slate-500 line-through">
                            {formatPrice(item.price)}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        addItem(
                          {
                            _id: item._id,
                            title: item.title,
                            banglaTitle: item.banglaTitle,
                            price: item.price,
                            discountPrice: item.discountPrice,
                            thumbnail: item.thumbnail,
                            images: [item.thumbnail],
                            slug: item.slug,
                          } as any,
                          1
                        );
                      }}
                      className="p-2.5 rounded-lg bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-slate-950 border border-orange-500/20 transition-all shrink-0"
                      title={lang === 'bn' ? 'কার্টে যোগ করুন' : 'Add to cart'}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="pt-4 border-t border-slate-800">
              <Link
                to="/products"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-orange-500/20"
              >
                <span>{lang === 'bn' ? 'সব পণ্য ঘুরে দেখুন' : 'Explore All Products'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
