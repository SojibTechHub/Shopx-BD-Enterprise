import React, { useState } from 'react';
import {
  Sparkles,
  Menu,
  Globe,
  ExternalLink,
  Bell,
  ShieldCheck,
  Search,
  CheckCircle,
  AlertTriangle,
  LifeBuoy,
  ShoppingCart,
  X,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { useSidebarStore } from '../store/useSidebarStore';
import { useAdminLanguageStore } from '../store/useAdminLanguageStore';

export const TopNavbar: React.FC = () => {
  const { user, logout } = useAdminAuthStore();
  const { toggleSidebar } = useSidebarStore();
  const { lang, toggleLang, t } = useAdminLanguageStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const isBn = lang === 'bn';

  const notifications = [
    {
      id: 'N1',
      title: isBn ? 'নতুন অর্ডার প্লেসড #SX-119951' : 'New Order Placed #SX-119951',
      desc: isBn ? 'কাস্টমার সজিব আহমেদ (৳297,060 - COD)' : 'Customer Sojib Ahmed (৳297,060 - COD)',
      time: '2m ago',
      type: 'order',
      link: '/orders',
    },
    {
      id: 'N2',
      title: isBn ? '⚠️ এআই ফ্রড শিল্ড নোটিশ' : '⚠️ AI Fraud Shield Flagged',
      desc: isBn ? 'হাই-ভ্যালু অর্ডার ভেরিফিকেশন প্রয়োজন' : 'High value order verification required',
      time: '12m ago',
      type: 'security',
      link: '/fraud-shield',
    },
    {
      id: 'N3',
      title: isBn ? 'জরুরি কাস্টমার ইনকোয়ারি' : 'Customer Support Ticket',
      desc: isBn ? 'রহিম উদ্দিন: ডেলিভারি ট্র্যাকিং সাহায্য' : 'Rahim Uddin: Delivery tracking help',
      time: '45m ago',
      type: 'support',
      link: '/support',
    },
  ];

  const quickLinks = [
    { label: isBn ? 'লাইভ অর্ডারসমূহ' : 'Live Orders Fleet', path: '/orders', icon: ShoppingCart },
    { label: isBn ? 'পণ্য ক্যাটালগ' : 'Products Catalog', path: '/products', icon: ShoppingCart },
    { label: isBn ? 'ইনভেন্টরি ও স্টক' : 'Inventory & Stock Hub', path: '/inventory', icon: ShoppingCart },
    { label: isBn ? 'এআই ফ্রড শিল্ড' : 'AI Fraud Shield', path: '/fraud-shield', icon: AlertTriangle },
    { label: isBn ? 'কাস্টমার সাপোর্ট' : 'Support Tickets', path: '/support', icon: LifeBuoy },
    { label: isBn ? 'সিস্টেম সেটিংস' : 'System Settings', path: '/settings', icon: ShieldCheck },
  ];

  const filteredQuickLinks = quickLinks.filter((q) =>
    q.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/90 flex items-center justify-between px-3 sm:px-6 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white md:hidden transition border border-slate-700/60"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Clean Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="text-slate-300 font-bold">{isBn ? 'সিস্টেম স্ট্যাটাস:' : 'System Status:'}</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 font-bold text-[11px] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {isBn ? 'লাইভ অনলাইন' : 'Live Online'}
            </span>
          </div>

          {/* Quick Search Trigger */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>{isBn ? 'কুইক সার্চ ও কমান্ড...' : 'Quick Finder & Commands...'}</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
              Ctrl+K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* View Storefront Link */}
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-600/40 text-emerald-300 hover:text-emerald-100 text-xs font-bold transition shadow-sm"
            title="Open ShopX Customer Storefront"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Live Store' : 'লাইভ শপ'}</span>
          </a>

          {/* Notifications Center with Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700/80"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-bounce shadow-md">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl z-50 animate-in fade-in space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      {isBn ? 'রিয়েলটাইম নোটিফিকেশনস' : 'Live Notifications'}
                    </h4>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        navigate(n.link);
                        setShowNotifications(false);
                      }}
                      className="p-2.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/60 transition cursor-pointer flex items-start gap-2.5"
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                          n.type === 'security'
                            ? 'bg-rose-950 text-rose-400'
                            : n.type === 'support'
                            ? 'bg-amber-950 text-amber-400'
                            : 'bg-emerald-950 text-emerald-400'
                        }`}
                      >
                        {n.type === 'security' ? '🛡️' : n.type === 'support' ? '💬' : '📦'}
                      </div>
                      <div className="overflow-hidden flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-white truncate">{n.title}</p>
                          <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{n.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Language Switcher Button (EN / বাংলা) */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-xs font-bold text-slate-200 hover:text-white transition shadow-sm"
            title={lang === 'en' ? 'Switch to বাংলা' : 'Switch to English'}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-[11px] font-black text-white">{lang === 'en' ? 'EN' : 'বাং'}</span>
            <span className="text-slate-500 text-[10px]">⇄</span>
            <span className="text-amber-400 text-[11px] font-bold">{lang === 'en' ? 'বাংলা' : 'English'}</span>
          </button>

          {/* Gemini AI Status Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800/60 text-purple-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            <span>{t('ai.active')}</span>
          </div>

          {/* User Info Profile */}
          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-md">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white truncate max-w-[120px]">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-emerald-400 uppercase font-black tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                {user?.role === 'admin' ? t('super_admin') : t('vendor_portal')}
              </p>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 border border-slate-700/60 transition shadow-sm ml-1"
              title={lang === 'en' ? 'Logout from Admin' : 'লগআউট'}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Omni-Search Modal */}
      {showSearchModal && (
        <div
          onClick={() => setShowSearchModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4"
          >
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                placeholder={isBn ? 'অর্ডার, প্রোডাক্ট বা সেটিংস মডিউলে জাম্প করুন...' : 'Jump to any order, page, module...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider px-2">Navigation Shortcuts</p>
              {filteredQuickLinks.map((ql, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    navigate(ql.path);
                    setShowSearchModal(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-xs font-bold text-slate-200 hover:text-white flex items-center justify-between transition"
                >
                  <span>{ql.label}</span>
                  <span className="text-[10px] font-mono text-slate-500">{ql.path}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
