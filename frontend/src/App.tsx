import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AIAssistantModal } from './components/AIAssistantModal';
import { FloatingAITrigger } from './components/FloatingAITrigger';
import { RecentViewedDrawer } from './components/RecentViewedDrawer';
import { AffiliateProgramModal } from './components/AffiliateProgramModal';
import { VIPLoyaltyClubModal } from './components/VIPLoyaltyClubModal';
import { LiveStreamShopModal } from './components/LiveStreamShopModal';
import { AIPriceMatcherModal } from './components/AIPriceMatcherModal';
import { GiftCardsModal } from './components/GiftCardsModal';
import { AIVoiceCommanderModal } from './components/AIVoiceCommanderModal';
import { SharedCartRoomModal } from './components/SharedCartRoomModal';
import { PrescriptionUploadModal } from './components/PrescriptionUploadModal';
import { AIVirtualTryOnModal } from './components/AIVirtualTryOnModal';
import { DeviceExchangeModal } from './components/DeviceExchangeModal';
import { B2BWholesaleQuoteModal } from './components/B2BWholesaleQuoteModal';
import { AIBudgetCartBuilderModal } from './components/AIBudgetCartBuilderModal';
import { DailyLoginStreakModal } from './components/DailyLoginStreakModal';
import { SaaSVendorStoreBuilderModal } from './components/SaaSVendorStoreBuilderModal';
import { AIFraudShieldModal } from './components/AIFraudShieldModal';
import { SaaSMultiCourierDispatchModal } from './components/SaaSMultiCourierDispatchModal';
import { SaaSDeveloperWebhooksModal } from './components/SaaSDeveloperWebhooksModal';
import { AISmartBundleUpsellModal } from './components/AISmartBundleUpsellModal';
import { Product3DStudioModal } from './components/Product3DStudioModal';
import { AILiveAuctionRoomModal } from './components/AILiveAuctionRoomModal';
import { DoorstepReturnRefundModal } from './components/DoorstepReturnRefundModal';
import { SaaSVendorAdCampaignModal } from './components/SaaSVendorAdCampaignModal';
import { RecruiterTechLeadModal } from './components/RecruiterTechLeadModal';
import { AIPriceTrackerModal } from './components/AIPriceTrackerModal';
import { AIRecipeDietPlannerModal } from './components/AIRecipeDietPlannerModal';
import { AIAudioReviewModal } from './components/AIAudioReviewModal';
import { LiveCoShoppingRoomModal } from './components/LiveCoShoppingRoomModal';
import { BiometricWebAuthnModal } from './components/BiometricWebAuthnModal';
import { DigitalWarrantyLookupModal } from './components/DigitalWarrantyLookupModal';
import { CustomerNPSRewardModal } from './components/CustomerNPSRewardModal';
import { AIInstantQAModal } from './components/AIInstantQAModal';
import { EcoGreenPackagingModal } from './components/EcoGreenPackagingModal';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderTrackPage } from './pages/OrderTrackPage';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { VendorRegisterPage } from './pages/VendorRegisterPage';
import { RiderPortalPage } from './pages/RiderPortalPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { VendorStorePage } from './pages/VendorStorePage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { FAQPage } from './pages/FAQPage';
import { LuckySpinWheel } from './components/LuckySpinWheel';
import { WhatsAppOrderButton } from './components/WhatsAppOrderButton';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LiveSalesNotification } from './components/LiveSalesNotification';
import { ProductCompareModal } from './components/ProductCompareModal';
import { CompareFloatingBar } from './components/CompareFloatingBar';
import { LiveSupportChat } from './components/LiveSupportChat';
import { ExitIntentModal } from './components/ExitIntentModal';
import { InstallAppBanner } from './components/InstallAppBanner';

import { useAuthStore } from './store/useAuthStore';
import { useProductStore } from './store/useProductStore';

