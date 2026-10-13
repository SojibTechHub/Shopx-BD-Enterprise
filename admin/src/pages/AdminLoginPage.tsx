import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Globe,
  KeyRound,
  RefreshCw,
  CheckCircle2,
  Smartphone,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { useAdminLanguageStore } from '../store/useAdminLanguageStore';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    sendLoginOTP,
    verifyLoginOTP,
    isLoading,
  } = useAdminAuthStore();
  const { lang, toggleLang, t } = useAdminLanguageStore();

  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval: any = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // 1. Password + 2FA Submit
  const handleSendCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !password) {
      setError(lang === 'en' ? 'Please provide email and password.' : 'ইমেইল এবং পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    try {
      const res = await sendLoginOTP({ email, password, lang });
      setSuccessMessage(res.message || (lang === 'en' ? '2FA OTP sent to your email.' : 'আপনার ইমেইলে ২-ফ্যাক্টর ওটিপি পাঠানো হয়েছে।'));
      setStep('otp');
      setTimer(60);
    } catch (err: any) {
      setError(err.message || (lang === 'en' ? 'Authentication failed.' : 'লগইন ব্যর্থ হয়েছে।'));
    }
  };

  // 2. OTP Verification
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.trim().length !== 6) {
      setError(lang === 'en' ? 'Please enter the 6-digit OTP code.' : 'সঠিক ৬-সংখ্যার ওটিপি কোড প্রদান করুন।');
      return;
    }

    try {
      await verifyLoginOTP({ email, otp: otp.trim() });
      navigate('/');
    } catch (err: any) {
      setError(err.message || (lang === 'en' ? 'Invalid OTP code.' : 'ভুল ওটিপি কোড।'));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Language Toggle in Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white shadow transition"
        >
          <Globe className="w-3.5 h-3.5 text-orange-400" />
          <span>{lang === 'en' ? 'EN ⇄ বাংলা' : 'বাং ⇄ English'}</span>
        </button>
      </div>

      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-6 relative z-10 animate-in fade-in">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-slate-950 font-black text-2xl mx-auto mb-4 shadow-xl shadow-orange-500/20">
            SX
          </div>
          <h1 className="text-2xl font-black text-white">{t('login.title')}</h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'en' ? 'Enterprise 2-Factor Authentication Portal' : '২-ফ্যাক্টর সিকিউরিটি অ্যাডমিন পোর্টাল'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800/80 text-red-300 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs rounded-xl font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {step === 'credentials' ? (
          <div>
            <form onSubmit={handleSendCredentials} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">{t('login.email')}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="sojibahmedshorif25@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-3 pl-10 pr-3 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-orange-500 shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">{t('login.password')}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-3 pl-10 pr-10 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-orange-500 shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black py-3.5 rounded-2xl shadow-xl shadow-orange-500/20 transition flex items-center justify-center gap-2 text-sm"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{lang === 'en' ? 'Sending 2FA Code to Gmail...' : 'জিমেইলে ২-ফ্যাক্টর ওটিপি পাঠানো হচ্ছে...'}</span>
                  </>
                ) : (
                  <>
                    <span>{lang === 'en' ? 'Send 2FA Security Code' : 'সিকিউরিটি ওটিপি পাঠান'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Step 2: 6-Digit Real OTP Verification Form */
          <form onSubmit={handleVerifyOTP} className="space-y-4 text-xs">
            <div className="text-center space-y-1">
              <span className="text-slate-400 text-xs">
                {lang === 'en' ? 'Enter 6-digit security OTP sent to:' : 'আপনার জিমেইলে পাঠানো ৬-সংখ্যার কোড দিন:'}
              </span>
              <p className="text-orange-400 font-mono font-bold text-xs">
                {email}
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1 text-center">
                {lang === 'en' ? '6-Digit Verification Code' : '৬-সংখ্যার ওটিপি কোড'}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-orange-400" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full py-3 pl-10 pr-3 rounded-xl border-2 border-orange-500/80 bg-slate-800 text-orange-300 font-mono text-center font-black text-xl tracking-[6px] outline-none shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black py-3.5 rounded-2xl shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2 text-sm"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{isLoading ? (lang === 'en' ? 'Authenticating...' : 'যাচাই করা হচ্ছে...') : (lang === 'en' ? 'Verify & Enter Command Center' : 'যাচাই করে কমান্ড সেন্টারে প্রবেশ')}</span>
            </button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep('credentials');
                  setOtp('');
                }}
                className="text-slate-400 hover:text-white"
              >
                ← {lang === 'en' ? 'Change' : 'পরিবর্তন'}
              </button>

              <button
                type="button"
                disabled={timer > 0 || isLoading}
                onClick={() => handleSendCredentials({ preventDefault: () => {} } as any)}
                className={`font-bold ${timer > 0 ? 'text-slate-600' : 'text-orange-400 hover:underline'}`}
              >
                {timer > 0 ? `${lang === 'en' ? 'Resend in' : 'পুনরায় কোড'} (${timer}s)` : (lang === 'en' ? 'Resend Code' : 'আবার কোড পাঠান')}
              </button>
            </div>
          </form>
        )}

        <div className="pt-3 border-t border-slate-800 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>ShopX BD Enterprise 2FA Protected • 45-Day Session</span>
        </div>
      </div>
    </div>
  );
};
