import React, { useState, useEffect } from 'react';
import { X, Heart, MessageCircle, Send, ShoppingBag, Zap, Eye, Volume2, VolumeX, Sparkles, Share2 } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useCartStore } from '../store/useCartStore';
import { getSafeImage } from '../utils/image';

interface LiveStreamShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickOrder?: (product: any) => void;
}

const mockComments = [
  { user: 'Tanvir Hossain', text: 'মধুটার টেস্ট কেমন ভাই? ল্যাব টেস্ট করা?', time: 'just now', badge: 'VIP' },
  { user: 'Sultana Razia', text: 'আইফোন ১৬ প্রো ম্যাক্সের সাথে কি অরিজিনাল কেবল আছে?', time: 'just now', badge: 'Buyer' },
  { user: 'Rahim Ahmed', text: 'ঢাকার বাইরে কত দিনে পাবো?', time: '1s ago', badge: 'VIP' },
  { user: 'Kazi Farhan', text: 'আমি এইমাত্র ২টা অর্ডার কনফার্ম করলাম! 🔥', time: '3s ago', badge: 'Top Fan' },
  { user: 'Mehedi Hasan', text: 'সরিষার তেলের ঝাঁঝ কেমন ভাই?', time: '5s ago', badge: 'Buyer' },
];

export const LiveStreamShopModal: React.FC<LiveStreamShopModalProps> = ({
  isOpen,
  onClose,
  onQuickOrder,
}) => {
  const { lang } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();
  const { addItem } = useCartStore();

  const [viewerCount, setViewerCount] = useState(1482);
  const [likesCount, setLikesCount] = useState(8920);
  const [hearts, setHearts] = useState<{ id: number; left: number }[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [commentsList, setCommentsList] = useState(mockComments);
  const [isMuted, setIsMuted] = useState(true);

  // Featured live pinned item
  const pinnedProduct = {
    _id: 'live-featured-01',
    title: 'Apple iPhone 16 Pro Max (256GB Desert Titanium)',
    banglaTitle: 'অ্যাপল আইফোন ১৬ প্রো ম্যাক্স (২৫৬ জিবি)',
    price: 185000,
    discountPrice: 169900,
    thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    slug: 'apple-iphone-16-pro-max-256gb',
  };

  // Simulate viewer count fluctuation
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 7) - 3);
    }, 3000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setCommentsList((prev) => [
      { user: 'You', text: commentInput.trim(), time: 'just now', badge: 'You' },
      ...prev.slice(0, 10),
    ]);
    setCommentInput('');
  };

  const triggerHeartBurst = () => {
    setLikesCount((prev) => prev + 1);
    const newHeart = { id: Date.now() + Math.random(), left: 40 + Math.random() * 40 };
    setHearts((prev) => [...prev.slice(-15), newHeart]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg h-[92vh] sm:h-[86vh] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Background Live Stream Video Simulation */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80"
            alt="Live Stream Host"
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
        </div>

        {/* Top Floating Info Bar */}
        <div className="relative z-10 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center space-x-1.5 bg-red-600 text-white font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider animate-pulse shadow-lg shadow-red-600/40">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>LIVE</span>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 px-3 py-1 rounded-full flex items-center space-x-1.5 text-xs text-slate-200">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold">{viewerCount.toLocaleString()} {lang === 'bn' ? 'দর্শক' : 'watching'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Floating Heart Animations */}
        <div className="absolute right-6 bottom-44 z-20 pointer-events-none h-60 w-32 overflow-hidden">
          {hearts.map((h) => (
            <div
              key={h.id}
              style={{ left: `${h.left}%` }}
              className="absolute bottom-0 text-rose-500 animate-floatUp"
            >
              <Heart className="w-6 h-6 fill-rose-500 stroke-rose-400" />
            </div>
          ))}
        </div>

        {/* Bottom Interactive Zone */}
        <div className="relative z-10 p-4 space-y-3">
          {/* Pinned Product Card */}
          <div className="bg-slate-900/95 backdrop-blur-md border border-orange-500/40 rounded-2xl p-3 flex items-center justify-between shadow-2xl">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <img
                src={getSafeImage(pinnedProduct.thumbnail)}
                alt={pinnedProduct.title}
                className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                  🔥 লাইভ স্পেশাল ডিল
                </span>
                <p className="text-xs font-bold text-slate-100 truncate mt-1">
                  {lang === 'bn' ? pinnedProduct.banglaTitle : pinnedProduct.title}
                </p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-sm font-black text-orange-400">
                    {formatPrice(pinnedProduct.discountPrice)}
                  </span>
                  <span className="text-[11px] text-slate-500 line-through">
                    {formatPrice(pinnedProduct.price)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0 pl-2">
              <button
                onClick={() => {
                  if (onQuickOrder) onQuickOrder(pinnedProduct);
                }}
                className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center space-x-1"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>{lang === 'bn' ? 'অর্ডার' : 'Buy'}</span>
              </button>
            </div>
          </div>

          {/* Real-time Comments Stream */}
          <div className="h-28 overflow-y-auto space-y-1.5 custom-scrollbar pr-1 flex flex-col-reverse">
            {commentsList.map((c, i) => (
              <div
                key={i}
                className="bg-slate-950/70 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2 border border-slate-800/60"
              >
                <span className="font-bold text-orange-400 text-[11px] shrink-0">{c.user}:</span>
                <span className="text-slate-200 text-xs truncate flex-1">{c.text}</span>
              </div>
            ))}
          </div>

          {/* Comment Form & Like Reaction Burst Button */}
          <div className="flex items-center space-x-2">
            <form onSubmit={handleSendComment} className="flex-1 flex items-center space-x-1.5">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder={lang === 'bn' ? 'হোস্টকে কিছু জিজ্ঞাসা করুন...' : 'Ask the host a question...'}
                className="flex-1 bg-slate-900/90 border border-slate-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 rounded-xl font-bold transition shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <button
              type="button"
              onClick={triggerHeartBurst}
              className="p-2.5 bg-rose-600/90 hover:bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-600/30 transition transform active:scale-90 shrink-0 flex items-center space-x-1"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span className="text-[11px] font-bold">{likesCount.toLocaleString()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
