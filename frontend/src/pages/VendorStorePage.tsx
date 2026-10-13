import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Store,
  ShieldCheck,
  Star,
  Clock,
  MessageSquare,
  Award,
  Sparkles,
  Ticket,
  Truck,
  Heart,
  Share2,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProductCard } from '../components/ProductCard';
import { QuickOrderModal } from '../components/QuickOrderModal';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { Product } from '../types';
import { api } from '../services/api';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCartStore } from '../store/useCartStore';

export const VendorStorePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguageStore();
  const { setCoupon } = useCartStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'deals' | 'vouchers'>('all');
  const [isFollowing, setIsFollowing] = useState(false);
  const [quickOrderProduct, setQuickOrderProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Mock verified vendor info based on slug
  const vendorInfo = {
    name: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'ANTIXOR OFFICIAL MALL',
    banglaName: 'অফিসিয়াল ফ্ল্যাগশিপ স্টোর',
    verified: true,
    rating: 4.9,
    reviewsCount: 3840,
    positiveRating: '98.8%',
    shipOnTime: '99.4%',
    chatResponse: '99.9%',
    followers: '42.8K',
    banner: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1600&auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80',
    badge: 'DARAZ MALL CERTIFIED',
    joined: '2023',
    responseHours: '< 15 mins',
  };

  useEffect(() => {
    const fetchStoreProducts = async () => {
      try {
        const res = await api.get('/products?limit=24');
        if (res.data?.success) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStoreProducts();
  }, [slug]);

  const handleFollow = () => {
    if (!isFollowing) {
      setIsFollowing(true);
      setCoupon('FOLLOW50', 50);
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } else {
      setIsFollowing(false);
    }
  };

  const filteredProducts =
    activeTab === 'deals'
      ? products.filter((p) => p.isFlashSale || (p.discountPrice && p.discountPrice < p.price))
      : products;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* 1. Official Store Banner & Header */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Banner Cover Image */}
        <div className="h-44 sm:h-60 relative w-full overflow-hidden bg-gradient-to-r from-emerald-900 to-slate-900">
          <img
            src={vendorInfo.banner}
            alt="Store Banner"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Store Profile Card */}
        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 -mt-16 sm:-mt-20 relative z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-white p-1 border-2 border-white shadow-xl overflow-hidden flex-shrink-0">
              <img
                src={vendorInfo.logo}
                alt="Store Logo"
                className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
              />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {vendorInfo.name}
                </h1>
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>100% Official Mall</span>
                </span>
              </div>

              <p className="text-xs text-slate-500">
                {lang === 'bn'
                  ? 'অনুমোদিত ব্র্যান্ড ডিস্ট্রিবিউটর ও ভেরিফাইড মাল্টি-ভেন্ডর পার্টনার'
                  : 'Authorized Brand Distributor & Verified Multi-Vendor Flagship'}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <strong className="text-slate-900">{vendorInfo.rating}</strong> ({vendorInfo.reviewsCount}+ {lang === 'bn' ? 'রিভিউ' : 'reviews'})
                </span>
                <span>•</span>
                <span>{vendorInfo.followers} {lang === 'bn' ? 'ফলোয়ার' : 'Followers'}</span>
              </div>
            </div>
          </div>

          {/* Follow & Metrics Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-center w-full sm:w-auto">
              <div className="px-3">
                <span className="text-xs font-black text-emerald-700 block font-mono">{vendorInfo.positiveRating}</span>
                <span className="text-[9px] text-slate-400 font-bold">{lang === 'bn' ? 'পজিটিভ রেটিং' : 'Positive Rating'}</span>
              </div>
              <div className="px-3 border-x border-slate-200">
                <span className="text-xs font-black text-blue-700 block font-mono">{vendorInfo.shipOnTime}</span>
                <span className="text-[9px] text-slate-400 font-bold">{lang === 'bn' ? 'অন-টাইম শিপ' : 'Ship on Time'}</span>
              </div>
              <div className="px-3">
                <span className="text-xs font-black text-purple-700 block font-mono">{vendorInfo.chatResponse}</span>
                <span className="text-[9px] text-slate-400 font-bold">{lang === 'bn' ? 'চ্যাট রেসপন্স' : 'Chat Response'}</span>
              </div>
            </div>

            <button
              onClick={handleFollow}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 ${
                isFollowing
                  ? 'bg-slate-100 text-slate-700 border border-slate-300'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFollowing ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>
                {isFollowing
                  ? lang === 'bn' ? 'ফলোয়িং (৳৫০ যুক্ত হয়েছে)' : 'Following (+৳50 Claimed)'
                  : lang === 'bn' ? '+ ফলো করুন (৳৫০ অফার)' : '+ Follow Store (Get ৳50)'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Store Vouchers Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-emerald-950">
              {lang === 'bn' ? 'স্টোর এক্সক্লুসিভ ডিসকাউন্ট ভাউচার' : 'Store Exclusive Follower Vouchers'}
            </h3>
            <p className="text-xs text-emerald-700">
              {lang === 'bn' ? 'এই শপের যেকোনো অর্ডারে অতিরিক্ত ৳১০০ ও ৳৫০ ছাড় নিন' : 'Claim extra ৳100 and ৳50 discount on this store only'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setCoupon('SHOPX100', 100);
            confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
          }}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition"
        >
          {lang === 'bn' ? 'ভাউচার সংগ্রহ করুন' : 'Collect Store Voucher'}
        </button>
      </div>

      {/* 3. Tab Filter Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'all'
                ? 'bg-emerald-700 text-white shadow'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {lang === 'bn' ? 'সকল পণ্য' : 'All Products'} ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('deals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'deals'
                ? 'bg-emerald-700 text-white shadow'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            ⚡ {lang === 'bn' ? 'ফ্ল্যাশ ডিলস' : 'Flash Deals'}
          </button>
        </div>

        <span className="text-xs text-slate-400 font-medium hidden sm:block">
          {filteredProducts.length} {lang === 'bn' ? 'টি পণ্য পাওয়া গেছে' : 'products found'}
        </span>
      </div>

      {/* 4. Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredProducts.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            onQuickOrder={(prod) => setQuickOrderProduct(prod)}
            onQuickView={(prod) => setQuickViewProduct(prod)}
          />
        ))}
      </div>

      {/* Modals */}
      {quickOrderProduct && (
        <QuickOrderModal
          product={quickOrderProduct}
          onClose={() => setQuickOrderProduct(null)}
        />
      )}
      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onQuickOrder={(prod) => setQuickOrderProduct(prod)}
        />
      )}
    </div>
  );
};
