import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { RoleSwitcherBanner } from './components/common/RoleSwitcherBanner';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';

// Buyer Pages
import { HomePage } from './pages/buyer/HomePage';
import { ProductListingPage } from './pages/buyer/ProductListingPage';
import { ProductDetailPage } from './pages/buyer/ProductDetailPage';
import { CartPage } from './pages/buyer/CartPage';
import { CheckoutPage } from './pages/buyer/CheckoutPage';
import { OrderSuccessPage } from './pages/buyer/OrderSuccessPage';
import { OrdersPage } from './pages/buyer/OrdersPage';
import { OrderTrackingPage } from './pages/buyer/OrderTrackingPage';
import { WishlistPage } from './pages/buyer/WishlistPage';
import { ProfilePage } from './pages/buyer/ProfilePage';
import { SellerOnboardingPage } from './pages/buyer/SellerOnboardingPage';

// Seller Pages
import { SellerLayout } from './pages/seller/SellerLayout';
import { SellerOverviewPage } from './pages/seller/SellerOverviewPage';
import { SellerAddProductPage } from './pages/seller/SellerAddProductPage';
import { SellerProductsPage } from './pages/seller/SellerProductsPage';
import { SellerOrdersPage } from './pages/seller/SellerOrdersPage';
import { SellerEarningsPage } from './pages/seller/SellerEarningsPage';
import { SellerAnalyticsPage } from './pages/seller/SellerAnalyticsPage';
import { SellerSettingsPage } from './pages/seller/SellerSettingsPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminSellersPage } from './pages/admin/AdminSellersPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminPayoutsPage } from './pages/admin/AdminPayoutsPage';
import { AdminPromotionsPage } from './pages/admin/AdminPromotionsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminAiInsightsPage } from './pages/admin/AdminAiInsightsPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Buyer Public Shell with Header and Footer
const BuyerShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF7F0]">
      <RoleSwitcherBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Buyer Public Routes */}
        <Route
          path="/"
          element={
            <BuyerShell>
              <HomePage />
            </BuyerShell>
          }
        />
        <Route
          path="/products"
          element={
            <BuyerShell>
              <ProductListingPage />
            </BuyerShell>
          }
        />
        <Route
          path="/products/:id"
          element={
            <BuyerShell>
              <ProductDetailPage />
            </BuyerShell>
          }
        />
        <Route
          path="/cart"
          element={
            <BuyerShell>
              <CartPage />
            </BuyerShell>
          }
        />
        <Route
          path="/checkout"
          element={
            <BuyerShell>
              <CheckoutPage />
            </BuyerShell>
          }
        />
        <Route
          path="/order-success/:orderId"
          element={
            <BuyerShell>
              <OrderSuccessPage />
            </BuyerShell>
          }
        />
        <Route
          path="/orders"
          element={
            <BuyerShell>
              <OrdersPage />
            </BuyerShell>
          }
        />
        <Route
          path="/orders/track/:subOrderId"
          element={
            <BuyerShell>
              <OrderTrackingPage />
            </BuyerShell>
          }
        />
        <Route
          path="/wishlist"
          element={
            <BuyerShell>
              <WishlistPage />
            </BuyerShell>
          }
        />
        <Route
          path="/profile"
          element={
            <BuyerShell>
              <ProfilePage />
            </BuyerShell>
          }
        />
        <Route
          path="/seller/onboarding"
          element={
            <BuyerShell>
              <SellerOnboardingPage />
            </BuyerShell>
          }
        />

        {/* Seller Portal Routes */}
        <Route
          path="/seller"
          element={
            <>
              <RoleSwitcherBanner />
              <SellerLayout />
              <ToastContainer />
            </>
          }
        >
          <Route index element={<SellerOverviewPage />} />
          <Route path="products/new" element={<SellerAddProductPage />} />
          <Route path="products" element={<SellerProductsPage />} />
          <Route path="orders" element={<SellerOrdersPage />} />
          <Route path="earnings" element={<SellerEarningsPage />} />
          <Route path="analytics" element={<SellerAnalyticsPage />} />
          <Route path="settings" element={<SellerSettingsPage />} />
        </Route>

        {/* Admin Portal Routes */}
        <Route
          path="/admin"
          element={
            <>
              <RoleSwitcherBanner />
              <AdminLayout />
              <ToastContainer />
            </>
          }
        >
          <Route index element={<AdminOverviewPage />} />
          <Route path="sellers" element={<AdminSellersPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="payouts" element={<AdminPayoutsPage />} />
          <Route path="promotions" element={<AdminPromotionsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="ai-insights" element={<AdminAiInsightsPage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
