import React, { useState, useEffect } from 'react';
import {
  Settings,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  Server,
  Database,
  RefreshCw,
  CheckCircle2,
  Lock,
  Globe,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api';
import { useAdminLanguageStore } from '../store/useAdminLanguageStore';

export const SettingsAdminPage: React.FC = () => {
  const { lang } = useAdminLanguageStore();
  const isBn = lang === 'bn';

  const [settings, setSettings] = useState<any>({
    platformName: 'ShopX BD Enterprise',
    headOffice: 'Rowmari, Kurigram, Rangpur, Bangladesh',
    banglaHeadOffice: 'রৌমারী, কুড়িগ্রাম, রংপুর বিভাগ, বাংলাদেশ',
    helplineEmail: 'sojibahmedshorif25@gmail.com',
    helplinePhone: '+880 1942-791004',
    superAdminEmail: 'sojibahmedshorif25@gmail.com',
    defaultCommissionRate: 5,
    dailyCheckInMaxReward: 100,
    maxCoinDiscountBDT: 25,
    smsGatewayStatus: 'Operational',
    emailSMTPStatus: 'Connected (Gmail Secure)',
    databaseStatus: 'MongoDB Atlas Connected',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/settings');
      if (res.data.success) {
        setSettings(res.data.settings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await api.put('/admin/settings', settings);
      if (res.data.success) {
        setSuccessMsg(isBn ? 'সিস্টেম কনফিগারেশন সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে!' : 'System configuration saved successfully to database!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || (isBn ? 'সেটিংস সংরক্ষণে ত্রুটি হয়েছে।' : 'Failed to save settings.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-3.5 sm:p-6 space-y-6 max-w-full overflow-hidden animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-900/60 p-4 sm:p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400 flex-shrink-0" />
            <span>{isBn ? 'সিস্টেম সেটিংস ও প্ল্যাটফর্ম কনফিগারেশন' : 'System Settings & Enterprise Architecture'}</span>
          </h1>
          <p className="text-xs text-teal-200/70 mt-1 max-w-2xl">
            {isBn
              ? 'হেড অফিস ঠিকানা, ২৪/৭ হেল্পলাইন, জিমেইল এসএমটিপি ও সিকিউরিটি প্যারামিটার নিয়ন্ত্রণ।'
              : 'Global platform configuration: official corporate headquarters, 24/7 helpline & gateway health.'}
          </p>
        </div>

        <button
          onClick={fetchSettings}
          disabled={isLoading}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-2xl flex items-center gap-1.5 transition border border-slate-700 shadow"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-teal-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isBn ? 'রিফ্রেশ' : 'Refresh'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-2xl font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Official Head Office & Corporate Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-5">
            <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>{isBn ? 'অফিশিয়াল হেড অফিস ও হেল্পলাইন' : 'Corporate Headquarters & Support'}</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  🏢 {isBn ? 'হেড অফিস ঠিকানা (English)' : 'Official Head Office (English)'}
                </label>
                <input
                  type="text"
                  required
                  value={settings.headOffice || ''}
                  onChange={(e) => setSettings({ ...settings, headOffice: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  🏢 {isBn ? 'হেড অফিস ঠিকানা (বাংলা)' : 'Official Head Office (Bengali)'}
                </label>
                <input
                  type="text"
                  required
                  value={settings.banglaHeadOffice || ''}
                  onChange={(e) => setSettings({ ...settings, banglaHeadOffice: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    📞 {isBn ? '২৪/৭ সাপোর্ট হেল্পলাইন' : '24/7 Helpline Number'}
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.helplinePhone || ''}
                    onChange={(e) => setSettings({ ...settings, helplinePhone: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    📧 {isBn ? 'অফিশিয়াল সাপোর্ট ইমেইল' : 'Official Support Email'}
                  </label>
                  <input
                    type="email"
                    required
                    value={settings.helplineEmail || ''}
                    onChange={(e) => setSettings({ ...settings, helplineEmail: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Fraudulent Payment Protection & Manual MFS Toggle */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-black text-rose-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      {isBn ? 'ভুয়া পেমেন্ট প্রতিরোধ ফিল্টার (Fake Payment Protection)' : 'Fraudulent Payment & Fake TrxID Guard'}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {isBn
                        ? 'ম্যানুয়াল বিকাশ/নগদ সেন্ড মানি বন্ধ রাখলে কেউ ভুয়া TrxID দিয়ে অর্ডার করতে পারবে না। শুধুমাত্র অটোমেটিক গেটওয়ে (SSLCommerz) এবং ক্যাশ অন ডেলিভারি (COD) চালু থাকবে।'
                        : 'Disabling manual MFS transfers completely eliminates fake TrxID orders. Customers will only be able to use verified SSLCommerz automated gateway or Cash on Delivery.'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.allowManualMfsPayment === true}
                      onChange={(e) => setSettings({ ...settings, allowManualMfsPayment: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>
                <div className="pt-1">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg ${settings.allowManualMfsPayment ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80' : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {settings.allowManualMfsPayment
                      ? (isBn ? '⚠️ ম্যানুয়াল বিকাশ/নগদ সেন্ড মানি সক্রিয় (ভুয়া TrxID ঝুঁকি থাকতে পারে)' : '⚠️ Manual Send Money Enabled (TrxID verification required)')
                      : (isBn ? '🛡️ ১০০% ভুয়া পেমেন্ট প্রতিরোধ সক্রিয় (অটো গেটওয়ে ও ক্যাশ অন ডেলিভারি চালু)' : '🛡️ 100% Anti-Fraud Active (SSLCommerz Gateway & COD only)')}
                  </span>
                </div>
              </div>

              {/* Merchant Payment Numbers Section (Configured for Send Money or Hotline) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="font-black text-amber-400 text-xs uppercase tracking-wider">
                  💳 {isBn ? 'মার্চেন্ট পেমেন্ট নম্বর (কাস্টমার সেন্ড মানি)' : 'Merchant Direct MFS Numbers'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1 text-[11px]">
                      {isBn ? 'বিকাশ নম্বর (bKash Personal)' : 'bKash Merchant/Personal'}
                    </label>
                    <input
                      type="text"
                      value={settings.merchantBkashNumber || '01942791004'}
                      onChange={(e) => setSettings({ ...settings, merchantBkashNumber: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-700 bg-slate-900 text-pink-400 font-mono font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1 text-[11px]">
                      {isBn ? 'নগদ নম্বর (Nagad Personal)' : 'Nagad Merchant/Personal'}
                    </label>
                    <input
                      type="text"
                      value={settings.merchantNagadNumber || '01942791004'}
                      onChange={(e) => setSettings({ ...settings, merchantNagadNumber: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-700 bg-slate-900 text-amber-400 font-mono font-bold outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    💰 {isBn ? 'ডিফল্ট ভেন্ডর কমিশন (%)' : 'Default Vendor Commission (%)'}
                  </label>
                  <input
                    type="number"
                    value={settings.defaultCommissionRate || 5}
                    onChange={(e) => setSettings({ ...settings, defaultCommissionRate: Number(e.target.value) })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    🪙 {isBn ? 'সর্বোচ্চ কয়েন ডিসকাউন্ট (৳)' : 'Max Coin Discount Cap (BDT)'}
                  </label>
                  <input
                    type="number"
                    value={settings.maxCoinDiscountBDT || 25}
                    onChange={(e) => setSettings({ ...settings, maxCoinDiscountBDT: Number(e.target.value) })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl shadow-xl shadow-emerald-600/20 transition flex items-center justify-center gap-2 text-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isLoading ? (isBn ? 'সংরক্ষণ করা হচ্ছে...' : 'Saving...') : (isBn ? 'কনফিগারেশন সংরক্ষণ করুন' : 'Save System Settings')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Gateway & Live Microservices Health (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
            <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Server className="w-5 h-5 text-teal-400" />
              <span>{isBn ? 'লাইভ গেটওয়ে ও সার্ভিস হেলথ' : 'Microservices & Gateway Health'}</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Gmail SMTP Secure Dispatch</p>
                  <p className="text-[11px] text-slate-400 font-mono">sojibahmedshorif25@gmail.com</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active
                </span>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">MongoDB Atlas Cloud</p>
                  <p className="text-[11px] text-slate-400 font-mono">Mongoose Multi-Tenant DB</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Connected
                </span>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">2FA Security Lockout Guard</p>
                  <p className="text-[11px] text-slate-400">Brute-Force 5 Attempt Lock</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-bold text-[10px]">
                  Protected
                </span>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">DEX Live GPS & Socket.io</p>
                  <p className="text-[11px] text-slate-400">Real-Time Rider Geolocation</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-bold text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                  Live
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <a
                href="http://localhost:5173"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 border border-slate-700 shadow"
              >
                <span>{isBn ? '🛍️ লাইভ স্টোরফ্রন্ট দেখুন' : '🛍️ View Live Customer Storefront ↗'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
