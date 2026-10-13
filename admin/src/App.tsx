import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsAdminPage } from './pages/ProductsAdminPage';
import { OrdersAdminPage } from './pages/OrdersAdminPage';
import { VendorsAdminPage } from './pages/VendorsAdminPage';
import { RidersAdminPage } from './pages/RidersAdminPage';
import { SaaSSubscriptionsAdminPage } from './pages/SaaSSubscriptionsAdminPage';
import { UsersAdminPage } from './pages/UsersAdminPage';
import { CategoriesAdminPage } from './pages/CategoriesAdminPage';
import { CouponsAdminPage } from './pages/CouponsAdminPage';
import { SettingsAdminPage } from './pages/SettingsAdminPage';
import { AnalyticsAdminPage } from './pages/AnalyticsAdminPage';
import { ReviewsAdminPage } from './pages/ReviewsAdminPage';
import { FraudShieldAdminPage } from './pages/FraudShieldAdminPage';
import { SupportAdminPage } from './pages/SupportAdminPage';
import { InventoryAdminPage } from './pages/InventoryAdminPage';
import { AuditLogsAdminPage } from './pages/AuditLogsAdminPage';
import { BroadcastAdminPage } from './pages/BroadcastAdminPage';
import { GatewaysAdminPage } from './pages/GatewaysAdminPage';
import { BannersAdminPage } from './pages/BannersAdminPage';
import { AbandonedCartsAdminPage } from './pages/AbandonedCartsAdminPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { useAdminAuthStore } from './store/useAdminAuthStore';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAdminAuthStore();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto bg-slate-950">{children}</main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const { fetchCurrentUser, user, token } = useAdminAuthStore();
  const [isInitializing, setIsInitializing] = React.useState(Boolean(token && !user));

  useEffect(() => {
    if (token && !user) {
      fetchCurrentUser().finally(() => setIsInitializing(false));
    } else {
      setIsInitializing(false);
    }
  }, []);

  if (isInitializing) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center animate-spin text-lg font-black">
          SX
        </div>
        <p className="text-xs text-slate-400 font-mono tracking-widest">VERIFYING 2FA SESSION...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedLayout>
              <DashboardPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedLayout>
              <AnalyticsAdminPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedLayout>
              <ProductsAdminPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedLayout>
              <CategoriesAdminPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/coupons"
          element={
            <ProtectedLayout>
              <CouponsAdminPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedLayout>
              <OrdersAdminPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/reviews"
          element={
            <ProtectedLayout>
              <ReviewsAdminPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedLayout>
              <UsersAdminPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/vendors"
          element={
            <ProtectedLayout>
              <VendorsAdminPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <ProtectedLayout>
              <SaaSSubscriptionsAdminPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/riders"
          element={
            <ProtectedLayout>
              <RidersAdminPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/fraud-shield"
          element={
            <ProtectedLayout>
              <FraudShieldAdminPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/support"
          element={
            <ProtectedLayout>
              <SupportAdminPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedLayout>
              <InventoryAdminPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <ProtectedLayout>
              <AuditLogsAdminPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/broadcast"
          element={
            <ProtectedLayout>
              <BroadcastAdminPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/gateways"
          element={
            <ProtectedLayout>
              <GatewaysAdminPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/banners"
          element={
            <ProtectedLayout>
              <BannersAdminPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/abandoned-carts"
          element={
            <ProtectedLayout>
              <AbandonedCartsAdminPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedLayout>
              <SettingsAdminPage />
            </ProtectedLayout>
          }
        />
      </Routes>
    </Router>
  );
};

