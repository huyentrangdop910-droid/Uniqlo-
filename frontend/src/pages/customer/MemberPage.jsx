
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Package, LogOut } from 'lucide-react';

// Import các component chung
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import DieuHuongNoi from '../../components/DieuHuongNoi';
import AddressBook from '../../components/AddressBook';
import EditOrderModal from '../../components/EditOrderModal'; 

// Import API
import { 
    getMyOrders, 
    cancelOrder, 
    updateOrderAddress, 
    updateOrderPaymentMethod,
    getUserProfile,       
    updateUserProfile,    
    changePassword,       
    deleteAccount         
} from '../../services/authService';

import './MemberPage.css';

// --- COMPONENT CON: Lịch sử đơn hàng ---
const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatusTab, setActiveStatusTab] = useState('PENDING'); 
  const [editingOrder, setEditingOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Tự động refresh lại giao diện mỗi phút để kiểm tra xem đã qua 5 phút chưa
    const interval = setInterval(() => {
        setOrders(prev => [...prev]); // Trigger render lại
    }, 60000); 

    return () => clearInterval(interval);
  }, []);

  // --- LOGIC XỬ LÝ TRẠNG THÁI HIỂN THỊ (SỬA Ở ĐÂY) ---
  const getDisplayStatus = (order) => {
    // -----------------------------------------------------------
    // CHỈNH SỬA  TEST: 5 PHÚT
    const TEST_TIME_MS = 5 * 60 * 1000; // 5 phút * 60 giây * 1000ms
    // -----------------------------------------------------------
    
    const timeDiff = new Date() - new Date(order.createdAt);

    // Nếu đơn hàng "Chờ Xác Nhận" và đã tạo quá 5 phút -> Tự động hiện là "Chờ Giao Hàng"
    if (order.status === 'Chờ Xác Nhận' && timeDiff > TEST_TIME_MS) {
        return 'Chờ Giao Hàng';
    }

    if (order.status === 'Đã Thanh Toán') return 'Chờ Giao Hàng';
    
    return order.status;
  };

  // --- LỌC ĐƠN HÀNG THEO TAB ---
  const filteredOrders = orders.filter(order => {
    const displayStatus = getDisplayStatus(order);

    if (activeStatusTab === 'PENDING') return displayStatus === 'Chờ Xác Nhận';
    if (activeStatusTab === 'CONFIRMED') return displayStatus === 'Chờ Giao Hàng';
    if (activeStatusTab === 'SHIPPING') return displayStatus === 'Đang Giao Hàng';
    if (activeStatusTab === 'DELIVERED') return displayStatus === 'Đã Giao Hàng';
    
    return false;
  });

  const handleUpdateAddressInModal = async (orderId, addressId) => {
    try {
        await updateOrderAddress(orderId, addressId);
        await fetchOrders();
        setEditingOrder(null);
    } catch (error) { throw error; }
  };

  const handleUpdatePaymentInModal = async (orderId, newMethod) => {
    try {
        await updateOrderPaymentMethod(orderId, newMethod);
        await fetchOrders();
        setEditingOrder(null);
    } catch (error) { throw error; }
  };

  const handlePayNow = async (order) => {
    try {
        localStorage.setItem('payingExistingOrderId', order.id);
        const response = await fetch(`http://localhost:8080/api/v1/payment/create_payment?amount=${order.totalAmount}`);
        const data = await response.json();
        if (data.paymentUrl) window.location.href = data.paymentUrl; 
        else alert("Lỗi: Không nhận được link thanh toán");
    } catch (error) {
        alert("Lỗi kết nối thanh toán: " + error.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      try {
        await cancelOrder(orderId);
        alert("Đã hủy đơn hàng thành công.");
        fetchOrders(); 
      } catch (error) { alert(error.message); }
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  if (loading) return <div className="member-loading">Đang tải đơn hàng...</div>;

  return (
    <div className="member-section">
      <h2 className="member-section-title">Lịch sử đơn hàng</h2>
      
      <div className="order-status-tabs">
        <button className={`status-tab-btn ${activeStatusTab === 'PENDING' ? 'active' : ''}`} onClick={() => setActiveStatusTab('PENDING')}>Chờ xác nhận</button>
        <button className={`status-tab-btn ${activeStatusTab === 'CONFIRMED' ? 'active' : ''}`} onClick={() => setActiveStatusTab('CONFIRMED')}>Chờ giao hàng</button>
        <button className={`status-tab-btn ${activeStatusTab === 'SHIPPING' ? 'active' : ''}`} onClick={() => setActiveStatusTab('SHIPPING')}>Đang giao hàng</button>
        <button className={`status-tab-btn ${activeStatusTab === 'DELIVERED' ? 'active' : ''}`} onClick={() => setActiveStatusTab('DELIVERED')}>Đã giao hàng</button>
      </div>
      
      {filteredOrders.length === 0 ? (
        <p className="member-empty-text">Không có đơn hàng nào ở mục này.</p>
      ) : (
        <div className="order-list">
          {filteredOrders.map(order => {
            const displayStatus = getDisplayStatus(order);

            return (
            <div key={order.id} className="shopee-order-card">
              <div className="shopee-order-header">
                <span className="shopee-shop-name">Đơn hàng #{order.orderCode} <span style={{fontWeight: 'normal', color: '#777', marginLeft: '10px'}}>({new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()})</span></span>
                <span className={`shopee-order-status ${displayStatus === 'Đã Giao Hàng' ? 'success' : ''}`}>{displayStatus}</span>
              </div>
              
              <div className="shopee-order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="shopee-item-row">
                    <img src={item.productImageUrl} alt="" className="shopee-item-img" />
                    <div className="shopee-item-info">
                      <div className="shopee-item-name">{item.productName}</div>
                      <div className="shopee-item-variant">Phân loại: {item.color}, {item.size}</div>
                      <div className="shopee-item-qty">x{item.quantity}</div>
                    </div>
                    <div className="shopee-item-price">{formatPrice(item.price)}</div>
                  </div>
                ))}
              </div>

              <div className="shopee-order-footer">
                <div className="shopee-order-total">Thành tiền: <span className="total-price">{formatPrice(order.totalAmount)}</span></div>
                
                <div className="shopee-order-actions">
                  {displayStatus === "Chờ Xác Nhận" && (
                      <>
                        {order.paymentMethod === "VNPAY" && (
                            <button className="shopee-btn-primary" style={{backgroundColor: '#0055a5', borderColor: '#0055a5'}} onClick={() => handlePayNow(order)}>Thanh Toán Ngay</button>
                        )}
                        <button className="shopee-btn-outline" onClick={() => setEditingOrder(order)}>Sửa</button>
                        <button className="shopee-btn-outline" style={{color: '#d90429', borderColor: '#d90429'}} onClick={() => handleCancelOrder(order.id)}>Hủy Đơn</button>
                      </>
                  )}

                  {displayStatus === "Chờ Giao Hàng" && (
                      <button className="shopee-btn-outline" style={{color: '#d90429', borderColor: '#d90429'}} onClick={() => handleCancelOrder(order.id)}>Hủy Đơn</button>
                  )}
                </div>
              </div>
            </div>
          )})}
        </div>
      )}

      {editingOrder && (
        <EditOrderModal 
            order={editingOrder}
            onClose={() => setEditingOrder(null)}
            onUpdateAddress={handleUpdateAddressInModal}
            onUpdatePayment={handleUpdatePaymentInModal}
            onPayNow={handlePayNow}
        />
      )}
    </div>
  );
};

