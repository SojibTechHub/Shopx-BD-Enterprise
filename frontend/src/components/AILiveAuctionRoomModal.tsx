import React, { useState, useEffect } from 'react';
import {
  X,
  Gavel,
  Flame,
  Zap,
  CheckCircle2,
  Clock,
  ArrowUp,
  User,
  Sparkles,
  Trophy,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useCartStore } from '../store/useCartStore';
import { getSafeImage } from '../utils/image';

interface AILiveAuctionRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BidRecord {
  id: string;
  bidder: string;
  amount: number;
  time: string;
  isYou?: boolean;
}

export const AILiveAuctionRoomModal: React.FC<AILiveAuctionRoomModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang } = useLanguageStore();
  const { formatPrice } = useCurrencyStore();
  const { addItem, setDrawerOpen } = useCartStore();

  const [currentBid, setCurrentBid] = useState(24500);
  const [timeLeft, setTimeLeft] = useState(45);
  const [bids, setBids] = useState<BidRecord[]>([
    { id: 'b1', bidder: 'Tanvir Hossain (Gulshan)', amount: 24500, time: '2s ago' },
    { id: 'b2', bidder: 'Shahidul Islam (Uttara)', amount: 24000, time: '8s ago' },
    { id: 'b3', bidder: 'Mahmudur Rahman (Dhanmondi)', amount: 23000, time: '15s ago' },
  ]);
  const [hasWon, setHasWon] = useState(false);

  const auctionItem = {
    title: 'Sony PlayStation 5 Pro (Limited Cyber Edition + 2 Controllers)',
    banglaTitle: 'সোনি প্লেস্টেশন ৫ প্রো (লিমিটেড সাইবার এডিশন + ২ কন্ট্রোলার)',
    retailPrice: 95000,
    startingBid: 15000,
    thumbnail: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
  };

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) {
      if (timeLeft <= 0) setHasWon(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  // Simulate rival bids
  useEffect(() => {
    if (!isOpen || timeLeft <= 5 || hasWon) return;

    const rivalTimer = setTimeout(() => {
      if (Math.random() > 0.4) {
        const increment = Math.random() > 0.5 ? 500 : 1000;
        const newAmount = currentBid + increment;
        setCurrentBid(newAmount);
        setBids((prev) => [
          {
            id: 'b-' + Date.now(),
            bidder: ['Arif Chowdhury (Banani)', 'Sabbir Ahmed (Mirpur)', 'Kamrul Hasan (Sylhet)'][
              Math.floor(Math.random() * 3)
            ],
            amount: newAmount,
            time: 'just now',
          },
          ...prev.slice(0, 5),
        ]);
      }
    }, 4000);

    return () => clearTimeout(rivalTimer);
  }, [isOpen, currentBid, timeLeft, hasWon]);

  if (!isOpen) return null;

  const handlePlaceBid = (increment: number) => {
    const newAmount = currentBid + increment;
    setCurrentBid(newAmount);
    setTimeLeft((prev) => Math.min(prev + 10, 60)); // Sniping prevention adds 10s
    setBids((prev) => [
      {
        id: 'b-' + Date.now(),
        bidder: 'You (Highest Bidder 👑)',
        amount: newAmount,
        time: 'just now',
        isYou: true,
      },
      ...prev.slice(0, 5),
    ]);
  };

  const handleClaimWin = () => {
    addItem(
      {
        _id: 'auction-ps5-pro',
        title: auctionItem.title,
        price: currentBid,
        images: [auctionItem.thumbnail],
        thumbnail: auctionItem.thumbnail,
        slug: 'ps5-pro-auction',
        category: 'gaming',
        categorySlug: 'electronics-gadgets',
        stock: 1,
        sku: 'AUC-PS5-01',
      } as any,
      1
    );
    onClose();
    setDrawerOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-orange-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-orange-500/20">
            <Gavel className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-white">
                {lang === 'bn' ? 'ShopX লাইভ অকশন ও বিড ব্যাটেল রুম' : 'ShopX Live Flash Auction & Bid Battle'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-black uppercase animate-pulse">
                Live Bidding
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'bn'
                ? 'সর্বোচ্চ বিড দিয়ে অবিশ্বাস্য ডিসকাউন্টে প্রিমিয়াম প্রোডাক্ট জিতে নিন।'
                : 'Real-time competitive live auction. Place highest bid before timer hits zero!'}
            </p>
          </div>
        </div>

        {/* Auction Product Details Card */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
          <img
            src={getSafeImage(auctionItem.thumbnail)}
            alt={auctionItem.title}
            className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-slate-700 bg-slate-950 flex-shrink-0"
          />
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
              {lang === 'bn' ? 'মার্কেট রিটেইল মূল্য:' : 'Market Retail Price:'} {formatPrice(auctionItem.retailPrice)}
            </span>
            <h3 className="text-sm sm:text-base font-black text-white mt-0.5">
              {lang === 'bn' ? auctionItem.banglaTitle : auctionItem.title}
            </h3>

            {/* Timer & Current Bid Bar */}
            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <div className="bg-slate-950 border border-orange-500/40 px-3 py-1.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block">{lang === 'bn' ? 'বর্তমান সর্বোচ্চ বিড:' : 'Current Highest Bid:'}</span>
                <span className="text-lg font-black text-orange-400 font-mono">
                  {formatPrice(currentBid)}
                </span>
              </div>

              <div className="bg-slate-950 border border-red-500/40 px-3 py-1.5 rounded-xl flex items-center space-x-2">
                <Clock className="w-4 h-4 text-red-400 animate-spin" />
                <div>
                  <span className="text-[10px] text-slate-400 block">{lang === 'bn' ? 'সময় বাকি:' : 'Time Remaining:'}</span>
                  <span className="text-lg font-black text-red-400 font-mono">{timeLeft}s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Bid History Stream */}
        <div className="my-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex justify-between text-xs font-bold text-slate-400 border-b border-slate-800 pb-2">
            <span>{lang === 'bn' ? 'লাইভ বিডিং হিস্টোরি' : 'Live Bid Feed'}</span>
            <span className="text-emerald-400 font-mono">Verified Bidders</span>
          </div>

          <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar">
            {bids.map((b) => (
              <div
                key={b.id}
                className={`p-2 rounded-xl flex items-center justify-between text-xs transition ${
                  b.isYou
                    ? 'bg-orange-500/15 border border-orange-500/40 text-orange-300 font-bold'
                    : 'bg-slate-900/60 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{b.bidder}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] text-slate-500">{b.time}</span>
                  <span className="font-mono font-black text-white">{formatPrice(b.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action / Bid Controls */}
        {!hasWon ? (
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center sm:text-left">
              {lang === 'bn' ? 'আপনার বিড নির্বাচন করুন (+১০ সেকেন্ড সময় যোগ হবে):' : 'Quick Bid Increment (+10s Sniping Protection):'}
            </span>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => handlePlaceBid(200)}
                className="py-3 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs sm:text-sm rounded-xl border border-slate-700 flex items-center justify-center space-x-1.5 transition active:scale-95"
              >
                <ArrowUp className="w-4 h-4 text-emerald-400" />
                <span>+৳২০০</span>
              </button>

              <button
                onClick={() => handlePlaceBid(500)}
                className="py-3 bg-slate-800 hover:bg-slate-700 text-amber-400 font-black text-xs sm:text-sm rounded-xl border border-amber-500/30 flex items-center justify-center space-x-1.5 transition active:scale-95 shadow"
              >
                <ArrowUp className="w-4 h-4 text-amber-400" />
                <span>+৳৫০০</span>
              </button>

              <button
                onClick={() => handlePlaceBid(1000)}
                className="py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center space-x-1.5 transition active:scale-95"
              >
                <Flame className="w-4 h-4 fill-slate-950" />
                <span>+৳১,০০০</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-center space-y-3 animate-fadeIn">
            <div className="flex items-center justify-center space-x-2 text-emerald-400 font-black text-lg">
              <Trophy className="w-6 h-6" />
              <span>{lang === 'bn' ? 'অভিনন্দন! আপনি অকশন জিতেছেন!' : 'Congratulations! You Won the Auction!'}</span>
            </div>
            <p className="text-xs text-slate-300">
              Final Hammer Price: <strong className="text-orange-400 font-mono text-sm">{formatPrice(currentBid)}</strong> (You saved {formatPrice(auctionItem.retailPrice - currentBid)})
            </p>
            <button
              onClick={handleClaimWin}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm rounded-xl shadow-xl flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{lang === 'bn' ? '১-ক্লিকে চেকআউট সম্পন্ন করুন' : 'Claim & Instant Checkout'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
