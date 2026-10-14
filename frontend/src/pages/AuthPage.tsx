import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Store,
  Crown,
  Truck,
  ExternalLink,
  KeyRound,
  Building2,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { api } from '../services/api';

// Helper to decode Google JWT ID Token
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguageStore();
  const isBn = lang === 'bn';
  const { login, register, googleLogin, isLoading } = useAuthStore();

  const googleClientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    '106175794481-evpgcn6mvbfh9uh3u1iqifpdge19iaoe.apps.googleusercontent.com';

  // Active Role Portal Tab (Customer, Seller, Super Admin, Rider)
  const [selectedRole, setSelectedRole] = useState<'customer' | 'seller' | 'admin' | 'rider'>('customer');

  // Customer State
  const [authMode, setAuthMode] = useState<'gmail_otp' | 'phone_otp' | 'email_pass'>('gmail_otp');
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (
      location.pathname === '/register' ||
      location.pathname === '/signup' ||
      params.get('mode') === 'signup' ||
      params.get('mode') === 'register'
    ) {
      setIsRegister(true);
    } else if (
      location.pathname === '/login' ||
      location.pathname === '/signin' ||
      location.pathname === '/customer-login' ||
      params.get('mode') === 'login'
    ) {
      setIsRegister(false);
    }
  }, [location]);
  
  // Gmail OTP State
  const [gmail, setGmail] = useState('');
  const [gmailName, setGmailName] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Phone SMS OTP State
  const [mobilePhone, setMobilePhone] = useState('');
  const [phoneName, setPhoneName] = useState('');
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [isSendingPhoneOtp, setIsSendingPhoneOtp] = useState(false);
  const [isVerifyingPhoneOtp, setIsVerifyingPhoneOtp] = useState(false);

  // Email / Password State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Password Visibility Toggle States
  const [showPassword, setShowPassword] = useState(false);
  const [showSellerPassword, setShowSellerPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showRiderPin, setShowRiderPin] = useState(false);
  const [showForgotNewPass, setShowForgotNewPass] = useState(false);

  // Seller Portal Login & Store Registration State
  const [isSellerRegister, setIsSellerRegister] = useState(false);
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPassword, setSellerPassword] = useState('');
  const [isSellerLoggingIn, setIsSellerLoggingIn] = useState(false);
  const [sellerStoreName, setSellerStoreName] = useState('');
  const [sellerOwnerName, setSellerOwnerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerAddress, setSellerAddress] = useState('');
  const [isSellerRegistering, setIsSellerRegistering] = useState(false);

  // Super Admin 2FA State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminOtpSent, setAdminOtpSent] = useState(false);
  const [adminOtp, setAdminOtp] = useState('');
  const [adminMaskedEmail, setAdminMaskedEmail] = useState('');
  const [adminCountdown, setAdminCountdown] = useState(0);
  const [isAdminStep1Loading, setIsAdminStep1Loading] = useState(false);
  const [isAdminStep2Loading, setIsAdminStep2Loading] = useState(false);

  // Rider Portal State
  const [riderPhone, setRiderPhone] = useState('');
  const [riderPin, setRiderPin] = useState('');
  const [isRiderApply, setIsRiderApply] = useState(false);
  const [riderApplyName, setRiderApplyName] = useState('');
  const [riderApplyPhone, setRiderApplyPhone] = useState('');
  const [riderApplyEmail, setRiderApplyEmail] = useState('');
  const [riderApplyVehicle, setRiderApplyVehicle] = useState('bike');
  const [riderApplyHub, setRiderApplyHub] = useState('ঢাকা হাব (Dhaka Hub)');
  const [riderApplyPin, setRiderApplyPin] = useState('');
  const [isRiderApplying, setIsRiderApplying] = useState(false);

  // Forgot Password Modal State (Real 6-Digit Email OTP)
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotStep, setForgotStep] = useState<'email' | 'otp_pass'>('email');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotErr, setForgotErr] = useState('');
  const [forgotCountdown, setForgotCountdown] = useState(0);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  React.useEffect(() => {
    let timer: any = null;
    if (forgotCountdown > 0) {
      timer = setInterval(() => setForgotCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [forgotCountdown]);

  const handleSendForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotErr('');
    setForgotMsg('');
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setForgotErr(isBn ? 'সঠিক ইমেইল ঠিকানা প্রদান করুন।' : 'Please enter a valid email address.');
      return;
    }

    try {
      setForgotLoading(true);
      const res = await api.post('/auth/forgot-password', {
        email: forgotEmail.trim(),
        lang,
      });
      if (res.data.success) {
        setForgotMsg(res.data.message);
        setForgotStep('otp_pass');
        setForgotCountdown(60);
      }
    } catch (err: any) {
      setForgotErr(err.response?.data?.message || (isBn ? 'ওটিপি পাঠাতে সমস্যা হয়েছে।' : 'Failed to send OTP code.'));
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetForgotPass = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotErr('');
    setForgotMsg('');

    if (forgotOtp.trim().length < 6) {
      setForgotErr(isBn ? '৬-সংখ্যার ওটিপি কোড লিখুন।' : 'Enter 6-digit OTP code.');
      return;
    }

    if (forgotNewPass.length < 6) {
      setForgotErr(isBn ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
      return;
    }

    try {
      setForgotLoading(true);
      const res = await api.post('/auth/reset-password', {
        email: forgotEmail.trim(),
        otp: forgotOtp.trim(),
        newPassword: forgotNewPass,
        lang,
      });

      if (res.data.success) {
        setForgotMsg(res.data.message);
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        setTimeout(() => {
          setShowForgotModal(false);
          setForgotStep('email');
          setForgotOtp('');
          setForgotNewPass('');
          setForgotMsg('');
          setSuccessMsg(res.data.message);
        }, 2000);
      }
    } catch (err: any) {
      setForgotErr(err.response?.data?.message || (isBn ? 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে।' : 'Password reset failed.'));
    } finally {
      setForgotLoading(false);
    }
  };

  // 1. Customer: Send Real 6-Digit OTP to Gmail
  const handleSendGmailOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!gmail.trim() || !gmail.includes('@')) {
      setError(isBn ? 'অনুগ্রহ করে সঠিক জিমেইল আইডি দিন (যেমন: yourname@gmail.com)' : 'Please enter a valid Gmail address (e.g. yourname@gmail.com)');
      return;
    }

    try {
      setIsSendingOtp(true);
      const res = await api.post('/auth/send-email-otp', {
        email: gmail.trim(),
        name: gmailName.trim() || undefined,
        lang,
      });

      if (res.data.success) {
        setOtpSent(true);
        setSuccessMsg(res.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || (isBn ? 'ইমেইলে ওটিপি কোড পাঠাতে সমস্যা হয়েছে।' : 'Failed to send OTP code to email.'));
    } finally {
      setIsSendingOtp(false);
    }
  };

  // 2. Customer: Verify Gmail 6-Digit OTP
  const handleVerifyGmailOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.trim().length < 6) {
      setError(isBn ? 'অনুগ্রহ করে ইমেইলে প্রাপ্ত ৬-সংখ্যার ওটিপি কোডটি লিখুন।' : 'Please enter the 6-digit OTP code received in your email.');
      return;
    }

    try {
      setIsVerifyingOtp(true);
      const res = await api.post('/auth/verify-email-otp', {
        email: gmail.trim(),
        otp: otp.trim(),
        name: gmailName.trim() || undefined,
      });

      if (res.data.success) {
        localStorage.setItem('shopx_token', res.data.token);
        useAuthStore.setState({ user: res.data.user, token: res.data.token });
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || (isBn ? 'ভুল বা মেয়াদোত্তীর্ণ ওটিপি কোড।' : 'Invalid or expired OTP code.'));
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // 3. Customer: Send Real 6-Digit SMS OTP to Mobile Number
  const handleSendPhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!mobilePhone.trim() || mobilePhone.trim().length < 11) {
      setError(isBn ? 'সঠিক ১১-সংখ্যার বাংলাদেশী মোবাইল নম্বর লিখুন (যেমন: 01712345678)' : 'Please enter a valid 11-digit mobile number (e.g. 01712345678)');
      return;
    }

    try {
      setIsSendingPhoneOtp(true);
      const res = await api.post('/auth/send-otp', {
        phone: mobilePhone.trim(),
        lang,
      });

      if (res.data.success) {
        setPhoneOtpSent(true);
        setSuccessMsg(res.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || (isBn ? 'মোবাইলে OTP পাঠাতে সমস্যা হয়েছে।' : 'Failed to send OTP code to mobile.'));
    } finally {
      setIsSendingPhoneOtp(false);
    }
  };

  // 4. Customer: Verify Mobile 6-Digit OTP
  const handleVerifyPhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (phoneOtp.trim().length < 6) {
      setError(isBn ? 'অনুগ্রহ করে মোবাইলে প্রাপ্ত ৬-সংখ্যার OTP কোডটি লিখুন।' : 'Please enter the 6-digit OTP code received on your phone.');
      return;
    }

    try {
      setIsVerifyingPhoneOtp(true);
      const res = await api.post('/auth/verify-otp', {
        phone: mobilePhone.trim(),
        otp: phoneOtp.trim(),
        name: phoneName.trim() || undefined,
        lang,
      });

      if (res.data.success) {
        localStorage.setItem('shopx_token', res.data.token);
        useAuthStore.setState({ user: res.data.user, token: res.data.token });
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || (isBn ? 'ভুল বা মেয়াদোত্তীর্ণ ওটিপি কোড।' : 'Invalid or expired OTP code.'));
    } finally {
      setIsVerifyingPhoneOtp(false);
    }
  };

  // Handle Real Google OAuth ID Token Credential Callback
  const handleGoogleCredentialResponse = async (response: any) => {
    try {
      if (!response.credential) return;
      const payload = parseJwt(response.credential);
      if (!payload || !payload.email) {
        throw new Error('Could not parse Google ID token');
      }

      console.log('✅ Real Google OAuth Response:', payload.email, payload.name);

      const res = await api.post('/auth/google', {
        email: payload.email,
        name: payload.name || payload.email.split('@')[0],
        avatar: payload.picture,
        googleId: payload.sub,
      });

      if (res.data.success) {
        localStorage.setItem('shopx_token', res.data.token);
        useAuthStore.setState({ user: res.data.user, token: res.data.token });
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        setSuccessMsg(
          isBn
            ? `স্বাগতম ${payload.name || payload.email}! গুগল দিয়ে সফলভাবে লগইন হয়েছে!`
            : `Welcome ${payload.name || payload.email}! Google login successful!`
        );
        setTimeout(() => navigate('/'), 600);
      }
    } catch (err: any) {
      console.error('Google OAuth Error:', err);
      setError(err.response?.data?.message || err.message || (isBn ? 'গুগল লগইন ব্যর্থ হয়েছে।' : 'Google login failed.'));
    }
  };

  // 5. Customer: Social Real Google OAuth Login
  const handleGoogleOneClick = async () => {
    setError('');
    setSuccessMsg('');

    // Method 1: Google OAuth2 Token Client (Opens clean popup window - works on all browsers without FedCM restrictions)
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              console.warn('Google OAuth Token Error:', tokenResponse);
              return;
            }
            try {
              const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const profile = await userInfoRes.json();
              if (profile && profile.email) {
                const res = await api.post('/auth/google', {
                  email: profile.email,
                  name: profile.name || profile.email.split('@')[0],
                  avatar: profile.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                  googleId: profile.sub || `g_${Date.now()}`,
                });

                if (res.data.success) {
                  localStorage.setItem('shopx_token', res.data.token);
                  useAuthStore.setState({ user: res.data.user, token: res.data.token });
                  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
                  setSuccessMsg(
                    isBn
                      ? `স্বাগতম ${profile.name || profile.email}! গুগল দিয়ে সফলভাবে লগইন হয়েছে!`
                      : `Welcome ${profile.name || profile.email}! Google login successful!`
                  );
                  setTimeout(() => navigate('/'), 600);
                }
              }
            } catch (err: any) {
              setError(err.response?.data?.message || err.message || (isBn ? 'গুগল লগইন ব্যর্থ হয়েছে।' : 'Google login failed.'));
            }
          },
        });
        client.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (e) {
        console.warn('Google OAuth2 Token Client fallback:', e);
      }
    }

    // Method 2: Google One Tap Fallback
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
        });
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('Google One Tap skipped or not displayed');
          }
        });
        return;
      } catch (e) {
        console.warn('Google prompt fallback:', e);
      }
    }

    // Method 3: Direct Email / OTP Fallback
    setAuthMode('gmail_otp');
    setError(
      isBn
        ? 'গুগল সাইন-ইনের জন্য আপনার আসল জিমেইল এড্রেস লিখুন।'
        : 'Please enter your Gmail address to receive a 6-digit login OTP code.'
    );
  };

  // 6. Seller Registration & Store Profile Handler
  const handleSellerRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSellerRegistering(true);

    try {
      const res = await api.post('/auth/register', {
        name: sellerOwnerName.trim() || sellerStoreName.trim(),
        email: sellerEmail.trim(),
        phone: sellerPhone.trim(),
        password: sellerPassword,
        role: 'vendor',
        storeName: sellerStoreName.trim(),
        address: sellerAddress.trim() || 'Dhaka, Bangladesh',
      });

      if (res.data.success) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        setSuccessMsg(
          isBn
            ? 'অভিনন্দন! আপনার সেলার ও শপ প্রোফাইল সফলভাবে তৈরি হয়েছে! এখন লগইন করে দোকান পরিচালনা করুন।'
            : 'Congratulations! Your Seller store profile has been created successfully! Please sign in.'
        );
        setTimeout(() => {
          setIsSellerRegister(false);
        }, 2200);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || (isBn ? 'সেলার রেজিস্ট্রেশন ব্যর্থ হয়েছে।' : 'Seller registration failed.'));
    } finally {
      setIsSellerRegistering(false);
    }
  };

  // 7. Customer: Email & Password Submit
  const handleCustomerEmailPassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        await register({ name, email, phone, password });
      } else {
        await login({ email, password });
      }
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      navigate('/');
    } catch (err: any) {
      setError(err.message || (isBn ? 'অথেনটিকেশন ব্যর্থ হয়েছে।' : 'Authentication failed. Please check credentials.'));
    }
  };

  // 8. Seller Login Submit
  const handleSellerLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSellerLoggingIn(true);

    try {
      const res = await api.post('/auth/seller/login', {
        email: sellerEmail.trim(),
        password: sellerPassword,
      });

      if (res.data.success) {
        localStorage.setItem('shopx_token', res.data.token);
        useAuthStore.setState({ user: res.data.user, token: res.data.token });
        const isLocal = typeof window !== 'undefined' &&
          (['localhost', '127.0.0.1', '::1'].includes(window.location.hostname) ||
           window.location.hostname.startsWith('192.168.'));
        const adminUrl = isLocal ? 'http://localhost:5174' : (import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174');
        window.location.href = adminUrl;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || (isBn ? 'সেলার লগইন ব্যর্থ হয়েছে।' : 'Seller login failed. Invalid credentials.'));
    } finally {
      setIsSellerLoggingIn(false);
    }
  };

  // 5. Super Admin Step 1 (Send 2FA Email OTP)
  const handleAdminStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      setIsAdminStep1Loading(true);
      const res = await api.post('/auth/admin/login-step1', {
        email: adminEmail.trim(),
        password: adminPassword,
        lang,
      });

      if (res.data.success) {
        setAdminOtpSent(true);
        setAdminMaskedEmail(res.data.maskedEmail || adminEmail);
        setAdminCountdown(60);
        setSuccessMsg(res.data.message);
        setAdminOtp('');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || (isBn ? 'এডমিন ভেরিফিকেশন ব্যর্থ হয়েছে।' : 'Admin credentials verification failed.'));
    } finally {
      setIsAdminStep1Loading(false);
    }
  };

  // 6. Super Admin Step 2 (Verify 2FA OTP)
  const handleAdminStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setIsAdminStep2Loading(true);
      const res = await api.post('/auth/admin/login-step2', {
        email: adminEmail.trim(),
        otp: adminOtp.trim(),
      });

      if (res.data.success) {
        localStorage.setItem('shopx_admin_token', res.data.token);
        localStorage.setItem('shopx_admin_user', JSON.stringify(res.data.user));
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        const isLocal = typeof window !== 'undefined' &&
          (['localhost', '127.0.0.1', '::1'].includes(window.location.hostname) ||
           window.location.hostname.startsWith('192.168.'));
        const adminUrl = isLocal ? 'http://localhost:5174' : (import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174');
        window.location.href = adminUrl;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || (isBn ? 'ভুল বা মেয়াদোত্তীর্ণ ওটিপি কোড।' : 'Invalid or expired 2FA OTP code.'));
    } finally {
      setIsAdminStep2Loading(false);
    }
  };

  // 7. Delivery Rider Login
  const handleRiderLogin = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    navigate('/rider-portal');
  };

  // 8. Delivery Rider Application Submit
  const handleRiderApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsRiderApplying(true);

    try {
      const res = await api.post('/rider/apply', {
        name: riderApplyName.trim(),
        phone: riderApplyPhone.trim(),
        email: riderApplyEmail.trim() || undefined,
        vehicleType: riderApplyVehicle,
        cityHub: riderApplyHub.trim(),
        pin: riderApplyPin.trim(),
      });

      if (res.data.success) {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        setSuccessMsg(res.data.message || (isBn ? 'আপনার রাইডার আবেদন সফলভাবে জমা হয়েছে!' : 'Rider application submitted successfully!'));
        setTimeout(() => {
          setIsRiderApply(false);
          setRiderPhone(riderApplyPhone.trim());
        }, 2500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || (isBn ? 'আবেদন জমা দেওয়া ব্যর্থ হয়েছে।' : 'Failed to submit rider application.'));
    } finally {
      setIsRiderApplying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* 4 Daraz-Style Portal Gateways Card Header */}
      <div className="text-center space-y-2">
        <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-block">
          {isBn ? 'দারাজ আর্কিটেকচার — ৪টি ডেডিকেটেড রোল পোর্টাল' : 'Daraz Multi-Role Architecture — 4 Dedicated Portals'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {isBn ? 'আপনার ভূমিকা (Role) অনুযায়ী প্রবেশ করুন' : 'Select Your Role Portal to Sign In'}
        </h1>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          {isBn
            ? 'কাস্টমার, সেলার, প্ল্যাটফর্ম এডমিন এবং ডেলিভারি রাইডারদের জন্য সম্পূর্ণ আলাদা ও নিরাপদ লগইন সিস্টেম।'
            : 'Enterprise multi-vendor platform with isolated authentication for Customers, Sellers, Admins & Riders.'}
        </p>
      </div>

      {/* 4 Portals Interactive Switcher Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Customer Portal */}
        <button
          type="button"
          onClick={() => {
            setSelectedRole('customer');
            setError('');
            setSuccessMsg('');
          }}
          className={`p-4 rounded-3xl border-2 text-left transition-all ${
            selectedRole === 'customer'
              ? 'border-emerald-600 bg-emerald-50/50 shadow-lg scale-[1.02]'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
              🛒
            </span>
            {selectedRole === 'customer' && (
              <span className="text-[10px] bg-emerald-700 text-white font-bold px-2 py-0.5 rounded-full">
                {isBn ? 'সক্রিয়' : 'Active'}
              </span>
            )}
          </div>
          <h3 className="font-extrabold text-sm text-slate-900">
            {isBn ? '১. কাস্টমার লগইন' : '1. Customer Portal'}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            {isBn ? 'জিমেইল রিয়েল ওটিপি ও শপিং অ্যাকাউন্ট।' : 'Gmail Real OTP & Shopping Account.'}
          </p>
        </button>

        {/* 2. Seller Center Portal */}
        <button
          type="button"
          onClick={() => {
            setSelectedRole('seller');
            setError('');
            setSuccessMsg('');
          }}
          className={`p-4 rounded-3xl border-2 text-left transition-all ${
            selectedRole === 'seller'
              ? 'border-orange-500 bg-orange-50/50 shadow-lg scale-[1.02]'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">
              <Store className="w-5 h-5" />
            </span>
            {selectedRole === 'seller' && (
              <span className="text-[10px] bg-orange-500 text-white font-bold px-2 py-0.5 rounded-full">
                {isBn ? 'সক্রিয়' : 'Active'}
              </span>
            )}
          </div>
          <h3 className="font-extrabold text-sm text-slate-900">
            {isBn ? '২. সেলার সেন্টার' : '2. Seller Center'}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            {isBn ? 'দোকানদার ড্যাশবোর্ড, পণ্য ও আয়।' : 'Merchant Dashboard & Store Catalog.'}
          </p>
        </button>

        {/* 3. Super Admin Portal */}
        <button
          type="button"
          onClick={() => {
            setSelectedRole('admin');
            setError('');
            setSuccessMsg('');
          }}
          className={`p-4 rounded-3xl border-2 text-left transition-all ${
            selectedRole === 'admin'
              ? 'border-purple-600 bg-purple-50/50 shadow-lg scale-[1.02]'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">
              <Crown className="w-5 h-5" />
            </span>
            {selectedRole === 'admin' && (
              <span className="text-[10px] bg-purple-700 text-white font-bold px-2 py-0.5 rounded-full">
                {isBn ? 'সক্রিয়' : 'Active'}
              </span>
            )}
          </div>
          <h3 className="font-extrabold text-sm text-slate-900">
            {isBn ? '৩. সুপার এডমিন' : '3. Super Admin (2FA)'}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            {isBn ? 'প্ল্যাটফর্ম মালিক, ২-ফ্যাক্টর ওটিপি কোড।' : 'Platform Owner, 2FA Email OTP.'}
          </p>
        </button>

        {/* 4. DEX Delivery Rider Portal */}
        <button
          type="button"
          onClick={() => {
            setSelectedRole('rider');
            setError('');
            setSuccessMsg('');
          }}
          className={`p-4 rounded-3xl border-2 text-left transition-all ${
            selectedRole === 'rider'
              ? 'border-blue-600 bg-blue-50/50 shadow-lg scale-[1.02]'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
              <Truck className="w-5 h-5" />
            </span>
            {selectedRole === 'rider' && (
              <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
                {isBn ? 'সক্রিয়' : 'Active'}
              </span>
            )}
          </div>
          <h3 className="font-extrabold text-sm text-slate-900">
            {isBn ? '৪. ডেলিভারি রাইডার' : '4. Delivery Hero'}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            {isBn ? 'লাইভ পার্সেল ডেলিভারি ও ক্যাশ ট্যালি।' : 'Live GPS Route, POD & COD Tally.'}
          </p>
        </button>
      </div>

      {/* Active Portal Form Container */}
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl space-y-6">
          {/* Alerts */}
          {error && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl text-xs text-red-600 dark:text-red-400 font-medium">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {successMsg}
            </div>
          )}

          {/* ======================================================== */}
          {/* 1. CUSTOMER PORTAL TAB */}
          {/* ======================================================== */}
          {selectedRole === 'customer' && (
            <div className="space-y-6">
              {/* Dual Tab Switcher: Login vs Sign Up */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-black">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setError('');
                    setSuccessMsg('');
                  }}
                  className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                    !isRegister
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{isBn ? 'লগইন (Sign In)' : 'Sign In'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setError('');
                    setSuccessMsg('');
                  }}
                  className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                    isRegister
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isBn ? 'নতুন একাউন্ট (Sign Up)' : 'Sign Up'}</span>
                </button>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-xl mx-auto mb-2 shadow-lg shadow-emerald-700/20">
                  SX
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {isRegister
                    ? (isBn ? 'নতুন কাস্টমার সাইন আপ' : 'Create Customer Account')
                    : (isBn ? 'কাস্টমার লগইন' : 'Customer Sign In')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isRegister
                    ? (isBn ? 'রিয়েল জিমেইল বা মোবাইল ওটিপি কোড দিয়ে নতুন একাউন্ট খুলুন' : 'Sign up with verified Gmail or Phone for ৳100 welcome bonus')
                    : (isBn ? 'রিয়েল জিমেইল ওটিপি, মোবাইল ওটিপি বা পাসওয়ার্ড দিয়ে প্রবেশ করুন' : 'Instant 2FA access with real Gmail 6-digit OTP code')}
                </p>
              </div>

              {/* 3-Way Mode Switcher (Gmail OTP | Mobile SMS OTP | Password) */}
              <div className="grid grid-cols-3 p-1 bg-gray-100 dark:bg-slate-800 rounded-2xl text-[11px] font-bold gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('gmail_otp');
                    setError('');
                  }}
                  className={`py-2 px-1 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                    authMode === 'gmail_otp'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm font-extrabold'
                      : 'text-gray-500 hover:text-slate-800'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isBn ? 'জিমেইল ওটিপি' : 'Gmail OTP'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('phone_otp');
                    setError('');
                  }}
                  className={`py-2 px-1 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                    authMode === 'phone_otp'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm font-extrabold'
                      : 'text-gray-500 hover:text-slate-800'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isBn ? 'মোবাইল ওটিপি' : 'Phone OTP'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('email_pass');
                    setError('');
                  }}
                  className={`py-2 px-1 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                    authMode === 'email_pass'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm font-extrabold'
                      : 'text-gray-500 hover:text-slate-800'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isBn ? 'পাসওয়ার্ড' : 'Password'}</span>
                </button>
              </div>

              {/* 1. Gmail OTP Sub-Form */}
              {authMode === 'gmail_otp' && (
                <div>
                  {!otpSent ? (
                    <form onSubmit={handleSendGmailOTP} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {isBn ? 'আপনার জিমেইল আইডি (Gmail Address)' : 'Your Gmail Address'} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                          <input
                            type="email"
                            required
                            placeholder="yourname@gmail.com"
                            value={gmail}
                            onChange={(e) => setGmail(e.target.value)}
                            className="w-full py-3 pl-10 pr-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-emerald-600 text-sm font-semibold dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {isBn ? 'আপনার নাম (ঐচ্ছিক)' : 'Full Name (Optional)'}
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                          <input
                            type="text"
                            placeholder={isBn ? 'যেমন: মোঃ শরিফ' : 'e.g. Sharif Ahmed'}
                            value={gmailName}
                            onChange={(e) => setGmailName(e.target.value)}
                            className="w-full py-2.5 pl-9 pr-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none dark:text-white"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingOtp}
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3.5 rounded-2xl shadow-xl shadow-emerald-700/20 transition flex items-center justify-center gap-2 text-sm"
                      >
                        {isSendingOtp ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>{isBn ? 'জিমেইলে কোড পাঠানো হচ্ছে...' : 'Sending Code to Gmail...'}</span>
                          </>
                        ) : (
                          <>
                            <span>{isBn ? 'জিমেইলে ৬-সংখ্যার OTP কোড পাঠান' : 'Send 6-Digit OTP to Gmail'}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyGmailOTP} className="space-y-4 text-xs">
                      <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs space-y-1">
                        <p className="font-medium">
                          <strong>{gmail}</strong> {isBn ? 'ইনবক্সে ৬-সংখ্যার রিয়েল সিকিউরিটি ওটিপি (OTP) কোড পাঠানো হয়েছে। আপনার ইমেইলের ইনবক্স বা স্প্যাম ফোল্ডার চেক করে কোডটি লিখুন।' : 'has received a real 6-digit verification code. Please check your inbox or spam folder.'}
                        </p>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {isBn ? '৬-সংখ্যার OTP লিখুন' : 'Enter 6-Digit OTP'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="123456"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full py-3 text-center text-2xl tracking-[0.5em] font-mono font-black rounded-xl border border-emerald-600 bg-emerald-50/50 dark:bg-slate-800 outline-none dark:text-white"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setOtp('');
                          }}
                          className="w-1/3 py-3 rounded-2xl bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                        >
                          {isBn ? 'ইমেইল বদল' : 'Change'}
                        </button>

                        <button
                          type="submit"
                          disabled={isVerifyingOtp}
                          className="w-2/3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3 rounded-2xl shadow-xl shadow-emerald-700/30 transition flex items-center justify-center gap-1.5"
                        >
                          {isVerifyingOtp ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          <span>{isVerifyingOtp ? (isBn ? 'যাচাই হচ্ছে...' : 'Verifying...') : (isBn ? 'লগইন নিশ্চিত করুন' : 'Confirm Login')}</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* 2. Phone SMS OTP Sub-Form */}
              {authMode === 'phone_otp' && (
                <div>
                  {!phoneOtpSent ? (
                    <form onSubmit={handleSendPhoneOTP} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {isBn ? 'মোবাইল নম্বর (১১ ডিজিট)' : 'Bangladeshi Mobile Number'} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Smartphone className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                          <input
                            type="tel"
                            required
                            placeholder="01712345678"
                            value={mobilePhone}
                            onChange={(e) => setMobilePhone(e.target.value)}
                            className="w-full py-3 pl-10 pr-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-emerald-600 text-sm font-semibold dark:text-white font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {isBn ? 'আপনার নাম (ঐচ্ছিক)' : 'Full Name (Optional)'}
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                          <input
                            type="text"
                            placeholder={isBn ? 'যেমন: মোঃ শরিফ' : 'e.g. Sharif Ahmed'}
                            value={phoneName}
                            onChange={(e) => setPhoneName(e.target.value)}
                            className="w-full py-2.5 pl-9 pr-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none dark:text-white"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingPhoneOtp}
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3.5 rounded-2xl shadow-xl shadow-emerald-700/20 transition flex items-center justify-center gap-2 text-sm"
                      >
                        {isSendingPhoneOtp ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>{isBn ? 'মোবাইলে OTP পাঠানো হচ্ছে...' : 'Sending SMS OTP...'}</span>
                          </>
                        ) : (
                          <>
                            <span>{isBn ? 'মোবাইলে ৬-সংখ্যার OTP পাঠান' : 'Send 6-Digit SMS OTP'}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyPhoneOTP} className="space-y-4 text-xs">
                      <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs space-y-1">
                        <p className="font-medium">
                          <strong>{mobilePhone}</strong> {isBn ? 'নম্বরে ৬-সংখ্যার রিয়েল SMS ওটিপি কোড পাঠানো হয়েছে। আপনার ইনবক্স চেক করে কোডটি লিখুন।' : 'has received a 6-digit SMS verification code. Please check your messages.'}
                        </p>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {isBn ? '৬-সংখ্যার OTP কোড লিখুন' : 'Enter 6-Digit OTP'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="123456"
                          value={phoneOtp}
                          onChange={(e) => setPhoneOtp(e.target.value)}
                          className="w-full py-3 text-center text-2xl tracking-[0.5em] font-mono font-black rounded-xl border border-emerald-600 bg-emerald-50/50 dark:bg-slate-800 outline-none dark:text-white"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPhoneOtpSent(false);
                            setPhoneOtp('');
                          }}
                          className="w-1/3 py-3 rounded-2xl bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                        >
                          {isBn ? 'নম্বর বদল' : 'Change'}
                        </button>

                        <button
                          type="submit"
                          disabled={isVerifyingPhoneOtp}
                          className="w-2/3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3 rounded-2xl shadow-xl shadow-emerald-700/30 transition flex items-center justify-center gap-1.5"
                        >
                          {isVerifyingPhoneOtp ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          <span>{isVerifyingPhoneOtp ? (isBn ? 'যাচাই হচ্ছে...' : 'Verifying...') : (isBn ? 'লগইন নিশ্চিত করুন' : 'Confirm Login')}</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* 3. Password Sub-Form */}
              {authMode === 'email_pass' && (
                <form onSubmit={handleCustomerEmailPassSubmit} className="space-y-3.5 text-xs">
                  {isRegister && (
                    <div className="p-3 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl space-y-1.5 animate-in fade-in">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 animate-bounce" />
                        <p className="text-xs font-black text-emerald-900 dark:text-emerald-300">
                          {isBn ? '🎉 নতুন একাউন্ট খুললেই ১০০৳ বোনাস ও কয়েন!' : '🎉 Join & Get ৳100 Welcome Bonus!'}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        {isBn ? '১০০% অরিজিনাল পণ্য, ৬৪ জেলায় দ্রুততম ডেলিভারি ও ফ্রি রিটার্ন সুবিধা।' : '100% genuine products, nationwide express delivery & easy 7-day returns.'}
                      </p>
                    </div>
                  )}

                  {isRegister && (
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isBn ? 'আপনার পূর্ণ নাম' : 'Full Name'} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                        <input
                          type="text"
                          required
                          autoComplete="name"
                          placeholder={isBn ? 'যেমন: মোঃ শরিফ হোসেন' : 'e.g. Sharif Ahmed'}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full py-2.5 pl-10 pr-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-emerald-600 dark:text-white text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {isRegister && (
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isBn ? 'মোবাইল নম্বর (ঐচ্ছিক)' : 'Mobile Phone (Optional)'}
                      </label>
                      <div className="relative">
                        <Smartphone className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                        <input
                          type="tel"
                          autoComplete="tel"
                          placeholder="01712-345678"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full py-2.5 pl-10 pr-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-emerald-600 dark:text-white text-sm font-mono"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'ইমেইল এড্রেস' : 'Email Address'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="user@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full py-2.5 pl-10 pr-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-emerald-600 dark:text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'পাসওয়ার্ড' : 'Password'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full py-2.5 pl-10 pr-10 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-emerald-600 dark:text-white text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {isRegister && password && (
                      <div className="pt-2 space-y-1">
                        <div className="flex gap-1.5 h-1.5 w-full">
                          <div className={`h-full flex-1 rounded-full ${password.length >= 6 ? 'bg-amber-500' : 'bg-red-500'}`} />
                          <div className={`h-full flex-1 rounded-full ${password.length >= 8 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'}`} />
                          <div className={`h-full flex-1 rounded-full ${password.length >= 10 && /[A-Z]/.test(password) ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-slate-700'}`} />
                        </div>
                        <p className="text-[10px] text-slate-500">
                          {password.length < 6
                            ? (isBn ? 'ন্যূনতম ৬ অক্ষর লিখুন' : 'At least 6 characters')
                            : password.length < 8
                            ? (isBn ? 'পাসওয়ার্ড মান: সাধারণ' : 'Strength: Fair')
                            : (isBn ? 'পাসওয়ার্ড মান: শক্তিশালী' : 'Strength: Strong')}
                        </p>
                      </div>
                    )}
                  </div>

                  {!isRegister && (
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(email);
                          setForgotStep('email');
                          setForgotErr('');
                          setForgotMsg('');
                          setShowForgotModal(true);
                        }}
                        className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                      >
                        {isBn ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3.5 rounded-2xl shadow-xl shadow-emerald-700/20 transition flex items-center justify-center gap-2 text-sm"
                  >
                    <span>{isRegister ? (isBn ? 'রেজিস্ট্রেশন সম্পন্ন করুন' : 'Create Free Account') : (isBn ? 'লগইন করুন' : 'Sign In')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2 text-xs text-gray-500">
                    {isRegister ? (isBn ? 'ইতোমধ্যে একাউন্ট আছে?' : 'Already have an account?') : (isBn ? 'নতুন কাস্টমার?' : 'New Customer?')}{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegister(!isRegister)}
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      {isRegister ? (isBn ? 'লগইন করুন' : 'Sign In') : (isBn ? 'সাইন আপ করুন' : 'Create Account')}
                    </button>
                  </div>
                </form>
              )}

              {/* 4. Social 1-Click Login (Official Google) */}
              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 space-y-2.5">
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-gray-200 dark:border-slate-700 w-full"></div>
                  <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
                    {isBn ? 'অথবা গুগল দিয়ে সরাসরি সাইন ইন' : 'Or 1-Click Google Sign In'}
                  </span>
                </div>

                <div className="pt-2">
                  {/* Google Login Button */}
                  <button
                    type="button"
                    onClick={handleGoogleOneClick}
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition shadow-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>{isBn ? 'Google দিয়ে ১-ক্লিকে সাইন ইন করুন' : 'Continue with Google Account'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* ======================================================== */}
          {/* 2. SELLER CENTER TAB */}
          {/* ======================================================== */}
          {selectedRole === 'seller' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black text-xl mx-auto mb-2 shadow-lg shadow-orange-600/20">
                  <Store className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {isBn ? 'ShopX সেলার সেন্টার পোর্টাল' : 'Seller Center Portal'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn ? 'আপনার দোকান পরিচালনা, নতুন প্রোডাক্ট লিস্টিং ও আয় পর্যবেক্ষণ' : 'Manage your shop catalog, inventory & sales analytics'}
                </p>
              </div>

              {/* Seller Mode Toggle (Login vs Register Store) */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-bold gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsSellerRegister(false);
                    setError('');
                    setSuccessMsg('');
                  }}
                  className={`py-2.5 rounded-xl transition ${
                    !isSellerRegister
                      ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow font-black'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {isBn ? '১. সেলার লগইন' : '1. Seller Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSellerRegister(true);
                    setError('');
                    setSuccessMsg('');
                  }}
                  className={`py-2.5 rounded-xl transition ${
                    isSellerRegister
                      ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow font-black'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {isBn ? '২. নতুন দোকান নিবন্ধন' : '2. Register Store'}
                </button>
              </div>

              {!isSellerRegister ? (
                <form onSubmit={handleSellerLoginSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'সেলার নিবন্ধিত ইমেইল' : 'Seller Registered Email'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="email"
                        required
                        placeholder="seller@gmail.com"
                        value={sellerEmail}
                        onChange={(e) => setSellerEmail(e.target.value)}
                        className="w-full py-3 pl-10 pr-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-orange-500 text-sm font-semibold dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'পাসওয়ার্ড' : 'Password'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type={showSellerPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={sellerPassword}
                        onChange={(e) => setSellerPassword(e.target.value)}
                        className="w-full py-3 pl-10 pr-10 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-orange-500 text-sm font-semibold dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSellerPassword(!showSellerPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                      >
                        {showSellerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(sellerEmail);
                        setForgotStep('email');
                        setForgotErr('');
                        setForgotMsg('');
                        setShowForgotModal(true);
                      }}
                      className="text-[11px] font-bold text-orange-600 hover:underline"
                    >
                      {isBn ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isSellerLoggingIn}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black py-3.5 rounded-2xl shadow-xl shadow-orange-500/20 transition flex items-center justify-center gap-2 text-sm"
                  >
                    {isSellerLoggingIn ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{isBn ? 'লগইন হচ্ছে...' : 'Signing in...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{isBn ? 'সেলার সেন্টারে প্রবেশ করুন' : 'Access Seller Center'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
                    {isBn ? 'নতুন দোকান খুলতে চান?' : 'Want to open a new store?'}{' '}
                    <button
                      type="button"
                      onClick={() => setIsSellerRegister(true)}
                      className="text-orange-600 font-extrabold hover:underline"
                    >
                      {isBn ? 'এখানে রেজিস্ট্রেশন করুন ↗' : 'Register Here ↗'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSellerRegisterSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'দোকানের নাম (Shop Name)' : 'Store Name'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder={isBn ? 'যেমন: ঢাকা ফ্যাশন ওয়্যার' : 'e.g. Dhaka Fashion Wear'}
                        value={sellerStoreName}
                        onChange={(e) => setSellerStoreName(e.target.value)}
                        className="w-full py-2.5 pl-10 pr-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-orange-500 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isBn ? 'মালিকের নাম' : 'Owner Name'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isBn ? 'আপনার নাম' : 'Your Name'}
                        value={sellerOwnerName}
                        onChange={(e) => setSellerOwnerName(e.target.value)}
                        className="w-full py-2.5 px-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-orange-500 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isBn ? 'মোবাইল নম্বর' : 'Phone'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="01712-345678"
                        value={sellerPhone}
                        onChange={(e) => setSellerPhone(e.target.value)}
                        className="w-full py-2.5 px-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-orange-500 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'সেলার ইমেইল एड্রেস' : 'Seller Email'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="email"
                        required
                        placeholder="store@gmail.com"
                        value={sellerEmail}
                        onChange={(e) => setSellerEmail(e.target.value)}
                        className="w-full py-2.5 pl-10 pr-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-orange-500 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'পাসওয়ার্ড' : 'Password'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type={showSellerPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="••••••••"
                        value={sellerPassword}
                        onChange={(e) => setSellerPassword(e.target.value)}
                        className="w-full py-2.5 pl-10 pr-10 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-orange-500 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSellerPassword(!showSellerPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                      >
                        {showSellerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'দোকানের ঠিকানা / পিকআপ পয়েন্ট' : 'Shop Address / Pickup Point'}
                    </label>
                    <input
                      type="text"
                      placeholder={isBn ? 'যেমন: দোকান নং ১২, নিউ মার্কেট, ঢাকা' : 'e.g. Shop 12, New Market, Dhaka'}
                      value={sellerAddress}
                      onChange={(e) => setSellerAddress(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSellerRegistering}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black py-3.5 rounded-2xl shadow-xl shadow-orange-500/20 transition flex items-center justify-center gap-2 text-sm"
                  >
                    {isSellerRegistering ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{isBn ? 'দোকান প্রোফাইল তৈরি হচ্ছে...' : 'Creating Store Profile...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{isBn ? 'দোকান প্রোফাইল সম্পূর্ণ করুন' : 'Create Seller Store'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. SUPER ADMIN 2FA PORTAL TAB */}
          {/* ======================================================== */}
          {selectedRole === 'admin' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-black text-xl mx-auto mb-2 shadow-lg shadow-purple-700/20">
                  <Crown className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {isBn ? 'সুপার এডমিন ২FA গেটওয়ে' : 'Super Admin 2FA Gateway'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn ? 'রিয়েল ৬-সংখ্যার ২-ফ্যাক্টর ইমেইল ওটিপি ভেরিফিকেশন' : 'Secured with 2-Factor Real 6-Digit Email OTP (Zero Auto-Fill)'}
                </p>
              </div>

              {!adminOtpSent ? (
                <form onSubmit={handleAdminStep1Submit} className="space-y-4 text-xs" autoComplete="off">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'এডমিন ইমেইল' : 'Master Admin Email'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="email"
                        required
                        autoComplete="off"
                        placeholder="sojibahmedshorif25@gmail.com"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full py-3 pl-10 pr-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-purple-600 text-sm font-semibold dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'এডমিন পাসওয়ার্ড' : 'Admin Master Password'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full py-3 pl-10 pr-10 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-purple-600 text-sm font-semibold dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                      >
                        {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isAdminStep1Loading}
                    className="w-full bg-purple-700 hover:bg-purple-800 text-white font-extrabold py-3.5 rounded-2xl shadow-xl shadow-purple-700/20 transition flex items-center justify-center gap-2 text-sm"
                  >
                    {isAdminStep1Loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{isBn ? 'ইমেইলে 2FA কোড পাঠানো হচ্ছে...' : 'Sending 2FA OTP to Email...'}</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>{isBn ? '২FA কোড জেনারেট করুন' : 'Verify & Send 2FA OTP'}</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAdminStep2Submit} className="space-y-4 text-xs">
                  <div className="p-3.5 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 text-purple-900 dark:text-purple-300 text-xs">
                    <p>
                      <strong>{adminMaskedEmail}</strong> {isBn ? 'ইনবক্সে ৬-সংখ্যার ২FA সিকিউরিটি ওটিপি কোড পাঠানো হয়েছে।' : 'received the 6-digit 2FA login code.'}
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? '৬-সংখ্যার 2FA OTP কোড' : 'Enter 6-Digit 2FA OTP'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="123456"
                      value={adminOtp}
                      onChange={(e) => setAdminOtp(e.target.value)}
                      className="w-full py-3 text-center text-2xl tracking-[0.5em] font-mono font-black rounded-xl border border-purple-600 bg-purple-50/50 dark:bg-slate-800 outline-none dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAdminStep2Loading}
                    className="w-full bg-purple-700 hover:bg-purple-800 text-white font-extrabold py-3.5 rounded-2xl shadow-xl shadow-purple-700/30 transition flex items-center justify-center gap-2 text-sm"
                  >
                    {isAdminStep2Loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>{isAdminStep2Loading ? (isBn ? 'যাচাই হচ্ছে...' : 'Verifying...') : (isBn ? 'এডমিন ড্যাশবোর্ডে প্রবেশ করুন' : 'Authorize & Enter Admin Dashboard')}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. DELIVERY RIDER TAB */}
          {/* ======================================================== */}
          {selectedRole === 'rider' && (
            <div className="space-y-6">
              {/* Dual Tab: Login vs Apply */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-black">
                <button
                  type="button"
                  onClick={() => {
                    setIsRiderApply(false);
                    setError('');
                    setSuccessMsg('');
                  }}
                  className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                    !isRiderApply
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>{isBn ? 'রাইডার লগইন' : 'Rider Login'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsRiderApply(true);
                    setError('');
                    setSuccessMsg('');
                  }}
                  className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                    isRiderApply
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isBn ? 'রাইডার আবেদন' : 'Apply as Rider'}</span>
                </button>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl mx-auto mb-2 shadow-lg shadow-blue-600/20">
                  <Truck className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {isRiderApply
                    ? (isBn ? 'ডেলিভারি রাইডার হিসেবে আবেদন করুন' : 'Apply as Delivery Hero')
                    : (isBn ? 'DEX ডেলিভারি হিরো লগইন' : 'DEX Delivery Hero Portal')}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {isRiderApply
                    ? (isBn ? 'আবেদন করার পর এডমিন (Super Admin) অ্যাপ্রুভ করলে ডেলিভারি শুরু করতে পারবেন।' : 'Admin will review and approve your application to start delivering.')
                    : (isBn ? 'পার্সেল ডেলিভারি, লাইভ জিপিএস ম্যাপ রুট ও ক্যাশ কালেকশন।' : 'Real-time parcel delivery route, POD signature & cash tally.')}
                </p>
              </div>

              {!isRiderApply ? (
                <form onSubmit={handleRiderLogin} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'রাইডার মোবাইল নম্বর / DEX আইডি' : 'Rider Mobile Number / DEX ID'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        placeholder="01712-345678"
                        value={riderPhone}
                        onChange={(e) => setRiderPhone(e.target.value)}
                        className="w-full py-3 pl-10 pr-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-blue-600 text-sm font-mono dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'সিকিউরিটি পিন (PIN)' : 'Security PIN'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type={showRiderPin ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        placeholder="••••"
                        value={riderPin}
                        onChange={(e) => setRiderPin(e.target.value)}
                        className="w-full py-3 pl-10 pr-10 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-blue-600 text-sm font-mono dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRiderPin(!showRiderPin)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                      >
                        {showRiderPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-blue-600/20 transition flex items-center justify-center gap-2 text-sm"
                  >
                    <span>{isBn ? 'রাইডার ড্যাশবোর্ডে প্রবেশ করুন' : 'Launch Rider Delivery App'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
                    {isBn ? 'নতুন রাইডার হতে চান?' : 'Want to join as a Rider?'}{' '}
                    <button
                      type="button"
                      onClick={() => setIsRiderApply(true)}
                      className="text-blue-600 font-extrabold hover:underline"
                    >
                      {isBn ? 'এখানে আবেদন করুন ↗' : 'Apply Here ↗'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRiderApplySubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'আপনার পূর্ণ নাম' : 'Full Name'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder={isBn ? 'যেমন: মোঃ কাউসার হোসেন' : 'e.g. Md. Kawsar Hossain'}
                        value={riderApplyName}
                        onChange={(e) => setRiderApplyName(e.target.value)}
                        className="w-full py-2.5 pl-10 pr-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-blue-600 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'সক্রিয় মোবাইল নম্বর' : 'Active Mobile Phone'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        placeholder="01712-345678"
                        value={riderApplyPhone}
                        onChange={(e) => setRiderApplyPhone(e.target.value)}
                        className="w-full py-2.5 pl-10 pr-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-blue-600 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'জিমেইল এড্রেস' : 'Gmail / Email'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="email"
                        placeholder="rider@gmail.com"
                        value={riderApplyEmail}
                        onChange={(e) => setRiderApplyEmail(e.target.value)}
                        className="w-full py-2.5 pl-10 pr-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-blue-600 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isBn ? 'বাহনের ধরন' : 'Vehicle'}
                      </label>
                      <select
                        value={riderApplyVehicle}
                        onChange={(e) => setRiderApplyVehicle(e.target.value)}
                        className="w-full py-2.5 px-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-blue-600 dark:text-white"
                      >
                        <option value="bike">{isBn ? '🏍️ মোটরসাইকেল' : '🏍️ Bike'}</option>
                        <option value="bicycle">{isBn ? '🚲 বাইসাইকেল' : '🚲 Bicycle'}</option>
                        <option value="van">{isBn ? '🚐 ভ্যান / গাড়ি' : '🚐 Van'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isBn ? 'ডেলিভারি জোন/হাব' : 'Delivery Hub'}
                      </label>
                      <input
                        type="text"
                        placeholder={isBn ? 'যেমন: ধানমন্ডি / মিরপুর' : 'e.g. Dhanmondi'}
                        value={riderApplyHub}
                        onChange={(e) => setRiderApplyHub(e.target.value)}
                        className="w-full py-2.5 px-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-blue-600 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'লগইন ৪-সংখ্যার পিন (PIN)' : '4-Digit Login PIN'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="••••"
                        value={riderApplyPin}
                        onChange={(e) => setRiderApplyPin(e.target.value)}
                        className="w-full py-2.5 pl-10 pr-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:border-blue-600 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isRiderApplying}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-blue-600/20 transition flex items-center justify-center gap-2 text-sm"
                  >
                    {isRiderApplying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{isBn ? 'আবেদন জমা হচ্ছে...' : 'Submitting Application...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{isBn ? 'আবেদন জমা দিন (Submit Application)' : 'Submit Rider Application'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. UNIVERSAL FORGOT PASSWORD MODAL (REAL 6-DIGIT EMAIL OTP) */}
      {/* ======================================================== */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {isBn ? 'পাসওয়ার্ড রিসেট (ইমেইল ওটিপি)' : 'Reset Password (Email OTP)'}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    {isBn ? 'রিয়েল ৬-সংখ্যার কোড দ্বারা নিরাপদ রিসেট' : 'Real 6-digit email OTP verification'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {forgotErr && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 dark:text-red-300 text-xs rounded-xl font-semibold">
                {forgotErr}
              </div>
            )}

            {forgotMsg && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{forgotMsg}</span>
              </div>
            )}

            {forgotStep === 'email' ? (
              <form onSubmit={handleSendForgotOtp} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'আপনার নিবন্ধিত ইমেইল' : 'Your Registered Email'} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full py-3 pl-10 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-emerald-600 font-semibold"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="w-1/3 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-2/3 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow transition flex items-center justify-center gap-2"
                  >
                    {forgotLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    <span>{forgotLoading ? (isBn ? 'পাঠানো হচ্ছে...' : 'Sending...') : (isBn ? '৬-সংখ্যার কোড পাঠান' : 'Send 6-Digit OTP')}</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetForgotPass} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-center">
                    {isBn ? 'ইমেইলে প্রাপ্ত ৬-সংখ্যার OTP কোড' : '6-Digit OTP Code'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    className="w-full py-3 text-center text-xl tracking-[0.4em] font-mono font-black rounded-xl border border-emerald-600 bg-emerald-50/50 dark:bg-slate-800 text-emerald-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'নতুন পাসওয়ার্ড' : 'New Password'} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type={showForgotNewPass ? 'text' : 'password'}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      placeholder="••••••••••••"
                      value={forgotNewPass}
                      onChange={(e) => setForgotNewPass(e.target.value)}
                      className="w-full py-2.5 pl-9 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotNewPass(!showForgotNewPass)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                    >
                      {showForgotNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    disabled={forgotCountdown > 0 || forgotLoading}
                    onClick={handleSendForgotOtp}
                    className={`font-bold ${forgotCountdown > 0 ? 'text-slate-400' : 'text-emerald-700 hover:underline'}`}
                  >
                    {forgotCountdown > 0 ? `${isBn ? 'পুনরায় পাঠান' : 'Resend in'} (${forgotCountdown}s)` : (isBn ? 'আবার কোড পাঠান' : 'Resend Code')}
                  </button>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="py-2.5 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow transition flex items-center gap-1.5"
                  >
                    {forgotLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    <span>{isBn ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Reset Password'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
