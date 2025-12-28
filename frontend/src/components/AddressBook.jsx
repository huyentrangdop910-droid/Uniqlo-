import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { getMyAddresses, addAddress, updateAddress, deleteAddress } from '../services/authService';
import './AddressBook.css';

const AddressBook = ({ onSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' hoặc 'form'
  const [editingId, setEditingId] = useState(null);

  // State cho Form
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    city: '',
    district: '',
    ward: '',
    streetAddress: '',
    isDefault: false
  });

  // Tải danh sách địa chỉ
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await getMyAddresses();
      setAddresses(data);
    } catch (error) {
      console.error("Lỗi tải địa chỉ:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý mở form thêm mới
  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      fullName: '', phoneNumber: '', city: '', district: '', ward: '', streetAddress: '', isDefault: false
    });
    setView('form');
  };

  // Xử lý mở form sửa
  const handleEdit = (addr) => {
    setEditingId(addr.id);
    setFormData({
      fullName: addr.fullName,
      phoneNumber: addr.phoneNumber,
      city: addr.city,
      district: addr.district,
      ward: addr.ward,
      streetAddress: addr.streetAddress,
      isDefault: addr.isDefault
    });
    setView('form');
  };

  // Xử lý xóa
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
      try {
        await deleteAddress(id);
        loadAddresses();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateAddress(editingId, formData);
      } else {
        await addAddress(formData);
      }
      setView('list');
      loadAddresses();
    } catch (error) {
      alert(error.message);
    }
  };

  

  // --- GIAO DIỆN DANH SÁCH ---
  if (view === 'list') {
    if (loading) return <p>Đang tải...</p>;
    
    return (
      <div className="address-book">
        <div className="address-header-row">
          <h3>Địa chỉ của tôi</h3>
          <button className="btn-add-new" onClick={handleAddNew}>
            <Plus size={16} /> Thêm địa chỉ mới
          </button>
        </div>

        <div className="address-list-container">
          {addresses.length === 0 ? (
            <p className="empty-text">Bạn chưa có địa chỉ nào.</p>
          ) : (
            addresses.map(addr => (
              <div key={addr.id} className={`address-card ${addr.isDefault ? 'default-bg' : ''}`}>
                
               
                <div className="address-info" onClick={() => onSelect && onSelect(addr)} style={{cursor: onSelect ? 'pointer' : 'default'}}>
                  <div className="info-row">
                    <span className="info-name">{addr.fullName}</span>
                    <span className="info-divider">|</span>
                    <span className="info-phone">{addr.phoneNumber}</span>
                  </div>
                  <p className="info-detail">{addr.streetAddress}</p>
                  <p className="info-sub">{addr.ward}, {addr.district}, {addr.city}</p>
                  {addr.isDefault && <span className="badge-default">Mặc định</span>}
                </div>
                
                <div className="address-actions">
                  <button className="btn-action" onClick={(e) => { e.stopPropagation(); handleEdit(addr); }}>Cập nhật</button>
                  {!addr.isDefault && (
                    <button className="btn-action delete" onClick={(e) => { e.stopPropagation(); handleDelete(addr.id); }}>Xóa</button>
                  )}
                  
                  {/* SỬA: Nút "Chọn" dành riêng cho Checkout */}
                  {onSelect && (
                    <button 
                        className="btn-submit" 
                        style={{padding: '0.4rem 1rem', fontSize: '0.8rem', marginTop: '0.5rem'}}
                        onClick={() => onSelect(addr)}
                    >
                        Chọn
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
  // --- GIAO DIỆN FORM (THÊM/SỬA) ---
  return (
    <div className="address-form-container">
      <h3>{editingId ? 'Cập nhật địa chỉ' : 'Địa chỉ mới'}</h3>
      <form onSubmit={handleSubmit} className="address-form">
        <div className="form-row">
          <input 
            type="text" placeholder="Họ và tên" required 
            value={formData.fullName}
            onChange={e => setFormData({...formData, fullName: e.target.value})}
          />
          <input 
            type="text" placeholder="Số điện thoại" required 
            value={formData.phoneNumber}
            onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
          />
        </div>
        
        <div className="form-row">
          <input 
            type="text" placeholder="Tỉnh/Thành phố" required 
            value={formData.city}
            onChange={e => setFormData({...formData, city: e.target.value})}
          />
          <input 
            type="text" placeholder="Quận/Huyện" required 
            value={formData.district}
            onChange={e => setFormData({...formData, district: e.target.value})}
          />
          <input 
            type="text" placeholder="Phường/Xã" required 
            value={formData.ward}
            onChange={e => setFormData({...formData, ward: e.target.value})}
          />
        </div>

        <input 
          type="text" placeholder="Địa chỉ cụ thể (Số nhà, tên đường...)" required 
          className="input-full"
          value={formData.streetAddress}
          onChange={e => setFormData({...formData, streetAddress: e.target.value})}
        />

        <div className="form-checkbox">
          <input 
            type="checkbox" id="default-check"
            checked={formData.isDefault}
            onChange={e => setFormData({...formData, isDefault: e.target.checked})}
          />
          <label htmlFor="default-check">Đặt làm địa chỉ mặc định</label>
        </div>

        <div className="form-buttons">
          <button type="button" className="btn-back" onClick={() => setView('list')}>Trở lại</button>
          <button type="submit" className="btn-submit">Hoàn thành</button>
        </div>
      </form>
    </div>
  );
};

export default AddressBook;