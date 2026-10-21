import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  ShieldCheck,
  Coins,
  CreditCard,
  Edit3,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  Lock,
  ArrowRight,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Calendar,
  Building2,
  Navigation,
  Globe,
  Camera,
  HeartHandshake,
  Printer,
  QrCode,
  Receipt,
  BadgeCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { api } from '../services/api';
import { ThermalInvoiceModal } from '../components/ThermalInvoiceModal';
import { DigitalWarrantyLookupModal } from '../components/DigitalWarrantyLookupModal';

const BD_DIVISIONS = [
  'Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh'
];

const BD_DISTRICTS: Record<string, string[]> = {
  Rangpur: ['Kurigram', 'Rowmari', 'Rangpur', 'Dinajpur', 'Gaibandha', 'Nilphamari', 'Panchagarh', 'Thakurgaon'],
  Dhaka: ['Dhaka', 'Gazipur', 'Narayanganj', 'Tangail', 'Faridpur', 'Manikganj', 'Munshiganj', 'Narsingdi', 'Gopalganj', 'Kishoreganj', 'Madaripur', 'Rajbari', 'Shariatpur'],
  Chattogram: ['Chattogram', 'Cox\'s Bazar', 'Cumilla', 'Feni', 'Brahmanbaria', 'Noakhali', 'Chandpur', 'Lakshmipur', 'Khagrachhari', 'Rangamati', 'Bandarban'],
  Rajshahi: ['Rajshahi', 'Bogura', 'Pabna', 'Sirajganj', 'Naogaon', 'Natore', 'Chapai Nawabganj', 'Joypurhat'],
  Khulna: ['Khulna', 'Jessore', 'Kushtia', 'Satkhira', 'Bagerhat', 'Chuadanga', 'Jhenaidah', 'Magura', 'Meherpur', 'Narail'],
  Barishal: ['Barishal', 'Bhola', 'Patuakhali', 'Pirojpur', 'Barguna', 'Jhalokati'],
  Sylhet: ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
  Mymensingh: ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'],
};

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
];

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, fetchCurrentUser } = useAuthStore();
  const { lang } = useLanguageStore();
  const isBn = lang === 'bn';
  const { formatPrice } = useCurrencyStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'security'>('profile');

  // Personal Info Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [dob, setDob] = useState('');
  const [division, setDivision] = useState('Rangpur');
  const [district, setDistrict] = useState('Rowmari');
  const [upazila, setUpazila] = useState('Rowmari Sadar');
  const [bio, setBio] = useState('');
  const [addresses, setAddresses] = useState<any[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addrTitle, setAddrTitle] = useState('Home');
  const [addrRecipient, setAddrRecipient] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrDivision, setAddrDivision] = useState('Rangpur');
  const [addrDistrict, setAddrDistrict] = useState('Rowmari');
  const [addrUpazila, setAddrUpazila] = useState('Rowmari');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Password Reset State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingResetOtp, setIsSendingResetOtp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [resetCountdown, setResetCountdown] = useState(0);

  // Invoice & Warranty Modals State
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isWarrantyOpen, setIsWarrantyOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setName(user.name || '');
    setPhone(user.phone || '');
    setAvatar(user.avatar || '');
    setGender(user.gender || 'male');
    setDob(user.dob || '');
    setDivision(user.division || 'Rangpur');
    setDistrict(user.district || 'Rowmari');
    setUpazila(user.upazila || 'Rowmari Sadar');
    setBio(user.bio || '');
    setAddresses(Array.isArray(user.addresses) ? user.addresses : []);
    setAddrRecipient(user.name || '');
    setAddrPhone(user.phone || '');
    fetchOrders();
  }, [user]);

  useEffect(() => {
    let timer: any = null;
    if (resetCountdown > 0) {
      timer = setInterval(() => setResetCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resetCountdown]);

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const res = await api.get('/orders/my-orders');
      if (res.data?.success) {
        const orderList = Array.isArray(res.data.orders)
          ? res.data.orders
          : Array.isArray(res.data.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];
        setOrders(orderList);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setOrders([
        {
          _id: 'SX-889894',
          totalAmount: 3490,
          status: 'out_for_delivery',
          paymentMethod: 'Cash on Delivery (COD)',
          createdAt: new Date().toISOString(),
          deliveryHub: 'Banani Central Hub (DEX-North)',
          rider: { name: 'Karim Ullah (DEX)', phone: '01712-345678' },
          items: [
            { title: 'Pure Sundarban Honey 1kg', quantity: 2, price: 1200 },
            { title: 'Organic Chia Seeds 500g', quantity: 1, price: 1090 },
          ],
        },
        {
          _id: 'SX-774120',
          totalAmount: 1850,
          status: 'delivered',
          paymentMethod: 'bKash Paid (Online)',
          createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
          items: [
            { title: 'T900 Ultra Smartwatch Series 9', quantity: 1, price: 1850 },
          ],
        },
      ]);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await api.put('/auth/profile', {
        name,
        phone,
        avatar,
        gender,
        dob,
        division,
        district,
        upazila,
        bio,
        addresses,
      });

      if (res.data.success) {
        setSaveSuccess(true);
        fetchCurrentUser();
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        setTimeout(() => setSaveSuccess(false), 3500);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Profile update failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr = {
      title: addrTitle,
      name: addrRecipient || name,
      phone: addrPhone || phone,
      division: addrDivision,
      district: addrDistrict,
      upazila: addrUpazila,
      street: addrStreet,
      landmark: addrLandmark,
      isDefault: addrIsDefault || addresses.length === 0,
    };

    const updatedAddresses = addrIsDefault
      ? [...addresses.map((a) => ({ ...a, isDefault: false })), newAddr]
      : [...addresses, newAddr];

    setAddresses(updatedAddresses);
    setShowAddressModal(false);
    setAddrStreet('');
    setAddrLandmark('');

    try {
      await api.put('/auth/profile', { addresses: updatedAddresses });
      fetchCurrentUser();
      confetti({ particleCount: 50, spread: 45, origin: { y: 0.6 } });
    } catch {}
  };

  const handleRemoveAddress = async (index: number) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
    try {
      await api.put('/auth/profile', { addresses: updated });
      fetchCurrentUser();
    } catch {}
  };

  const handleSetDefaultAddress = async (index: number) => {
    const updated = addresses.map((a, i) => ({
      ...a,
      isDefault: i === index,
    }));
    setAddresses(updated);
    try {
      await api.put('/auth/profile', { addresses: updated });
      fetchCurrentUser();
    } catch {}
  };

  // Password reset through Real 6-Digit Email OTP
  const handleSendResetCode = async () => {
    if (!user?.email) return;
    setIsSendingResetOtp(true);
    setPasswordErr('');
    setPasswordMsg('');

    try {
      const res = await api.post('/auth/forgot-password', {
        email: user.email,
        lang,
      });

      if (res.data.success) {
        setIsOtpSent(true);
        setResetCountdown(60);
        setPasswordMsg(res.data.message);
      }
    } catch (err: any) {
      setPasswordErr(err.response?.data?.message || 'Failed to send reset code.');
    } finally {
      setIsSendingResetOtp(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordErr(isBn ? 'নতুন পাসওয়ার্ড দুটি মিলছে না।' : 'Passwords do not match.');
      return;
    }

    setIsResetting(true);
    setPasswordErr('');

    try {
      const res = await api.post('/auth/reset-password', {
        email: user?.email,
        otp: resetOtp.trim(),
        newPassword,
        lang,
      });

      if (res.data.success) {
        setPasswordMsg(res.data.message);
        setNewPassword('');
        setConfirmPassword('');
        setResetOtp('');
        setIsOtpSent(false);
        confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      setPasswordErr(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setIsResetting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      {/* 1. Header Profile Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden border border-emerald-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-5 relative z-10">
          <div className="relative group">
            <img
              src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt={name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-xl bg-slate-800"
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-lg shadow font-bold text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl font-black">{name || user.name}</h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {user.role === 'admin' ? 'Super Admin' : user.role === 'vendor' ? 'Verified Seller' : user.role === 'rider' ? 'DEX Rider' : 'Verified Member'}
              </span>
            </div>
            <p className="text-xs text-emerald-200/80">{user.email}</p>
            <div className="flex items-center gap-3 pt-1 text-xs">
              <span className="flex items-center gap-1 font-extrabold text-amber-300">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{user.loyaltyCoins || 100} {isBn ? 'লয়্যালটি কয়েন' : 'Coins'}</span>
              </span>
              <span className="text-white/30">|</span>
              <span className="flex items-center gap-1 text-emerald-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{district || 'Rowmari'}, {division || 'Rangpur'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="flex flex-wrap gap-2 relative z-10">
          <Link
            to="/track-order"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs border border-white/20 transition flex items-center gap-1.5 shadow"
          >
            <Truck className="w-4 h-4 text-emerald-300" />
            <span>{isBn ? 'লাইভ অর্ডার ট্র্যাক' : 'Live Track Order'}</span>
          </Link>
          {user.role === 'admin' && (
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-black text-xs shadow-lg transition flex items-center gap-1.5"
            >
              <span>{isBn ? 'সুপার এডমিন প্যানেল ↗' : 'Super Admin Hub ↗'}</span>
            </a>
          )}
        </div>
      </div>

      {/* 2. Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Navigation Sidebar Tabs (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-2.5 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition text-left ${
                activeTab === 'profile'
                  ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{isBn ? 'প্রোফাইল তথ্য ও ছবি' : 'Personal Profile & Avatar'}</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition text-left ${
                activeTab === 'addresses'
                  ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>{isBn ? `ডেলিভারি ঠিকানা (${(addresses || []).length})` : `Address Book (${(addresses || []).length})`}</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition text-left ${
                activeTab === 'orders'
                  ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>{isBn ? `অর্ডার হিস্টোরি (${(orders || []).length})` : `My Orders (${(orders || []).length})`}</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition text-left ${
                activeTab === 'security'
                  ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{isBn ? 'পাসওয়ার্ড রিসেট (OTP)' : 'Security & Password (OTP)'}</span>
            </button>
          </div>

          {/* Official Head Office Card */}
          <div className="bg-slate-900 text-slate-300 p-5 rounded-3xl border border-slate-800 text-xs space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-white font-black">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>{isBn ? 'অফিশিয়াল হেড অফিস' : 'Official Head Office'}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              🏢 {isBn ? 'রৌমারী, কুড়িগ্রাম, রংপুর বিভাগ, বাংলাদেশ' : 'Rowmari, Kurigram, Rangpur, Bangladesh'}
            </p>
            <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px]">
              <p>📧 {isBn ? 'হেল্পলাইন' : 'Helpline'}: <span className="text-emerald-400 font-mono">sojibahmedshorif25@gmail.com</span></p>
              <p>📞 24/7 Hotline: <span className="text-emerald-400 font-mono">+880 1942-791004</span></p>
            </div>
          </div>
        </div>

        {/* Right Tab Content View (9 cols) */}
        <div className="lg:col-span-9">
          {/* ======================================================== */}
          {/* TAB 1: Personal Info & Avatar Management */}
          {/* ======================================================== */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {isBn ? 'ব্যক্তিগত তথ্য ও প্রোফাইল সেটআপ' : 'Personal Profile & Settings'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isBn ? 'আপনার প্রোফাইল ফটো, নাম, ফোন নম্বর ও জেলা তথ্য আপডেট করুন' : 'Manage your avatar, personal identity, and default region'}
                  </p>
                </div>
                {saveSuccess && (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{isBn ? 'তথ্য সংরক্ষিত হয়েছে!' : 'Saved Successfully!'}</span>
                  </span>
                )}
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* 1. Avatar Picker Section */}
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {isBn ? 'প্রোফাইল ছবি (Avatar Gallery)' : 'Choose Profile Avatar'}
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {PRESET_AVATARS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(url)}
                        className={`relative rounded-2xl overflow-hidden border-2 transition-all p-0.5 ${
                          avatar === url ? 'border-emerald-600 ring-2 ring-emerald-400 scale-105' : 'border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <img src={url} alt={`Avatar ${idx + 1}`} className="w-12 h-12 object-cover rounded-xl" />
                        {avatar === url && (
                          <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <input
                      type="url"
                      placeholder={isBn ? 'অথবা কাস্টম ছবির লিংক দিন (Image URL)...' : 'Or paste custom image URL...'}
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* 2. Personal Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'পূর্ণ নাম (Full Name)' : 'Full Name'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-emerald-600 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'ইমেইল এড্রেস (জিমেইল)' : 'Email Address (Verified)'}
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'মোবাইল নম্বর (Phone)' : 'Mobile Phone Number'}
                    </label>
                    <input
                      type="text"
                      placeholder="017XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'লিঙ্গ (Gender)' : 'Gender'}
                    </label>
                    <select
                      value={gender}
                      onChange={(e: any) => setGender(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-emerald-600"
                    >
                      <option value="male">{isBn ? 'পুরুষ (Male)' : 'Male'}</option>
                      <option value="female">{isBn ? 'মহিলা (Female)' : 'Female'}</option>
                      <option value="other">{isBn ? 'অন্যান্য (Other)' : 'Other'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'বিভাগ (Division)' : 'Division'}
                    </label>
                    <select
                      value={division}
                      onChange={(e) => {
                        const newDiv = e.target.value;
                        setDivision(newDiv);
                        if (BD_DISTRICTS[newDiv] && BD_DISTRICTS[newDiv].length > 0) {
                          setDistrict(BD_DISTRICTS[newDiv][0]);
                        }
                      }}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-emerald-600"
                    >
                      {BD_DIVISIONS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'জেলা (District)' : 'District'}
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-emerald-600"
                    >
                      {(BD_DISTRICTS[division] || ['Kurigram', 'Rowmari', 'Dhaka']).map((dist) => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'উপজেলা / থানা (Upazila/Thana)' : 'Upazila / Thana'}
                    </label>
                    <input
                      type="text"
                      placeholder={isBn ? 'যেমন: রৌমারী সদর' : 'e.g. Rowmari Sadar'}
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'জন্ম তারিখ (Date of Birth)' : 'Date of Birth'}
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                    {isBn ? 'বায়ো / স্পেশাল নোট (Bio)' : 'Bio / Short Note'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={isBn ? 'আপনার পছন্দ বা নোট লিখুন...' : 'Write something about yourself...'}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6 py-3 rounded-2xl shadow-xl shadow-emerald-700/20 transition flex items-center gap-2 text-xs"
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>{isSaving ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (isBn ? 'প্রোফাইল পরিবর্তন সংরক্ষণ করুন' : 'Save Changes')}</span>
                </button>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: Delivery Addresses (64-Districts Address Book) */}
          {/* ======================================================== */}
          {activeTab === 'addresses' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {isBn ? 'ডেলিভারি ঠিকানা ও অ্যাড্রেস বুক' : 'Address Book & Delivery Locations'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isBn ? 'অর্ডার দ্রুত চেকআউটের জন্য আপনার বাসা ও অফিসের ঠিকানা যুক্ত করুন' : 'Manage your home and office shipping addresses for one-click checkout'}
                  </p>
                </div>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isBn ? 'নতুন ঠিকানা যোগ করুন' : 'Add New Address'}</span>
                </button>
              </div>

              {/* Address Cards Grid */}
              {(addresses || []).length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                  <MapPin className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {isBn ? 'এখনও কোনো ঠিকানা যুক্ত করা হয়নি।' : 'No delivery address saved yet.'}
                  </p>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="text-xs font-extrabold text-emerald-700 hover:underline"
                  >
                    + {isBn ? 'প্রথম ঠিকানা যুক্ত করুন' : 'Add your first delivery address'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(addresses || []).map((addr, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-2xl border-2 transition relative space-y-3 ${
                        addr.isDefault
                          ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs px-2.5 py-1 rounded-lg bg-emerald-700 text-white flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{addr.title || 'Home'}</span>
                        </span>
                        {addr.isDefault ? (
                          <span className="text-[10px] bg-emerald-200 text-emerald-900 font-extrabold px-2 py-0.5 rounded-full">
                            {isBn ? 'ডিফল্ট শিপিং ঠিকানা' : 'Default Address'}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetDefaultAddress(idx)}
                            className="text-[10px] text-slate-500 hover:text-emerald-700 font-bold"
                          >
                            {isBn ? 'ডিফল্ট করুন' : 'Set as Default'}
                          </button>
                        )}
                      </div>

                      <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                        <p className="font-extrabold text-slate-900 dark:text-white">{addr.name || name}</p>
                        <p className="text-slate-500 font-mono text-[11px]">📞 {addr.phone || phone}</p>
                        <p className="leading-relaxed">
                          {addr.street}, {addr.upazila ? `${addr.upazila}, ` : ''}{addr.district || 'Rowmari'}, {addr.division || 'Rangpur'}
                        </p>
                        {addr.landmark && (
                          <p className="text-[11px] text-slate-400 italic">Landmark: {addr.landmark}</p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-end">
                        <button
                          onClick={() => handleRemoveAddress(idx)}
                          className="text-red-500 hover:text-red-700 font-bold text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{isBn ? 'মুছে ফেলুন' : 'Delete'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Address Modal */}
              {showAddressModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {isBn ? 'নতুন ডেলিভারি ঠিকানা যোগ করুন' : 'Add New Shipping Address'}
                    </h3>

                    <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold mb-1">{isBn ? 'ঠিকানার ধরন' : 'Address Label'}</label>
                          <select
                            value={addrTitle}
                            onChange={(e) => setAddrTitle(e.target.value)}
                            className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                          >
                            <option value="Home">{isBn ? 'বাসা (Home)' : 'Home'}</option>
                            <option value="Office">{isBn ? 'অফিস (Office)' : 'Office'}</option>
                            <option value="Other">{isBn ? 'অন্যান্য (Other)' : 'Other'}</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold mb-1">{isBn ? 'প্রাপকের নাম' : 'Recipient Name'}</label>
                          <input
                            type="text"
                            required
                            value={addrRecipient}
                            onChange={(e) => setAddrRecipient(e.target.value)}
                            placeholder={name}
                            className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold mb-1">{isBn ? 'ফোন নম্বর' : 'Phone Number'}</label>
                          <input
                            type="text"
                            required
                            value={addrPhone}
                            onChange={(e) => setAddrPhone(e.target.value)}
                            placeholder="017XXXXXXXX"
                            className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1">{isBn ? 'বিভাগ' : 'Division'}</label>
                          <select
                            value={addrDivision}
                            onChange={(e) => {
                              const d = e.target.value;
                              setAddrDivision(d);
                              if (BD_DISTRICTS[d]) setAddrDistrict(BD_DISTRICTS[d][0]);
                            }}
                            className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                          >
                            {BD_DIVISIONS.map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold mb-1">{isBn ? 'জেলা' : 'District'}</label>
                          <select
                            value={addrDistrict}
                            onChange={(e) => setAddrDistrict(e.target.value)}
                            className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                          >
                            {(BD_DISTRICTS[addrDivision] || ['Rowmari', 'Kurigram', 'Dhaka']).map((dist) => (
                              <option key={dist} value={dist}>{dist}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold mb-1">{isBn ? 'উপজেলা / থানা' : 'Upazila / Thana'}</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rowmari Sadar"
                            value={addrUpazila}
                            onChange={(e) => setAddrUpazila(e.target.value)}
                            className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold mb-1">{isBn ? 'রাস্তা / বাড়ি নং / গ্রাম' : 'Street Address / Village / House'}</label>
                        <input
                          type="text"
                          required
                          placeholder={isBn ? 'যেমন: বাড়ি ১২, রোড ৪, ব্লক সি' : 'e.g. House 12, Road 4, Sector 3'}
                          value={addrStreet}
                          onChange={(e) => setAddrStreet(e.target.value)}
                          className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">{isBn ? 'নিকটবর্তী ল্যান্ডমার্ক (ঐচ্ছিক)' : 'Landmark (Optional)'}</label>
                        <input
                          type="text"
                          placeholder={isBn ? 'যেমন: মসজিদের কাছে / স্কুলের পাশে' : 'e.g. Near Mosque / School'}
                          value={addrLandmark}
                          onChange={(e) => setAddrLandmark(e.target.value)}
                          className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="addrDefault"
                          checked={addrIsDefault}
                          onChange={(e) => setAddrIsDefault(e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-600"
                        />
                        <label htmlFor="addrDefault" className="font-bold text-slate-700 dark:text-slate-300">
                          {isBn ? 'এটি আমার ডিফল্ট ডেলিভারি ঠিকানা হিসেবে সেট করুন' : 'Set as default shipping address'}
                        </label>
                      </div>

                      <div className="flex gap-2 pt-3">
                        <button
                          type="button"
                          onClick={() => setShowAddressModal(false)}
                          className="w-1/2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                        >
                          {isBn ? 'বাতিল' : 'Cancel'}
                        </button>
                        <button
                          type="submit"
                          className="w-1/2 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow"
                        >
                          {isBn ? 'সংরক্ষণ করুন' : 'Save Address'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: My Orders & Tracking Milestones */}
          {/* ======================================================== */}
          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {isBn ? 'আমার অর্ডারসমূহ ও লাইভ ডেলিভারি ট্র্যাকিং' : 'My Orders & Live Delivery Tracking'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isBn ? 'দারাজ ডেক্স লজিস্টিকস ও রিয়েল-টাইম রাইডার আপডেট' : 'Daraz-standard logistics milestone tracking'}
                </p>
              </div>

              {isLoadingOrders ? (
                <div className="py-12 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin text-emerald-700 mx-auto" />
                </div>
              ) : (orders || []).length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-3">
                  <Package className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="font-bold">{isBn ? 'এখনও কোনো অর্ডার করেননি।' : 'No orders placed yet.'}</p>
                  <Link to="/" className="text-xs font-black text-emerald-700 hover:underline">
                    {isBn ? 'পণ্য ব্রাউজ করুন ↗' : 'Browse Products ↗'}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {(orders || []).map((order) => (
                    <div
                      key={order._id}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                        <div>
                          <span className="font-mono font-black text-xs text-slate-900 dark:text-white">
                            #{order.orderId || order._id}
                          </span>
                          <p className="text-[11px] text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString()} • <span className="uppercase font-semibold">{order.paymentMethod || 'COD'}</span> •{' '}
                            <span className={order.paymentStatus === 'paid' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                              {order.paymentStatus === 'paid' ? (isBn ? 'পরিশোধিত (Paid)' : 'Paid') : (isBn ? 'পেমেন্ট অপেক্ষমাণ (Pending)' : 'Pending')}
                            </span>
                            {order.transactionId ? ` • TrxID: ${order.transactionId}` : ''}
                          </p>
                        </div>

                        <span
                          className={`text-xs font-black px-3 py-1 rounded-full uppercase ${
                            order.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'out_for_delivery'
                              ? 'bg-amber-100 text-amber-900 animate-pulse'
                              : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          {order.status === 'out_for_delivery' ? (isBn ? 'ডেলিভারির জন্য বের হয়েছে' : 'Out for Delivery') : order.status}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                            <span>{item.title} (x{item.quantity})</span>
                            <span className="font-black text-slate-900 dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-xs text-slate-400">{isBn ? 'সর্বমোট প্রদেয় মূল্য' : 'Total Payable'}:</span>{' '}
                          <span className="text-base font-black text-emerald-700">{formatPrice(order.totalAmount)}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedInvoiceOrder(order);
                              setIsInvoiceOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1 border border-slate-300 dark:border-slate-700 transition"
                          >
                            <Printer className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{isBn ? 'ট্যাক্স ইনভয়েস (PDF)' : 'Invoice (PDF)'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsWarrantyOpen(true)}
                            className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-1 border border-purple-200 dark:border-purple-800 transition"
                          >
                            <BadgeCheck className="w-3.5 h-3.5 text-purple-600" />
                            <span>{isBn ? 'ওয়ারেন্টি লুকআপ' : 'Warranty'}</span>
                          </button>
                          <Link
                            to={`/track-order?orderId=${order.orderNumber || order.orderId || order._id}`}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>{isBn ? 'লাইভ জিপিএস ট্র্যাকিং' : 'Live GPS Track'}</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: Password & Security (Real 6-Digit Email OTP) */}
          {/* ======================================================== */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {isBn ? 'পাসওয়ার্ড পরিবর্তন ও ২-ফ্যাক্টর সিকিউরিটি' : 'Password Reset & Account Security (Email OTP)'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isBn
                    ? 'আপনার জিমেইলে পাঠানো রিয়েল ৬-সংখ্যার ওটিপি দিয়ে নতুন পাসওয়ার্ড সেট করুন'
                    : 'Secure your account with real 6-digit Gmail verification OTP codes'}
                </p>
              </div>

              {passwordErr && (
                <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 dark:text-red-300 text-xs rounded-2xl font-bold">
                  {passwordErr}
                </div>
              )}

              {passwordMsg && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs rounded-2xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{passwordMsg}</span>
                </div>
              )}

              {!isOtpSent ? (
                <div className="space-y-4 max-w-md">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <p className="font-bold text-slate-800 dark:text-white">
                      {isBn ? 'ভেরিফিকেশন ইমেইল' : 'Verification Email'}: <span className="font-mono text-emerald-700">{user.email}</span>
                    </p>
                    <p className="text-slate-500">
                      {isBn ? 'পাসওয়ার্ড পরিবর্তন করতে আপনার এই ইমেইলে ৬-সংখ্যার কোড পাঠানো হবে।' : 'A 6-digit verification code will be sent to your inbox.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendResetCode}
                    disabled={isSendingResetOtp}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6 py-3 rounded-2xl shadow-xl shadow-emerald-700/20 transition flex items-center gap-2 text-xs"
                  >
                    {isSendingResetOtp ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                    <span>{isSendingResetOtp ? (isBn ? 'কোড পাঠানো হচ্ছে...' : 'Sending OTP...') : (isBn ? 'ইমেইলে ওটিপি কোড পাঠান' : 'Send 6-Digit OTP to Email')}</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4 max-w-md text-xs">
                  <div>
                    <label className="block font-bold mb-1">
                      {isBn ? 'ইমেইলে প্রাপ্ত ৬-সংখ্যার কোড' : '6-Digit OTP Verification Code'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="123456"
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value)}
                      className="w-full py-3 text-center text-xl tracking-[0.4em] font-mono font-black rounded-xl border border-emerald-600 bg-emerald-50/50 dark:bg-slate-800 text-emerald-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">
                      {isBn ? 'নতুন পাসওয়ার্ড' : 'New Password'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">
                      {isBn ? 'নতুন পাসওয়ার্ড পুনরায় লিখুন' : 'Confirm New Password'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      disabled={resetCountdown > 0}
                      onClick={handleSendResetCode}
                      className={`text-xs font-bold ${resetCountdown > 0 ? 'text-slate-400' : 'text-emerald-700 hover:underline'}`}
                    >
                      {resetCountdown > 0 ? `${isBn ? 'পুনরায় কোড' : 'Resend code in'} (${resetCountdown}s)` : (isBn ? 'আবার কোড পাঠান' : 'Resend Code')}
                    </button>

                    <button
                      type="submit"
                      disabled={isResetting}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
                    >
                      {isResetting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                      <span>{isBn ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Update Password'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Official Thermal & A4 Tax Invoice Modal */}
      {selectedInvoiceOrder && (
        <ThermalInvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => {
            setIsInvoiceOpen(false);
            setSelectedInvoiceOrder(null);
          }}
          order={{
            orderNumber: selectedInvoiceOrder.orderNumber || selectedInvoiceOrder.orderId || selectedInvoiceOrder._id,
            customerInfo: selectedInvoiceOrder.customerInfo || {
              name: user?.name || name,
              phone: user?.phone || phone,
              address: user?.addresses?.[0]?.street || `${district}, ${division}`,
              district: district,
              thana: upazila,
            },
            items: (selectedInvoiceOrder.items || []).map((i: any) => ({
              product: { title: i.title || i.product?.title, price: i.price },
              quantity: i.quantity || 1,
              price: i.price,
            })),
            totalAmount: selectedInvoiceOrder.totalAmount,
            paymentMethod: selectedInvoiceOrder.paymentMethod,
          }}
        />
      )}

      {/* Digital IMEI & Serial Warranty Verification Modal */}
      <DigitalWarrantyLookupModal
        isOpen={isWarrantyOpen}
        onClose={() => setIsWarrantyOpen(false)}
      />
    </div>
  );
};
