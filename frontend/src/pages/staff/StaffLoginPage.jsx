import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getUserProfile } from '../../services/authService';
import './StaffLoginPage.css';

const StaffLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Đăng nhập lấy token
      const data = await login(username, password);
      localStorage.setItem('userToken', data.token);

      // 2. Lấy thông tin
      const profile = await getUserProfile();

      console.log("STAFF LOGIN DEBUG:", profile);

      // --- LOGIC ĐIỀU HƯỚNG MỚI ---
      
      // Nếu là USER -> Chặn
      if (profile.role === 'USER') {
        alert("Khách hàng không được truy cập trang này.");
        localStorage.removeItem('userToken');
        return;
      }

      // Nếu là STAFF -> Vào trang Dashboard Nhân Viên
      if (profile.role === 'STAFF') {
        alert(`Xin chào nhân viên: ${profile.fullName || profile.username}`);
        navigate('/staff/dashboard'); 
      } 
      
      else if (profile.role === 'ADMIN') {
        alert(`Xin chào Sếp: ${profile.fullName || profile.username}`);
        navigate('/admin/dashboard'); // Admin thì vẫn về trang quản lý to nhất
      } 
      else {
        alert("Quyền truy cập không hợp lệ.");
        localStorage.removeItem('userToken');
      }

    } catch (error) {
      console.error(error);
      alert("Đăng nhập thất bại. Vui lòng kiểm tra lại!");
    }
  };

  return (
    <div className="staff-login-wrapper">
      <div className="staff-login-card">
        <div className="card-header-image">
          <div className="image-overlay"></div>
        </div>
        <div className="card-logo-circle">
          <span>Staff</span>
        </div>
        <div className="card-form-body">
          <form onSubmit={handleLogin}>
            <div className="styled-input-group">
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                placeholder=" " 
              />
              <label>TÀI KHOẢN</label>
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
              <label>MẬT KHẨU</label>
              <span className="highlight"></span>
              <span className="bar"></span>
            </div>

            <button type="submit" className="styled-login-btn">ĐĂNG NHẬP</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffLoginPage;