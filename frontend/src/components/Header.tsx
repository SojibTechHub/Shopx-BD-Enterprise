import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Truck,
  Sparkles,
  Globe,
  Store,
  Mic,
  X,
  PhoneCall,
  ShieldCheck,
  ChevronDown,
  MapPin,
  Menu,
  Layers,
  Sparkle,
  Gift,
  Users,
  FileText,
  DollarSign,
  Crown,
  Camera,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCurrencyStore, CURRENCIES, CurrencyCode } from '../store/useCurrencyStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { api } from '../services/api';
import { ImageSearchModal } from './ImageSearchModal';
import { getSafeImage } from '../utils/image';

interface HeaderProps {
  onOpenAI?: () => void;
  onOpenAffiliate?: () => void;
  onOpenVIP?: () => void;
  onOpenLive?: () => void;
  onOpenPriceMatch?: () => void;
  onOpenGiftCards?: () => void;
  onOpenVoiceCommander?: () => void;
  onOpenSharedCart?: () => void;
  onOpenPrescription?: () => void;
  onOpenTryOn?: () => void;
  onOpenExchange?: () => void;
  onOpenB2BQuote?: () => void;
  onOpenBudgetCart?: () => void;
  onOpenDailyStreak?: () => void;
  onOpenSaaSStoreBuilder?: () => void;
  onOpenFraudShield?: () => void;
  onOpenCourierDispatch?: () => void;
  onOpenWebhooks?: () => void;
  onOpenSmartUpsell?: () => void;
  onOpen3DStudio?: () => void;
  onOpenAuctionRoom?: () => void;
  onOpenDoorstepReturn?: () => void;
  onOpenAdCampaign?: () => void;
  onOpenRecruiter?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAI,
  onOpenAffiliate,
  onOpenVIP,
  onOpenLive,
  onOpenPriceMatch,
  onOpenGiftCards,
  onOpenVoiceCommander,
  onOpenSharedCart,
  onOpenPrescription,
  onOpenTryOn,
  onOpenExchange,
  onOpenB2BQuote,
  onOpenBudgetCart,
  onOpenDailyStreak,
  onOpenSaaSStoreBuilder,
  onOpenFraudShield,
  onOpenCourierDispatch,
  onOpenWebhooks,
  onOpenSmartUpsell,
  onOpen3DStudio,
  onOpenAuctionRoom,
  onOpenDoorstepReturn,
  onOpenAdCampaign,
  onOpenRecruiter,
}) => {
  const navigate = useNavigate();
  const { items, setDrawerOpen } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, logout } = useAuthStore();
  const { lang, setLang, toggleLang, t } = useLanguageStore();
  const { currency, setCurrency, formatPrice } = useCurrencyStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState('Dhaka, Bangladesh');
  const [showLocationModal, setShowLocationModal] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  const totalCartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Live search suggestions
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await api.get(`/products/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
        if (res.data?.success) {
          setSuggestions(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setShowCategoriesDropdown(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setShowServicesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSuggestions([]);
    }
  };

  // Voice Search Web Speech API
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please use Google Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      navigate(`/products?search=${encodeURIComponent(transcript)}`);
    };

    recognition.start();
  };

  const categoriesList = [
    { name: 'Smartphones & Tablets', bn: '📱 স্মার্টফোন ও ট্যাব', icon: '📱', slug: 'smartphones-tablets', count: '180+ Flagships', bnCount: '১৮০+ মডেল' },
    { name: 'Tech & Gadgets (TWS)', bn: '🎧 টেক ও স্মার্ট গ্যাজেটস', icon: '🎧', slug: 'electronics-gadgets', count: '300+ Gadgets', bnCount: '৩০০+ গ্যাজেট' },
    { name: 'Pure Organic Foods', bn: '🌿 খাঁটি ও অর্গানিক খাদ্য', icon: '🌿', slug: 'organic-foods', count: '250+ Items', bnCount: '২৫০+ আইটেম' },
    { name: 'Fashion & Lifestyle', bn: '👕 ফ্যাশন ও প্রিমিয়াম পোশাক', icon: '👕', slug: 'fashion-lifestyle', count: '450+ Trends', bnCount: '৪৫০+ কালেকশন' },
    { name: 'Laptops & PC', bn: '💻 ল্যাপটপ ও কম্পিউটার', icon: '💻', slug: 'laptops-computers', count: '120+ Models', bnCount: '১২০+ মডেল' },
    { name: 'Beauty & Fragrances', bn: '💄 বিউটি ও রাজকীয় আতর', icon: '💄', slug: 'beauty-care', count: '190+ Scents', bnCount: '১৯০+ পারফিউম' },
    { name: 'Home & Kitchen', bn: '🏠 হোম ও কিচেন অ্যাপ্লায়েন্স', icon: '🏠', slug: 'home-kitchen', count: '160+ Items', bnCount: '১৬০+ আইটেম' },
    { name: 'Gaming & Drones', bn: '🎮 গেমিং, কনসোল ও ড্রোন', icon: '🎮', slug: 'gaming-consoles', count: '80+ Gears', bnCount: '৮০+ গেমিং গিয়ার' },
    { name: 'Watches & Accessories', bn: '⌚ ঘড়ি ও লাক্সারি টাইমপিস', icon: '⌚', slug: 'watches-accessories', count: '140+ Luxury', bnCount: '১৪০+ লাক্সারি' },
    { name: 'B2B Wholesale & Bulk', bn: '🏢 B2B হোলসেল ও বাল্ক সাপ্লাই', icon: '🏢', slug: 'global-imports', count: 'Bulk Tiers', bnCount: 'পাইকারি রেট' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-md transition-all">
      {/* 1. Top Bar: Deliver Location, Hotline, Portals, Currency, Language */}
      <div className="bg-slate-900 text-slate-300 text-xs sm:text-sm py-2 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs sm:text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'bn' ? '১০০% অরিজিনাল ব্র্যান্ড ও ক্যাশ অন ডেলিভারি' : '100% Authentic Brands, Official Warranty & COD'}</span>
            </span>
            <span className="hidden sm:inline-block text-slate-700">|</span>
            <a
              href="tel:+8801942791004"
              className="hidden md:flex items-center gap-1.5 text-slate-300 hover:text-white transition text-xs sm:text-sm"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('hotline')}: <strong className="text-white font-mono">01942791004</strong> (24/7 Helpline)</span>
            </a>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 text-xs sm:text-sm font-semibold">
            {/* 4 Role Portals Navigation Links */}
            <Link
              to="/vendor-register"
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition"
            >
              <Store className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'সেলার হাব' : 'Seller Hub'}</span>
            </Link>

            <span className="text-slate-700">|</span>

            <Link
              to="/rider-portal"
              className="hidden lg:flex items-center gap-1 text-slate-300 hover:text-blue-400 font-semibold transition"
            >
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'bn' ? 'রাইডার হাব' : 'Rider Hub'}</span>
            </Link>

            <span className="hidden lg:inline text-slate-700">|</span>

            <a
              href="http://localhost:5174/login"
              target="_blank"
              rel="noreferrer"
              className="hidden xl:flex items-center gap-1 text-purple-400 hover:text-purple-300 font-bold transition"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'এডমিন পোর্টাল' : 'Admin 2FA'}</span>
            </a>

            <span className="hidden xl:inline text-slate-700">|</span>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-1 text-slate-200 hover:text-emerald-400 transition font-bold"
              >
                <span>{currency} ({CURRENCIES[currency]?.symbol})</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {showCurrencyDropdown && (
                <div className="absolute right-0 mt-1 w-44 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-1.5 z-50 text-xs">
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((cCode) => (
                    <button
                      key={cCode}
                      onClick={() => {
                        setCurrency(cCode);
                        setShowCurrencyDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-200 hover:text-emerald-400 flex justify-between font-semibold"
                    >
                      <span>{CURRENCIES[cCode].name}</span>
                      <span className="font-mono text-emerald-400">{CURRENCIES[cCode].symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-slate-700">|</span>

            {/* Language Switcher [ EN | বাংলা ] */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 text-xs font-black rounded-lg transition ${
                  lang === 'en'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('bn')}
                className={`px-2.5 py-1 text-xs font-black rounded-lg transition ${
                  lang === 'bn'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="বাংলায় পরিবর্তন করুন"
              >
                বাং
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Center Header: Logo, Search Bar, Quick Action Icons */}
      <div className="py-2.5 sm:py-4 px-3 sm:px-6 max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
        {/* Brand Logo: ShopX Official Supermall */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3.5 group flex-shrink-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-md sm:shadow-lg shadow-emerald-700/25 group-hover:scale-105 transition">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
          </div>
          <div className="flex flex-col">
            <div className="font-black text-xl sm:text-3xl tracking-tight text-slate-900 flex items-center gap-1.5 sm:gap-2 leading-none">
              Shop<span className="text-emerald-700">X</span>
              <span className="text-[9px] sm:text-[10px] bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider shadow-sm">
                OFFICIAL
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 font-semibold tracking-normal mt-0.5 sm:mt-1 hidden sm:block">
              {lang === 'bn' ? 'অফিসিয়াল প্রিমিয়াম সুপারমল ও স্মার্ট কমার্স' : 'Official Supermall & Smart Commerce'}
            </p>
          </div>
        </Link>

        {/* Big Clean Search Bar (Desktop View) */}
        <div ref={searchRef} className="hidden md:block relative flex-1 max-w-2xl min-w-0">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'bn' ? 'স্মার্টফোন, গ্যাজেট, ফ্যাশন, খাঁটি অর্গানিক ফুড ও নিত্যপণ্য খুঁজুন...' : 'Search 50,000+ smartphones, tech gadgets, fashion, organic foods...'}
              className="w-full bg-[#f8fafc] border-2 border-slate-200 focus:border-emerald-600 focus:bg-white rounded-full py-3 pl-6 pr-32 text-sm sm:text-base text-slate-800 outline-none transition-all placeholder-slate-400 shadow-sm"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-28 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* AI Camera Search */}
            <button
              type="button"
              onClick={() => setIsImageSearchOpen(true)}
              className="absolute right-20 p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-emerald-600 transition"
              title="AI Camera Search"
            >
              <Camera className="w-5 h-5" />
            </button>

            {/* Voice Search */}
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`absolute right-12 p-2 rounded-full hover:bg-slate-200 transition ${
                isListening ? 'text-red-500 animate-ping' : 'text-slate-400 hover:text-emerald-600'
              }`}
              title="Voice Search"
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Green Circular Submit Button */}
            <button
              type="submit"
              className="absolute right-1.5 bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-full shadow-md shadow-emerald-600/30 transition flex items-center justify-center"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Autocomplete Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="p-3 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                {lang === 'bn' ? `পণ্য সাজেশন্স (${suggestions.length})` : `Products Found (${suggestions.length})`}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {suggestions.map((item) => (
                  <Link
                    key={item._id}
                    to={`/product/${item.slug}`}
                    onClick={() => setSuggestions([])}
                    className="flex items-center gap-3 p-3 hover:bg-emerald-50 transition border-b border-slate-50"
                  >
                    <img
                      src={getSafeImage(item.thumbnail || (item as any).images?.[0])}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-xl bg-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {lang === 'bn' && item.banglaTitle ? item.banglaTitle : item.title}
                      </p>
                      <p className="text-xs font-black text-emerald-600 font-mono mt-0.5">
                        {formatPrice(item.discountPrice || item.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Action Icons & Login / Sign Up */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* 1. Track Order */}
          <Link
            to="/track-order"
            className="hidden lg:flex flex-col items-center text-slate-700 hover:text-emerald-600 transition group p-1"
          >
            <div className="relative">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition" />
            </div>
            <span className="text-xs font-semibold mt-0.5">
              {lang === 'bn' ? 'ট্র্যাক অর্ডার' : 'Track Order'}
            </span>
          </Link>

          {/* 2. Wishlist */}
          <Link
            to="/products?filter=wishlist"
            className="hidden sm:flex flex-col items-center text-slate-700 hover:text-emerald-600 transition group relative p-1"
          >
            <div className="relative">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {wishlistItems.length}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold mt-0.5 hidden lg:inline-block">
              {lang === 'bn' ? 'উইশলিস্ট' : 'Wishlist'}
            </span>
          </Link>

          {/* 3. Account / Dedicated Login Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition group"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xs shadow-sm">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden xl:block text-left pr-1">
                  <p className="text-xs font-bold text-slate-900 truncate max-w-[100px]">
                    {user.name.split(' ')[0]}
                  </p>
                  <span className="text-[10px] text-emerald-700 font-black font-mono flex items-center gap-0.5">
                    🪙 {user.loyaltyCoins || 0}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-700" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                    <p className="text-xs font-bold text-slate-900">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black">
                      <span>🪙 {user.loyaltyCoins || 0} ShopX Coins</span>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setShowUserDropdown(false)}
                    className="block px-4 py-2 text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    👤 {lang === 'bn' ? 'আমার প্রোফাইল ও ঠিকানা' : 'My Profile & Addresses'}
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setShowUserDropdown(false)}
                    className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    📦 {lang === 'bn' ? 'আমার অর্ডারসমূহ' : 'My Orders'}
                  </Link>
                  {user.role === 'admin' && (
                    <a
                      href={
                        typeof window !== 'undefined' &&
                        (window.location.hostname === 'localhost' ||
                          window.location.hostname === '127.0.0.1' ||
                          window.location.hostname.startsWith('192.168.'))
                          ? 'http://localhost:5174'
                          : (import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174')
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="block px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                    >
                      👑 {lang === 'bn' ? 'সুপার অ্যাডমিন পোর্টাল' : 'Super Admin Portal'}
                    </a>
                  )}
                  {user.role === 'vendor' && (
                    <a
                      href={
                        typeof window !== 'undefined' &&
                        (window.location.hostname === 'localhost' ||
                          window.location.hostname === '127.0.0.1' ||
                          window.location.hostname.startsWith('192.168.'))
                          ? 'http://localhost:5174'
                          : (import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174')
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="block px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50"
                    >
                      🏪 {lang === 'bn' ? 'সেলার ড্যাশবোর্ড' : 'Vendor Dashboard'}
                    </a>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-bold border-t border-slate-100 mt-1"
                  >
                    🚪 {lang === 'bn' ? 'লগআউট' : 'Sign Out'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 font-bold text-xs sm:text-sm border border-slate-200 transition shadow-xs"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                <span className="whitespace-nowrap">{lang === 'bn' ? 'লগইন' : 'Login'}</span>
              </Link>
              <Link
                to="/register"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 transition hover:shadow-lg"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="whitespace-nowrap">{lang === 'bn' ? 'সাইন আপ' : 'Sign Up'}</span>
              </Link>
            </div>
          )}

          {/* 4. Cart Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl transition border border-emerald-200 group shadow-sm flex-shrink-0"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700 group-hover:scale-110 transition" />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-emerald-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {totalCartCount}
                </span>
              )}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-[10px] text-emerald-600 uppercase font-bold tracking-wider">
                {lang === 'bn' ? 'কার্ট' : 'Cart'}
              </span>
              <span className="block text-xs font-black font-mono text-emerald-950">
                {formatPrice(totalCartPrice)}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Dedicated Full-Width Search Bar */}
      <div className="block md:hidden px-3 pb-3">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'bn' ? 'পণ্য, গ্যাজেট, ফ্যাশন খুঁজুন...' : 'Search 50,000+ products...'}
            className="w-full bg-[#f8fafc] border-2 border-slate-200 focus:border-emerald-600 focus:bg-white rounded-full py-2.5 pl-4 pr-28 text-xs text-slate-800 outline-none transition-all placeholder-slate-400 shadow-sm"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-24 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsImageSearchOpen(true)}
            className="absolute right-16 p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-emerald-600"
          >
            <Camera className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`absolute right-9 p-1.5 rounded-full hover:bg-slate-200 ${
              isListening ? 'text-red-500 animate-ping' : 'text-slate-400 hover:text-emerald-600'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="submit"
            className="absolute right-1 bg-emerald-600 text-white p-2 rounded-full shadow-md"
          >
            <Search className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </form>
      </div>


      {/* 3. Bottom Navigation Bar matching reference image */}
      <div className="border-t border-slate-100 bg-white px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Green "All Categories" Dropdown */}
          <div ref={categoriesRef} className="relative">
            <button
              onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
              className="flex items-center gap-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-t-xl transition shadow-sm"
            >
              <Menu className="w-4 h-4" />
              <span>{lang === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showCategoriesDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Mega Categories Dropdown */}
            {showCategoriesDropdown && (
              <div className="absolute top-full left-0 w-72 bg-white border border-slate-200 rounded-b-2xl rounded-tr-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                {categoriesList.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/products?category=${cat.slug}`}
                    onClick={() => setShowCategoriesDropdown(false)}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-emerald-50 transition text-slate-700 hover:text-emerald-700 border-b border-slate-50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{cat.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{lang === 'bn' ? cat.bn : cat.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{lang === 'bn' ? cat.bnCount : cat.count}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Center Links matching reference image */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-700">
            <Link to="/" className="text-emerald-700 font-bold hover:text-emerald-800 transition">
              {lang === 'bn' ? 'হোম' : 'Home'}
            </Link>
            <Link to="/products" className="hover:text-emerald-600 transition">
              {lang === 'bn' ? 'শপ' : 'Shop'}
            </Link>
            <Link to="/products?filter=deals" className="hover:text-emerald-600 transition flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>{lang === 'bn' ? 'হট ডিলস' : 'Deals'}</span>
            </Link>
            <Link to="/about" className="hover:text-emerald-600 transition">
              {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
            </Link>
            <Link to="/contact" className="hover:text-emerald-600 transition">
              {lang === 'bn' ? 'যোগাযোগ' : 'Contact'}
            </Link>

            {/* Smart AI & Super Services Hub Dropdown */}
            <div ref={servicesRef} className="relative">
              <button
                onClick={() => setShowServicesDropdown(!showServicesDropdown)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border border-emerald-300 rounded-full font-extrabold text-xs hover:bg-emerald-100 hover:shadow-sm transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-700 animate-spin" style={{ animationDuration: '8s' }} />
                <span>{lang === 'bn' ? 'স্মার্ট হাব (Smart Hub)' : 'Smart Hub'}</span>
                <ChevronDown className="w-3 h-3 text-emerald-700" />
              </button>

              {showServicesDropdown && (
                <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 z-50 text-xs animate-in fade-in space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-xs shadow-sm">
                        SX
                      </span>
                      <div>
                        <h4 className="font-extrabold text-slate-900 dark:text-white">
                          {lang === 'bn' ? 'ShopX স্মার্ট হাব ও সুপার পাওয়ার টুলস' : 'ShopX Smart Hub & Power Services'}
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          {lang === 'bn' ? 'এআই, ভাউচার, লজিস্টিকস ও শপিং সার্ভিসেস' : 'AI, vouchers, logistics & customer tools'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* 1. AI Shopping Copilot */}
                    <button
                      onClick={() => { onOpenAI?.(); setShowServicesDropdown(false); }}
                      className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100/70 border border-purple-200 text-left transition flex flex-col justify-between"
                    >
                      <span className="text-base mb-1">🤖</span>
                      <p className="font-bold text-purple-900 dark:text-purple-300 text-[11px] leading-tight">
                        {lang === 'bn' ? 'এআই শপিং অ্যাসিস্ট্যান্ট' : 'AI Shopping Copilot'}
                      </p>
                      <span className="text-[9px] text-purple-600 mt-0.5">{lang === 'bn' ? 'ভয়েস ও স্মার্ট পরামর্শ' : 'Voice & Chat Advice'}</span>
                    </button>

                    {/* 2. Voucher & Deals */}
                    <Link
                      to="/products?filter=deals"
                      onClick={() => setShowServicesDropdown(false)}
                      className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100/70 border border-amber-200 text-left transition flex flex-col justify-between"
                    >
                      <span className="text-base mb-1">🎟️</span>
                      <p className="font-bold text-amber-900 dark:text-amber-300 text-[11px] leading-tight">
                        {lang === 'bn' ? 'ভাউচার ও মেগা ডিলস' : 'Voucher & Mega Deals'}
                      </p>
                      <span className="text-[9px] text-amber-600 mt-0.5">{lang === 'bn' ? '১-ক্লিকে ৳১০০ ছাড়' : 'Flat ৳100 Off & Free Ship'}</span>
                    </Link>

                    {/* 3. Daily Coins & VIP */}
                    <button
                      onClick={() => { onOpenVIP?.(); setShowServicesDropdown(false); }}
                      className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100/70 border border-emerald-200 text-left transition flex flex-col justify-between"
                    >
                      <span className="text-base mb-1">🪙</span>
                      <p className="font-bold text-emerald-900 dark:text-emerald-300 text-[11px] leading-tight">
                        {lang === 'bn' ? 'ডেইলি কয়েন ও ভিআইপি' : 'Daily Coins & VIP Club'}
                      </p>
                      <span className="text-[9px] text-emerald-600 mt-0.5">{lang === 'bn' ? '৭-দিনের স্ট্রিক রিওয়ার্ড' : '7-Day Check-in Streak'}</span>
                    </button>

                    {/* 4. Live Stream Shopping */}
                    <button
                      onClick={() => { onOpenLive?.(); setShowServicesDropdown(false); }}
                      className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100/70 border border-rose-200 text-left transition flex flex-col justify-between"
                    >
                      <span className="text-base mb-1">🎥</span>
                      <p className="font-bold text-rose-900 dark:text-rose-300 text-[11px] leading-tight">
                        {lang === 'bn' ? 'লাইভ স্ট্রিম শপিং' : 'Live Stream Shop'}
                      </p>
                      <span className="text-[9px] text-rose-600 mt-0.5">{lang === 'bn' ? 'ভিডিও কমার্স ও ডিল' : 'Real-Time Video Sales'}</span>
                    </button>

                    {/* 5. Live DEX Tracking */}
                    <Link
                      to="/track-order"
                      onClick={() => setShowServicesDropdown(false)}
                      className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100/70 border border-blue-200 text-left transition flex flex-col justify-between"
                    >
                      <span className="text-base mb-1">🚚</span>
                      <p className="font-bold text-blue-900 dark:text-blue-300 text-[11px] leading-tight">
                        {lang === 'bn' ? 'অর্ডার লাইভ ট্র্যাকিং' : 'Live DEX GPS Tracking'}
                      </p>
                      <span className="text-[9px] text-blue-600 mt-0.5">{lang === 'bn' ? '২৪ ঘণ্টার সুপার ডেলিভারি' : 'Real-Time Rider Status'}</span>
                    </Link>

                    {/* 6. AI Virtual Try-On */}
                    <button
                      onClick={() => { onOpenTryOn?.(); setShowServicesDropdown(false); }}
                      className="p-2.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 hover:bg-cyan-100/70 border border-cyan-200 text-left transition flex flex-col justify-between"
                    >
                      <span className="text-base mb-1">🥼</span>
                      <p className="font-bold text-cyan-900 dark:text-cyan-300 text-[11px] leading-tight">
                        {lang === 'bn' ? 'ভার্চুয়াল ট্রাই-অন (AR)' : 'Virtual Try-On AR'}
                      </p>
                      <span className="text-[9px] text-cyan-600 mt-0.5">{lang === 'bn' ? 'পোশাক ও চশমা ট্রায়াল' : '3D Studio Experience'}</span>
                    </button>
                  </div>

                  {/* Head Office & Hotline Footer */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-2xl text-[10px] space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-800 dark:text-white">
                      <span>🏢 {lang === 'bn' ? 'হেড অফিস:' : 'Head Office:'}</span>
                      <span className="text-emerald-700">{lang === 'bn' ? 'রৌমারী, কুড়িগ্রাম, রংপুর' : 'Rowmari, Kurigram, Rangpur'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>📞 24/7 Helpline:</span>
                      <strong className="text-emerald-700 font-mono">01942791004</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right: Deliver to 64-District Selector */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs py-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-400 font-semibold leading-none">{lang === 'bn' ? 'ডেলিভারি এরিয়া:' : 'Deliver to:'}</span>
              <button
                onClick={() => setShowLocationModal(true)}
                className="text-slate-800 dark:text-white font-black hover:text-emerald-700 flex items-center gap-1 text-xs underline underline-offset-2 transition"
              >
                <span>{deliveryLocation}</span>
                <ChevronDown className="w-3 h-3 text-emerald-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive 64-District Location Selector Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {lang === 'bn' ? 'ডেলিভারি এরিয়া ও শিপিং ক্যালকুলেটর' : 'Select Delivery Location & Shipping Calculator'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {lang === 'bn' ? 'বাংলাদেশের ৬৪ জেলায় দ্রুততম এক্সপ্রেস ডেলিভারি' : 'Express Doorstep Delivery Across all 64 Districts'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Popular Locations */}
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                {lang === 'bn' ? 'জনপ্রিয় ডেলিভারি জোন ও রেট:' : 'Popular Delivery Zones & Rates:'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { name: 'Dhaka, Dhanmondi', tag: 'Inside Dhaka • 24h', fee: '৳60', isDhaka: true },
                  { name: 'Dhaka, Gulshan', tag: 'Inside Dhaka • 24h', fee: '৳60', isDhaka: true },
                  { name: 'Dhaka, Uttara', tag: 'Inside Dhaka • 24h', fee: '৳60', isDhaka: true },
                  { name: 'Dhaka, Mirpur', tag: 'Inside Dhaka • 24h', fee: '৳60', isDhaka: true },
                  { name: 'Chattogram City', tag: 'Outside Dhaka • 48h', fee: '৳120', isDhaka: false },
                  { name: 'Sylhet, Zindabazar', tag: 'Outside Dhaka • 48h', fee: '৳120', isDhaka: false },
                  { name: 'Rajshahi Sadar', tag: 'Outside Dhaka • 48h', fee: '৳120', isDhaka: false },
                  { name: 'Khulna City', tag: 'Outside Dhaka • 48h', fee: '৳120', isDhaka: false },
                  { name: 'Rowmari, Kurigram', tag: 'Outside Dhaka • 48h', fee: '৳120', isDhaka: false },
                  { name: 'Rangpur City', tag: 'Outside Dhaka • 48h', fee: '৳120', isDhaka: false },
                  { name: 'Barishal City', tag: 'Outside Dhaka • 48h', fee: '৳120', isDhaka: false },
                  { name: 'Mymensingh City', tag: 'Outside Dhaka • 48h', fee: '৳120', isDhaka: false },
                ].map((loc) => (
                  <button
                    key={loc.name}
                    onClick={() => {
                      setDeliveryLocation(loc.name);
                      localStorage.setItem('shopx_delivery_location', loc.name);
                      useCartStore.getState().setDeliveryZone(loc.isDhaka ? 'inside_dhaka' : 'outside_dhaka');
                      setShowLocationModal(false);
                    }}
                    className={`p-2.5 rounded-2xl text-left border transition flex flex-col justify-between ${
                      deliveryLocation === loc.name
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30 font-bold'
                        : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 text-slate-700 dark:text-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <span className="font-extrabold text-xs truncate">{loc.name}</span>
                    <div className="flex items-center justify-between text-[10px] text-emerald-700 dark:text-emerald-400 mt-1">
                      <span>{loc.tag}</span>
                      <span className="font-mono font-black">{loc.fee}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Guarantee Info Card */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 dark:text-white">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'bn' ? 'ডেলিভারি চার্জ রেট:' : 'Delivery Charge Rate:'}</span>
                </span>
                <span className="text-emerald-700 font-mono font-black">
                  {deliveryLocation.toLowerCase().includes('dhaka') ? (lang === 'bn' ? '৳৬০ (ঢাকার ভেতরে ২৪ ঘণ্টা)' : '৳60 (Inside Dhaka • 24h Express)') : (lang === 'bn' ? '৳১২০ (ঢাকার বাইরে ৪৮-৭২ ঘণ্টা)' : '৳120 (Outside Dhaka • 48-72h Express)')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                ✓ {lang === 'bn' ? 'ক্যাশ অন ডেলিভারি (পণ্য দেখে মূল্য পরিশোধ)' : 'Cash on Delivery (Pay after inspecting product)'} • ✓ {lang === 'bn' ? '৭ দিনের সহজ রিটার্ন গ্যারান্টি' : '7-Day Easy Returns Guarantee'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Image Search Modal */}
      <ImageSearchModal
        isOpen={isImageSearchOpen}
        onClose={() => setIsImageSearchOpen(false)}
      />
    </header>
  );
};
