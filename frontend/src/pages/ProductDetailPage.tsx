import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  ShoppingBag,
  Eye,
  CheckCircle2,
  Share2,
  Sparkles,
  MapPin,
  Clock,
  Award,
} from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';
import { useCartStore } from '../store/useCartStore';
import { getSafeImage } from '../utils/image';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useRecentViewedStore } from '../store/useRecentViewedStore';
import { QuickOrderModal } from '../components/QuickOrderModal';
import { ProductCard } from '../components/ProductCard';
import { ProductReviewsSection } from '../components/ProductReviewsSection';
import { ProductQASection } from '../components/ProductQASection';
import { LabCertificateModal } from '../components/LabCertificateModal';
import { EMICalculatorModal } from '../components/EMICalculatorModal';
import { PriceDropAlertModal } from '../components/PriceDropAlertModal';
import { ShareProductModal } from '../components/ShareProductModal';
import { Product360ViewModal } from '../components/Product360ViewModal';
import { SizeAdvisorModal } from '../components/SizeAdvisorModal';
import { AIVirtualTryOnModal } from '../components/AIVirtualTryOnModal';
import { B2BWholesaleQuoteModal } from '../components/B2BWholesaleQuoteModal';
import { DeviceExchangeModal } from '../components/DeviceExchangeModal';
import { GiftWrapModal } from '../components/GiftWrapModal';
import { ReturnExchangeModal } from '../components/ReturnExchangeModal';
import { UnboxingProofModal } from '../components/UnboxingProofModal';
import { BellRing, Volume2, VolumeX, RotateCw, Ruler, Glasses, Building2, RefreshCw, PackageCheck, Gift } from 'lucide-react';

const bdDistricts = [
  { name: 'ঢাকা (Dhaka)', fee: 60, timeBn: '২৪ ঘণ্টার মধ্যে (আগামীকাল)', timeEn: 'Within 24 Hours (Tomorrow)' },
  { name: 'চট্টগ্রাম (Chattogram)', fee: 120, timeBn: '২-৩ দিনের মধ্যে', timeEn: 'Within 2-3 Days' },
  { name: 'সিলেট (Sylhet)', fee: 120, timeBn: '২-৩ দিনের মধ্যে', timeEn: 'Within 2-3 Days' },
  { name: 'রাজশাহী (Rajshahi)', fee: 120, timeBn: '২-৩ দিনের মধ্যে', timeEn: 'Within 2-3 Days' },
  { name: 'খুলনা (Khulna)', fee: 120, timeBn: '২-৩ দিনের মধ্যে', timeEn: 'Within 2-3 Days' },
  { name: 'বরিশাল (Barishal)', fee: 120, timeBn: '২-৩ দিনের মধ্যে', timeEn: 'Within 2-3 Days' },
  { name: 'রংপুর (Rangpur)', fee: 120, timeBn: '২-৩ দিনের মধ্যে', timeEn: 'Within 2-3 Days' },
  { name: 'ময়মনসিংহ (Mymensingh)', fee: 120, timeBn: '২-৩ দিনের মধ্যে', timeEn: 'Within 2-3 Days' },
  { name: 'অন্যান্য সব জেলা (Other Districts)', fee: 120, timeBn: '২-৩ দিনের মধ্যে', timeEn: 'Within 2-3 Days' },
];

import { useProductStore } from '../store/useProductStore';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCartStore();
  const { lang } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();
  const { addProduct: recordView } = useRecentViewedStore();

  const cachedProduct = useProductStore.getState().products.find((p) => p.slug === slug);
  const [product, setProduct] = useState<Product | null>(() => cachedProduct || null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>(() => {
    if (cachedProduct) {
      return useProductStore.getState().products.filter((p) => p._id !== cachedProduct._id).slice(0, 4);
    }
    return [];
  });
  const [activeImage, setActiveImage] = useState(() => (cachedProduct ? (cachedProduct.thumbnail || cachedProduct.images[0]) : ''));
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(bdDistricts[0]);
  const [isLoading, setIsLoading] = useState(!cachedProduct);
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [isEMIModalOpen, setIsEMIModalOpen] = useState(false);
  const [isPriceDropModalOpen, setIsPriceDropModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [is360Open, setIs360Open] = useState(false);
  const [isSizeAdvisorOpen, setIsSizeAdvisorOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [isB2BQuoteOpen, setIsB2BQuoteOpen] = useState(false);
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [isGiftWrapOpen, setIsGiftWrapOpen] = useState(false);
  const [isUnboxingOpen, setIsUnboxingOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);

  const price = product?.price || 0;
  const discountPrice = product?.discountPrice;
  const unitPrice = discountPrice || price;

  const handleToggleVoiceReader = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const titleText = lang === 'bn' && product?.banglaTitle ? product.banglaTitle : product?.title;
    const descText = lang === 'bn' && product?.banglaDescription ? product.banglaDescription : product?.shortDescription;
    const textToSpeak = `${titleText}. মূল্য ${unitPrice} টাকা. ${descText}. ২৪ ঘণ্টার মধ্যে দ্রুত হোম ডেলিভারি এবং ক্যাশ অন ডেলিভারি সুবিধা রয়েছে।`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/products/slug/${slug}`);
        if (res.data.success) {
          setProduct(res.data.data);
          recordView(res.data.data);
          setActiveImage(res.data.data.thumbnail || res.data.data.images[0]);
          setRelatedProducts(res.data.relatedProducts || []);
          if (res.data.data.variants?.[0]?.options?.[0]) {
            setSelectedVariant(res.data.data.variants[0].options[0].title);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchProduct();
  }, [slug]);

  if (isLoading) {
    return <div className="text-center py-20 text-slate-500 font-bold">{lang === 'bn' ? 'লোড হচ্ছে...' : 'Loading product details...'}</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-black text-white">{lang === 'bn' ? 'পণ্য পাওয়া যায়নি' : 'Product Not Found'}</h2>
        <Link to="/products" className="text-orange-400 font-bold underline mt-2 block">
          {lang === 'bn' ? 'অন্য পণ্য দেখুন' : 'Explore all products'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Product Main Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square bg-[#f8fafc] rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
            <img
              src={getSafeImage(activeImage || product.thumbnail || product.images?.[0])}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition ${
                    activeImage === img ? 'border-emerald-600 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={getSafeImage(img)} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: Details (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            {/* Badges, Voice Reader & Share */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex flex-wrap items-center gap-2">
                {product.isOrganic && (
                  <button
                    onClick={() => setIsLabModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md transition"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{lang === 'bn' ? '১০০% খাঁটি (ল্যাব সার্টিফিকেট দেখুন ↗)' : '100% Organic (Lab Certified ↗)'}</span>
                  </button>
                )}
                <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'bn' ? '৫৪ জন এই মুহূর্তে দেখছেন' : '54 shoppers viewing now'}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* 360 3D View Button */}
                <button
                  type="button"
                  onClick={() => setIs360Open(true)}
                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition"
                  title="Interactive 360° 3D View"
                >
                  <RotateCw className="w-4 h-4" />
                  <span className="hidden sm:inline">360° 3D</span>
                </button>

                {/* AI Size Advisor Button */}
                <button
                  type="button"
                  onClick={() => setIsSizeAdvisorOpen(true)}
                  className="p-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-bold flex items-center gap-1.5 transition"
                  title="AI Size & Fit Advisor"
                >
                  <Ruler className="w-4 h-4" />
                  <span className="hidden sm:inline">{lang === 'bn' ? 'সাইজ গাইড' : 'Size Guide'}</span>
                </button>

                {/* Voice Product Reader Button */}
                <button
                  type="button"
                  onClick={handleToggleVoiceReader}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
                    isSpeaking
                      ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                  title={isSpeaking ? 'বন্ধ করুন' : 'অডিওতে শুনুন (Voice Reader)'}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
                  <span className="hidden sm:inline">{isSpeaking ? (lang === 'bn' ? 'থামুন' : 'Stop') : (lang === 'bn' ? 'শুনে নিন' : 'Listen')}</span>
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
                  title="Share Product"
                >
                  <Share2 className="w-4 h-4 text-slate-600" />
                  <span className="hidden sm:inline">{lang === 'bn' ? 'শেয়ার' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {lang === 'bn' && product.banglaTitle ? product.banglaTitle : product.title}
            </h1>

            {/* Ratings & SKU */}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-extrabold text-slate-900">
                  {product.rating || 4.9}
                </span>
                <span className="text-slate-500">({product.soldCount || 10}+ {lang === 'bn' ? 'বিক্রিত' : 'sold'})</span>
              </div>
              <span className="text-slate-500">SKU: <strong className="text-slate-700 font-mono">{product.sku}</strong></span>
              <span className="text-slate-500">{lang === 'bn' ? 'ব্র্যান্ড:' : 'Brand:'} <strong className="text-emerald-700">{product.brand || 'Antixor Fresh'}</strong></span>
            </div>

            {/* Price Box */}
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-emerald-800 font-mono">
                {formatPrice(unitPrice)}
              </span>
              {discountPrice && discountPrice < price && (
                <span className="text-sm text-slate-400 line-through font-mono">
                  {formatPrice(price)}
                </span>
              )}
              {discountPrice && discountPrice < price && (
                <span className="bg-rose-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-md">
                  -{Math.round(((price - discountPrice) / price) * 100)}% {lang === 'bn' ? 'ছাড়' : 'OFF'}
                </span>
              )}
            </div>

            {/* AI Review Summary Box */}
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
              <p className="text-xs text-purple-900 leading-relaxed">
                {lang === 'bn'
                  ? '🤖 AI রিভিউ সারসংক্ষেপ: ৯৮% যাচাইকৃত ক্রেতা এই পণ্যের কোয়ালিটি, টেস্ট সার্টিফিকেট ও দ্রুত ডেলিভারির প্রশংসা করেছেন।'
                  : '🤖 AI Sentiment: 98% verified buyers loved the premium quality, authentic certificate and fast delivery.'}
              </p>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed">
              {lang === 'bn' && product.banglaDescription ? product.banglaDescription : product.shortDescription}
            </p>

            {/* Interactive District Delivery Estimator */}
            <div className="mt-5 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{lang === 'bn' ? 'ডেলিভারি এরিয়া ও খরচ হিসাব:' : 'Delivery Area & Cost Estimator:'}</span>
                </span>
                <select
                  value={selectedDistrict.name}
                  onChange={(e) => {
                    const found = bdDistricts.find((d) => d.name === e.target.value);
                    if (found) setSelectedDistrict(found);
                  }}
                  className="bg-white border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-1.5 outline-none focus:border-emerald-600 font-medium"
                >
                  {bdDistricts.map((d, i) => (
                    <option key={i} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-white p-2.5 rounded-xl flex items-center gap-2 border border-slate-200">
                  <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-slate-400 text-[10px]">{lang === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Charge'}</p>
                    <p className="font-bold text-slate-800">{formatPrice(selectedDistrict.fee)}</p>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl flex items-center gap-2 border border-slate-200">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="text-slate-400 text-[10px]">{lang === 'bn' ? 'আনুমানিক সময়' : 'Est. Delivery'}</p>
                    <p className="font-bold text-slate-800 text-[11px]">
                      {lang === 'bn' ? selectedDistrict.timeBn : selectedDistrict.timeEn}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mt-5">
              <span className="text-xs font-bold text-slate-300">{lang === 'bn' ? 'পরিমাণ:' : 'Quantity:'}</span>
              <div className="flex items-center border border-slate-700 rounded-2xl overflow-hidden bg-slate-950">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-slate-800 font-bold text-white text-sm"
                >
                  -
                </button>
                <span className="px-4 font-black text-sm text-white font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-slate-800 font-bold text-white text-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setIsQuickOrderOpen(true)}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 text-sm"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>{lang === 'bn' ? '১-ক্লিকে অর্ডার (COD)' : '1-Click Quick Order (COD)'}</span>
              </button>

              <button
                onClick={() => addItem(product, quantity, selectedVariant)}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{lang === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
              </button>
            </div>

            {/* Direct WhatsApp Order Link, 0% EMI Option & Price Drop Alert */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <a
                href={`https://wa.me/8801942791004?text=${encodeURIComponent(
                  `আসসালামু আলাইকুম ShopX BD, আমি "${product.banglaTitle || product.title}" (মূল্য: ${formatPrice(unitPrice)}) পণ্যটি অর্ডার করতে চাই। লিঙ্ক: ${window.location.href}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800 text-emerald-400 text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>💬 {lang === 'bn' ? 'হোয়াটসঅ্যাপে অর্ডার' : 'WhatsApp Order'}</span>
              </a>

              <button
                type="button"
                onClick={() => setIsEMIModalOpen(true)}
                className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'bn' ? '০% EMI কিস্তি' : '0% EMI Plan'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPriceDropModalOpen(true)}
                className="py-2.5 px-3 rounded-2xl bg-amber-950/30 hover:bg-amber-900/40 border border-amber-800/60 text-amber-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'দাম কমলে অ্যালার্ট' : 'Price Drop Alert'}</span>
              </button>
            </div>

            {/* Exclusive ShopX Innovation Suite Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsTryOnOpen(true)}
                className="p-2.5 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Glasses className="w-3.5 h-3.5 text-purple-400" />
                <span>{lang === 'bn' ? 'এআই ট্রাই-অন (AR)' : 'AI Virtual Try-On'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsExchangeOpen(true)}
                className="p-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'bn' ? 'ডিভাইস এক্সচেঞ্জ' : 'Trade-In Discount'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsB2BQuoteOpen(true)}
                className="p-2.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm col-span-2 sm:col-span-1"
              >
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'bn' ? 'B2B পাইকারি কোটেশন' : 'B2B Bulk Quote'}</span>
              </button>
            </div>

            {/* Open Box Guarantee & Gift Wrap Quick Triggers */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setIsUnboxingOpen(true)}
                className="hover:text-white flex items-center gap-1 transition text-emerald-400 font-bold"
              >
                <PackageCheck className="w-4 h-4" />
                <span>{lang === 'bn' ? 'প্যাকেট খুলে চেক করার নিয়ম' : 'Open Parcel Guarantee'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsGiftWrapOpen(true)}
                className="hover:text-white flex items-center gap-1 transition text-pink-400 font-bold"
              >
                <Gift className="w-4 h-4" />
                <span>{lang === 'bn' ? 'উপহার পাঠান' : 'Send as Gift'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsReturnOpen(true)}
                className="hover:text-white flex items-center gap-1 transition text-amber-400 font-bold hidden sm:flex"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'bn' ? '৭ দিনে রিটার্ন ও রিফান্ড' : '7-Day Return'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ShopX vs Traditional E-Commerce Superiority Guarantee */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500 text-slate-950 rounded-xl font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {lang === 'bn' ? 'কেন ShopX BD সাধারণ ই-কমার্সের চেয়ে বহুগুণে বিশ্বস্ত ও সেরা?' : 'Why ShopX BD is Superior to Traditional E-Commerce?'}
                </h3>
                <p className="text-xs text-emerald-400 font-medium">
                  {lang === 'bn' ? '১০০% ঝুঁকিহীন শপিং, ওপেন বক্স যাচাই ও অফিশিয়াল অথেনটিসিটি নিশ্চয়তা' : '100% Risk-Free Shopping, Open-Box Check & Authentic Guarantee'}
                </p>
              </div>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold font-mono">
              ★ OFFICIAL MALL VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-emerald-500/20 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <PackageCheck className="w-5 h-5" />
                <h4 className="font-extrabold text-xs text-white">
                  {lang === 'bn' ? '১. ওপেন বক্স চেক ডেলিভারি' : '1. Open-Box Inspection'}
                </h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {lang === 'bn'
                  ? 'ডেলিভারি রাইডারের সামনে প্যাকেট খুলে পণ্য ও কোয়ালিটি নিশ্চিত হয়ে ক্যাশ অন ডেলিভারি পরিশোধের শতভাগ সুযোগ।'
                  : 'Open & verify parcel contents in front of rider before paying Cash on Delivery.'}
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-emerald-500/20 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2 text-amber-400">
                <Truck className="w-5 h-5" />
                <h4 className="font-extrabold text-xs text-white">
                  {lang === 'bn' ? '২. নিশ্চিত দ্রুততম ডেলিভারি' : '2. 24H Express Delivery'}
                </h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {lang === 'bn'
                  ? 'ঢাকা সিটিতে ২৪ ঘণ্টায় এবং দেশের ৬৩ জেলায় ৪৮-৭২ ঘণ্টায় লাইভ GPS ট্র্যাকিং সহ গ্যারান্টেড হোম ডেলিভারি।'
                  : 'Guaranteed 24h in Dhaka, 48-72h nationwide with live GPS rider tracking.'}
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-emerald-500/20 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2 text-purple-400">
                <Award className="w-5 h-5" />
                <h4 className="font-extrabold text-xs text-white">
                  {lang === 'bn' ? '৩. BSTI ও BCSIR সনদ' : '3. 100% Lab Tested'}
                </h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {lang === 'bn'
                  ? 'খাদ্যপণ্যে শতভাগ খাঁটি ল্যাব সার্টিফিকেট এবং গ্যাজেটে অফিশিয়াল ১-২ বছরের ব্র্যান্ড ওয়ারেন্টি কার্ড।'
                  : 'Govt. lab purity tested organics & 100% genuine brand warranty for electronics.'}
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-emerald-500/20 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2 text-cyan-400">
                <RotateCcw className="w-5 h-5" />
                <h4 className="font-extrabold text-xs text-white">
                  {lang === 'bn' ? '৪. ৭ দিনের ফ্রি রিটার্ন' : '4. 7-Day Free Return'}
                </h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {lang === 'bn'
                  ? 'পণ্য অপছন্দ বা ডিফেক্ট হলে ৭ দিনের মধ্যে ডোরস্টেপ ফ্রি রিটার্ন ও ইনস্ট্যান্ট রিফান্ড সুবিধা।'
                  : 'Hassle-free 7-day doorstep replacement & instant money-back guarantee.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Full Description Tab */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <h3 className="text-base sm:text-lg font-black text-white mb-4">
          {lang === 'bn' ? 'পণ্যের বিস্তারিত বিবরণ (Description)' : 'Product Specifications & Details'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
      </div>

      {/* Customer Verified Reviews & Ratings */}
      <ProductReviewsSection
        productId={product._id}
        productRating={product.rating}
        numReviews={product.numReviews}
      />

      {/* Daraz-style Product Q&A Community */}
      <ProductQASection productId={product._id} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-black text-white">
            {lang === 'bn' ? 'সম্পর্কিত অন্যান্য পণ্য' : 'Related Similar Products'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* 1-Click Fast Order Modal */}
      {isQuickOrderOpen && (
        <QuickOrderModal
          product={product}
          onClose={() => setIsQuickOrderOpen(false)}
        />
      )}

      {/* Lab Test Quality Certificate Modal */}
      <LabCertificateModal
        isOpen={isLabModalOpen}
        onClose={() => setIsLabModalOpen(false)}
        productTitle={product.banglaTitle || product.title}
      />

      {/* 0% EMI Calculator Modal */}
      <EMICalculatorModal
        isOpen={isEMIModalOpen}
        onClose={() => setIsEMIModalOpen(false)}
        price={unitPrice}
      />

      {/* Price Drop Alert Modal */}
      <PriceDropAlertModal
        isOpen={isPriceDropModalOpen}
        onClose={() => setIsPriceDropModalOpen(false)}
        productName={product.banglaTitle || product.title}
        currentPrice={unitPrice}
        productImage={activeImage}
      />

      {/* AI Virtual Try-On AR Studio Modal */}
      <AIVirtualTryOnModal
        isOpen={isTryOnOpen}
        onClose={() => setIsTryOnOpen(false)}
        productName={product.banglaTitle || product.title}
        productPrice={unitPrice}
        productImage={activeImage}
      />

      {/* B2B Wholesale & Corporate Quotation Modal */}
      <B2BWholesaleQuoteModal
        isOpen={isB2BQuoteOpen}
        onClose={() => setIsB2BQuoteOpen(false)}
        productName={product.banglaTitle || product.title}
        unitPrice={unitPrice}
      />

      {/* Old Device Exchange Trade-In Modal */}
      <DeviceExchangeModal
        isOpen={isExchangeOpen}
        onClose={() => setIsExchangeOpen(false)}
      />

      {/* Send as a Gift & Ribbon Wrapping Modal */}
      <GiftWrapModal
        isOpen={isGiftWrapOpen}
        onClose={() => setIsGiftWrapOpen(false)}
      />

      {/* Open Box Parcel Inspection Checklist Modal */}
      <UnboxingProofModal
        isOpen={isUnboxingOpen}
        onClose={() => setIsUnboxingOpen(false)}
      />

      {/* 7-Day Return & Instant Refund Request Portal */}
      <ReturnExchangeModal
        isOpen={isReturnOpen}
        onClose={() => setIsReturnOpen(false)}
      />

      {/* 360 Degree Interactive 3D Viewer Modal */}
      <Product360ViewModal
        isOpen={is360Open}
        onClose={() => setIs360Open(false)}
        productTitle={product.banglaTitle || product.title}
        images={product.images}
      />

      {/* AI Smart Size & Fit Advisor Modal */}
      <SizeAdvisorModal
        isOpen={isSizeAdvisorOpen}
        onClose={() => setIsSizeAdvisorOpen(false)}
        productType={product.categorySlug === 'fashion-lifestyle' ? 'panjabi' : 'general'}
        onSelectSize={(s) => setSelectedVariant(s)}
      />

      {/* Share Product Modal */}
      <ShareProductModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={lang === 'bn' && product.banglaTitle ? product.banglaTitle : product.title}
        url={window.location.href}
      />

      {/* Persistent Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-3 flex items-center gap-2 md:hidden">
        <button
          onClick={() => addItem(product, quantity, selectedVariant)}
          className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-orange-400 font-black text-xs rounded-2xl flex items-center justify-center gap-1.5 border border-slate-800"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{lang === 'bn' ? 'কার্ট (+১)' : 'Cart (+1)'}</span>
        </button>

        <button
          onClick={() => setIsQuickOrderOpen(true)}
          className="flex-[2] py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-xs rounded-2xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/30"
        >
          <Zap className="w-4 h-4 fill-slate-950" />
          <span>{lang === 'bn' ? `১-ক্লিকে অর্ডার (${formatPrice(unitPrice)})` : `Buy Now (${formatPrice(unitPrice)})`}</span>
        </button>
      </div>
    </div>
  );
};
