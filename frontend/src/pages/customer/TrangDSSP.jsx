
import React, { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

// SỬA: Import API thật và Mock Collection (chỉ để lấy ảnh banner)
import { getAllProducts } from '../../services/authService'; 
import { MOCK_COLLECTIONS } from '../../duLieu.js'; 

import Footer from '../../components/Footer.jsx'; 
import Header from '../../components/Header';
import FloatingNavbar from '../../components/DieuHuongNoi';
import MenuOverlay from '../../components/MenuOverlay';
import videoBanner from '../../assets/videos/Banner2.mp4';
import ProductCard from '../../components/ProductCard'; 
import './TrangDSSP.css'; 

// Component Thanh Filter (Giữ nguyên cho đẹp)
const FilterBar = ({ collectionName }) => (
  <div className="filter-bar-container">
    <div className="filter-buttons">
      <button className="filter-btn"><span>{collectionName}</span><ChevronDown size={9} /></button>
      <button className="filter-btn"><span>Chương trình khuyến mãi</span><ChevronDown size={9} /></button>
      <button className="filter-btn"><span>Kích cỡ</span><ChevronDown size={9} /></button>
      <button className="filter-btn"><span>Màu sắc</span><ChevronDown size={9} /></button>
      <button className="filter-btn"><span>Giá</span><ChevronDown size={9} /></button>
    </div>
  </div>
);

const ProductListPage = () => {
  const { collectionId, name } = useParams();
  const navigate = useNavigate(); 
  
  // STATE CHỨA DỮ LIỆU THẬT
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 1. Kiểm tra đăng nhập
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) setIsAuthenticated(true);
  }, []);

  // 2. GỌI API LẤY SẢN PHẨM THẬT (Thay thế MOCK_PRODUCTS)
  useEffect(() => {
    const fetchRealProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts(); // Gọi API
        setProducts(data); // Lưu vào state
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealProducts();
  }, [collectionId]); // Chạy lại khi chuyển danh mục (sau này lọc ở đây)

  // Logic hiển thị Tiêu đề (Lấy từ Mock Collection)
  let title;
  if (collectionId) {
    const collection = MOCK_COLLECTIONS.find(c => c.id === parseInt(collectionId));
    title = collection ? collection.title : "Sản phẩm";
  } else if (name) {
    title = name;
  } else {
    title = "Tất cả sản phẩm";
  }

  const handleLogoClick = () => navigate('/'); 
  const handleUserClick = () => isAuthenticated ? navigate('/member') : navigate('/auth');

  return (
    <div className="product-list-page">
      <Header 
        variant="solid" 
        onMenuEnter={() => setIsMenuOpen(true)}
        onLogoClick={handleLogoClick}
      />
      
      {/* Banner Video */}
      <div className="video-banner-container">
        <video className="video-banner" src={videoBanner} autoPlay loop muted playsInline />
      </div>

      <main className="product-list-main">
        <FilterBar collectionName={title} /> 
        
        {loading ? (
            <div style={{textAlign:'center', padding:'50px', color: '#666'}}>Đang tải danh sách sản phẩm...</div>
        ) : (
            <>
                <p className="product-count">{products.length} Sản phẩm</p>
                
                {products.length > 0 ? (
                    <div className="product-grid">
                    {/* Render danh sách sản phẩm thật */}
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                    </div>
                ) : (
                    <div style={{textAlign:'center', padding:'50px'}}>
                        <p>Chưa có sản phẩm nào trong kho.</p>
                        <p style={{fontSize:'0.9rem', color:'#888'}}>Vui lòng vào trang Admin để nhập thêm hàng.</p>
                    </div>
                )}
            </>
        )}
      </main>
      
      <FloatingNavbar onHomeClick={handleLogoClick} onUserClick={handleUserClick} />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onMenuLeave={() => setIsMenuOpen(false)} />
      <Footer />
    </div>
  );
};

export default ProductListPage;