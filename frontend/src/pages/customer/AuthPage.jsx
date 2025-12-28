import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AuthPage.css'; // SỬA: Tạm thời comment lại để khắc phục lỗi
// Import service
// SỬA: Bỏ đuôi .js ở cuối đường dẫn
import { register, login , getUserProfile } from '../../services/authService';


// --- HÌNH ẢNH NỀN ---
// Thay thế bằng URL ảnh của bạn
const BACKGROUND_IMAGE_URL = 'https://im.uniqlo.com/global-cms/spa/res8f8ec8209e2b0db17ff48479cf04a017fr.jpg';

// ===== Component Form Đăng Nhập =====
const LoginForm = ({ onFormSubmit, onSwitchToRegister }) => (
  <form className="auth-form" onSubmit={onFormSubmit}>
    <h1 className="auth-title">Đăng Nhập</h1>
    
    <div className="input-group">
      <label htmlFor="login-username">Tên tài khoản</label>
      <input id="login-username" type="text" placeholder="Nhập tên người dùng" required />
    </div>
    
    <div className="input-group">
      <label htmlFor="login-password">Mật khẩu</label>
      <input id="login-password" type="password" placeholder="Nhập mật khẩu" required />
    </div>
    
    <button type="submit" className="auth-button">Đăng Nhập</button>
    
    <p className="auth-switch">
      Chưa có tài khoản? <span onClick={onSwitchToRegister}>Đăng ký ngay</span>
    </p>
  </form>
);

// ===== Component Form Đăng Ký =====
const RegisterForm = ({ onFormSubmit, onSwitchToLogin }) => (
  <form className="auth-form" onSubmit={onFormSubmit}>
    <h1 className="auth-title">Đăng Ký Thành Viên</h1>
    
    <div className="input-group">
      <label htmlFor="reg-username">Tên người dùng*</label>
      <input id="reg-username" type="text" placeholder="Tên người dùng" required />
    </div>
    <div className="input-group">
      <label htmlFor="reg-password">Mật khẩu*</label>
      <input id="reg-password" type="password" placeholder="Mật khẩu" required />
    </div>
    
    <div className="input-group">
      <label htmlFor="reg-phone">Số điện thoại*</label>
      <input id="reg-phone" type="text" placeholder="Số điện thoại" required />
    </div>

    <div className="input-group">
      <label htmlFor="reg-address">Địa chỉ</label>
      <input id="reg-address" type="text" placeholder="Địa chỉ (Không bắt buộc)" />
    </div>
    
    <button type="submit" className="auth-button">Đăng Ký</button>
    
    <p className="auth-switch">
      Đã có tài khoản? <span onClick={onSwitchToLogin}>Đăng nhập</span>
    </p>
  </form>
);


// ===== Component AuthPage Chính =====
const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const navigate = useNavigate();

  // Xử lý logic gọi API khi form được submit
  const handleLogin = async (e) => {
    e.preventDefault();
    // Lấy giá trị từ form
    const username = e.target.elements['login-username'].value;
    const password = e.target.elements['login-password'].value;

    try {
      // 1. Gọi API đăng nhập
      const data = await login(username, password);
      const profile = await getUserProfile();
      console.log("PROFILE RECEIVED:", profile); 
      console.log("ROLE IS:", profile.role);
      
      
      // 2. Lưu token và username
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('username', username); // Lưu tạm tên đăng nhập


      // 3. Thông báo và chuyển hướng
      alert('Đăng nhập thành công!');
      navigate('/'); // Chuyển về trang chủ hoặc trang trước đó
      
      // Tắt modal hoặc chuyển hướng (tùy logic cũ của bạn)
      // Ví dụ nếu đang ở trang /auth thì chuyển về Home
      // navigate('/'); 
      
      // Nếu đang dùng Modal (setIsLoginView) thì gọi prop onClose nếu có
      // Hoặc reload trang để cập nhật Header
      window.location.reload(); 

    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert(`Đăng nhập thất bại: ${error.message}`);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const username = e.target.elements['reg-username'].value;
    const password = e.target.elements['reg-password'].value;
    const phone = e.target.elements['reg-phone'].value;
    const address = e.target.elements['reg-address'].value || ''; // Gửi chuỗi rỗng nếu không nhập
    
    try {
      // SỬA: Đã bỏ comment
      await register({ username,password, phone, address });
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      setIsLoginView(true); // Chuyển sang tab đăng nhập
    } catch (error) {
      console.error("Lỗi đăng ký:", error.message);
      alert(`Đăng ký thất bại: ${error.message}`);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Cột 1: Ảnh nền (che phủ toàn bộ) */}
      <div 
        className="auth-image-column" 
        style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}
      >
        {/* Logo RENTZY, click để về Home */}
        <Link to="/" className="auth-logo">UNIQLO</Link>
      </div>

      {/* Cột 2: Form (Nổi bên trên) */}
      <div className="auth-form-column">
        <div className="auth-form-wrapper">
          {isLoginView ? (
            <LoginForm 
              onFormSubmit={handleLogin} 
              onSwitchToRegister={() => setIsLoginView(false)} 
            />
          ) : (
            <RegisterForm 
              onFormSubmit={handleRegister} 
              onSwitchToLogin={() => setIsLoginView(true)} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