// --- COMPONENT CON: Hồ sơ ---
const UserProfile = () => {
  const [subTab, setSubTab] = useState('info'); 
  const [profile, setProfile] = useState({ username: '', fullName: '', email: '', phoneNumber: '' });
  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const fetchProfile = async () => {
      try {
        const data = await getUserProfile(); 
        setProfile({
            username: data.username,
            fullName: data.fullName || '',
            email: data.email || '',
            phoneNumber: data.phoneNumber || ''
        });
      } catch (error) { 
        console.error(error); 
        localStorage.clear();
        window.location.href = '/auth';
      }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleUpdateProfile = async () => {
    try {
        await updateUserProfile({
            fullName: profile.fullName,
            email: profile.email,
            phoneNumber: profile.phoneNumber
        });
        alert("Cập nhật hồ sơ thành công!");
        setSubTab('info'); 
        fetchProfile(); 
    } catch (error) { alert("Lỗi: " + error.message); }
  };

  const handleChangePassword = async () => {
    if (passData.newPassword !== passData.confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!"); return;
    }
    try {
        await changePassword(passData);
        alert("Đổi mật khẩu thành công!");
        setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) { alert("Lỗi: " + error.message); }
  };

  const handleDeleteAccount = async () => {
      if (window.confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản này?")) {
          try {
              await deleteAccount();
              alert("Tài khoản đã được xóa.");
              localStorage.clear(); 
              window.location.href = '/'; 
          } catch (error) { alert("Lỗi: " + error.message); }
      }
  };

  return (
    <div className="member-section">
      <h2 className="member-section-title">Hồ sơ của tôi</h2>
      <div className="profile-tabs">
        <button className={`profile-tab-btn ${subTab === 'info' ? 'active' : ''}`} onClick={() => setSubTab('info')}>Thông tin</button>
        <button className={`profile-tab-btn ${subTab === 'edit' ? 'active' : ''}`} onClick={() => setSubTab('edit')}>Chỉnh sửa hồ sơ</button>
        <button className={`profile-tab-btn ${subTab === 'address' ? 'active' : ''}`} onClick={() => setSubTab('address')}>Địa chỉ</button>
        <button className={`profile-tab-btn ${subTab === 'password' ? 'active' : ''}`} onClick={() => setSubTab('password')}>Đổi mật khẩu</button>
      </div>

      <div className="profile-content-box">
        {subTab === 'info' && (
            <div className="profile-info-view">
                <div className="info-row"><span className="label">Tên đăng nhập:</span><span className="value">{profile.username}</span></div>
                <div className="info-row"><span className="label">Họ tên:</span><span className="value">{profile.fullName}</span></div>
                <div className="info-row"><span className="label">Email:</span><span className="value">{profile.email}</span></div>
                <div className="info-row"><span className="label">SĐT:</span><span className="value">{profile.phoneNumber}</span></div>
                <div className="info-actions">
                    <button className="member-btn-primary" onClick={() => setSubTab('edit')}>Sửa Hồ Sơ</button>
                    <button className="member-btn-danger" onClick={handleDeleteAccount}>Xóa Tài Khoản</button>
                </div>
            </div>
        )}
        {subTab === 'edit' && (
          <form className="profile-form" onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }}>
            <div className="form-group"><label>Họ và tên</label><input type="text" className="form-input" value={profile.fullName} onChange={e => setProfile({...profile, fullName: e.target.value})} /></div>
            <div className="form-group"><label>Email</label><input type="email" className="form-input" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} /></div>
            <div className="form-group"><label>Số điện thoại</label><input type="text" className="form-input" value={profile.phoneNumber} onChange={e => setProfile({...profile, phoneNumber: e.target.value})} /></div>
            <button type="submit" className="member-btn-primary">Lưu Thay Đổi</button>
          </form>
        )}
        {subTab === 'address' && <AddressBook />}
        {subTab === 'password' && (
          <form className="profile-form" onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }}>
            <div className="form-group"><label>Mật khẩu hiện tại</label><input type="password" className="form-input" required value={passData.currentPassword} onChange={e => setPassData({...passData, currentPassword: e.target.value})} /></div>
            <div className="form-group"><label>Mật khẩu mới</label><input type="password" className="form-input" required value={passData.newPassword} onChange={e => setPassData({...passData, newPassword: e.target.value})} /></div>
            <div className="form-group"><label>Xác nhận mật khẩu</label><input type="password" className="form-input" required value={passData.confirmPassword} onChange={e => setPassData({...passData, confirmPassword: e.target.value})} /></div>
            <button type="submit" className="member-btn-primary">Đổi Mật Khẩu</button>
          </form>
        )}
      </div>
    </div>
  );
};

