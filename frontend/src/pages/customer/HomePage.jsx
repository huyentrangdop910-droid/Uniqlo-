import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import LoginPromptModal from '../../components/LoginPromptModal'; 
// Import các icon
import {
  Menu, X, Heart, ShoppingCart, Home, Search, User,
  MapPin, Shirt, Newspaper, Zap, Percent, Ruler, Redo, HomeIcon, Gift
} from 'lucide-react';

import './HomePage.css';

import { MOCK_COLLECTIONS, MENU_CATEGORIES, TOPICS_DATA } from '../../duLieu.js';
import FloatingNavbar from '../../components/DieuHuongNoi';
import Header from '../../components/Header';
import MenuOverlay from '../../components/MenuOverlay';

// ÁNH XẠ TÊN CHUỖI VỚI COMPONENT ICON
const iconComponents = {
  Newspaper: Newspaper,
  Ruler: Ruler,
  Percent: Percent,
  Shirt: Shirt,
  Redo: Redo,
  Gift: Gift,
  HomeIcon: HomeIcon,
  Zap: Zap
};

// ===== Component Chỉ báo Slider (Các dấu chấm) =====
const SliderIndicator = ({ totalSlides, currentSlide }) => (
  <div className="slider-indicator">
    {Array.from({ length: totalSlides }).map((_, index) => (
      <div
        key={index}
        className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
      />
    ))}
  </div>
);

// ===== Component Slider Cuộn Dọc Chính =====
const VerticalSlider = React.forwardRef(({ setCurrentSlide }, ref) => {
  const navigate = useNavigate();// SỬA: Thêm useNavigate để điều hướng khi cần

  const handleScroll = () => {
    if (ref.current) { 
      const { scrollTop, clientHeight } = ref.current;
      const newIndex = Math.round(scrollTop / clientHeight);
      setCurrentSlide(newIndex);
    }
  };

  return (
    <div
      ref={ref} 
      onScroll={handleScroll}
      className="vertical-slider"
    >
      {MOCK_COLLECTIONS.map((collection) => (
        <div
          key={collection.id}
          className="slider-item"
          style={{ backgroundImage: `url(${collection.imageUrl})`, cursor: 'pointer'}}
          onClick={() => navigate(`/collection/${collection.id}`)}
        >
          <div className="slider-content">
            <h1>{collection.title}</h1>
            <p>{collection.description}</p>
            <h3 className="slider-price">{collection.price}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}); 





// ===== Component HomePage Chính (Tổ hợp tất cả lại) =====
const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  

  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    setCurrentSlide(0);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Xử lý khi click icon User
  const handleUserClick = () => {
    if (isAuthenticated) {
      navigate('/member');
    } else {
      setIsLoginPromptOpen(true); 
    }
  };
  

  const handleConfirmLogin = () => {
    setIsLoginPromptOpen(false); // Đóng modal thông báo
    navigate('/auth'); 
  };

  return (
    <div className="main-container">
      <Header
        variant="transparent"
        onMenuEnter={() => setIsMenuOpen(true)}
        onLogoClick={handleLogoClick}
        
      />

      <main className="main-content">
        <VerticalSlider
          setCurrentSlide={setCurrentSlide}
          ref={sliderRef}
        />
        <SliderIndicator
          totalSlides={MOCK_COLLECTIONS.length}
          currentSlide={currentSlide}
        />
       
        <FloatingNavbar 
        onUserClick={handleUserClick} 
        onHomeClick={handleLogoClick}/>
      </main> 
      
      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)} 
        onMenuLeave={() => setIsMenuOpen(false)} 
      />
      
      
      <LoginPromptModal
        isOpen={isLoginPromptOpen}
        onClose={() => setIsLoginPromptOpen(false)} // Bấm 'X'
        onConfirm={handleConfirmLogin} // Bấm 'OK'
      />
      
      

    </div>
  );
};

export default HomePage;


