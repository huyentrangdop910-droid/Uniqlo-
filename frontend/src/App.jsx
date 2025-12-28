/*import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

// --- CÁC TRANG (TÁCH RA TỪ TRƯỚC) ---

// 1. Trang chủ sẽ gọi API
function HomePage() {
  const [products, setProducts] = useState([]); // State để lưu sản phẩm
  const [loading, setLoading] = useState(true); // State cho trạng thái tải

  // 2. useEffect sẽ chạy 1 lần khi trang được tải
  useEffect(() => {
    // Hàm gọi API
    const fetchProducts = async () => {
      try {
        // 3. GỌI API BACKEND (CỔNG 8080)
        const response = await axios.get('http://localhost:8080/api/products');
        setProducts(response.data); // Lưu dữ liệu vào state
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        // (Bạn có thể thêm state [error, setError] ở đây)
      } finally {
        setLoading(false); // Dừng loading
      }
    };

    fetchProducts(); // Gọi hàm
  }, []); // [] đảm bảo chỉ chạy 1 lần

  // 4. Hiển thị dữ liệu
  if (loading) return <p>Đang tải sản phẩm từ Backend...</p>;

  return (
    <div>
      <h2>Trang Chủ (Home Page)</h2>
      <p>Đã kết nối và lấy được {products.length} sản phẩm từ Spring Boot!</p>
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h4>{product.name}</h4>
            <p>Giá: {product.price} VND</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchPage() {
  return <h2>Trang Tìm Kiếm</h2>;
}

function ProductDetailPage() {
  return <h2>Trang Chi Tiết Sản Phẩm</h2>;
}

// --- COMPONENT APP CHÍNH ---
function App() {
  return (
    <div className="App">
      <nav style={{ padding: '20px', backgroundColor: '#f4f4f4' }}>
        <Link to="/" style={{ marginRight: '20px' }}>**Rentzy (Logo)**</Link>
        <Link to="/search">Tìm kiếm</Link>
      </nav>

      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;*/

import React from 'react';
//import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
// Lỗi sẽ hết khi bạn tạo file App.css
 

// Lỗi sẽ hết khi bạn tạo file HomePage.jsx
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
  /*const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    // Gọi API từ backend khi component được render
    fetch('http://localhost:8080/api/v1/health')
      .then(response => response.text()) // Lấy dữ liệu trả về dạng text
      .then(data => setBackendMessage(data)) // Cập nhật state
      .catch(error => console.error("Error fetching data:", error));
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần
  // ĐOẠN CODE MỚI KẾT THÚC

  // ... (Phần code <Routes> ... </Routes> của bạn giữ nguyên)*/

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
        {/* THÊM ROUTE MỚI NÀY */}
<Route path="/product/:productId" element={<TrangChiTietSanPham />} />
{/* ... (các route cũ) ... */}
<Route path="/search" element={<TrangTimKiem />} />
<Route path="/cart" element={<TrangGioHang />} />
<Route path="/write-review/:productId" element={<TrangVietDanhGia />} />
<Route path="/checkout" element={<CheckoutPage />} />
<Route path="/payment-result" element={<PaymentResultPage />} />
        
        {/* Sau này bạn có thể thêm các route khác ở đây */}
        
       <Route path="/admin" element={<AdminLoginPage />} />
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/staff" element={<StaffLoginPage />} />
    <Route path="/staff/dashboard" element={<StaffDashboard />} />
      </Routes>
    
  );
}

export default App;

