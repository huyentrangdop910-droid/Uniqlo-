// frontend/src/components/MenuOverlay.jsx
import React from 'react';
import { X, MapPin, Shirt, Newspaper, Zap, Percent, Ruler, Redo, HomeIcon, Gift,Flame } from 'lucide-react';
import { MOCK_COLLECTIONS, MENU_CATEGORIES, TOPICS_DATA } from '../duLieu.js';
import './MenuOverlay.css'; // Chúng ta sẽ tạo file CSS này
import { Link } from 'react-router-dom'; // <-- THÊM DÒNG NÀY

// ÁNH XẠ TÊN CHUỖI VỚI COMPONENT ICON
const iconComponents = {
  Newspaper: Newspaper,
  Ruler: Ruler,
  Percent: Percent,
  Shirt: Shirt,
  Redo: Redo,
  Gift: Gift,
  HomeIcon: HomeIcon,
  Zap: Zap,
  Flame: Flame
};

// ===== Component Menu MỚI (Click, có Topics) =====
const MenuOverlay = ({ isOpen, onClose, onMenuLeave }) => {
  if (!isOpen) return null;

  return (
    <div
      className="menu-overlay"
      onMouseLeave={onMenuLeave} 
    >
      {/* Header của Menu (Logo và nút X) */}
      <div className="menu-header">
        <span className="header-logo">UNIQLO</span>
        <button onClick={onClose} className="close-button">
          <X size={24} />
        </button>
      </div>

      {/* Grid Menu Mới với Icon */}
      <nav className="menu-nav-grid">
        {MENU_CATEGORIES.map((item) => {
          const IconComponent = iconComponents[item.icon];
          return (
            <Link
        to={`/category/${item.name}`}// TẤT CẢ đều trỏ về 1 trang sản phẩm mẫu
        key={item.name}
        className="menu-nav-item"
        onClick={onClose} // THÊM: Tự động đóng menu khi nhấp
      >
        <div className="menu-item-icon-wrapper">
          {IconComponent ? <IconComponent size={20} /> : null}
        </div>
        <span>{item.name}</span>
      </Link>
          );
        })}
      </nav>

      {/* THÊM: Phần TOPICS */}
      <section className="topics-section">
        {/* ... (Code của Topics section) ... */}
        <h2 className="topics-title">TOPICS</h2>
                <div className="topics-grid">
                  {TOPICS_DATA.map((topic) => (
                    <a href="#/" key={topic.title} className="topic-card">
                      <img src={topic.imageUrl} alt={topic.title} />
                      <div className="topic-card-content">
                        <h3>{topic.title}</h3>
                        <p>{topic.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
      </section>

      {/* THÊM: Phần Thông Tin Cửa Hàng */}
      <section className="store-info-section">
        {/* ... (Code của Store Info section) ... */}
        <h2 className="store-info-title">Thông Tin Cửa Hàng</h2>
                <div className="store-info-main">
                  {/* Link Map */}
                  <a href="#/" className="store-info-map-link">
                    <MapPin size={32} />
                    <span>Hệ thống cửa hàng</span>
                  </a>
                  {/* 3 Card cửa hàng */}
                  <div className="store-info-cards">
                    <a href="#/" className="store-card">
                    <img src="https://im.uniqlo.com/global-cms/spa/res9663d294f99ec37e52f2499872506ee3fr.jpg"></img>
                      <div className="store-card-content">
                        <h3>UNOQLO Vincom Lê Văn Việt</h3>
                        <p>Khám phá ngay tại TP.Hồ Chí Minh.</p>
                      </div>
                    </a>
                    <a href="#/" className="store-card">
                    <img src="https://im.uniqlo.com/global-cms/spa/res904e2d19437017c44ce7d323c3cdc163fr.jpg"></img>
                      <div className="store-card-content">
                        <h3>UNIQLO AEON Mall Huế</h3>
                        <p>Khám phá ngay tại Thành Phố Huế.</p>
                      </div>
                    </a>
                    <a href="#/" className="store-card">
                    <img src="https://im.uniqlo.com/global-cms/spa/res1a80c2f329715205505d77215d6befe2fr.jpg"></img>
                      <div className="store-card-content">
                        <h3>UNIQLO Vincom Thảo Điền</h3>
                        <p>Khám phá ngay tại TP.Thủ Đức.</p>
                      </div>
                    </a>
                  </div>
                </div>

      </section>
    </div>
  );
};

export default MenuOverlay;