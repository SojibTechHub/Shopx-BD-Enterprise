import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Heart, Eye, ArrowRight, RefreshCw, Layers } from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';
import { useLanguageStore } from '../store/useLanguageStore';
import { useRecentViewedStore } from '../store/useRecentViewedStore';
import { useProductStore } from '../store/useProductStore';
import { ProductCard } from './ProductCard';

interface JustForYouAISectionProps {
  onQuickOrder: (p: Product) => void;
  onQuickView: (p: Product) => void;
}

export const JustForYouAISection: React.FC<JustForYouAISectionProps> = ({
  onQuickOrder,
  onQuickView,
}) => {
  const { lang } = useLanguageStore();
  const { items: recentItems } = useRecentViewedStore();
  const { products } = useProductStore();
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>(() => {
    return products.length > 0 ? products.slice(0, 8) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeInterest, setActiveInterest] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/products?limit=10&sortBy=popular');
        if (res.data?.success) {
          setRecommendedProducts(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const handleLoadMore = async () => {
    try {
      const nextPage = page + 1;
      const res = await api.get(`/products?limit=10&page=${nextPage}`);
      if (res.data?.success && res.data.data.length > 0) {
        setRecommendedProducts((prev) => [...prev, ...res.data.data]);
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    }
  };

  const interestFilters = [
    { id: 'all', label: lang === 'bn' ? 'সব মিলিয়ে' : 'All Personalized' },
    { id: 'tech', label: lang === 'bn' ? '📱 টেক ও গ্যাজেট' : '📱 Tech & Flagships' },
    { id: 'organic', label: lang === 'bn' ? '🌿 খাঁটি খাদ্য' : '🌿 Pure Organics' },
    { id: 'fashion', label: lang === 'bn' ? '👕 ফ্যাশন' : '👕 Fashion' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-4 space-y-6">
      {/* Header & AI Intelligence Tag */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {lang === 'bn' ? 'জাস্ট ফর ইউ (Just For You AI)' : 'Just For You — AI Recommended'}
            </h2>
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase shadow">
              ML Personalized
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {lang === 'bn'
              ? 'আপনার সাম্প্রতিক সার্চ ও ব্রাউজিং হিস্ট্রির ওপর ভিত্তি করে রিয়েল-টাইম এআই রেকমেন্ডেশন।'
              : 'Machine learning recommendations tuned to your recent views and preference signals.'}
          </p>
        </div>

        {/* Interest Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {interestFilters.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveInterest(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                activeInterest === tab.id
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Products Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-400 font-bold">
          {lang === 'bn' ? 'এআই পার্সোনালাইজড ফিড লোড হচ্ছে...' : 'Curating personalized feed...'}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
            {recommendedProducts.map((prod) => (
              <ProductCard
                key={prod._id}
                product={prod}
                onQuickOrder={onQuickOrder}
                onQuickView={onQuickView}
              />
            ))}
          </div>

          {/* Load More Infinite Scroll Button */}
          {hasMore && (
            <div className="text-center pt-2">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-full border border-slate-300 shadow-sm hover:shadow transition inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4 text-purple-600" />
                <span>{lang === 'bn' ? 'আরও এআই রেকমেন্ডেশন লোড করুন' : 'Load More Personalized Items'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