// ===== COMPONENT CHÍNH: MemberPage =====
const MemberPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile'); 

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) navigate('/auth');
    const tabParam = searchParams.get('tab');
    if (tabParam === 'orders') setActiveTab('orders');
    else setActiveTab('profile');
  }, [navigate, searchParams]);

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      localStorage.clear();
      navigate('/');
    }
  };

  return (
    <div className="member-page-layout">
      <Header variant="solid" onMenuEnter={() => {}} onLogoClick={() => navigate('/')} />
      <main className="member-main-container">
        <div className="member-wrapper">
          <aside className="member-sidebar">
            <div className="member-avatar-box">
              <div className="avatar-circle"><User size={32} /></div>
              <div className="avatar-info"><span className="username">{localStorage.getItem('username')}</span></div>
            </div>
            <nav className="member-nav">
              <button className={`member-nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}><User size={20} /> Hồ sơ</button>
              <button className={`member-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}><Package size={20} /> Đơn hàng</button>
              <button className="member-nav-item logout" onClick={handleLogout}><LogOut size={20} /> Đăng xuất</button>
            </nav>
          </aside>
          <section className="member-content">
            {activeTab === 'profile' && <UserProfile />}
            {activeTab === 'orders' && <OrderHistory />}
          </section>
        </div>
      </main>
      <DieuHuongNoi onUserClick={() => {}} />
      <Footer />
    </div>
  );
};

export default MemberPage;