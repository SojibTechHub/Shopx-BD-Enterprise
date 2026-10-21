import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { useProductStore } from '../store/useProductStore';
import { Product } from '../types';
import { getSafeImage } from '../utils/image';

export const CategoryExplorerGrid: React.FC = () => {
  const { lang } = useLanguageStore();
  const { products } = useProductStore();

  const productCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p: Product) => {
      const slug = p.categorySlug || (typeof p.category === 'object' ? (p.category as any)?.slug : p.category);
      if (slug) {
        counts[slug] = (counts[slug] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  const worldCategories = [
    {
      id: 'smartphones',
      name: 'Smartphones & Tablets',
      bn: 'স্মার্টফোন ও ট্যাব',
      slug: 'smartphones-tablets',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&auto=format&fit=crop&q=80',
      bg: 'bg-blue-50 border-blue-100 text-blue-900',
      defaultCount: 18,
    },
    {
      id: 'laptops',
      name: 'Laptops & Computers',
      bn: 'ল্যাপটপ ও পিসি',
      slug: 'laptops-computers',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&auto=format&fit=crop&q=80',
      bg: 'bg-indigo-50 border-indigo-100 text-indigo-900',
      defaultCount: 12,
    },
    {
      id: 'gadgets',
      name: 'Smart Gadgets & Audio',
      bn: 'গ্যাজেট ও অডিও',
      slug: 'electronics-gadgets',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80',
      bg: 'bg-amber-50 border-amber-100 text-amber-900',
      defaultCount: 24,
    },
    {
      id: 'organic-foods',
      name: 'Pure Organic Foods',
      bn: 'খাঁটি ও অর্গানিক ফুড',
      slug: 'organic-foods',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&auto=format&fit=crop&q=80',
      bg: 'bg-emerald-50 border-emerald-100 text-emerald-900',
      defaultCount: 35,
    },
    {
      id: 'fashion',
      name: 'Fashion & Apparel',
      bn: 'ফ্যাশন ও পোশাক',
      slug: 'fashion-lifestyle',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200&auto=format&fit=crop&q=80',
      bg: 'bg-rose-50 border-rose-100 text-rose-900',
      defaultCount: 42,
    },
    {
      id: 'home-kitchen',
      name: 'Home & Kitchen',
      bn: 'হোম ও কিচেন',
      slug: 'home-kitchen',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=200&auto=format&fit=crop&q=80',
      bg: 'bg-orange-50 border-orange-100 text-orange-900',
      defaultCount: 16,
    },
    {
      id: 'beauty-perfumes',
      name: 'Beauty & Fragrances',
      bn: 'বিউটি ও রাজকীয় সুগন্ধি',
      slug: 'beauty-care',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80',
      bg: 'bg-pink-50 border-pink-100 text-pink-900',
      defaultCount: 20,
    },
    {
      id: 'gaming-consoles',
      name: 'Gaming & Drones',
      bn: 'গেমিং ও ড্রোন',
      slug: 'gaming-consoles',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=200&auto=format&fit=crop&q=80',
      bg: 'bg-purple-50 border-purple-100 text-purple-900',
      defaultCount: 10,
    },
    {
      id: 'watches',
      name: 'Watches & Jewelry',
      bn: 'ঘড়ি ও জুয়েলারি',
      slug: 'watches-accessories',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&auto=format&fit=crop&q=80',
      bg: 'bg-teal-50 border-teal-100 text-teal-900',
      defaultCount: 14,
    },
    {
      id: 'cameras',
      name: 'Cameras & Optics',
      bn: 'ক্যামেরা ও অপটিকস',
      slug: 'cameras-drones',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&auto=format&fit=crop&q=80',
      bg: 'bg-cyan-50 border-cyan-100 text-cyan-900',
      defaultCount: 8,
    },
  ];

  const needsList = [
    {
      title: lang === 'bn' ? 'মেগা টেক ডিল' : 'Mega Tech Deals',
      sub: lang === 'bn' ? 'অফিসিয়াল ওয়্যারেন্টি' : 'Official Warranty',
      image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=150&auto=format&fit=crop&q=80',
      link: '/products?category=smartphones-tablets',
    },
    {
      title: lang === 'bn' ? '১০০% খাঁটি খাদ্য' : '100% Organic Life',
      sub: lang === 'bn' ? 'বিএসটিআই ল্যাব টেস্ট' : 'BSTI Lab Certified',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=150&auto=format&fit=crop&q=80',
      link: '/products?category=organic-foods',
    },
    {
      title: lang === 'bn' ? 'রাজকীয় লাইফস্টাইল' : 'Royal Lifestyle',
      sub: lang === 'bn' ? 'ডিজাইনার ও সুগন্ধি' : 'Designer & Fragrance',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=150&auto=format&fit=crop&q=80',
      link: '/products?category=fashion-lifestyle',
    },
    {
      title: lang === 'bn' ? 'স্মার্ট হোম লিভিং' : 'Smart Home & Living',
      sub: lang === 'bn' ? 'টপ অ্যাপ্লায়েন্স' : 'Top Appliances',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=150&auto=format&fit=crop&q=80',
      link: '/products?category=home-kitchen',
    },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 py-4">
      {/* 1. SHOP BY DEPARTMENT (World Standard Categories with Accurate Item Counts) */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {lang === 'bn' ? 'বিশ্বমানের সকল ক্যাটাগরি ও ডিপার্টমেন্ট' : 'Explore Global Departments'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {lang === 'bn' ? 'স্মার্টফোন, গ্যাজেট, অর্গানিক খাদ্য, ফ্যাশন, হোম ও গেমিং কালেকশন' : 'Shop authentic smartphones, gadgets, organic food, fashion & lifestyle'}
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 group self-start sm:self-auto"
          >
            <span>{lang === 'bn' ? 'সকল পণ্য দেখুন' : 'View All Departments'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4 sm:gap-5">
          {worldCategories.map((cat) => {
            const count = productCounts[cat.slug] !== undefined ? productCounts[cat.slug] : cat.defaultCount;
            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center p-5 sm:p-6 rounded-3xl bg-white border border-slate-100/90 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 text-center relative"
              >
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl ${cat.bg} border p-1.5 mb-3 flex items-center justify-center overflow-hidden group-hover:scale-108 transition-all duration-300 shadow-sm group-hover:shadow-md`}>
                  <img
                    src={getSafeImage(cat.image)}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-2xl"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 group-hover:text-emerald-700 transition-colors leading-tight">
                  {lang === 'bn' ? cat.bn : cat.name}
                </h3>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-2 font-mono">
                  {count} {lang === 'bn' ? 'পণ্য' : 'Items'}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 2. 3-COLUMN MEGA PROMO CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Banner 1: Apple & Tech Fest */}
        <div className="bg-[#eef5fa] border border-blue-200/90 rounded-3xl p-7 sm:p-8 flex items-center justify-between relative overflow-hidden shadow-sm hover:shadow-md transition-all group">
          <div className="z-10 space-y-2.5 max-w-[62%]">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-800 bg-blue-200/80 px-3 py-1 rounded-full">
              {lang === 'bn' ? '৪০% পর্যন্ত ছাড়' : 'Up to 40% Off'}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {lang === 'bn' ? 'অ্যাপল ও গ্যাজেট' : 'Apple & Gadgets'} <br />
              <span className="text-blue-700">{lang === 'bn' ? 'ফ্ল্যাগশিপ ফেস্ট' : 'Flagship Fest'}</span>
            </h3>
            <Link
              to="/products?category=smartphones-tablets"
              className="inline-flex items-center gap-1.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition"
            >
              <span>{lang === 'bn' ? 'ডিল দেখুন' : 'Explore Deals'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&auto=format&fit=crop&q=80"
            alt="Flagship Tech"
            className="w-32 h-32 object-cover rounded-2xl shadow-md group-hover:scale-108 transition-transform duration-300"
          />
        </div>

        {/* Banner 2: 100% Pure Organic Foods */}
        <div className="bg-[#eaf8ee] border border-emerald-200/90 rounded-3xl p-7 sm:p-8 flex items-center justify-between relative overflow-hidden shadow-sm hover:shadow-md transition-all group">
          <div className="z-10 space-y-2.5 max-w-[62%]">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/80 px-3 py-1 rounded-full">
              {lang === 'bn' ? 'বিএসটিআই পরীক্ষিত' : 'BSTI Certified'}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {lang === 'bn' ? '১০০% খাঁটি' : 'Pure Organic'} <br />
              <span className="text-emerald-700">{lang === 'bn' ? 'মধু ও গাওয়া ঘি' : 'Honey & Ghee'}</span>
            </h3>
            <Link
              to="/products?category=organic-foods"
              className="inline-flex items-center gap-1.5 mt-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition"
            >
              <span>{lang === 'bn' ? 'অর্গানিক কিনুন' : 'Shop Organic'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&auto=format&fit=crop&q=80"
            alt="Pure Honey"
            className="w-32 h-32 object-cover rounded-2xl shadow-md group-hover:scale-108 transition-transform duration-300"
          />
        </div>

        {/* Banner 3: Luxury Fashion & Watches */}
        <div className="bg-[#fef4ea] border border-orange-200/90 rounded-3xl p-7 sm:p-8 flex items-center justify-between relative overflow-hidden shadow-sm hover:shadow-md transition-all group">
          <div className="z-10 space-y-2.5 max-w-[62%]">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/80 px-3 py-1 rounded-full">
              {lang === 'bn' ? 'নতুন কালেকশন' : 'New Arrival'}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {lang === 'bn' ? 'রাজকীয় ফ্যাশন' : 'Royal Fashion'} <br />
              <span className="text-amber-700">{lang === 'bn' ? 'ও আতর সুগন্ধি' : '& Fragrances'}</span>
            </h3>
            <Link
              to="/products?category=fashion-lifestyle"
              className="inline-flex items-center gap-1.5 mt-2 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition"
            >
              <span>{lang === 'bn' ? 'ফ্যাশন দেখুন' : 'Shop Fashion'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&auto=format&fit=crop&q=80"
            alt="Royal Watches"
            className="w-32 h-32 object-cover rounded-2xl shadow-md group-hover:scale-108 transition-transform duration-300"
          />
        </div>
      </section>

      {/* 3. SHOP BY NEEDS (Multi-Category Lifestyle) */}
      <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {lang === 'bn' ? 'লাইফস্টাইল ও প্রয়োজন অনুযায়ী কেনাকাটা' : 'Shop by Lifestyle & Needs'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'bn' ? 'আপনার দৈনন্দিন জীবনের জন্য নির্বাচিত সেরা কালেকশন' : 'Handpicked collections tailored for your daily preferences'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {needsList.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/40 transition group shadow-sm"
            >
              <img
                src={getSafeImage(item.image)}
                alt={item.title}
                className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400">{item.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
