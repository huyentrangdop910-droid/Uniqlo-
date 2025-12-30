
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, LogOut, Bell, Search, 
  Briefcase, Package, UserCheck, 
  Plus, Edit, Trash2, X, UploadCloud, Eye, 
  DollarSign, TrendingUp, ShoppingBag, RotateCcw, 
  ChevronLeft, ChevronRight // <--- Đã thêm ChevronLeft
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { getUserProfile } from '../../services/authService';
import './AdminDashboard.css';

// --- HÀM HỖ TRỢ ---
const getColorHex = (colorName) => {
    const name = colorName.toLowerCase().trim();
    if (name.includes('đen') || name.includes('black')) return '#000000';
    if (name.includes('trắng') || name.includes('white')) return '#FFFFFF';
    if (name.includes('đỏ') || name.includes('red')) return '#EF4444';
    if (name.includes('xanh dương') || name.includes('blue')) return '#3B82F6';
    if (name.includes('xanh lá') || name.includes('green')) return '#10B981';
    if (name.includes('vàng') || name.includes('yellow')) return '#F59E0B';
    if (name.includes('xám') || name.includes('gray')) return '#6B7280';
    if (name.includes('nâu') || name.includes('brown')) return '#92400E';
    if (name.includes('hồng') || name.includes('pink')) return '#EC4899';
    if (name.includes('tím') || name.includes('purple')) return '#8B5CF6';
    if (name.includes('cam') || name.includes('orange')) return '#F97316';
    if (name.includes('be') || name.includes('beige')) return '#F5F5DC';
    return '#9CA3AF';
};

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [adminName, setAdminName] = useState('Admin');
  
  const [activeTab, setActiveTab] = useState('dashboard'); 
  
  // --- STATE DỮ LIỆU ---
  const [staffList, setStaffList] = useState([]); 
  const [productList, setProductList] = useState([]); 
  const [customerList, setCustomerList] = useState([]); 
  const [ordersList, setOrdersList] = useState([]); 

  // --- STATE PHÂN TRANG KHO HÀNG ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Số lượng: 5 sản phẩm/trang

  // --- STATE TÌM KIẾM KHO HÀNG ---
  const [inventorySearchTerm, setInventorySearchTerm] = useState('');

  // --- STATE THỐNG KÊ DASHBOARD ---
  const [stats, setStats] = useState({ revenue: 0, profit: 0, totalOrders: 0 });
  const [orderChartData, setOrderChartData] = useState([]);
  
  const visitorChartData = [
      { name: 'T1', visitors: 4000 }, { name: 'T2', visitors: 3000 }, { name: 'T3', visitors: 2000 },
      { name: 'T4', visitors: 2780 }, { name: 'T5', visitors: 1890 }, { name: 'T6', visitors: 2390 },
      { name: 'T7', visitors: 3490 }, { name: 'T8', visitors: 4200 }, { name: 'T9', visitors: 3800 },
      { name: 'T10', visitors: 5000 }, { name: 'T11', visitors: 6100 }, { name: 'T12', visitors: 7500 },
  ];

  // --- STATE MODAL ---
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); 
  const [modalMode, setModalMode] = useState('create');
  
  // --- FORM DATA ---
  const [userForm, setUserForm] = useState({ id: null, username: '', password: '', fullName: '', email: '', phone: '', address: '' });
  const [productForm, setProductForm] = useState({ id: null, name: '', price: 0, importPrice: 0, stockQuantity: 0, description: '', imageUrl: '', sizes: 'S,M,L', colors: 'Trắng, Đen' });

  // --- API CALLS ---
  const fetchStaffs = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await fetch('http://localhost:8080/api/v1/users/staffs', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setStaffList(await res.json());
      } catch (e) { console.error(e); }
  };

  const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/products/admin-list');
        if (res.ok) {
            setProductList(await res.json());
            setCurrentPage(1); // Reset về trang 1 khi load lại
        }
      } catch (e) { console.error(e); }
  };

  const handleSearchInventory = async () => {
    if (!inventorySearchTerm.trim()) {
        fetchProducts(); 
        return;
    }
    try {
        const url = `http://localhost:8080/api/v1/products/search?query=${encodeURIComponent(inventorySearchTerm)}&min=0&max=2000000000`;
        const res = await fetch(url);
        if (res.ok) {
            setProductList(await res.json());
            setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
        }
    } catch (error) {
        console.error("Lỗi tìm kho:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch('http://localhost:8080/api/v1/users/customers', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setCustomerList(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await fetch('http://localhost:8080/api/v1/orders/all', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            setOrdersList(await res.json());
        }
      } catch (e) { console.error("Lỗi lấy đơn hàng:", e); }
  };

  useEffect(() => {
    const checkAccess = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) { navigate('/admin'); return; }
      try {
        const profile = await getUserProfile();
        if (profile.role !== 'ADMIN') { alert("Không có quyền!"); navigate('/'); } 
        else {
            setAdminName(profile.fullName || profile.username);
            setIsLoading(false);
            fetchStaffs();    
            fetchProducts();
            fetchCustomers();
            fetchOrders(); 
        }
      } catch { localStorage.removeItem('userToken'); navigate('/admin'); }
    };
    checkAccess();
  }, [navigate]);

  useEffect(() => {
      if (ordersList.length > 0 && productList.length > 0) {
          calculateStats();
      }
  }, [ordersList, productList]);

  const calculateStats = () => {
      let revenue = 0;
      let totalImportCost = 0;
      const monthlyOrderCounts = Array(12).fill(0);

      ordersList.forEach(order => {
          if (order.createdAt) {
              const month = new Date(order.createdAt).getMonth();
              monthlyOrderCounts[month] += 1;
          }
          if (order.status === 'Đã Giao Hàng') {
              revenue += order.totalAmount;
              if (order.items) {
                  order.items.forEach(item => {
                      const product = productList.find(p => p.name === item.productName); 
                      const importPrice = product ? product.importPrice : 0;
                      totalImportCost += (importPrice * item.quantity);
                  });
              }
          }
      });

      setStats({
          revenue: revenue,
          profit: revenue - totalImportCost,
          totalOrders: ordersList.length
      });

      setOrderChartData(monthlyOrderCounts.map((count, index) => ({
          name: `T${index + 1}`,
          orders: count
      })));
  };

  // --- HANDLERS (GIỮ NGUYÊN) ---
  const handleUserChange = (e) => setUserForm({ ...userForm, [e.target.name]: e.target.value });
  const handleProductChange = (e) => setProductForm({ ...productForm, [e.target.name]: e.target.value });
  
  const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setProductForm({ ...productForm, imageUrl: reader.result });
          reader.readAsDataURL(file);
      }
  };

  const openUserModal = (mode, staff = null) => {
      setModalType('USER'); setModalMode(mode);
      if (mode === 'create') setUserForm({ id: null, username: '', password: '', fullName: '', email: '', phone: '', address: '' });
      else setUserForm({ id: staff.id, username: staff.username, password: '', fullName: staff.fullName, email: staff.email, phone: staff.phoneNumber || staff.phone, address: staff.address || '' });
      setShowModal(true);
  };

  const openCustomerModal = (customer) => {
    setModalType('CUSTOMER'); setModalMode('view');
    setUserForm({ id: customer.id, username: customer.username, password: '', fullName: customer.fullName, email: customer.email, phone: customer.phoneNumber, address: customer.address || '' });
    setShowModal(true);
  };

  const openProductModal = (mode, product = null) => {
      setModalType('PRODUCT'); setModalMode(mode);
      if (mode === 'create') setProductForm({ id: null, name: '', price: 0, importPrice: 0, stockQuantity: 0, description: '', imageUrl: '', sizes: 'S,M,L', colors: 'Trắng, Đen' });
      else {
          const colorString = product.colors ? product.colors.map(c => c.name).join(', ') : '';
          setProductForm({ id: product.id, name: product.name, price: product.price, importPrice: product.importPrice || 0, stockQuantity: product.stockQuantity || 0, description: product.description || '', imageUrl: product.imageUrls?.[0] || '', sizes: product.sizes ? product.sizes.join(',') : '', colors: colorString });
      }
      setShowModal(true);
  };

  const handleSaveUser = async (e) => {
      e.preventDefault(); if (modalType === 'CUSTOMER') { setShowModal(false); return; }
      const token = localStorage.getItem('userToken');
      const payload = { username: userForm.username, password: userForm.password, fullName: userForm.fullName, email: userForm.email, phone: userForm.phone, address: userForm.address };
      let url = 'http://localhost:8080/api/v1/users/staffs'; let method = 'POST';
      if (modalMode === 'edit') { url = `http://localhost:8080/api/v1/users/${userForm.id}`; method = 'PUT'; }
      try { const res = await fetch(url, { method: method, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (res.ok) { alert(modalMode === 'create' ? "Thêm thành công!" : "Cập nhật thành công!"); setShowModal(false); fetchStaffs(); } else { alert("Lỗi: " + await res.text()); } } catch (e) { alert("Lỗi server"); }
  };

  const handleDeleteUser = async (e, id) => {
    e.stopPropagation(); if(!window.confirm("Xóa nhân viên?")) return;
    const token = localStorage.getItem('userToken');
    try { const res = await fetch(`http://localhost:8080/api/v1/users/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); if (res.ok) { setStaffList(staffList.filter(s => s.id !== id)); alert("Đã xóa!"); } else { alert("Lỗi xóa!"); } } catch (e) { alert("Lỗi server"); }
  };

  const handleSaveProduct = async (e) => {
      e.preventDefault(); const token = localStorage.getItem('userToken');
      const colorList = productForm.colors.split(',').map(c => { const colorName = c.trim(); return { name: colorName, code: getColorHex(colorName) }; }).filter(c => c.name !== '');
      const payload = { name: productForm.name, price: parseInt(productForm.price), importPrice: parseInt(productForm.importPrice), stockQuantity: parseInt(productForm.stockQuantity), description: productForm.description, details: productForm.description, imageUrls: [productForm.imageUrl], sizes: productForm.sizes.split(',').map(s => s.trim()), colors: colorList };
      let url = 'http://localhost:8080/api/v1/products'; let method = 'POST';
      if (modalMode === 'edit') { url = `http://localhost:8080/api/v1/products/${productForm.id}`; method = 'PUT'; }
      try { const res = await fetch(url, { method: method, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (res.ok) { alert("Thành công!"); setShowModal(false); fetchProducts(); } else { alert("Lỗi: " + await res.text()); } } catch (e) { alert("Lỗi server"); }
  };

  const handleDeleteProduct = async (id) => {
      if(!window.confirm("Xóa sản phẩm?")) return;
      const token = localStorage.getItem('userToken');
      try { const res = await fetch(`http://localhost:8080/api/v1/products/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); if (res.ok) { setProductList(productList.filter(p => p.id !== id)); alert("Đã xóa!"); } else { alert("Lỗi xóa"); } } catch (e) { alert("Lỗi server"); }
  };

  const handleLogout = () => { if(window.confirm("Đăng xuất?")) { localStorage.removeItem('userToken'); navigate('/admin'); } };

  if (isLoading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand"><div className="brand-logo">R</div><div className="brand-info"><span className="brand-name">Uniqlo</span><span className="brand-role">Admin</span></div></div>
        <div className="sidebar-menu">
          <div className={`menu-item ${activeTab==='dashboard'?'active':''}`} onClick={()=>setActiveTab('dashboard')}><LayoutDashboard size={20}/> Dashboard</div>
          <div className={`menu-item ${activeTab==='staff'?'active':''}`} onClick={()=>setActiveTab('staff')}><Briefcase size={20}/> Nhân Sự</div>
          <div className={`menu-item ${activeTab==='customers'?'active':''}`} onClick={()=>setActiveTab('customers')}><UserCheck size={20}/> Khách Hàng</div>
          <div className={`menu-item ${activeTab==='inventory'?'active':''}`} onClick={()=>setActiveTab('inventory')}><Package size={20}/> Kho Hàng</div>
        </div>
        <div className="sidebar-bottom"><div className="menu-item logout-item" onClick={handleLogout}><LogOut size={20}/> <span>Đăng xuất</span></div></div>
      </aside>

      <main className="admin-main">
        <header className="admin-header"><div className="search-box"><Search size={20}/></div><div className="header-actions"><Bell size={20}/><div className="admin-avatar"><img src="https://i.pravatar.cc/150?u=admin" alt="Admin"/></div></div></header>
       
        <div className="dashboard-content">
          
          {/* TAB DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-view">
                <div className="stats-grid" style={{gridTemplateColumns: 'repeat(5, 1fr)'}}>
                    <div className="stat-card">
                        <div className="stat-top">
                            <div><p className="stat-label">DOANH THU</p><h3>{new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(stats.revenue)}</h3></div>
                            <div className="stat-icon green"><DollarSign size={24} color="white"/></div>
                        </div>
                        <p className="stat-sub">Tổng tiền đơn thành công</p>
                    </div>
                    <div className="stat-card">
                        <div className="stat-top">
                            <div><p className="stat-label">LỢI NHUẬN</p><h3>{new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(stats.profit)}</h3></div>
                            <div className="stat-icon blue"><TrendingUp size={24} color="white"/></div>
                        </div>
                        <p className="stat-sub">Doanh thu - Giá vốn</p>
                    </div>
                    <div className="stat-card">
                        <div className="stat-top">
                            <div><p className="stat-label">TỔNG ĐƠN</p><h3>{stats.totalOrders}</h3></div>
                            <div className="stat-icon orange"><ShoppingBag size={24} color="white"/></div>
                        </div>
                        <p className="stat-sub">Số đơn hàng toàn hệ thống</p>
                    </div>
                    <div className="stat-card">
                        <div className="stat-top">
                            <div><p className="stat-label">TỔNG NHÂN SỰ</p><h3>{staffList.length}</h3></div>
                            <div className="stat-icon purple"><Briefcase size={24} color="white"/></div>
                        </div>
                        <p className="stat-sub">Nhân viên đang hoạt động</p>
                    </div>
                    <div className="stat-card">
                        <div className="stat-top">
                            <div><p className="stat-label">TỔNG KHÁCH HÀNG</p><h3>{customerList.length}</h3></div>
                            <div className="stat-icon red"><Users size={24} color="white"/></div>
                        </div>
                        <p className="stat-sub">Tài khoản đã đăng ký</p>
                    </div>
                </div>

                <div className="charts-container" style={{display: 'flex', gap: '20px', marginTop: '30px'}}>
                    <div className="chart-box" style={{flex: 1, background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'}}>
                        <h3 style={{marginBottom: '20px', color: '#333'}}>Lượng khách truy cập (Năm 2025)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={visitorChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="visitors" stroke="#8884d8" fill="#8884d8" name="Lượt xem" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-box" style={{flex: 1, background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'}}>
                        <h3 style={{marginBottom: '20px', color: '#333'}}>Số lượng đơn hàng (Thực tế)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={orderChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="orders" name="Đơn hàng" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
          )}

          {/* TAB QUẢN LÝ NHÂN SỰ */}
          {activeTab === 'staff' && (
             <div className="staff-container">
                <div className="content-header">
                    <h2>Danh Sách Nhân Sự</h2>
                    <button className="btn-primary" onClick={() => openUserModal('create')}><Plus size={18} style={{marginRight:'8px'}}/> Thêm Nhân Viên</button>
                </div>
                <div className="table-wrapper">
                    <table className="admin-table">
                        <thead><tr><th>ID</th><th>Họ Tên</th><th>Tài khoản</th><th>Email</th><th>SĐT</th><th>Vai trò</th><th>Hành động</th></tr></thead>
                        <tbody>{staffList.map((staff) => (<tr key={staff.id} onClick={() => openUserModal('view', staff)} className="clickable-row"><td>#{staff.id}</td><td><div className="user-cell"><div className="user-avatar-small">{staff.fullName ? staff.fullName.charAt(0) : 'U'}</div>{staff.fullName}</div></td><td>{staff.username}</td><td>{staff.email}</td><td>{staff.phoneNumber || staff.phone}</td><td><span className="badge badge-staff">{staff.role}</span></td><td><div className="action-buttons"><button className="btn-action edit" onClick={(e) => { e.stopPropagation(); openUserModal('edit', staff); }}><Edit size={16}/> Sửa</button><button className="btn-action delete-text" onClick={(e) => handleDeleteUser(e, staff.id)}><Trash2 size={16}/> Xóa</button></div></td></tr>))}</tbody>
                    </table>
                </div>
             </div>
          )}

          {/* TAB KHÁCH HÀNG */}
          {activeTab === 'customers' && (
             <div className="staff-container">
                <div className="content-header"><h2>Danh Sách Khách Hàng</h2></div>
                <div className="table-wrapper">
                    <table className="admin-table">
                        <thead><tr><th>ID</th><th>Họ Tên</th><th>Email</th><th>Số điện thoại</th><th>Địa chỉ</th><th>Hành động</th></tr></thead>
                        <tbody>{customerList.length > 0 ? customerList.map((cus) => (<tr key={cus.id} onClick={() => openCustomerModal(cus)} className="clickable-row"><td>#{cus.id}</td><td><div className="user-cell"><div className="user-avatar-small" style={{backgroundColor: '#3B82F6'}}>{cus.fullName ? cus.fullName.charAt(0).toUpperCase() : 'C'}</div>{cus.fullName || cus.username}</div></td><td>{cus.email}</td><td>{cus.phoneNumber || '---'}</td><td style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{cus.address || '---'}</td><td><div className="action-buttons"><button className="btn-action view" onClick={(e) => { e.stopPropagation(); openCustomerModal(cus); }} title="Xem chi tiết"><Eye size={16} /> Xem</button></div></td></tr>)) : (<tr><td colSpan="6" style={{textAlign: 'center', padding: '20px', color: '#888'}}>Chưa có khách hàng nào</td></tr>)}</tbody>
                    </table>
                </div>
             </div>
          )}
          
          {/* TAB KHO HÀNG (ĐÃ CÓ TÌM KIẾM + PHÂN TRANG) */}
          {activeTab === 'inventory' && (
             <div className="staff-container">
                <div className="content-header">
                    <h2>Quản Lý Kho Hàng</h2>
                    <button className="btn-primary" onClick={() => openProductModal('create')}><Plus size={18} style={{marginRight:'8px'}}/> Nhập Hàng Mới</button>
                </div>

                {/* UI TÌM KIẾM */}
                <div className="search-bar-container" style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div className="search-input-wrapper" style={{position: 'relative', width: '350px'}}>
                        <Search size={18} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input 
                            type="text" placeholder="Nhập tên sản phẩm..." 
                            value={inventorySearchTerm}
                            onChange={(e) => setInventorySearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchInventory()}
                            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e5e7eb', height: '42px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>
                    <button className="btn-primary" onClick={handleSearchInventory} style={{ height: '42px', padding: '0 20px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', flexShrink: 0 }}>
                        <Search size={16} /> Tìm kiếm
                    </button>
                    <button className="btn-secondary" onClick={() => { setInventorySearchTerm(''); fetchProducts(); }} title="Làm mới danh sách" style={{ height: '42px', width: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', flexShrink: 0 }}>
                        <RotateCcw size={18} color="#6b7280"/>
                    </button>
                </div>

                {/* LOGIC PHÂN TRANG */}
                {(() => {
                    // Tính toán các sản phẩm của trang hiện tại
                    const indexOfLastItem = currentPage * itemsPerPage;
                    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                    const currentProducts = productList.slice(indexOfFirstItem, indexOfLastItem);
                    const totalPages = Math.ceil(productList.length / itemsPerPage);

                    return (
                        <>
                            <div className="table-wrapper">
                                <table className="admin-table">
                                    <thead><tr><th>ID</th><th>Ảnh</th><th>Tên SP</th><th>Tồn</th><th>Màu Sắc</th><th>Giá Bán</th><th>Hành động</th></tr></thead>
                                    <tbody>
                                        {currentProducts.length > 0 ? currentProducts.map((p) => (
                                            <tr key={p.id}>
                                                <td>#{p.id}</td>
                                                <td><img src={p.imageUrls?.[0] || 'https://placehold.co/40'} alt="" style={{width:'40px', height:'40px', objectFit:'cover', borderRadius:'4px'}}/></td>
                                                <td style={{fontWeight:'500'}}>{p.name}</td>
                                                <td style={{color: p.stockQuantity < 10 ? 'red' : 'inherit', fontWeight: 'bold'}}>{p.stockQuantity}</td>
                                                <td><div style={{display:'flex', gap:'4px'}}>{p.colors && p.colors.map(c => (<div key={c.code} title={c.name} style={{width:'15px', height:'15px', borderRadius:'50%', backgroundColor: c.code, border:'1px solid #ddd'}}></div>))}</div></td>
                                                <td>{formatCurrency(p.price)}</td>
                                                <td><div className="action-buttons"><button className="btn-action edit" onClick={() => openProductModal('edit', p)}><Edit size={16}/></button><button className="btn-action delete-text" onClick={() => handleDeleteProduct(p.id)}><Trash2 size={16}/></button></div></td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px', color: '#888'}}>Không tìm thấy sản phẩm nào</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* THANH ĐIỀU HƯỚNG PHÂN TRANG */}
                            {totalPages > 1 && (
                                <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        style={{
                                            padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', 
                                            background: currentPage === 1 ? '#f5f5f5' : 'white', 
                                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer', 
                                            color: currentPage === 1 ? '#ccc' : '#333',
                                            display: 'flex', alignItems: 'center'
                                        }}
                                    >
                                        <ChevronLeft size={16} />
                                    </button>

                                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#555' }}>
                                        Trang {currentPage} / {totalPages}
                                    </span>

                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        style={{
                                            padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', 
                                            background: currentPage === totalPages ? '#f5f5f5' : 'white', 
                                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', 
                                            color: currentPage === totalPages ? '#ccc' : '#333',
                                            display: 'flex', alignItems: 'center'
                                        }}
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </>
                    );
                })()}
             </div>
          )}
          
          {/* MODAL CHUNG */}
          {showModal && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header"><h3>{modalType === 'USER' ? (modalMode==='create'?"Thêm Nhân Viên":"Thông tin Nhân Viên") : modalType === 'CUSTOMER' ? "Chi Tiết Khách Hàng" : (modalMode==='create'?"Nhập Hàng":"Sửa Sản Phẩm")}</h3><button className="close-btn" onClick={() => setShowModal(false)}><X size={20}/></button></div>
                    {(modalType === 'USER' || modalType === 'CUSTOMER') ? (
                        <form onSubmit={handleSaveUser}>
                            <div className="form-grid">
                                <div className="form-group"><label>Username</label><input type="text" name="username" value={userForm.username} onChange={handleUserChange} disabled={modalMode!=='create' && modalType!=='CUSTOMER'} required/></div>
                                {modalType === 'USER' && modalMode !== 'view' && (<div className="form-group"><label>Mật khẩu</label><input type="password" name="password" value={userForm.password} onChange={handleUserChange} placeholder={modalMode==='edit'?'(Để trống nếu không đổi)':''} required={modalMode==='create'}/></div>)}
                                <div className="form-group"><label>Họ tên</label><input type="text" name="fullName" value={userForm.fullName} onChange={handleUserChange} disabled={modalType === 'CUSTOMER' || modalMode==='view'} required/></div>
                                <div className="form-group"><label>Email</label><input type="email" name="email" value={userForm.email} onChange={handleUserChange} disabled={modalType === 'CUSTOMER' || modalMode==='view'} required/></div>
                                <div className="form-group"><label>Số điện thoại</label><input type="text" name="phone" value={userForm.phone} onChange={handleUserChange} disabled={modalType === 'CUSTOMER' || modalMode==='view'} /></div>
                                <div className="form-group" style={{gridColumn: '1 / -1'}}><label>Địa chỉ</label><input type="text" name="address" value={userForm.address} onChange={handleUserChange} disabled={modalType === 'CUSTOMER' || modalMode==='view'} /></div>
                            </div>
                            <div className="modal-footer">{modalMode === 'view' ? (<button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Đóng</button>) : (<><button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Hủy</button><button type="submit" className="btn-primary">{modalMode==='create'?'Tạo':'Lưu'}</button></>)}</div>
                        </form>
                    ) : (
                        <form onSubmit={handleSaveProduct}>
                             <div className="form-grid">
                                <div className="form-group" style={{gridColumn: '1 / -1'}}><label>Tên SP</label><input type="text" name="name" value={productForm.name} onChange={handleProductChange} required /></div>
                                <div className="form-group" style={{gridColumn: '1 / -1'}}><label>Hình Ảnh (Link hoặc Upload)</label><div className="image-upload-box">{productForm.imageUrl ? (<div className="image-preview"><img src={productForm.imageUrl} alt="Preview" /><button type="button" className="remove-img-btn" onClick={() => setProductForm({...productForm, imageUrl: ''})}><X size={14}/></button></div>) : (<label className="upload-btn"><UploadCloud size={24}/><span>Chọn ảnh</span><input type="file" accept="image/*" onChange={handleImageUpload} hidden /></label>)}</div></div>
                                <div className="form-group"><label>Giá Nhập</label><input type="number" name="importPrice" value={productForm.importPrice} onChange={handleProductChange} required /></div>
                                <div className="form-group"><label>Giá Bán</label><input type="number" name="price" value={productForm.price} onChange={handleProductChange} required /></div>
                                <div className="form-group"><label>Tồn Kho</label><input type="number" name="stockQuantity" value={productForm.stockQuantity} onChange={handleProductChange} required /></div>
                                <div className="form-group" style={{gridColumn: '1 / -1'}}><label>Màu sắc (Ngăn cách bằng dấu phẩy)</label><input type="text" name="colors" value={productForm.colors} onChange={handleProductChange} placeholder="Ví dụ: Trắng, Đen"/></div>
                                <div className="form-group" style={{gridColumn: '1 / -1'}}><label>Size (S, M, L...)</label><input type="text" name="sizes" value={productForm.sizes} onChange={handleProductChange}/></div>
                                <div className="form-group" style={{gridColumn: '1 / -1'}}><label>Mô tả</label><input type="text" name="description" value={productForm.description} onChange={handleProductChange}/></div>
                            </div>
                            <div className="modal-footer"><button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Hủy</button><button type="submit" className="btn-primary">Lưu</button></div>
                        </form>
                    )}
                </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;