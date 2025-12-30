
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Heart, ShoppingCart, MessageCircle, User } from 'lucide-react'; 
import CustomerChat from './CustomerChat'; 
import './Header.css'; 

const Header = ({ variant, onMenuEnter, onLogoClick }) => {
  const navigate = useNavigate();
  // State quản lý việc mở/đóng cửa sổ chat
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Hàm xử lý khi bấm vào icon Chat
  const handleChatClick = () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        // Nếu chưa đăng nhập thì hỏi người dùng
        if(window.confirm("Bạn cần đăng nhập để chat với nhân viên. Đi đến trang đăng nhập?")) {
            navigate('/auth');
        }
    } else {
        // Đã đăng nhập thì bật/tắt chat
        setIsChatOpen(!isChatOpen);
    }
  };

  // Hàm xử lý khi bấm vào icon User (vào trang thành viên hoặc login)
  

  return (
    <>
      <header
        className={`header-container ${variant === 'transparent' ? 'transparent' : 'solid'}`}
      >
        <div className="header-left">
          <button onMouseEnter={onMenuEnter} className="floating-icon-button">
            <Menu size={28} />
          </button>
          <span
            className="header-logo"
            onClick={onLogoClick}
            style={{ cursor: 'pointer' }}
          >
            UNIQLO
          </span>
        </div>

        <div className="header-right">
          
          {/* --- ICON CHAT (MỚI) --- */}
          <button className="floating-icon-button" onClick={handleChatClick}>
            <MessageCircle size={28} />
          </button>

          {/* --- ICON USER (Vào trang cá nhân) --- */}
          

          <button className="floating-icon-button">
            <Heart size={28} />
          </button>
          
          <Link to="/cart" className="floating-icon-button">
            <ShoppingCart size={28} />
          </Link>
        </div>
      </header>

      {/* --- COMPONENT CỬA SỔ CHAT --- */}
      {/* Nó sẽ hiển thị nổi lên trên trang web khi isChatOpen = true */}
      <CustomerChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default Header;