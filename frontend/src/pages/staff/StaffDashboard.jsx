/*import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, User, Package, ShoppingCart, 
  FileText, Warehouse, LogOut, Menu,
  PlusCircle, Check, Trash2, Edit, X, Eye, EyeOff, MapPin, Phone, Mail
} from 'lucide-react';
import { getUserProfile } from '../../services/authService';
import UserProfile from '../../components/UserProfile.jsx'; 
import './StaffDashboard.css';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [staffInfo, setStaffInfo] = useState({ 
      fullName: '', role: '', email: '', phone: '', address: '', username: '' 
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- STATE DỮ LIỆU ---
  const [inventoryList, setInventoryList] = useState([]); 
  const [activeProducts, setActiveProducts] = useState([]);

  // --- STATE MODAL SẢN PHẨM ---
  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
      id: null, name: '', price: 0, importPrice: 0, stockQuantity: 0,
      description: '', imageUrl: '', sizes: '', colors: '', active: false
  });

  // --- STATE MODAL PROFILE (MỚI) ---
  
  // --- INIT ---
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) { navigate('/staff/login'); return; }
        
        const profile = await getUserProfile(); // Gọi API /me lấy thông tin mới nhất
        if (profile.role !== 'STAFF' && profile.role !== 'ADMIN') {
           localStorage.removeItem('userToken'); navigate('/staff/login');
        } else {
            setStaffInfo(profile); // Lưu thông tin staff vào state
            fetchAllData(); 
        }
      } catch (error) { navigate('/staff/login'); }
    };
    checkAuth();
  }, [navigate]);

  const fetchAllData = () => {
      fetchInventory();     
      fetchActiveProducts(); 
  };

  const fetchInventory = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/products/admin-list');
        if (res.ok) setInventoryList(await res.json());
      } catch (e) { console.error(e); }
  };

  const fetchActiveProducts = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/products');
        if (res.ok) setActiveProducts(await res.json());
      } catch (e) { console.error(e); }
  };

  // --- CHỨC NĂNG PROFILE (MỚI) ---

  

  

  // --- CÁC CHỨC NĂNG KHÁC (GIỮ NGUYÊN) ---
  const toggleProductStatus = async (product, status) => {
      const actionName = status ? "Đăng bán (Lấy)" : "Gỡ xuống";
      if(!window.confirm(`Bạn muốn ${actionName} sản phẩm "${product.name}"?`)) return;
      const token = localStorage.getItem('userToken');
      try {
          const res = await fetch(`http://localhost:8080/api/v1/products/${product.id}/status?active=${status}`, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) { alert(`${actionName} thành công!`); fetchAllData(); } 
          else { alert("Lỗi cập nhật trạng thái!"); }
      } catch (e) { alert("Lỗi server"); }
  };

  const handleEditProduct = (product) => {
      const colorString = product.colors ? product.colors.map(c => c.name).join(', ') : '';
      setProductForm({
          id: product.id, name: product.name, price: product.price, importPrice: product.importPrice || 0,
          stockQuantity: product.stockQuantity || 0, description: product.description || '',
          imageUrl: product.imageUrls?.[0] || '', sizes: product.sizes ? product.sizes.join(',') : '',
          colors: colorString, active: product.active
      });
      setShowProductModal(true);
  };

  const handleSaveProductUpdate = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('userToken');
      const colorList = productForm.colors.split(',').map(c => ({ name: c.trim(), code: '#000000' })).filter(c => c.name !== '');
      const payload = {
          name: productForm.name, price: parseInt(productForm.price), importPrice: parseInt(productForm.importPrice),
          stockQuantity: parseInt(productForm.stockQuantity), description: productForm.description, details: productForm.description,
          imageUrls: [productForm.imageUrl], sizes: productForm.sizes.split(',').map(s => s.trim()), colors: colorList,
          active: productForm.active
      };
      try {
          const res = await fetch(`http://localhost:8080/api/v1/products/${productForm.id}`, {
              method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          if (res.ok) { alert("Cập nhật thành công!"); setShowProductModal(false); fetchAllData(); } 
          else { alert("Lỗi cập nhật!"); }
      } catch (e) { alert("Lỗi server"); }
  };

  const handleLogout = () => {
    if(window.confirm("Bạn muốn đăng xuất?")) { localStorage.removeItem('userToken'); navigate('/staff/login'); }
  };

  // --- RENDER CONTENT ---
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-home">
             <div className="stats-row">
                <div className="stat-box bg-info"><div className="inner"><h3>12</h3><p>Đơn Hàng</p></div><div className="icon"><ShoppingCart size={40} opacity={0.4}/></div></div>
                <div className="stat-box bg-success"><div className="inner"><h3>{activeProducts.length}</h3><p>Đang Bán</p></div><div className="icon"><Eye size={40} opacity={0.4}/></div></div>
                <div className="stat-box bg-warning"><div className="inner"><h3>{inventoryList.length}</h3><p>Tổng Kho</p></div><div className="icon"><Warehouse size={40} opacity={0.4}/></div></div>
             </div>
          </div>
        );

      // --- TAB PROFILE (ĐÃ NÂNG CẤP) ---
      case 'profile':
       return (
            <UserProfile 
                onProfileUpdate={(updatedUser) => {
                    // Khi UserProfile báo lên, ta cập nhật state của Dashboard ngay lập tức
                    console.log("Dashboard nhận được ảnh mới:", updatedUser.avatarUrl);
                    setStaffInfo(updatedUser);
                }} 
            />
        );

      case 'products':
        return (
          <div className="content-section">
            <div className="section-header"><h2>Sản Phẩm Đang Bán</h2></div>
            <div className="table-responsive">
              <table className="staff-table">
                <thead><tr><th>ID</th><th>Ảnh</th><th>Tên SP</th><th>Giá Bán</th><th>Tồn</th><th>Hành Động</th></tr></thead>
                <tbody>
                  {activeProducts.map(p => (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td><img src={p.imageUrls?.[0] || 'https://placehold.co/40'} alt="" style={{width:'40px', height:'40px', objectFit:'cover', borderRadius:'4px'}} /></td>
                      <td style={{fontWeight:'500'}}>{p.name}</td>
                      <td style={{color:'#007bff'}}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}</td>
                      <td>{p.stockQuantity}</td>
                      <td>
                          <div style={{display:'flex', gap:'5px'}}>
                              <button className="btn-small btn-edit" onClick={() => handleEditProduct(p)}><Edit size={14}/> Sửa</button>
                              <button className="btn-small btn-delete" onClick={() => toggleProductStatus(p, false)}><EyeOff size={14}/> Gỡ</button>
                          </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'inventory':
        return (
            <div className="content-section">
               <div className="section-header"><h2>Kho Hàng Tổng</h2><button className="btn-small" onClick={fetchInventory}>Làm mới</button></div>
               <div className="table-responsive">
                 <table className="staff-table">
                   <thead><tr><th>ID</th><th>Sản Phẩm</th><th>Tồn Kho</th><th>Trạng Thái</th><th>Thao Tác</th></tr></thead>
                   <tbody>
                     {inventoryList.map(p => (
                        <tr key={p.id}>
                            <td>#{p.id}</td>
                            <td><div style={{display:'flex', alignItems:'center', gap:'10px'}}><img src={p.imageUrls?.[0] || 'https://placehold.co/30'} alt="" style={{width:'30px', height:'30px', borderRadius:'50%'}}/><span>{p.name}</span></div></td>
                            <td style={{color: p.stockQuantity < 10 ? '#dc3545' : '#28a745', fontWeight:'bold'}}>{p.stockQuantity}</td>
                            <td>{p.active ? <span className="status-badge completed">Đang bán</span> : <span className="status-badge pending">Chưa bán</span>}</td>
                            <td>{p.active ? <button className="btn-small btn-disabled" disabled><Check size={14}/> Đã Lấy</button> : <button className="btn-small btn-take" onClick={() => toggleProductStatus(p, true)}><PlusCircle size={14}/> LẤY</button>}</td>
                        </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
         );
      
      case 'orders': return <div className="content-section"><h2>Quản Lý Đơn Hàng</h2><p>Đang phát triển...</p></div>;
      case 'invoices': return <div className="content-section"><h2>Quản Lý Hóa Đơn</h2><p>Đang phát triển...</p></div>;
      default: return <div>Chọn một mục từ menu</div>;
    }
  };

  return (
    <div className={`staff-layout ${isSidebarOpen ? '' : 'sidebar-collapse'}`}>
      <nav className="main-header">
         <div className="header-left"><button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu size={20}/></button><span className="page-title">Home</span></div>
         <div className="header-right"><div className="user-profile-top"><img 
    // Nếu có avatarUrl thì dùng, không thì dùng ảnh mặc định
    src={staffInfo.avatarUrl || "https://i.pravatar.cc/150?u=staff"} 
    alt="User" 
    style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }}
/><span>{staffInfo.fullName}</span></div></div>
      </nav>
      <aside className="main-sidebar">
         <div className="brand-link"><div className="brand-logo">R</div><span className="brand-text">Staff Portal</span></div>
         <div className="sidebar-user"><div className="image"><img 
    src={staffInfo.avatarUrl || "https://i.pravatar.cc/150?u=staff"} 
    alt="User"
    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
/></div><div className="info"><a href="#">{staffInfo.fullName}</a></div></div>
         <nav className="mt-2">
            <ul className="nav-sidebar">
               <li className={`nav-item ${activeTab==='dashboard'?'active':''}`} onClick={()=>setActiveTab('dashboard')}><LayoutDashboard size={18} /> <p>Dashboard</p></li>
               <li className={`nav-item ${activeTab==='profile'?'active':''}`} onClick={()=>setActiveTab('profile')}><User size={18} /> <p>Tài khoản</p></li>
               <li className={`nav-item ${activeTab==='products'?'active':''}`} onClick={()=>setActiveTab('products')}><Package size={18} /> <p>Quản lý Sản phẩm</p></li>
               <li className={`nav-item ${activeTab==='orders'?'active':''}`} onClick={()=>setActiveTab('orders')}><ShoppingCart size={18} /> <p>Quản lý Đơn hàng</p></li>
               <li className={`nav-item ${activeTab==='invoices'?'active':''}`} onClick={()=>setActiveTab('invoices')}><FileText size={18} /> <p>Quản lý Hóa đơn</p></li>
               <li className={`nav-item ${activeTab==='inventory'?'active':''}`} onClick={()=>setActiveTab('inventory')}><Warehouse size={18} /> <p>Kho hàng (Tổng)</p></li>
               <li className="nav-item logout" onClick={handleLogout}><LogOut size={18} /> <p>Đăng xuất</p></li>
            </ul>
         </nav>
      </aside>
      <div className="content-wrapper">
         <div className="content-header-row"><h1>{activeTab === 'dashboard' ? 'Dashboard' : ''}</h1></div>
         <section className="content">{renderContent()}</section>
      </div>

      {showProductModal && (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header"><h3>Cập Nhật Sản Phẩm</h3><button className="close-btn" onClick={() => setShowProductModal(false)}><X size={20}/></button></div>
                <form onSubmit={handleSaveProductUpdate}>
                     <div className="form-grid">
                        <div className="form-group" style={{gridColumn: '1 / -1'}}><label>Tên SP</label><input type="text" value={productForm.name} onChange={(e)=>setProductForm({...productForm, name: e.target.value})} required /></div>
                        <div className="form-group"><label>Giá Bán</label><input type="number" value={productForm.price} onChange={(e)=>setProductForm({...productForm, price: e.target.value})} required /></div>
                        <div className="form-group"><label>Tồn Kho</label><input type="number" value={productForm.stockQuantity} onChange={(e)=>setProductForm({...productForm, stockQuantity: e.target.value})} required /></div>
                        <div className="form-group" style={{gridColumn: '1 / -1'}}><label>Mô tả</label><input type="text" value={productForm.description} onChange={(e)=>setProductForm({...productForm, description: e.target.value})}/></div>
                    </div>
                    <div className="modal-footer"><button type="button" className="btn-secondary" onClick={() => setShowProductModal(false)}>Hủy</button><button type="submit" className="btn-primary">Lưu thay đổi</button></div>
                </form>
            </div>
        </div>
      )}

      
    </div>
  );
};

export default StaffDashboard;*/
/*import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, User, Package, ShoppingCart, 
  FileText, Warehouse, LogOut, Menu,
  PlusCircle, Check, Trash2, Edit, X, Eye, EyeOff, MapPin, Phone, Mail, Truck
} from 'lucide-react';
import { getUserProfile } from '../../services/authService';
import UserProfile from '../../components/UserProfile.jsx'; 
import './StaffDashboard.css';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [staffInfo, setStaffInfo] = useState({ 
      fullName: '', role: '', email: '', phone: '', address: '', username: '', avatarUrl: '' 
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- STATE DỮ LIỆU ---
  const [inventoryList, setInventoryList] = useState([]); 
  const [activeProducts, setActiveProducts] = useState([]);
  
  // --- STATE ĐƠN HÀNG (MỚI) ---
  const [ordersList, setOrdersList] = useState([]);
  const [orderSubTab, setOrderSubTab] = useState('confirm'); // 'confirm' | 'shipping'
  const [selectedOrder, setSelectedOrder] = useState(null); // Để hiện modal chi tiết

  // --- STATE MODAL SẢN PHẨM ---
  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
      id: null, name: '', price: 0, importPrice: 0, stockQuantity: 0,
      description: '', imageUrl: '', sizes: '', colors: '', active: false
  });

  // --- INIT ---
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) { navigate('/staff/login'); return; }
        
        const profile = await getUserProfile(); 
        if (profile.role !== 'STAFF' && profile.role !== 'ADMIN') {
           localStorage.removeItem('userToken'); navigate('/staff/login');
        } else {
            setStaffInfo(profile); 
            fetchAllData(); 
        }
      } catch (error) { navigate('/staff/login'); }
    };
    checkAuth();
  }, [navigate]);

  const fetchAllData = () => {
      fetchInventory();     
      fetchActiveProducts(); 
      fetchOrders(); // <-- Lấy danh sách đơn hàng
  };

  // --- API CALLS ---
  const fetchInventory = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/products/admin-list');
        if (res.ok) setInventoryList(await res.json());
      } catch (e) { console.error(e); }
  };

  const fetchActiveProducts = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/products');
        if (res.ok) setActiveProducts(await res.json());
      } catch (e) { console.error(e); }
  };

  // 1. API Lấy toàn bộ đơn hàng (Cho Staff/Admin)
  const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('userToken');
        // Giả sử API lấy tất cả đơn là /api/v1/orders/all hoặc /api/v1/orders (có quyền admin)
        // Nếu Backend chưa có, bạn cần thêm API: @GetMapping("/all") trong OrderController
        const res = await fetch('http://localhost:8080/api/v1/orders/all', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            // Sắp xếp đơn mới nhất lên đầu
            setOrdersList(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
      } catch (e) { console.error("Lỗi lấy đơn hàng:", e); }
  };

  // 2. API Cập nhật trạng thái giao hàng
  const updateOrderStatus = async (orderId, newStatus) => {
      if(!window.confirm(`Xác nhận chuyển đơn hàng #${orderId} sang trạng thái: ${newStatus}?`)) return;
      
      try {
          const token = localStorage.getItem('userToken');
          const res = await fetch(`http://localhost:8080/api/v1/orders/${orderId}/status?status=${newStatus}`, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}` }
          });

          if (res.ok) {
              alert("Cập nhật thành công!");
              fetchOrders(); // Load lại danh sách
              setSelectedOrder(null); // Đóng modal nếu đang mở
          } else {
              alert("Lỗi cập nhật trạng thái!");
          }
      } catch (error) {
          alert("Lỗi server: " + error.message);
      }
  };

  // --- HELPER FORMAT ---
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  const formatDate = (dateString) => new Date(dateString).toLocaleString('vi-VN');

  // --- CÁC CHỨC NĂNG SẢN PHẨM (GIỮ NGUYÊN) ---
  const toggleProductStatus = async (product, status)
  const handleSaveProductUpdate = async (e) 
  const handleLogout = () 

  // --- RENDER CONTENT ---
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-home">
             <div className="stats-row">
                <div className="stat-box bg-info"><div className="inner"><h3>{ordersList.length}</h3><p>Đơn Hàng</p></div><div className="icon"><ShoppingCart size={40} opacity={0.4}/></div></div>
                <div className="stat-box bg-success"><div className="inner"><h3>{activeProducts.length}</h3><p>Đang Bán</p></div><div className="icon"><Eye size={40} opacity={0.4}/></div></div>
                <div className="stat-box bg-warning"><div className="inner"><h3>{inventoryList.length}</h3><p>Tổng Kho</p></div><div className="icon"><Warehouse size={40} opacity={0.4}/></div></div>
             </div>
          </div>
        );

      case 'profile':
       return <UserProfile onProfileUpdate={setStaffInfo} />;

      // --- TAB QUẢN LÝ ĐƠN HÀNG (MỚI) ---
      case 'orders':
        // Lọc danh sách theo tab con
        const filteredOrders = ordersList.filter(order => {
            if (orderSubTab === 'confirm') {
                // Hiển thị đơn "Chờ Giao Hàng" hoặc "Đã Thanh Toán" (coi như chờ giao)
                return order.status === 'Chờ Giao Hàng' || order.status === 'Đã Thanh Toán';
            }
            if (orderSubTab === 'shipping') {
                return order.status === 'Đang Giao Hàng';
            }
            return false;
        });

        return (
            <div className="content-section">
                <div className="section-header">
                    <h2>Quản Lý Đơn Hàng</h2>
                    <div className="order-tabs">
                        <button className={`tab-btn ${orderSubTab==='confirm'?'active':''}`} onClick={()=>setOrderSubTab('confirm')}>
                            Xác nhận ({ordersList.filter(o => o.status === 'Chờ Giao Hàng' || o.status === 'Đã Thanh Toán').length})
                        </button>
                        <button className={`tab-btn ${orderSubTab==='shipping'?'active':''}`} onClick={()=>setOrderSubTab('shipping')}>
                            Đang giao ({ordersList.filter(o => o.status === 'Đang Giao Hàng').length})
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="staff-table">
                        <thead>
                            <tr>
                                <th>Mã Đơn</th>
                                <th>Khách Hàng</th>
                                <th>Ngày Đặt</th>
                                <th>Tổng Tiền</th>
                                <th>Thanh Toán</th>
                                <th>Trạng Thái</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr><td colSpan="7" style={{textAlign:'center', padding:'20px'}}>Không có đơn hàng nào</td></tr>
                            ) : (
                                filteredOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.orderCode || order.id}</td>
                                        <td>
                                            <div style={{fontWeight:'500'}}>{order.fullName}</div>
                                            <div style={{fontSize:'12px', color:'#666'}}>{order.phoneNumber}</div>
                                        </td>
                                        <td>{formatDate(order.createdAt)}</td>
                                        <td style={{color:'#d90429', fontWeight:'bold'}}>{formatPrice(order.totalAmount)}</td>
                                        <td>{order.paymentMethod}</td>
                                        <td>
                                            <span className={`status-badge ${order.status === 'Đang Giao Hàng' ? 'shipping' : 'pending'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{display:'flex', gap:'5px'}}>
                                                <button className="btn-small btn-view" onClick={() => setSelectedOrder(order)}>
                                                    <Eye size={14}/> Xem
                                                </button>
                                                
                                               
                                                {orderSubTab === 'confirm' && (
                                                    <button 
                                                        className="btn-small btn-confirm" 
                                                        onClick={() => updateOrderStatus(order.id, 'Đang Giao Hàng')}
                                                    >
                                                        <Truck size={14}/> Xác nhận
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );

      case 'products':
        return 
          <div className="content-section">
            <div className="section-header"><h2>Sản Phẩm Đang Bán</h2></div>
            <div className="table-responsive">
              <table className="staff-table">
                <thead><tr><th>ID</th><th>Ảnh</th><th>Tên SP</th><th>Giá Bán</th><th>Tồn</th><th>Hành Động</th></tr></thead>
                <tbody>
                  {activeProducts.map(p => (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td><img src={p.imageUrls?.[0] || 'https://placehold.co/40'} alt="" style={{width:'40px', height:'40px', objectFit:'cover', borderRadius:'4px'}} /></td>
                      <td style={{fontWeight:'500'}}>{p.name}</td>
                      <td style={{color:'#007bff'}}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}</td>
                      <td>{p.stockQuantity}</td>
                      <td>
                         
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'inventory':
        return 
            <div className="content-section">
               
         );
      
      case 'invoices': return <div className="content-section"><h2>Quản Lý Hóa Đơn</h2><p>Đang phát triển...</p></div>;
      default: return <div>Chọn một mục từ menu</div>;
    }
  };

  return (
    <div className={`staff-layout ${isSidebarOpen ? '' : 'sidebar-collapse'}`}>
      <nav className="main-header">
         <div className="header-left"><button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu size={20}/></button><span className="page-title">Home</span></div>
         <div className="header-right">
            <div className="user-profile-top">
                <img 
                    src={staffInfo.avatarUrl || "https://i.pravatar.cc/150?u=staff"} 
                    alt="User" 
                    style={{width:'35px', height:'35px', borderRadius:'50%', objectFit:'cover'}}
                />
                <span>{staffInfo.fullName}</span>
            </div>
         </div>
      </nav>
      <aside className="main-sidebar">
        
         <div className="brand-link"><div className="brand-logo">R</div><span className="brand-text">Staff Portal</span></div>
         <div className="sidebar-user">
            <div className="image">
                <img src={staffInfo.avatarUrl || "https://i.pravatar.cc/150?u=staff"} alt="User" style={{width:'40px', height:'40px', borderRadius:'50%', objectFit:'cover'}}/>
            </div>
            <div className="info"><a href="#">{staffInfo.fullName}</a></div>
        </div>
         <nav className="mt-2">
            <ul className="nav-sidebar">
               <li className={`nav-item ${activeTab==='dashboard'?'active':''}`} onClick={()=>setActiveTab('dashboard')}><LayoutDashboard size={18} /> <p>Dashboard</p></li>
               <li className={`nav-item ${activeTab==='profile'?'active':''}`} onClick={()=>setActiveTab('profile')}><User size={18} /> <p>Tài khoản</p></li>
               <li className={`nav-item ${activeTab==='products'?'active':''}`} onClick={()=>setActiveTab('products')}><Package size={18} /> <p>Quản lý Sản phẩm</p></li>
               <li className={`nav-item ${activeTab==='orders'?'active':''}`} onClick={()=>setActiveTab('orders')}><ShoppingCart size={18} /> <p>Quản lý Đơn hàng</p></li>
               <li className={`nav-item ${activeTab==='invoices'?'active':''}`} onClick={()=>setActiveTab('invoices')}><FileText size={18} /> <p>Quản lý Hóa đơn</p></li>
               <li className={`nav-item ${activeTab==='inventory'?'active':''}`} onClick={()=>setActiveTab('inventory')}><Warehouse size={18} /> <p>Kho hàng (Tổng)</p></li>
               <li className="nav-item logout" onClick={handleLogout}><LogOut size={18} /> <p>Đăng xuất</p></li>
            </ul>
         </nav>
      </aside>
      <div className="content-wrapper">
         <div className="content-header-row"><h1>{activeTab === 'dashboard' ? 'Dashboard' : ''}</h1></div>
         <section className="content">{renderContent()}</section>
      </div>

     
      {selectedOrder && (
        <div className="modal-overlay">
            <div className="modal-content" style={{maxWidth: '700px'}}>
                <div className="modal-header">
                    <h3>Chi Tiết Đơn Hàng #{selectedOrder.orderCode || selectedOrder.id}</h3>
                    <button className="close-btn" onClick={() => setSelectedOrder(null)}><X size={20}/></button>
                </div>
                <div className="modal-body" style={{maxHeight:'70vh', overflowY:'auto'}}>
                    
                   
                    <div className="info-group">
                        <h4><User size={16}/> Thông tin khách hàng</h4>
                        <p><strong>Họ tên:</strong> {selectedOrder.fullName}</p>
                        <p><strong>SĐT:</strong> {selectedOrder.phoneNumber}</p>
                        <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
                        <p><strong>Email:</strong> {selectedOrder.email}</p>
                    </div>

                   
                    <div className="info-group" style={{marginTop:'15px'}}>
                        <h4><Package size={16}/> Danh sách sản phẩm</h4>
                        <table className="order-items-table" style={{width:'100%', marginTop:'10px', borderCollapse:'collapse'}}>
                            <thead style={{background:'#f8f9fa'}}>
                                <tr>
                                    <th style={{padding:'8px', textAlign:'left'}}>Sản phẩm</th>
                                    <th style={{padding:'8px'}}>SL</th>
                                    <th style={{padding:'8px', textAlign:'right'}}>Đơn giá</th>
                                    <th style={{padding:'8px', textAlign:'right'}}>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                                    <tr key={idx} style={{borderBottom:'1px solid #eee'}}>
                                        <td style={{padding:'8px', display:'flex', gap:'10px', alignItems:'center'}}>
                                            <img src={item.productImageUrl} alt="" style={{width:'40px', height:'40px', objectFit:'cover', borderRadius:'4px'}}/>
                                            <div>
                                                <div style={{fontWeight:'500'}}>{item.productName}</div>
                                                <div style={{fontSize:'12px', color:'#777'}}>{item.color}, {item.size}</div>
                                            </div>
                                        </td>
                                        <td style={{padding:'8px', textAlign:'center'}}>x{item.quantity}</td>
                                        <td style={{padding:'8px', textAlign:'right'}}>{formatPrice(item.price)}</td>
                                        <td style={{padding:'8px', textAlign:'right'}}>{formatPrice(item.price * item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                   
                    <div style={{marginTop:'20px', textAlign:'right', fontSize:'16px', fontWeight:'bold', color:'#d90429'}}>
                        Tổng thanh toán: {formatPrice(selectedOrder.totalAmount)}
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={() => setSelectedOrder(null)}>Đóng</button>
                    
                    {orderSubTab === 'confirm' && (
                        <button className="btn-primary" onClick={() => updateOrderStatus(selectedOrder.id, 'Đang Giao Hàng')}>
                            <Truck size={16} style={{marginRight:'5px'}}/> Xác nhận giao hàng
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}

     
      {showProductModal && (
        <div className="modal-overlay">
            
             <div className="modal-content">
                <div className="modal-header"><h3>Cập Nhật Sản Phẩm</h3><button className="close-btn" onClick={() => setShowProductModal(false)}><X size={20}/></button></div>
                <form onSubmit={handleSaveProductUpdate}>
                     
                     <div className="form-grid">
                        <div className="form-group" style={{gridColumn: '1 / -1'}}><label>Tên SP</label><input type="text" value={productForm.name} onChange={(e)=>setProductForm({...productForm, name: e.target.value})} required /></div>
                        <div className="form-group"><label>Giá Bán</label><input type="number" value={productForm.price} onChange={(e)=>setProductForm({...productForm, price: e.target.value})} required /></div>
                        <div className="form-group"><label>Tồn Kho</label><input type="number" value={productForm.stockQuantity} onChange={(e)=>setProductForm({...productForm, stockQuantity: e.target.value})} required /></div>
                        <div className="form-group" style={{gridColumn: '1 / -1'}}><label>Mô tả</label><input type="text" value={productForm.description} onChange={(e)=>setProductForm({...productForm, description: e.target.value})}/></div>
                    </div>
                    <div className="modal-footer"><button type="button" className="btn-secondary" onClick={() => setShowProductModal(false)}>Hủy</button><button type="submit" className="btn-primary">Lưu thay đổi</button></div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default StaffDashboard;*/
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, User, Package, ShoppingCart, 
  FileText, Warehouse, LogOut, Menu,
  PlusCircle, Check, Trash2, Edit, X, Eye, EyeOff, MapPin, Phone, Mail, Truck, DollarSign ,MessageCircle
} from 'lucide-react';
// Import thư viện biểu đồ
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { getUserProfile } from '../../services/authService';
import UserProfile from '../../components/UserProfile.jsx'; 
import StaffChat from '../../components/StaffChat.jsx';
import './StaffDashboard.css';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [staffInfo, setStaffInfo] = useState({ 
      fullName: '', role: '', email: '', phone: '', address: '', username: '', avatarUrl: '' 
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- STATE DỮ LIỆU ---
  const [inventoryList, setInventoryList] = useState([]); 
  const [activeProducts, setActiveProducts] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  
  // --- STATE BIỂU ĐỒ ---
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [productPieData, setProductPieData] = useState([]);

  // State quản lý đơn hàng
  const [orderSubTab, setOrderSubTab] = useState('confirm'); 
  const [selectedOrder, setSelectedOrder] = useState(null); 

  // State Modal Sản phẩm
  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
      id: null, name: '', price: 0, importPrice: 0, stockQuantity: 0,
      description: '', imageUrl: '', sizes: '', colors: '', active: false
  });

  // --- INIT ---
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) { navigate('/staff'); return; } // <--- SỬA THÀNH /staff
        
        const profile = await getUserProfile(); 
        if (profile.role !== 'STAFF' && profile.role !== 'ADMIN') {
           localStorage.removeItem('userToken'); 
           navigate('/staff'); // <--- SỬA THÀNH /staff
        } else {
            setStaffInfo(profile); 
            fetchAllData(); 
        }
      } catch (error) { 
          localStorage.removeItem('userToken');
          navigate('/staff'); // <--- SỬA THÀNH /staff
      }
    };
    checkAuth();
  }, [navigate]);

  // --- TÍNH TOÁN BIỂU ĐỒ ---
  useEffect(() => {
    if (ordersList.length > 0) {
        processChartData(ordersList);
    }
  }, [ordersList]);

  const processChartData = (orders) => {
      // 1. Biểu đồ Cột (Tháng)
      const monthlyCounts = Array(12).fill(0);
      orders.forEach(order => {
          if (order.createdAt) {
              const date = new Date(order.createdAt);
              monthlyCounts[date.getMonth()] += 1;
          }
      });
      setMonthlyChartData(monthlyCounts.map((count, index) => ({ name: `T${index + 1}`, orders: count })));

      // 2. Biểu đồ Tròn (Sản phẩm)
      let aoCount = 0, quanCount = 0, vayCount = 0;
      orders.forEach(order => {
          if (order.items) {
              order.items.forEach(item => {
                  const name = item.productName ? item.productName.toLowerCase() : '';
                  const qty = item.quantity || 0;
                  if (name.includes('áo')) aoCount += qty;
                  else if (name.includes('quần')) quanCount += qty;
                  else if (name.includes('váy') || name.includes('đầm') || name.includes('chân váy')) vayCount += qty;
              });
          }
      });
      
      if (aoCount === 0 && quanCount === 0 && vayCount === 0) {
          setProductPieData([{ name: 'Chưa có', value: 1 }]);
      } else {
          setProductPieData([
              { name: 'Áo', value: aoCount },
              { name: 'Quần', value: quanCount },
              { name: 'Váy', value: vayCount }
          ]);
      }
  };

  const fetchAllData = () => {
      fetchInventory();     
      fetchActiveProducts(); 
      fetchOrders(); 
  };

  // --- API CALLS ---
  const fetchInventory = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/products/admin-list');
        if (res.ok) setInventoryList(await res.json());
      } catch (e) { console.error(e); }
  };

  const fetchActiveProducts = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/products');
        if (res.ok) setActiveProducts(await res.json());
      } catch (e) { console.error(e); }
  };

  const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await fetch('http://localhost:8080/api/v1/orders/all', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setOrdersList(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
      } catch (e) { console.error(e); }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
      if(!window.confirm(`Xác nhận chuyển đơn hàng #${orderId} sang trạng thái: ${newStatus}?`)) return;
      try {
          const token = localStorage.getItem('userToken');
          const res = await fetch(`http://localhost:8080/api/v1/orders/${orderId}/status?status=${newStatus}`, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
              alert("Cập nhật thành công!");
              fetchOrders(); 
              setSelectedOrder(null); 
          } else { alert("Lỗi cập nhật trạng thái!"); }
      } catch (error) { alert("Lỗi server: " + error.message); }
  };

  const toggleProductStatus = async (product, status) => {
      const actionName = status ? "Đăng bán (Lấy)" : "Gỡ xuống";
      if(!window.confirm(`Bạn muốn ${actionName} sản phẩm "${product.name}"?`)) return;
      const token = localStorage.getItem('userToken');
      try {
          const res = await fetch(`http://localhost:8080/api/v1/products/${product.id}/status?active=${status}`, {
              method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) { alert(`${actionName} thành công!`); fetchAllData(); } 
      } catch (e) { alert("Lỗi server"); }
  };

  const handleEditProduct = (product) => {
      const colorString = product.colors ? product.colors.map(c => c.name).join(', ') : '';
      setProductForm({
          id: product.id, name: product.name, price: product.price, importPrice: product.importPrice || 0,
          stockQuantity: product.stockQuantity || 0, description: product.description || '',
          imageUrl: product.imageUrls?.[0] || '', sizes: product.sizes ? product.sizes.join(',') : '',
          colors: colorString, active: product.active
      });
      setShowProductModal(true);
  };

  const handleSaveProductUpdate = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('userToken');
      const colorList = productForm.colors.split(',').map(c => ({ name: c.trim(), code: '#000000' })).filter(c => c.name !== '');
      const payload = {
          name: productForm.name, price: parseInt(productForm.price), importPrice: parseInt(productForm.importPrice),
          stockQuantity: parseInt(productForm.stockQuantity), description: productForm.description, details: productForm.description,
          imageUrls: [productForm.imageUrl], sizes: productForm.sizes.split(',').map(s => s.trim()), colors: colorList, active: productForm.active
      };
      try {
          const res = await fetch(`http://localhost:8080/api/v1/products/${productForm.id}`, {
              method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          if (res.ok) { alert("Cập nhật thành công!"); setShowProductModal(false); fetchAllData(); } 
      } catch (e) { alert("Lỗi server"); }
  };

  // --- CHỨC NĂNG ĐĂNG XUẤT (ĐÃ CHỈNH SỬA) ---
  const handleLogout = () => {
    if(window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi trang Nhân viên?")) { 
        // 1. Xóa token
        localStorage.removeItem('userToken'); 
        // 2. Chuyển hướng về trang login STAFF (Đã sửa link)
        navigate('/staff'); 
    }
  };
  
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  const formatDate = (dateString) => new Date(dateString).toLocaleString('vi-VN');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; 
  const totalRevenue = ordersList
    .filter(o => o.status === 'Đã Giao Hàng')
    .reduce((sum, order) => sum + order.totalAmount, 0);


  // ================= RENDER GIAO DIỆN =================

  const renderContent = () => {
    switch (activeTab) {
      
      // 1. DASHBOARD
      case 'dashboard':
        return (
          <div className="dashboard-home">
             <div className="stats-row" style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px'}}>
                <div className="stat-box bg-info">
                    <div className="inner"><h3>{ordersList.length}</h3><p>Tổng Đơn</p></div>
                    <div className="icon"><ShoppingCart size={40} opacity={0.4}/></div>
                </div>
                <div className="stat-box bg-success">
                    <div className="inner"><h3>{activeProducts.length}</h3><p>Đang Bán</p></div>
                    <div className="icon"><Eye size={40} opacity={0.4}/></div>
                </div>
                <div className="stat-box bg-warning">
                    <div className="inner"><h3>{inventoryList.length}</h3><p>Tổng Kho</p></div>
                    <div className="icon"><Warehouse size={40} opacity={0.4}/></div>
                </div>
                <div className="stat-box" style={{background: '#6f42c1', color: 'white'}}>
                    <div className="inner">
                        <h3 style={{fontSize:'20px'}}>{new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(totalRevenue)}</h3>
                        <p>Doanh Thu</p>
                    </div>
                    <div className="icon"><DollarSign size={40} opacity={0.4}/></div>
                </div>
             </div>

             {/* BIỂU ĐỒ */}
             <div className="charts-container" style={{display: 'flex', gap: '20px', marginTop: '30px'}}>
                <div className="chart-box" style={{flex: 2, background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'}}>
                    <h3 style={{marginBottom: '20px', color: '#333'}}>Thống kê đơn hàng (Năm nay)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip formatter={(value) => [`${value} Đơn`, 'Số lượng']} />
                            <Legend />
                            <Bar dataKey="orders" name="Số đơn hàng" fill="#007bff" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="chart-box" style={{flex: 1, background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'}}>
                    <h3 style={{marginBottom: '20px', color: '#333', textAlign:'center'}}>Sản phẩm bán chạy</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={productPieData}
                                cx="50%" cy="50%"
                                innerRadius={60} outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {productPieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{textAlign:'center', marginTop:'10px', fontSize:'14px', color:'#666'}}>
                        Phân bố: Áo - Quần - Váy
                    </div>
                </div>
             </div>
          </div>
        );

      // 2. PROFILE
      case 'profile':
       return <UserProfile onProfileUpdate={setStaffInfo} />;

      // 3. ORDERS
      case 'orders':
        const filteredOrders = ordersList.filter(order => {
            if (orderSubTab === 'confirm') return ['Chờ Giao Hàng', 'Đã Thanh Toán', 'Chờ Xác Nhận'].includes(order.status);
            if (orderSubTab === 'shipping') return order.status === 'Đang Giao Hàng';
            return false;
        });
        const countConfirm = ordersList.filter(o => ['Chờ Giao Hàng', 'Đã Thanh Toán', 'Chờ Xác Nhận'].includes(o.status)).length;
        const countShipping = ordersList.filter(o => o.status === 'Đang Giao Hàng').length;

        return (
            <div className="content-section">
                <div className="section-header">
                    <h2>Quản Lý Đơn Hàng</h2>
                    <div className="order-tabs">
                        <button className={`tab-btn ${orderSubTab==='confirm'?'active':''}`} onClick={()=>setOrderSubTab('confirm')}>Xác nhận ({countConfirm})</button>
                        <button className={`tab-btn ${orderSubTab==='shipping'?'active':''}`} onClick={()=>setOrderSubTab('shipping')}>Đang giao ({countShipping})</button>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="staff-table">
                        <thead><tr><th>Mã Đơn</th><th>Khách Hàng</th><th>Ngày Đặt</th><th>Tổng Tiền</th><th>Thanh Toán</th><th>Trạng Thái</th><th>Hành Động</th></tr></thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr><td colSpan="7" style={{textAlign:'center', padding:'20px'}}>Không có đơn hàng nào</td></tr>
                            ) : (
                                filteredOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.orderCode || order.id}</td>
                                        <td><div style={{fontWeight:'500'}}>{order.fullName}</div><div style={{fontSize:'12px', color:'#666'}}>{order.phoneNumber}</div></td>
                                        <td>{formatDate(order.createdAt)}</td>
                                        <td style={{color:'#d90429', fontWeight:'bold'}}>{formatPrice(order.totalAmount)}</td>
                                        <td>{order.paymentMethod}</td>
                                        <td><span className={`status-badge ${order.status === 'Đang Giao Hàng' ? 'shipping' : 'pending'}`}>{order.status === 'Đã Thanh Toán' ? 'Chờ Giao (Đã TT)' : order.status}</span></td>
                                        <td>
                                            <div style={{display:'flex', gap:'5px'}}>
                                                <button className="btn-small btn-view" onClick={() => setSelectedOrder(order)}><Eye size={14}/> Xem</button>
                                                {orderSubTab === 'confirm' && (
                                                    <button className="btn-small btn-confirm" onClick={() => updateOrderStatus(order.id, 'Đang Giao Hàng')}><Truck size={14}/> Xác nhận</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );

      // 4. INVOICES
      case 'invoices': 
        const invoices = ordersList.filter(order => order.status === 'Đã Giao Hàng');
        return (
            <div className="content-section">
               <div className="section-header"><h2>Quản Lý Hóa Đơn</h2><div style={{fontSize:'14px', color:'#666'}}>Tổng số: <strong>{invoices.length}</strong> hóa đơn hoàn tất</div></div>
               <div className="table-responsive">
                 <table className="staff-table">
                   <thead><tr><th>Mã Hóa Đơn</th><th>Khách Hàng</th><th>Ngày Đặt</th><th>Tổng Tiền</th><th>Thanh Toán</th><th>Chi Tiết</th></tr></thead>
                   <tbody>
                     {invoices.length === 0 ? (
                        <tr><td colSpan="6" style={{textAlign:'center', padding:'20px', color: '#888'}}>Chưa có hóa đơn nào hoàn tất.</td></tr>
                     ) : (
                        invoices.map(order => (
                            <tr key={order.id}>
                                <td>#{order.orderCode || order.id}</td>
                                <td><div style={{fontWeight:'500'}}>{order.fullName}</div><div style={{fontSize:'12px', color:'#666'}}>{order.phoneNumber}</div></td>
                                <td>{formatDate(order.createdAt)}</td> 
                                <td style={{color:'#28a745', fontWeight:'bold'}}>{formatPrice(order.totalAmount)}</td>
                                <td><span className="status-badge completed" style={{background:'#d4edda', color:'#155724'}}>{order.paymentMethod}</span></td>
                                <td><button className="btn-small btn-view" onClick={() => setSelectedOrder(order)}><Eye size={14} style={{marginRight:'5px'}}/> Xem</button></td>
                            </tr>
                        ))
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
        );

      // 5. PRODUCTS
      case 'products':
        return (
          <div className="content-section">
            <div className="section-header"><h2>Sản Phẩm Đang Bán</h2></div>
            <div className="table-responsive">
              <table className="staff-table">
                <thead><tr><th>ID</th><th>Ảnh</th><th>Tên SP</th><th>Giá Bán</th><th>Tồn</th><th>Hành Động</th></tr></thead>
                <tbody>
                  {activeProducts.map(p => (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td><img src={p.imageUrls?.[0] || 'https://placehold.co/40'} alt="" style={{width:'40px', height:'40px', objectFit:'cover', borderRadius:'4px'}} /></td>
                      <td style={{fontWeight:'500'}}>{p.name}</td>
                      <td style={{color:'#007bff'}}>{formatPrice(p.price)}</td>
                      <td>{p.stockQuantity}</td>
                      <td>
                          <div style={{display:'flex', gap:'5px'}}>
                              <button className="btn-small btn-edit" onClick={() => handleEditProduct(p)}><Edit size={14}/> Sửa</button>
                              <button className="btn-small btn-delete" onClick={() => toggleProductStatus(p, false)}><EyeOff size={14}/> Gỡ</button>
                          </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      // 6. INVENTORY
      case 'inventory':
        return (
            <div className="content-section">
               <div className="section-header"><h2>Kho Hàng Tổng</h2><button className="btn-small" onClick={fetchInventory}>Làm mới</button></div>
               <div className="table-responsive">
                 <table className="staff-table">
                   <thead><tr><th>ID</th><th>Sản Phẩm</th><th>Tồn Kho</th><th>Trạng Thái</th><th>Thao Tác</th></tr></thead>
                   <tbody>
                     {inventoryList.map(p => (
                        <tr key={p.id}>
                            <td>#{p.id}</td>
                            <td>
                                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                    <img src={p.imageUrls?.[0] || 'https://placehold.co/30'} alt="" style={{width:'30px', height:'30px', borderRadius:'50%'}}/>
                                    <span>{p.name}</span>
                                </div>
                            </td>
                            <td style={{color: p.stockQuantity < 10 ? '#dc3545' : '#28a745', fontWeight:'bold'}}>{p.stockQuantity}</td>
                            <td>{p.active ? <span className="status-badge completed">Đang bán</span> : <span className="status-badge pending">Chưa bán</span>}</td>
                            <td>
                                {p.active ? (
                                    <button className="btn-small btn-disabled" disabled><Check size={14}/> Đã Lấy</button>
                                ) : (
                                    <button className="btn-small btn-take" onClick={() => toggleProductStatus(p, true)}><PlusCircle size={14}/> LẤY</button>
                                )}
                            </td>
                        </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
         );
         case 'chat':
    return (
        <div className="content-section">
            <div className="section-header"><h2>Hỗ Trợ Khách Hàng</h2></div>
            <StaffChat /> 
        </div>
    );
      
      default: return <div>Chọn một mục từ menu</div>;
    }
  };

  return (
    <div className={`staff-layout ${isSidebarOpen ? '' : 'sidebar-collapse'}`}>
      <nav className="main-header">
         <div className="header-left"><button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu size={20}/></button><span className="page-title">Home</span></div>
         <div className="header-right"><div className="user-profile-top"><img src={staffInfo.avatarUrl || "https://i.pravatar.cc/150?u=staff"} alt="User" style={{width:'35px', height:'35px', borderRadius:'50%', objectFit:'cover'}}/><span>{staffInfo.fullName}</span></div></div>
      </nav>
      <aside className="main-sidebar">
         <div className="brand-link"><div className="brand-logo">R</div><span className="brand-text">Staff Portal</span></div>
         <div className="sidebar-user"><div className="image"><img src={staffInfo.avatarUrl || "https://i.pravatar.cc/150?u=staff"} alt="User" style={{width:'40px', height:'40px', borderRadius:'50%', objectFit:'cover'}}/></div><div className="info"><a href="#">{staffInfo.fullName}</a></div></div>
         <nav className="mt-2">
            <ul className="nav-sidebar">
               <li className={`nav-item ${activeTab==='dashboard'?'active':''}`} onClick={()=>setActiveTab('dashboard')}><LayoutDashboard size={18} /> <p>Dashboard</p></li>
               <li className={`nav-item ${activeTab==='profile'?'active':''}`} onClick={()=>setActiveTab('profile')}><User size={18} /> <p>Tài khoản</p></li>
               <li className={`nav-item ${activeTab==='products'?'active':''}`} onClick={()=>setActiveTab('products')}><Package size={18} /> <p>Quản lý Sản phẩm</p></li>
               <li className={`nav-item ${activeTab==='orders'?'active':''}`} onClick={()=>setActiveTab('orders')}><ShoppingCart size={18} /> <p>Quản lý Đơn hàng</p></li>
               <li className={`nav-item ${activeTab==='invoices'?'active':''}`} onClick={()=>setActiveTab('invoices')}><FileText size={18} /> <p>Quản lý Hóa đơn</p></li>
               <li className={`nav-item ${activeTab==='inventory'?'active':''}`} onClick={()=>setActiveTab('inventory')}><Warehouse size={18} /> <p>Kho hàng (Tổng)</p></li>
               {/* Thêm dòng này vào danh sách menu sidebar */}
<li className={`nav-item ${activeTab==='chat'?'active':''}`} onClick={()=>setActiveTab('chat')}>
    <MessageCircle size={18} /> <p>CSKH / Chat</p>
</li>
               <li className="nav-item logout" onClick={handleLogout}><LogOut size={18} /> <p>Đăng xuất</p></li>
            </ul>
         </nav>
      </aside>
      <div className="content-wrapper">
         <div className="content-header-row"><h1>{activeTab === 'dashboard' ? 'Dashboard' : ''}</h1></div>
         <section className="content">{renderContent()}</section>
      </div>

      {selectedOrder && (
        <div className="modal-overlay">
            <div className="modal-content" style={{maxWidth: '700px'}}>
                <div className="modal-header"><h3>{activeTab === 'invoices' ? 'Chi Tiết Hóa Đơn' : 'Chi Tiết Đơn Hàng'} #{selectedOrder.orderCode || selectedOrder.id}</h3><button className="close-btn" onClick={() => setSelectedOrder(null)}><X size={20}/></button></div>
                <div className="modal-body" style={{maxHeight:'70vh', overflowY:'auto'}}>
                    <div className="info-group">
                        <h4><User size={16}/> Thông tin khách hàng</h4>
                        <p><strong>Họ tên:</strong> {selectedOrder.fullName}</p>
                        <p><strong>SĐT:</strong> {selectedOrder.phoneNumber}</p>
                        <p><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress}</p> 
                    </div>
                    <div className="info-group" style={{marginTop:'15px'}}>
                        <h4><Package size={16}/> Danh sách sản phẩm</h4>
                        <table className="order-items-table" style={{width:'100%', marginTop:'10px', borderCollapse:'collapse'}}>
                            <thead style={{background:'#f8f9fa'}}><tr><th style={{padding:'8px', textAlign:'left'}}>Sản phẩm</th><th style={{padding:'8px'}}>SL</th><th style={{padding:'8px', textAlign:'right'}}>Đơn giá</th><th style={{padding:'8px', textAlign:'right'}}>Thành tiền</th></tr></thead>
                            <tbody>{selectedOrder.items && selectedOrder.items.map((item, idx) => (<tr key={idx} style={{borderBottom:'1px solid #eee'}}><td style={{padding:'8px', display:'flex', gap:'10px', alignItems:'center'}}><img src={item.productImageUrl} alt="" style={{width:'40px', height:'40px', objectFit:'cover', borderRadius:'4px'}}/><div><div style={{fontWeight:'500'}}>{item.productName}</div><div style={{fontSize:'12px', color:'#777'}}>{item.color}, {item.size}</div></div></td><td style={{padding:'8px', textAlign:'center'}}>x{item.quantity}</td><td style={{padding:'8px', textAlign:'right'}}>{formatPrice(item.price)}</td><td style={{padding:'8px', textAlign:'right'}}>{formatPrice(item.price * item.quantity)}</td></tr>))}</tbody>
                        </table>
                    </div>
                    <div style={{marginTop:'20px', textAlign:'right', fontSize:'16px', fontWeight:'bold', color: activeTab === 'invoices' ? '#28a745' : '#d90429'}}>Tổng thanh toán: {formatPrice(selectedOrder.totalAmount)}</div>
                </div>
                <div className="modal-footer"><button className="btn-secondary" onClick={() => setSelectedOrder(null)}>Đóng</button>{activeTab === 'orders' && orderSubTab === 'confirm' && (<button className="btn-primary" onClick={() => updateOrderStatus(selectedOrder.id, 'Đang Giao Hàng')}><Truck size={16} style={{marginRight:'5px'}}/> Xác nhận giao hàng</button>)}</div>
            </div>
        </div>
      )}

      {showProductModal && (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header"><h3>Cập Nhật Sản Phẩm</h3><button className="close-btn" onClick={() => setShowProductModal(false)}><X size={20}/></button></div>
                <form onSubmit={handleSaveProductUpdate}>
                     <div className="form-grid">
                        <div className="form-group" style={{gridColumn: '1 / -1'}}><label>Tên SP</label><input type="text" value={productForm.name} onChange={(e)=>setProductForm({...productForm, name: e.target.value})} required /></div>
                        <div className="form-group"><label>Giá Bán</label><input type="number" value={productForm.price} onChange={(e)=>setProductForm({...productForm, price: e.target.value})} required /></div>
                        <div className="form-group"><label>Tồn Kho</label><input type="number" value={productForm.stockQuantity} onChange={(e)=>setProductForm({...productForm, stockQuantity: e.target.value})} required /></div>
                        <div className="form-group" style={{gridColumn: '1 / -1'}}><label>Mô tả</label><input type="text" value={productForm.description} onChange={(e)=>setProductForm({...productForm, description: e.target.value})}/></div>
                    </div>
                    <div className="modal-footer"><button type="button" className="btn-secondary" onClick={() => setShowProductModal(false)}>Hủy</button><button type="submit" className="btn-primary">Lưu thay đổi</button></div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default StaffDashboard;