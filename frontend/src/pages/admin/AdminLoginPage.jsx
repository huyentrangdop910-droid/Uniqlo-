
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// SỬA: Import đầy đủ login và getUserProfile
import { login, getUserProfile } from '../../services/authService';
// Import file CSS mới
import './AdminLoginPage.css';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // --- PHẦN LOGIC GIỮ NGUYÊN HOÀN TOÀN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Đăng nhập lấy token
      const data = await login(username, password);
      localStorage.setItem('userToken', data.token);

      // 2. Lấy thông tin
      const profile = await getUserProfile();

      // --- DEBUG: IN RA CONSOLE ĐỂ XEM TẬN MẮT ---
      console.log("ADMIN LOGIN DEBUG:", profile);
      console.log("ROLE IS:", profile.role);
      // --------------------------------------------
      if (profile.role === 'USER') {
        alert("Tài khoản Khách hàng không có quyền truy cập trang Quản trị.");
        localStorage.removeItem('userToken');
        return;
      }

      // 3. Kiểm tra Role
      // Nếu profile.role là undefined -> Lỗi Backend
      if (profile.role === 'ADMIN') {
        alert("Xin chào Admin: " + profile.username);
        navigate('/admin/dashboard');
      } else {
        alert(`Bạn không có quyền truy cập! Role hiện tại: ${profile.role}`);
        localStorage.removeItem('userToken');
      }

    } catch (error) {
      console.error(error);
      alert("Đăng nhập thất bại: " + error.message);
    }
  };
  // --- KẾT THÚC PHẦN LOGIC GIỮ NGUYÊN ---

  // --- PHẦN GIAO DIỆN MỚI ---
  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        
        {/* Phần Header chứa ảnh và đường cắt chéo */}
        <div className="card-header-image">
          {/* Lớp phủ màu xanh lên ảnh */}
          <div className="image-overlay"></div>
        </div>

        {/* Vòng tròn logo ở giữa */}
        <div className="card-logo-circle">
          <span>Admin</span>
        </div>

        {/* Phần Form bên dưới */}
        <div className="card-form-body">
          <form onSubmit={handleLogin}>
            <div className="styled-input-group">
              {/* Dùng type=text vì state gốc là username */}
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                placeholder=" " /* Placeholder rỗng để làm hiệu ứng CSS */
              />
              <label>USERNAME</label>
              <span className="highlight"></span>
              <span className="bar"></span>
            </div>

            <div className="styled-input-group">
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder=" " 
              />
              <label>PASSWORD</label>
              <span className="highlight"></span>
              <span className="bar"></span>

            </div>

            <button type="submit" className="styled-login-btn">SIGN IN</button>
          </form>
           
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;