import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Product from './pages/Product.jsx';
import Cart from './pages/Cart.jsx';
import AboutUs from './pages/AboutUs.jsx';
import ContactUs from './pages/ContactUs.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import SingleProduct from './pages/SingleProduct.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import VerifyOtp from './pages/VerifyOtp.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';

// VENDOR IMPORTS - Explicitly using .jsx extension
import VendorHome from './pages/Vendor/VendorHome.jsx';
import AddArtwork from './pages/Vendor/AddArtwork.jsx'; 

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const hideLayout = [
    '/login', '/register', '/verify-email', 
    '/forgot-password', '/verify-otp', '/reset-password'
  ].includes(location.pathname);

  return (
    <>
      {!hideLayout && <Nav />}
      <main className={!hideLayout ? 'min-h-[70vh]' : ''}>{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to="/" replace />;
  return children;
};

const App = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <LayoutWrapper>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute><Product /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/product/:id" element={<ProtectedRoute><SingleProduct /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            <Route path="/vendor" element={
              <ProtectedRoute allowedRoles={['vendor', 'admin']}><VendorHome /></ProtectedRoute>
            } />
            <Route path="/vendor/add-artwork" element={
              <ProtectedRoute allowedRoles={['vendor', 'admin']}><AddArtwork /></ProtectedRoute>
            } />

            <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </LayoutWrapper>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;