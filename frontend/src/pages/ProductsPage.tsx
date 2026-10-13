import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { QuickOrderModal } from '../components/QuickOrderModal';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { ProductCompareModal } from '../components/ProductCompareModal';
import { Product } from '../types';
import { api } from '../services/api';
import { useLanguageStore } from '../store/useLanguageStore';
import { getSafeImage } from '../utils/image';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useCartStore } from '../store/useCartStore';
import {
  Crown,
  Sparkles,
  Truck,
  Star,
  Zap,
  Flame,
  RotateCcw,
  SlidersHorizontal,
  Tag,
  ArrowRight,
  LayoutGrid,
  Grid3X3,
  List,
  ShieldCheck,
  CheckCircle2,
  X,
  Scale,
  Search,
  Check,
  Plus,
} from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { lang } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();
  const { addItem } = useCartStore();
  const isBn = lang === 'bn';

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const isDeals = searchParams.get('filter') === 'deals' || searchParams.get('deals') === 'true';
  const isFlash = searchParams.get('flash') === 'true';
  const isMall = searchParams.get('mall') === 'true';

  const [sortBy, setSortBy] = useState('createdAt');
  const [priceRange, setPriceRange] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minRating, setMinRating] = useState<number>(0);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [mallOnly, setMallOnly] = useState(isMall);
  const [dealsOnly, setDealsOnly] = useState(isDeals || isFlash);
  const [freeDeliveryOnly, setFreeDeliveryOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid5' | 'grid4' | 'list'>('grid5');

  const [quickOrderProduct, setQuickOrderProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const categoryPills = [
    { slug: '', label: isBn ? 'সকল পণ্য' : 'All Products' },
    { slug: 'smartphones-tablets', label: isBn ? '📱 স্মার্টফোন' : '📱 Smartphones' },
    { slug: 'laptops-computers', label: isBn ? '💻 ল্যাপটপ ও পিসি' : '💻 Laptops & PC' },
    { slug: 'electronics-gadgets', label: isBn ? '🎧 গ্যাজেটস ও অডিও' : '🎧 Gadgets' },
    { slug: 'organic-foods', label: isBn ? '🌿 খাঁটি খাদ্য' : '🌿 Organic Foods' },
    { slug: 'fashion-lifestyle', label: isBn ? '👕 ফ্যাশন' : '👕 Fashion' },
    { slug: 'beauty-care', label: isBn ? '💄 বিউটি ও আতর' : '💄 Beauty' },
    { slug: 'home-kitchen', label: isBn ? '🏠 হোম অ্যাপ্লায়েন্স' : '🏠 Home & Kitchen' },
    { slug: 'gaming-consoles', label: isBn ? '🎮 গেমিং ও ড্রোন' : '🎮 Gaming & Drones' },
    { slug: 'watches-accessories', label: isBn ? '⌚ ঘড়ি ও জুয়েলারি' : '⌚ Watches' },
  ];

  const popularBrands = [
    'Apple',
    'Sony',
    'Samsung',
    'Dyson',
    'ASUS',
    'Casio',
    'Philips',
    'Marshall',
    'ShopX Organic',
  ];

  useEffect(() => {
    setMallOnly(isMall);
    setDealsOnly(isDeals || isFlash);
  }, [isMall, isDeals, isFlash]);

  useEffect(() => {
    const fetchFiltered = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append('limit', '50');
        if (category) queryParams.append('category', category);
        if (search) queryParams.append('search', search);
        if (dealsOnly || isDeals || isFlash) queryParams.append('deals', 'true');
        if (organicOnly) queryParams.append('isOrganic', 'true');
        if (sortBy) queryParams.append('sortBy', sortBy);

        if (priceRange === 'under_1000') {
          queryParams.append('maxPrice', '1000');
        } else if (priceRange === '1000_5000') {
          queryParams.append('minPrice', '1000');
          queryParams.append('maxPrice', '5000');
        } else if (priceRange === '5000_25000') {
          queryParams.append('minPrice', '5000');
          queryParams.append('maxPrice', '25000');
        } else if (priceRange === 'above_25000') {
          queryParams.append('minPrice', '25000');
        }

        const res = await api.get(`/products?${queryParams.toString()}`);
        if (res.data?.success) {
          let list = res.data.data as Product[];
          if (mallOnly) {
            list = list.filter((p) => p.brand && p.brand !== 'Local');
          }
          if (selectedBrand) {
            list = list.filter(
              (p) =>
                p.brand?.toLowerCase().includes(selectedBrand.toLowerCase()) ||
                p.title.toLowerCase().includes(selectedBrand.toLowerCase())
            );
          }
          if (minRating > 0) {
            list = list.filter((p) => (p.rating || 4.9) >= minRating);
          }
          if (freeDeliveryOnly) {
            list = list.filter((p) => (p.price || 0) > 1000);
          }
          if (dealsOnly) {
            list = list.filter(
              (p) => p.isFlashSale || (p.discountPrice && p.discountPrice < p.price)
            );
          }
          setProducts(list);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiltered();
  }, [
    category,
    search,
    isDeals,
    isFlash,
    sortBy,
    priceRange,
    selectedBrand,
    minRating,
    organicOnly,
    mallOnly,
    dealsOnly,
    freeDeliveryOnly,
  ]);

  const handleCategorySelect = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('category', slug);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const getPageTitle = () => {
    if (search)
      return isBn ? `অনুসন্ধানের ফলাফল: "${search}"` : `Search Results for: "${search}"`;
    if (dealsOnly || isDeals || isFlash)
      return isBn ? '🔥 মেগা ডিলস ও ফ্ল্যাশ সেল অফার' : '🔥 Mega Deals & Flash Sale Rush';
    if (mallOnly || isMall)
      return isBn
        ? '👑 ShopX অফিসিয়াল মল (১০০% অথেনটিক ব্র্যান্ড)'
        : '👑 ShopX Official Mall (100% Authentic Brands)';
    if (category) {
      const match = categoryPills.find((c) => c.slug === category);
      return match ? match.label : isBn ? `ক্যাটাগরি: ${category}` : `Category: ${category}`;
    }
    return isBn ? 'সকল অফিসিয়াল পণ্য ক্যাটালগ' : 'All Official Flagship Products';
  };

  const resetAllFilters = () => {
    setOrganicOnly(false);
    setMallOnly(false);
    setDealsOnly(false);
    setFreeDeliveryOnly(false);
    setPriceRange('');
    setSelectedBrand('');
    setMinRating(0);
    handleCategorySelect('');
  };

  const activeFiltersCount =
    (category ? 1 : 0) +
    (dealsOnly ? 1 : 0) +
    (mallOnly ? 1 : 0) +
    (organicOnly ? 1 : 0) +
    (freeDeliveryOnly ? 1 : 0) +
    (priceRange ? 1 : 0) +
    (selectedBrand ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Deals Header Banner if in Deals Mode */}
      {(dealsOnly || isDeals || isFlash) && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-400 text-slate-950 px-3 py-1 rounded-full shadow">
              {isBn ? 'সীমিত সময়ের মেগা অফার' : 'LIMITED TIME MEGA DEALS'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              {isBn ? 'সুপার মেগা ডিলস ও ছাড়' : 'Super Mega Deals & Rush Offers'}
            </h2>
            <p className="text-xs text-red-100 max-w-lg">
              {isBn
                ? 'স্মার্টফোন, গ্যাজেট, খাঁটি খাদ্য ও ফ্যাশনে সর্বোচ্চ ৫০% পর্যন্ত বিশেষ মূল্যছাড় ও ফ্রি ডেলিভারি।'
                : 'Save up to 50% OFF on flagship smartphones, gadgets, BSTI-certified organics & fashion.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-yellow-400 text-slate-950 flex flex-col items-center justify-center font-black shadow-lg">
              <span className="text-[9px] uppercase">{isBn ? 'সর্বোচ্চ' : 'Up to'}</span>
              <span className="text-xl leading-none">50%</span>
              <span className="text-[9px] uppercase">{isBn ? 'ছাড়' : 'OFF'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Luxury Command Center Header & Filter Controls Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Genuine Certified</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">64 Districts Fast Express</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              <strong className="text-emerald-700 font-mono font-black">{products.length}</strong>{' '}
              {isBn ? 'টি ভেরিফায়েড পণ্য পাওয়া গেছে' : 'verified products available'}
            </p>
          </div>

          {/* Layout Mode Toggles & Sort Options */}
          <div className="flex items-center gap-2.5 self-end md:self-auto">
            {/* View Mode Buttons */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid5')}
                className={`p-2 rounded-xl transition ${
                  viewMode === 'grid5'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={isBn ? '৫-কলাম গ্রিড ভিউ' : '5-Column Grid View'}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid4')}
                className={`p-2 rounded-xl transition ${
                  viewMode === 'grid4'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={isBn ? '৪-কলাম কমপ্যাক্ট ভিউ' : '4-Column Compact View'}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition ${
                  viewMode === 'list'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={isBn ? 'ডিটেইলস লিস্ট ভিউ' : 'Detailed List View'}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort By Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs py-2.5 px-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 outline-none font-bold shadow-sm focus:border-emerald-600"
            >
              <option value="createdAt">{isBn ? 'নতুন পণ্য (Newest)' : 'Newest Arrivals'}</option>
              <option value="popular">{isBn ? 'জনপ্রিয় (Best Selling)' : 'Best Selling'}</option>
              <option value="price_asc">{isBn ? 'দাম: কম থেকে বেশি' : 'Price: Low to High'}</option>
              <option value="price_desc">{isBn ? 'দাম: বেশি থেকে কম' : 'Price: High to Low'}</option>
              <option value="rating">{isBn ? 'সেরা রেটিং (Top Rated)' : 'Customer Rating'}</option>
            </select>
          </div>
        </div>

        {/* Filter Pills Grid: Quick Toggles */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {/* Deals Toggle Filter */}
          <button
            onClick={() => setDealsOnly(!dealsOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
              dealsOnly
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-yellow-300" />
            <span>{isBn ? 'মেগা ডিলস' : 'Deals'}</span>
          </button>

          {/* ShopX Mall Filter */}
          <button
            onClick={() => setMallOnly(!mallOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
              mallOnly
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>{isBn ? 'ShopX অফিসিয়াল মল' : 'ShopX Official Mall'}</span>
          </button>

          {/* Organic Only Filter */}
          <button
            onClick={() => setOrganicOnly(!organicOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              organicOnly
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            🌿 {isBn ? 'খাঁটি অর্গানিক খাদ্য' : 'Organic Foods'}
          </button>

          {/* Free Delivery Filter */}
          <button
            onClick={() => setFreeDeliveryOnly(!freeDeliveryOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
              freeDeliveryOnly
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{isBn ? 'ফ্রি ডেলিভারি' : 'Free Shipping'}</span>
          </button>

          {/* Price Range Filter Dropdown */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none font-medium"
          >
            <option value="">{isBn ? 'সকল বাজেট' : 'All Prices'}</option>
            <option value="under_1000">{isBn ? '৳১,০০০ এর নিচে' : 'Under ৳1,000'}</option>
            <option value="1000_5000">{isBn ? '৳১,০০০ - ৳৫,০০০' : '৳1,000 - ৳5,000'}</option>
            <option value="5000_25000">{isBn ? '৳৫,০০০ - ৳২৫,০০০' : '৳5,000 - ৳25,000'}</option>
            <option value="above_25000">{isBn ? '৳২৫,০০০ এর উপরে' : 'Above ৳25,000'}</option>
          </select>

          {/* Minimum Rating Dropdown */}
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none font-medium"
          >
            <option value="0">{isBn ? 'সকল রেটিং' : 'All Ratings'}</option>
            <option value="4.5">★ 4.5+ {isBn ? 'স্টার' : 'Stars'}</option>
            <option value="4.0">★ 4.0+ {isBn ? 'স্টার' : 'Stars'}</option>
          </select>

          {/* Reset All Button */}
          {activeFiltersCount > 0 && (
            <button
              onClick={resetAllFilters}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 flex items-center gap-1 transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>{isBn ? 'সব ফিল্টার মুছুন' : 'Clear Filters'}</span>
            </button>
          )}
        </div>

        {/* Popular Brand Quick Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            {isBn ? 'টপ ব্র্যান্ড:' : 'Top Brands:'}
          </span>
          {popularBrands.map((brandName) => {
            const isSelected = selectedBrand.toLowerCase() === brandName.toLowerCase();
            return (
              <button
                key={brandName}
                onClick={() => setSelectedBrand(isSelected ? '' : brandName)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                {brandName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categoryPills.map((pill) => {
          const isActive = (pill.slug === '' && !category) || category === pill.slug;
          return (
            <button
              key={pill.slug}
              onClick={() => handleCategorySelect(pill.slug)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition whitespace-nowrap shadow-sm ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-emerald-700/20 ring-2 ring-emerald-600/30'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* Products Display (Grid or List View) */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-bold text-xs font-mono">
            {isBn ? 'যাচাইকৃত পণ্য লোড হচ্ছে...' : 'Loading verified flagship products...'}
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-800 font-black text-base">
              {isBn ? 'এই ফিল্টারে কোনো পণ্য পাওয়া যায়নি।' : 'No products matched your criteria.'}
            </p>
            <p className="text-xs text-slate-400">
              {isBn
                ? 'অনুগ্রহ করে অন্যান্য ক্যাটাগরি বা ফিল্টার ট্রাই করুন।'
                : 'Try adjusting your filters or price range to find matching items.'}
            </p>
          </div>
          <button
            onClick={resetAllFilters}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-2xl shadow transition"
          >
            {isBn ? 'সব ফিল্টার ক্লিয়ার করুন' : 'Reset All Filters'}
          </button>
        </div>
      ) : viewMode === 'list' ? (
        /* Detailed List View Mode */
        <div className="space-y-4">
          {products.map((product) => {
            const hasDiscount =
              product.discountPrice && product.discountPrice < product.price;
            return (
              <div
                key={product._id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-emerald-300 shadow-sm hover:shadow-xl transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group"
              >
                <div className="flex items-center gap-5">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0">
                    <img
                      src={getSafeImage(product.thumbnail || product.images?.[0])}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition duration-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {product.brand || 'Official Store'} • {product.categorySlug?.replace('-', ' ')}
                    </span>
                    <Link
                      to={`/product/${product.slug}`}
                      className="text-base font-black text-slate-900 hover:text-emerald-700 transition block line-clamp-2"
                    >
                      {isBn && product.banglaTitle ? product.banglaTitle : product.title}
                    </Link>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-amber-500 font-extrabold flex items-center gap-1">
                        ★ {product.rating || 4.9}
                      </span>
                      <span className="text-slate-400">
                        {product.soldCount || 34} {isBn ? 'বিক্রয়' : 'sold'}
                      </span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {product.isOrganic ? 'BSTI Organic' : 'Official Warranty'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 gap-3">
                  <div className="text-left sm:text-right">
                    <span className="text-lg sm:text-xl font-mono font-black text-emerald-800">
                      {formatPrice(product.discountPrice || product.price)}
                    </span>
                    {hasDiscount && (
                      <span className="block text-xs text-slate-400 line-through font-mono">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                      title={isBn ? 'কুইক ভিউ' : 'Quick View'}
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        addItem(product, 1);
                        alert(isBn ? 'কার্টে যোগ করা হয়েছে!' : 'Added to cart!');
                      }}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition"
                    >
                      {isBn ? '+ কার্ট' : '+ Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Grid Mode (5-Col or 4-Col) */
        <div
          className={
            viewMode === 'grid4'
              ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5'
              : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
          }
        >
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickOrder={(p) => setQuickOrderProduct(p)}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Interactive Product Comparison Modal & Floating Dock */}
      <ProductCompareModal />

      {/* Modals for Quick Order & View */}
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
    </div>
  );
};
