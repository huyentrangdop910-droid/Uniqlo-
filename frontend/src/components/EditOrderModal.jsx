// frontend/src/components/EditOrderModal.jsx
import React, { useState } from 'react';
import { X, MapPin, CreditCard, Package } from 'lucide-react';
import AddressBook from './AddressBook'; 
import './EditOrderModal.css';

// SỬA: Nhận thêm prop 'onPayNow'
const EditOrderModal = ({ order, onClose, onUpdateAddress, onUpdatePayment, onPayNow }) => {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(order.paymentMethod);
  const [isSaving, setIsSaving] = useState(false);

  // State lưu địa chỉ hiển thị
  const [deliveryAddress, setDeliveryAddress] = useState({
      fullName: order.shippingName,
      phoneNumber: order.shippingPhone,
      fullAddress: order.shippingAddress
  });

  const handleAddressSelect = async (addr) => {
    setDeliveryAddress({
        fullName: addr.fullName,
        phoneNumber: addr.phoneNumber,
        fullAddress: `${addr.streetAddress}, ${addr.ward}, ${addr.district}, ${addr.city}`
    });
    setIsEditingAddress(false); 

    try {
        await onUpdateAddress(order.id, addr.id);
    } catch (error) {
        alert("Lỗi cập nhật server: " + error.message);
    }
  };

  // SỬA: Hàm xử lý lưu thay đổi
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // 1. Cập nhật phương thức thanh toán (nếu có thay đổi)
      if (paymentMethod !== order.paymentMethod) {
        await onUpdatePayment(order.id, paymentMethod);
      }

      // 2. LOGIC MỚI: Nếu chọn VNPay, chuyển hướng thanh toán NGAY LẬP TỨC
      if (paymentMethod === 'VNPAY' && order.status === 'Chờ Xác Nhận') {
         await onPayNow(order); // Gọi hàm thanh toán của cha
         return; // Dừng lại để chuyển trang
      }

      // Nếu là COD hoặc không cần thanh toán ngay
      alert("Cập nhật đơn hàng thành công!");
      onClose(); 
    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div className="edit-order-overlay">
      <div className="edit-order-content">
        
        <div className="edit-order-header">
          <h3>Chi Tiết Đơn Hàng #{order.orderCode}</h3>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="edit-order-body">
          
          {/* 1. Thông tin sản phẩm */}
          <div className="order-section">
            <h4 className="section-title"><Package size={18} /> Sản phẩm</h4>
            <div className="order-items-list-modal">
              {order.items.map((item, idx) => (
                <div key={idx} className="modal-item-row">
                  <img src={item.productImageUrl} alt="" className="modal-item-img" />
                  <div className="modal-item-info">
                    <div className="modal-item-name">{item.productName}</div>
                    <div className="modal-item-variant">Loại: {item.color}, {item.size}</div>
                    <div className="modal-item-qty">x{item.quantity}</div>
                  </div>
                  <div className="modal-item-price">{formatPrice(item.price)}</div>
                </div>
              ))}
            </div>
            <div className="modal-total-row">
              Tổng tiền: <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* 2. Địa chỉ giao hàng */}
          <div className="order-section">
            <div className="section-header-row">
              <h4 className="section-title"><MapPin size={18} /> Địa chỉ nhận hàng</h4>
              {!isEditingAddress && (
                <button className="btn-change-link" onClick={() => setIsEditingAddress(true)}>Thay đổi</button>
              )}
            </div>
            
            {isEditingAddress ? (
              <div className="address-book-wrapper">
                <p className="hint-text">Chọn địa chỉ mới từ sổ địa chỉ:</p>
                <AddressBook onSelect={handleAddressSelect} />
                <button className="btn-cancel-edit" onClick={() => setIsEditingAddress(false)}>Hủy thay đổi</button>
              </div>
            ) : (
              // SỬA: Đã xóa dòng tiêu đề đỏ thừa, chỉ hiện địa chỉ
              <div className="current-address-box">
                <p className="addr-text" style={{fontSize: '1rem', lineHeight: '1.5'}}>
                    {deliveryAddress.fullAddress || order.shippingAddress}
                </p>
              </div>
            )}
          </div>

          {/* 3. Phương thức thanh toán */}
          <div className="order-section">
             <h4 className="section-title"><CreditCard size={18} /> Phương thức thanh toán</h4>
             <div className="payment-options">
                <label className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                  <input 
                    type="radio" name="payment" value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                  />
                  Thanh toán khi nhận hàng (COD)
                </label>
                
                <label className={`payment-option ${paymentMethod === 'VNPAY' ? 'selected' : ''}`}>
                  <input 
                    type="radio" name="payment" value="VNPAY"
                    checked={paymentMethod === 'VNPAY'}
                    onChange={() => setPaymentMethod('VNPAY')}
                  />
                  Ví VNPay / Thẻ ATM
                </label>
             </div>
          </div>

        </div>

        <div className="edit-order-footer">
          <button className="btn-secondary" onClick={onClose}>Đóng</button>
          <button className="btn-primary" onClick={handleSaveChanges} disabled={isSaving}>
            {/* Đổi tên nút cho hợp ngữ cảnh nếu chọn VNPay */}
            {paymentMethod === 'VNPAY' && order.status === 'Chờ Xác Nhận' 
                ? (isSaving ? "Đang xử lý..." : "Thanh Toán Ngay") 
                : (isSaving ? "Đang lưu..." : "Lưu Thay Đổi")
            }
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditOrderModal;