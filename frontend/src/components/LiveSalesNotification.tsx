import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle, X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSafeImage } from '../utils/image';

interface SaleItem {
  name: string;
  location: string;
  product: string;
  price: string;
  image: string;
  timeAgo: string;
  slug: string;
}

const recentSales: SaleItem[] = [
  {
    name: 'তানভীর আহমেদ',
    location: 'ধানমন্ডি, ঢাকা',
    product: 'সুন্দরবনের খাঁটি প্রাকৃতিক মধু (৫০০ গ্রাম)',
    price: '৳৭৫০',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300',
    timeAgo: '২ মিনিট আগে',
    slug: 'sundarban-pure-honey-500g',
  },
  {
    name: 'আফরোজা সুলতানা',
    location: 'জিইসি মোড়, চট্টগ্রাম',
    product: 'ঘানি ভাঙা খাঁটি সরিষার তেল (১ লিটার)',
    price: '৳৩৮০',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300',
    timeAgo: '৪ মিনিট আগে',
    slug: 'mustard-oil-1l',
  },
  {
    name: 'মাহমুদুল হাসান',
    location: 'উত্তরা সেক্টর ৭, ঢাকা',
    product: 'TWS Pro ANC Earbuds 2026',
    price: '৳২,৪৫০',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300',
    timeAgo: '১ মিনিট আগে',
    slug: 'tws-pro-anc-earbuds-2026',
  },
  {
    name: 'সাবিহা চৌধুরী',
    location: 'উপশহর, সিলেট',
    product: 'খাঁটি গাওয়া ঘি (প্রিমিয়াম জার ৫০০ গ্রাম)',
    price: '৳১,১০০',
    image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=300',
    timeAgo: '৬ মিনিট আগে',
    slug: 'pure-cow-ghee-500g',
  },
  {
    name: 'রাকিবুল ইসলাম',
    location: 'সোনাডাঙ্গা, খুলনা',
    product: 'Ultra Watch Series 9 4G Pro',
    price: '৳৩,২০০',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300',
    timeAgo: '৩ মিনিট আগে',
    slug: 'ultra-watch-series-9-4g',
  },
  {
    name: 'ফারহানা ইসলাম',
    location: 'মতিহার, রাজশাহী',
    product: 'প্রিমিয়াম ড্রাই ফ্রুটস ও নাট মিক্স (১ কেজি)',
    price: '৳১,৪৫০',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300',
    timeAgo: '৫ মিনিট আগে',
    slug: 'premium-dry-fruits-nut-mix-1kg',
  },
];

export const LiveSalesNotification: React.FC = () => {
  const [currentSale, setCurrentSale] = useState<SaleItem | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show first after 4 seconds
    const initialTimer = setTimeout(() => {
      triggerNotification();
    }, 4000);

    // Trigger every 14 seconds
    const interval = setInterval(() => {
      triggerNotification();
    }, 14000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const triggerNotification = () => {
    const randomIndex = Math.floor(Math.random() * recentSales.length);
    setCurrentSale(recentSales[randomIndex]);
    setIsVisible(true);

    // Auto hide after 5.5 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 5500);
  };

  if (!currentSale || !isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 z-40 max-w-sm w-auto animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md border border-orange-500/30 shadow-2xl rounded-2xl p-3 flex items-center gap-3 ring-1 ring-orange-500/20 text-slate-100 hover:border-orange-500 transition cursor-pointer">
        <div className="relative flex-shrink-0">
          <img
            src={getSafeImage(currentSale.image)}
            alt={currentSale.product}
            className="w-12 h-12 rounded-xl object-cover border border-slate-700"
          />
          <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-slate-950 p-0.5 rounded-full ring-2 ring-slate-900">
            <CheckCircle className="w-3 h-3" />
          </div>
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="font-bold text-orange-400">{currentSale.name}</span>
            <span>({currentSale.location})</span>
          </div>
          <p className="font-semibold text-xs text-white truncate line-clamp-1">
            {currentSale.product}
          </p>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <span className="text-xs font-black text-amber-400 font-mono">
              {currentSale.price}
            </span>
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-orange-400" />
              {currentSale.timeAgo}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
          }}
          className="text-slate-500 hover:text-slate-300 p-1 rounded-lg"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