export const App: React.FC = () => {
  const { fetchCurrentUser } = useAuthStore();
  const { fetchProducts } = useProductStore();
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAffiliateOpen, setIsAffiliateOpen] = useState(false);
  const [isVIPOpen, setIsVIPOpen] = useState(false);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [isPriceMatchOpen, setIsPriceMatchOpen] = useState(false);
  const [isGiftCardsOpen, setIsGiftCardsOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isSharedCartOpen, setIsSharedCartOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [isB2BQuoteOpen, setIsB2BQuoteOpen] = useState(false);
  const [isBudgetCartOpen, setIsBudgetCartOpen] = useState(false);
  const [isDailyStreakOpen, setIsDailyStreakOpen] = useState(false);
  const [isSaaSStoreOpen, setIsSaaSStoreOpen] = useState(false);
  const [isFraudShieldOpen, setIsFraudShieldOpen] = useState(false);
  const [isCourierDispatchOpen, setIsCourierDispatchOpen] = useState(false);
  const [isWebhooksOpen, setIsWebhooksOpen] = useState(false);
  const [isSmartUpsellOpen, setIsSmartUpsellOpen] = useState(false);
  const [is3DStudioOpen, setIs3DStudioOpen] = useState(false);
  const [isAuctionOpen, setIsAuctionOpen] = useState(false);
  const [isDoorstepReturnOpen, setIsDoorstepReturnOpen] = useState(false);
  const [isAdCampaignOpen, setIsAdCampaignOpen] = useState(false);
  const [isRecruiterOpen, setIsRecruiterOpen] = useState(false);
  const [isPriceTrackerOpen, setIsPriceTrackerOpen] = useState(false);
  const [isRecipePlannerOpen, setIsRecipePlannerOpen] = useState(false);
  const [isAudioReviewOpen, setIsAudioReviewOpen] = useState(false);
  const [isCoShoppingOpen, setIsCoShoppingOpen] = useState(false);
  const [isBiometricOpen, setIsBiometricOpen] = useState(false);
  const [isWarrantyOpen, setIsWarrantyOpen] = useState(false);
  const [isNPSOpen, setIsNPSOpen] = useState(false);
  const [isQAOpen, setIsQAOpen] = useState(false);
  const [isEcoOpen, setIsEcoOpen] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
    fetchProducts();
  }, [fetchCurrentUser, fetchProducts]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 selection:bg-emerald-600 selection:text-white">
        {/* Main Clean Header matching reference image */}
        <Header
          onOpenAI={() => setIsAIOpen(true)}
          onOpenAffiliate={() => setIsAffiliateOpen(true)}
          onOpenVIP={() => setIsVIPOpen(true)}
          onOpenLive={() => setIsLiveOpen(true)}
          onOpenPriceMatch={() => setIsPriceMatchOpen(true)}
          onOpenGiftCards={() => setIsGiftCardsOpen(true)}
          onOpenVoiceCommander={() => setIsVoiceOpen(true)}
          onOpenSharedCart={() => setIsSharedCartOpen(true)}
          onOpenPrescription={() => setIsPrescriptionOpen(true)}
          onOpenTryOn={() => setIsTryOnOpen(true)}
          onOpenExchange={() => setIsExchangeOpen(true)}
          onOpenB2BQuote={() => setIsB2BQuoteOpen(true)}
          onOpenBudgetCart={() => setIsBudgetCartOpen(true)}
          onOpenDailyStreak={() => setIsDailyStreakOpen(true)}
          onOpenSaaSStoreBuilder={() => setIsSaaSStoreOpen(true)}
          onOpenFraudShield={() => setIsFraudShieldOpen(true)}
          onOpenCourierDispatch={() => setIsCourierDispatchOpen(true)}
          onOpenWebhooks={() => setIsWebhooksOpen(true)}
          onOpenSmartUpsell={() => setIsSmartUpsellOpen(true)}
          onOpen3DStudio={() => setIs3DStudioOpen(true)}
          onOpenAuctionRoom={() => setIsAuctionOpen(true)}
          onOpenDoorstepReturn={() => setIsDoorstepReturnOpen(true)}
          onOpenAdCampaign={() => setIsAdCampaignOpen(true)}
          onOpenRecruiter={() => setIsRecruiterOpen(true)}
        />

        {/* App Main Body */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/track-order" element={<OrderTrackPage />} />
            <Route path="/rider" element={<RiderPortalPage />} />
            <Route path="/rider-portal" element={<RiderPortalPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/customer-login" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/account" element={<ProfilePage />} />
            <Route path="/vendor-register" element={<VendorRegisterPage />} />
            <Route path="/seller-portal" element={<VendorRegisterPage />} />
            <Route path="/seller-center" element={<VendorRegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/terms-and-conditions" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/faqs" element={<FAQPage />} />
            <Route path="/refund" element={<TermsPage />} />
            <Route path="/refund-policy" element={<TermsPage />} />
            <Route path="/shipping-policy" element={<TermsPage />} />
            <Route path="/store/:slug" element={<VendorStorePage />} />
          </Routes>
        </main>

        {/* Recently Viewed Products Drawer */}
        <RecentViewedDrawer />

        {/* ShopX Live Video Commerce Stream Modal */}
        <LiveStreamShopModal
          isOpen={isLiveOpen}
          onClose={() => setIsLiveOpen(false)}
        />

        {/* AI Voice Shopping Commander Modal */}
        <AIVoiceCommanderModal
          isOpen={isVoiceOpen}
          onClose={() => setIsVoiceOpen(false)}
        />

        {/* Shared Cart Room & Split Bill Modal */}
        <SharedCartRoomModal
          isOpen={isSharedCartOpen}
          onClose={() => setIsSharedCartOpen(false)}
        />

        {/* Prescription Upload & Medicine Delivery Modal */}
        <PrescriptionUploadModal
          isOpen={isPrescriptionOpen}
          onClose={() => setIsPrescriptionOpen(false)}
        />

        {/* AI Price Match & Competitor Scanner Modal */}
        <AIPriceMatcherModal
          isOpen={isPriceMatchOpen}
          onClose={() => setIsPriceMatchOpen(false)}
        />

        {/* Digital Gift Cards & E-Vouchers Modal */}
        <GiftCardsModal
          isOpen={isGiftCardsOpen}
          onClose={() => setIsGiftCardsOpen(false)}
        />

        {/* Affiliate Partner Modal */}
        <AffiliateProgramModal
          isOpen={isAffiliateOpen}
          onClose={() => setIsAffiliateOpen(false)}
        />

        {/* VIP Loyalty Tier Club Modal */}
        <VIPLoyaltyClubModal
          isOpen={isVIPOpen}
          onClose={() => setIsVIPOpen(false)}
        />

        {/* AI Virtual Try-On AR Studio Modal */}
        <AIVirtualTryOnModal
          isOpen={isTryOnOpen}
          onClose={() => setIsTryOnOpen(false)}
        />

        {/* Device Exchange & Trade-In Modal */}
        <DeviceExchangeModal
          isOpen={isExchangeOpen}
          onClose={() => setIsExchangeOpen(false)}
        />

        {/* B2B Wholesale & Corporate Quotation Modal */}
        <B2BWholesaleQuoteModal
          isOpen={isB2BQuoteOpen}
          onClose={() => setIsB2BQuoteOpen(false)}
        />

        {/* AI Smart Budget Cart Builder Modal */}
        <AIBudgetCartBuilderModal
          isOpen={isBudgetCartOpen}
          onClose={() => setIsBudgetCartOpen(false)}
        />

        {/* 7-Day Daily Login Streak & Rewards Modal */}
        <DailyLoginStreakModal
          isOpen={isDailyStreakOpen}
          onClose={() => setIsDailyStreakOpen(false)}
        />

        {/* SaaS Multi-Tenant Vendor Storefront Builder Modal */}
        <SaaSVendorStoreBuilderModal
          isOpen={isSaaSStoreOpen}
          onClose={() => setIsSaaSStoreOpen(false)}
        />

        {/* AI COD Fraud Detection & RTO Risk Shield Modal */}
        <AIFraudShieldModal
          isOpen={isFraudShieldOpen}
          onClose={() => setIsFraudShieldOpen(false)}
        />

        {/* SaaS Multi-Courier Automated Rate & Dispatch Modal */}
        <SaaSMultiCourierDispatchModal
          isOpen={isCourierDispatchOpen}
          onClose={() => setIsCourierDispatchOpen(false)}
        />

        {/* SaaS Developer API & Webhooks Testing Engine Modal */}
        <SaaSDeveloperWebhooksModal
          isOpen={isWebhooksOpen}
          onClose={() => setIsWebhooksOpen(false)}
        />

        {/* AI Frequently Bought Together Smart Upsell Combo Modal */}
        <AISmartBundleUpsellModal
          isOpen={isSmartUpsellOpen}
          onClose={() => setIsSmartUpsellOpen(false)}
        />

        {/* Interactive 3D WebGL & AR Studio Modal */}
        <Product3DStudioModal
          isOpen={is3DStudioOpen}
          onClose={() => setIs3DStudioOpen(false)}
        />

        {/* AI Live Auction & Bid Battle Room Modal */}
        <AILiveAuctionRoomModal
          isOpen={isAuctionOpen}
          onClose={() => setIsAuctionOpen(false)}
        />

        {/* 7-Day Doorstep Return & Instant Refund Modal */}
        <DoorstepReturnRefundModal
          isOpen={isDoorstepReturnOpen}
          onClose={() => setIsDoorstepReturnOpen(false)}
        />

        {/* SaaS AI Ad Campaign & Creative Studio Modal */}
        <SaaSVendorAdCampaignModal
          isOpen={isAdCampaignOpen}
          onClose={() => setIsAdCampaignOpen(false)}
        />

        {/* Recruiter, Senior Tech Lead & Investor System Architecture Modal */}
        <RecruiterTechLeadModal
          isOpen={isRecruiterOpen}
          onClose={() => setIsRecruiterOpen(false)}
        />

        {/* AI Smart Price Drop Radar Modal */}
        <AIPriceTrackerModal
          isOpen={isPriceTrackerOpen}
          onClose={() => setIsPriceTrackerOpen(false)}
        />

        {/* AI Organic Food Nutrition & Diet Planner Modal */}
        <AIRecipeDietPlannerModal
          isOpen={isRecipePlannerOpen}
          onClose={() => setIsRecipePlannerOpen(false)}
        />

        {/* AI 30s Voice Podcast Review Modal */}
        <AIAudioReviewModal
          isOpen={isAudioReviewOpen}
          onClose={() => setIsAudioReviewOpen(false)}
        />

        {/* Real-time Co-Shopping Room Modal */}
        <LiveCoShoppingRoomModal
          isOpen={isCoShoppingOpen}
          onClose={() => setIsCoShoppingOpen(false)}
        />

        {/* WebAuthn Biometric Authentication Modal */}
        <BiometricWebAuthnModal
          isOpen={isBiometricOpen}
          onClose={() => setIsBiometricOpen(false)}
        />

        {/* Digital Warranty & RMA Serial Lookup Modal */}
        <DigitalWarrantyLookupModal
          isOpen={isWarrantyOpen}
          onClose={() => setIsWarrantyOpen(false)}
        />

        {/* Customer Satisfaction NPS ৳50 Reward Modal */}
        <CustomerNPSRewardModal
          isOpen={isNPSOpen}
          onClose={() => setIsNPSOpen(false)}
        />

        {/* AI Instant Product Q&A Copilot Modal */}
        <AIInstantQAModal
          isOpen={isQAOpen}
          onClose={() => setIsQAOpen(false)}
        />

        {/* Eco-Friendly Packaging & Carbon Offset Modal */}
        <EcoGreenPackagingModal
          isOpen={isEcoOpen}
          onClose={() => setIsEcoOpen(false)}
        />

        {/* Global Cart Slideout Drawer */}
        <CartDrawer />

        {/* Global Floating AI Shopping Copilot Trigger */}
        <FloatingAITrigger onOpenAI={() => setIsAIOpen(true)} />

        {/* Google Gemini & GPT-4o AI Shopping Assistant Bot */}
        <AIAssistantModal isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

        {/* Footer */}
        <Footer />

        {/* Daraz-Style Mobile Persistent App Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </Router>

  );
};
