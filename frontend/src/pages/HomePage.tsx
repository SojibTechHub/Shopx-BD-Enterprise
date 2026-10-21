import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeroSlider } from '../components/HeroSlider';
import { ShopXChannelsBar } from '../components/ShopXChannelsBar';
import { TrustGuaranteeBar } from '../components/TrustGuaranteeBar';
import { CategoryExplorerGrid } from '../components/CategoryExplorerGrid';
import { FlashSaleSection } from '../components/FlashSaleSection';
import { ComboDealsSection } from '../components/ComboDealsSection';
import { TeamBuySection } from '../components/TeamBuySection';
import { VoucherCenter } from '../components/VoucherCenter';
import { CoinsRewardHub } from '../components/CoinsRewardHub';
import { DarazComparisonMatrix } from '../components/DarazComparisonMatrix';
import { ProductCard } from '../components/ProductCard';
import { JustForYouAISection } from '../components/JustForYouAISection';
import { QuickOrderModal } from '../components/QuickOrderModal';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { LiveStreamShopModal } from '../components/LiveStreamShopModal';
import { ImageSearchModal } from '../components/ImageSearchModal';
import { Product } from '../types';
import { api } from '../services/api';
import { useLanguageStore } from '../store/useLanguageStore';
import { useProductStore } from '../store/useProductStore';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, SlidersHorizontal } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, fetchProducts, isLoading } = useProductStore();
  const [activeTab, setActiveTab] = useState('all');
  const { lang } = useLanguageStore();

  const [quickOrderProduct, setQuickOrderProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const tabsContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const offset = direction === 'left' ? -250 : 250;
      tabsContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter tabs across all major departments
  const tabs = [
    { id: 'all', label: lang === 'bn' ? 'সকল ডিপার্টমেন্ট' : 'All Departments' },
    { id: 'smartphones-tablets', label: lang === 'bn' ? '📱 স্মার্টফোন' : '📱 Smartphones' },
    { id: 'electronics-gadgets', label: lang === 'bn' ? '🎧 গ্যাজেটস ও অডিও' : '🎧 Tech & Gadgets' },
    { id: 'organic-foods', label: lang === 'bn' ? '🌿 খাঁটি খাদ্য' : '🌿 Organic Foods' },
    { id: 'fashion-lifestyle', label: lang === 'bn' ? '👕 ফ্যাশন' : '👕 Fashion & Lifestyle' },
    { id: 'laptops-computers', label: lang === 'bn' ? '💻 ল্যাপটপ' : '💻 Laptops & PC' },
    { id: 'beauty-care', label: lang === 'bn' ? '💄 বিউটি ও আতর' : '💄 Beauty & Fragrances' },
    { id: 'home-kitchen', label: lang === 'bn' ? '🏠 হোম অ্যাপ্লায়েন্স' : '🏠 Home & Kitchen' },
    { id: 'gaming-consoles', label: lang === 'bn' ? '🎮 গেমিং ও ড্রোন' : '🎮 Gaming & Drones' },
    { id: 'watches-accessories', label: lang === 'bn' ? '⌚ ঘড়ি ও জুয়েলারি' : '⌚ Watches' },
  ];

  const filteredProducts = activeTab === 'all'
    ? products
    : products.filter((p) => {
        const catSlug = typeof p.category === 'string' ? p.category : (p.category as any)?.slug;
        const pSlug = catSlug || p.categorySlug;
        if (activeTab === 'gaming-consoles') {
          return pSlug === 'gaming-consoles' || pSlug === 'cameras-drones';
        }
        return pSlug === activeTab;
      });

  return (
    <div className="space-y-10 sm:space-y-14 pb-20 bg-[#f8fafc]">
      {/* 1. Mega Hero Slider & Deals of the Day */}
      <HeroSlider />

      {/* 2. Daraz-Style Quick Channels Action Bar */}
      <ShopXChannelsBar
        onOpenLive={() => setIsLiveOpen(true)}
        onOpenImageSearch={() => setIsImageSearchOpen(true)}
      />

      {/* 3. Official Mall Trust & Authenticity Guarantee Bar */}
      <TrustGuaranteeBar />

      {/* 4. Shop by Department (10 World-Standard Visual Tiles) + 3-Column Mega Promo Cards */}
      <CategoryExplorerGrid />

      {/* 5. Daraz Flash Sale Rush with Live Countdown & Stock Progress */}
      <FlashSaleSection
        products={products}
        onQuickOrder={(p) => setQuickOrderProduct(p)}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* 6. Choice Zone: Multi-Product Super Saver Combo Bundles */}
      <ComboDealsSection onQuickOrder={(p) => setQuickOrderProduct(p)} />

      {/* 7. Social Group Buy & Slash It Team Deals */}
      <TeamBuySection onQuickOrder={(p) => setQuickOrderProduct(p)} />

      {/* 8. Daraz Voucher Collection Center with 1-Click Collect */}
      <VoucherCenter />

      {/* 9. Daraz Daily Coins & 7-Day Check-in Streak VIP Club */}
      <CoinsRewardHub />

      {/* 10. Popular Trending Products Catalog with Department Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
                Official Catalog Collection
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {lang === 'bn' ? 'জনপ্রিয় ও শীর্ষ রেটেড পণ্যসমূহ' : 'Popular & Trending Products'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {lang === 'bn'
                ? 'জেনুইন ব্র্যান্ড ওয়্যারেন্টি সহ সকল ক্যাটাগরির সেরা অফিশিয়াল পণ্য'
                : 'Top authenticated products across all departments with official warranty'}
            </p>
          </div>

          <Link
            to="/products"
            className="self-start md:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-2xl border border-emerald-200 transition shadow-xs"
          >
            <span>{lang === 'bn' ? 'সকল পণ্য দেখুন (৪৯+)' : 'Explore All (49+)'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Full-Width Smooth Scrollable Department Tabs Bar with Left/Right Click Navigators */}
        <div className="relative group bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
          <div className="flex items-center flex-1 overflow-hidden">
            {/* Scroll Left Button */}
            <button
              type="button"
              onClick={() => scrollTabs('left')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition flex-shrink-0 shadow-xs mr-2 z-10"
              title="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable Container (no scrollbar track) */}
            <div
              ref={tabsContainerRef}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-1 px-0.5"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition whitespace-nowrap flex-shrink-0 flex items-center gap-2 shadow-xs ${
                    activeTab === tab.id
                      ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-600/40 scale-102'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Scroll Right Button */}
            <button
              type="button"
              onClick={() => scrollTabs('right')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition flex-shrink-0 shadow-xs ml-2 z-10"
              title="Scroll Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="py-16 text-center text-slate-400 font-bold text-sm">
            {lang === 'bn' ? 'ক্যাটালগ লোড হচ্ছে...' : 'Loading flagship catalog...'}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8">
            <p className="text-slate-500 font-bold text-sm">
              {lang === 'bn' ? 'এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।' : 'No products found in this category.'}
            </p>
            <button
              onClick={() => setActiveTab('all')}
              className="mt-3 px-5 py-2.5 bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-full shadow"
            >
              {lang === 'bn' ? 'সকল পণ্য দেখুন' : 'Show All Products'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickOrder={(p) => setQuickOrderProduct(p)}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 11. Daraz/Alibaba "Just For You" ML Personalized Recommendation Feed */}
      <JustForYouAISection
        onQuickOrder={(p) => setQuickOrderProduct(p)}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* 12. ShopX Superiority vs Daraz Comparison Matrix */}
      <DarazComparisonMatrix />

      {/* 12. "100% Authentic Brands & Official Warranty Guarantee" Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#eaf5ef] border border-emerald-200 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-200/80 px-3 py-1 rounded-full">
              {lang === 'bn' ? 'জেনুইন মাল্টি-ভেন্ডর মল' : 'GENUINE MULTI-VENDOR MALL'}
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
              {lang === 'bn' ? 'অফিসিয়াল ব্র্যান্ডস ও' : 'Official Brands &'}{' '}
              <br />
              <span className="text-emerald-700">{lang === 'bn' ? '১০০% কোয়ালিটি গ্যারান্টি' : '100% Quality Guaranteed'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {lang === 'bn'
                ? 'অ্যাপল, সনি, স্যামসাং সহ অনুমোদিত ভেন্ডর এবং খাঁটি গ্রামীণ অর্গানিক ফার্ম থেকে সরাসরি সংগৃহীত পণ্য।'
                : 'From flagship Apple iPhones and Sony electronics to pure BSTI-certified honey and designer apparel — ShopX guarantees 100% authentic quality and doorstep delivery.'}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-md transition"
              >
                <span>{lang === 'bn' ? 'সকল ডিপার্টমেন্ট দেখুন' : 'Shop All Departments'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/vendor-register"
                className="inline-flex items-center gap-2 bg-white text-emerald-800 border border-emerald-300 font-bold text-xs sm:text-sm px-5 py-3 rounded-full shadow-sm hover:bg-emerald-50 transition"
              >
                <span>{lang === 'bn' ? 'সেলার স্টোর তৈরি করুন →' : 'Open a Vendor Store →'}</span>
              </Link>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=80"
              alt="Mega Mall Experience"
              className="w-72 sm:w-88 h-56 sm:h-64 object-cover rounded-3xl shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 13. "Super Mega Sale Rush" Up to 50% Off Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden">
          <div className="z-10 text-center sm:text-left space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
              {lang === 'bn' ? 'সীমিত সময়ের মেগা অফার' : 'LIMITED TIME MEGA OFFER'}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold">{lang === 'bn' ? 'ShopX সুপার মেগা ডিলস' : 'ShopX Super Mega Deals'}</h3>
            <p className="text-xs text-emerald-200">
              {lang === 'bn'
                ? 'স্মার্টফোন, গ্যাজেট, অর্গানিক খাদ্য ও ফ্যাশনে বাংলাদেশের ৬৪ জেলায় সেরা ছাড়।'
                : 'Save more on flagship smartphones, gadgets, organic food & fashion across all 64 districts.'}
            </p>
            <Link
              to="/products?filter=deals"
              className="inline-block mt-2 bg-amber-400 text-slate-950 hover:bg-amber-300 text-xs font-extrabold px-5 py-2.5 rounded-xl shadow transition"
            >
              {lang === 'bn' ? 'মেগা ডিল দেখুন →' : 'Explore Mega Deals →'}
            </Link>
          </div>

          <div className="z-10 flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-amber-400 text-slate-950 flex flex-col items-center justify-center font-black shadow-lg">
              <span className="text-[10px] uppercase">{lang === 'bn' ? 'সর্বোচ্চ' : 'Up to'}</span>
              <span className="text-2xl leading-none">50%</span>
              <span className="text-[10px] uppercase">{lang === 'bn' ? 'ছাড়' : 'OFF'}</span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80"
              alt="Mega Gadgets"
              className="w-24 h-24 object-cover rounded-2xl shadow hidden md:block"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Modals for Quick View, Quick Order, Live Commerce & Image Search */}
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
          onQuickOrder={(p) => setQuickOrderProduct(p)}
        />
      )}

      <LiveStreamShopModal
        isOpen={isLiveOpen}
        onClose={() => setIsLiveOpen(false)}
        onQuickOrder={(p) => setQuickOrderProduct(p)}
      />

      <ImageSearchModal
        isOpen={isImageSearchOpen}
        onClose={() => setIsImageSearchOpen(false)}
      />
    </div>
  );
};
