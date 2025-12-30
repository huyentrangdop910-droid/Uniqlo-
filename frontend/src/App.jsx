

import React from 'react';
//import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
//  tạo file App.css
//  tạo file HomePage.jsx
import HomePage from './pages/customer/HomePage'; 
import MemberPage from './pages/customer/MemberPage.jsx';
import AuthPage from './pages/customer/AuthPage.jsx';
import TrangDSSP from './pages/customer/TrangDSSP.jsx';
import TrangChiTietSanPham from './pages/customer/TrangChiTietSanPham';
import TrangTimKiem from './pages/customer/TrangTimKiem';
import TrangGioHang from './pages/customer/TrangGioHang';
import TrangVietDanhGia from './pages/customer/TrangVietDanhGia';
import CheckoutPage from './pages/customer/CheckoutPage';
import PaymentResultPage from './pages/customer/PaymentResultPage';
// ... (các import khác)
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import StaffLoginPage from './pages/staff/StaffLoginPage.jsx';
import StaffDashboard from './pages/staff/StaffDashboard';


/**
 * Đây là component App chính.
 * Vai trò của nó CHỈ là điều hướng.
 */
function App() {
  

  return (
      
      
      /*<div style={{ padding: '10px', backgroundColor: '#333', color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Trạng thái Backend: {backendMessage || 'Đang tải...'}     
      </div> */   
      <Routes>
        {/* Route cho trang Bán Hàng (Khách hàng) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/member" element={<MemberPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/collection/:collectionId" element={<TrangDSSP />} />
        <Route path="/category/:name" element={<TrangDSSP />} />
        {/* THÊM  */}
        <Route path="/product/:productId" element={<TrangChiTietSanPham />} />
        <Route path="/search" element={<TrangTimKiem />} />
        <Route path="/cart" element={<TrangGioHang />} />
        <Route path="/write-review/:productId" element={<TrangVietDanhGia />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment-result" element={<PaymentResultPage />} />
       <Route path="/admin" element={<AdminLoginPage />} />
       <Route path="/admin/dashboard" element={<AdminDashboard />} />
       <Route path="/staff" element={<StaffLoginPage />} />
       <Route path="/staff/dashboard" element={<StaffDashboard />} />
      </Routes>
    
  );
}

export default App;

