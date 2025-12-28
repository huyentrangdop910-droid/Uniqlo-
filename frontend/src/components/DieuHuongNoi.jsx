// frontend/src/components/DieuHuongNoi.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, User, X } from 'lucide-react';
import './DieuHuongNoi.css'; // (Hoặc .css tương ứng)

const DieuHuongNoi = ({ onHomeClick, onUserClick }) => {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const isSearchPage = location.pathname === '/search';
  const isHomePage = location.pathname === '/';

  // Hàm cho nút X
  const handleCloseClick = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  return (
    <nav className="floating-nav">
      
      {/* ===== SỬA LOGIC NÚT HOME ===== */}
      {isHomePage ? (
        <button onClick={onHomeClick} className="floating-nav-button">
          <Home size={32} />
        </button>
      ) : (
        // NẾU LÀ TRANG KHÁC: Dùng Link để về /
        <Link to="/" className="floating-nav-button">
          <Home size={32} />
        </Link>
      )}
      
      {/* Nút 🔍 hoặc X (Logic này đã đúng) */}
      {isSearchPage ? (
        <button 
          onClick={handleCloseClick} 
          className="floating-nav-button search-toggle active"
        >
          <X size={32} />
        </button>
      ) : (
        <Link to="/search" className="floating-nav-button search-toggle">
          <Search size={32} />
        </Link>
      )}
      
      {/* Nút User (Logic này đã đúng) */}
      <button onClick={onUserClick} className="floating-nav-button">
        <User size={32} />
      </button>
    </nav>
  );
};

export default DieuHuongNoi;