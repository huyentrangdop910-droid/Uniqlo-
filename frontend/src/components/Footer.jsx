// frontend/src/components/ChanTrang.jsx
import React from 'react';
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import './Footer.css'; // SỬA: Đổi tên file CSS

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Cột 1: Về Uniqlo */}
          <div className="footer-column">
            <h3 className="footer-heading">Về Uniqlo</h3>
            <a href="#/" className="footer-link">Thông tin</a>
            <a href="#/" className="footer-link">Danh sách cửa hàng</a>
            <a href="#/" className="footer-link">Cơ Hội Nghề Nghiệp</a>
          </div>
          
          {/* Cột 2: Trợ giúp */}
          <div className="footer-column">
            <h3 className="footer-heading">Trợ giúp</h3>
            <a href="#/" className="footer-link">FAQ</a>
            <a href="#/" className="footer-link">Chính sách trả hàng</a>
            <a href="#/" className="footer-link">Chính sách bảo mật</a>
            <a href="#/" className="footer-link">Tiếp cận</a>
          </div>

          {/* Cột 3: Tài khoản */}
          <div className="footer-column">
            <h3 className="footer-heading">Tài khoản</h3>
            <a href="#/" className="footer-link">Tư cách thành viên</a>
            <a href="#/" className="footer-link">Hồ sơ</a>
            <a href="#/" className="footer-link">Coupons</a>
          </div>

          {/* Cột 4: Bản tin */}
          <div className="footer-column">
            <h3 className="footer-heading">Bản tin điện tử</h3>
            <p className="footer-text">
              Đăng ký ngay và là người đầu tiên nắm được thông tin...
            </p>
            <a href="#/" className="footer-link-bold">ĐĂNG KÝ NGAY</a>
          </div>

          {/* Cột 5: Mạng xã hội */}
          <div className="footer-column">
            <h3 className="footer-heading">Tài khoản xã hội Uniqlo</h3>
            <div className="footer-social-icons">
              <a href="#/" className="footer-social-link"><Facebook /></a>
              <a href="#/" className="footer-social-link"><Instagram /></a>
              <a href="#/" className="footer-social-link"><Youtube /></a>
              <a href="#/" className="footer-social-link"><Twitter /></a>
            </div>
          </div>
        </div>
        
        <hr className="footer-divider" />
        
        <div className="footer-bottom">
          <p className="footer-copyright">
            BẢN QUYỀN THUỘC CÔNG TY TNHH UNIQLO. BẢO LƯU MỌI QUYỀN.
          </p>
          <div className="footer-links-bottom">
            <a href="#/" className="footer-link-small">Điều khoản sử dụng</a>
            <a href="#/" className="footer-link-small">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;