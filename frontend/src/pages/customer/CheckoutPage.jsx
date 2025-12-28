// frontend/src/pages/customer/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { getCart } from '../../services/authService'; // API lấy giỏ hàng
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './CheckoutPage.css';
import {  placeOrder } from '../../services/authService'; // Thêm placeOrder
import { getMyAddresses } from '../../services/authService'; // API lấy địa chỉ
import AddressBook from '../../components/AddressBook'; // Component sổ địa chỉ
import { X } from 'lucide-react'; // Icon đóng modal

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedIds = location.state?.selectedItems || [];

  const [cart, setCart] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(true);
  
  // THÊM MỚI: State cho địa chỉ
  const [addressList, setAddressList] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false); // Modal chọn địa chỉ

  // Tải dữ liệu (Giỏ hàng + Địa chỉ)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Lấy giỏ hàng
        const cartData = await getCart();
        if (selectedIds.length > 0) {
          cartData.items = cartData.items.filter(item => selectedIds.includes(item.id));
        }
        setCart(cartData);

        // 2. Lấy danh sách địa chỉ
        const addresses = await getMyAddresses();
        setAddressList(addresses);
        
        // Chọn địa chỉ mặc định (hoặc địa chỉ đầu tiên)
        const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
        setDeliveryAddress(defaultAddr);

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Hàm xử lý khi chọn địa chỉ từ Modal
  const handleSelectAddress = (addr) => {
    setDeliveryAddress(addr);
    setShowAddressModal(false); // Đóng modal
  };
  // Hàm tính tổng tiền
  const calculateTotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const totalAmount = calculateTotal();
  const shippingFee = 16500; // Phí ship giả định
  const finalTotal = totalAmount + shippingFee;

  // HÀM XỬ LÝ THANH TOÁN (Quan trọng)
  const handlePlaceOrder = async () => {
    if (selectedIds.length === 0) {
        alert("Lỗi: Không tìm thấy sản phẩm để thanh toán.");
        return;
    }

    // KIỂM TRA ĐỊA CHỈ
    if (!deliveryAddress) {
        alert("Vui lòng chọn địa chỉ nhận hàng!");
        return;
    }

    if (paymentMethod === 'COD') {
      try {
        // Gọi API tạo đơn hàng (Gửi kèm ID địa chỉ)
        await placeOrder('COD', selectedIds, deliveryAddress.id);
        
        alert("Đặt hàng thành công! Đơn hàng đã được lưu vào lịch sử.");
        navigate('/member?tab=orders');
        
      } catch (error) {
        console.error(error);
        alert("Lỗi đặt hàng: " + error.message);
      }

    } else if (paymentMethod === 'VNPAY') {
      try {
        // Lưu thông tin tạm vào localStorage (bao gồm cả addressId)
        localStorage.setItem('pendingCheckoutItems', JSON.stringify(selectedIds));
        localStorage.setItem('pendingAddressId', deliveryAddress.id); // <-- Lưu ID địa chỉ

        const response = await fetch(`http://localhost:8080/api/v1/payment/create_payment?amount=${Math.round(finalTotal)}`);
        const data = await response.json();
        
        if (data.paymentUrl) {
            window.location.href = data.paymentUrl; 
        } else {
            alert("Lỗi: Không nhận được link thanh toán");
        }
      } catch (error) {
        alert("Lỗi tạo thanh toán VNPay: " + error.message);
      }
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="checkout-page">
      <Header variant="solid" onMenuEnter={() => {}} onLogoClick={() => navigate('/')} />

      <div className="checkout-container">
        <div className="checkout-title">Thanh Toán</div>

        {/* 1. Địa chỉ nhận hàng (DỮ LIỆU THẬT) */}
        <div className="checkout-section">
          <div className="address-header">
            <MapPin size={20} /> Địa Chỉ Nhận Hàng
          </div>
          
          {deliveryAddress ? (
            <div className="address-content">
              <span className="address-name">{deliveryAddress.fullName}</span>
              <span className="address-phone">{deliveryAddress.phoneNumber}</span>
              <span className="address-detail">
                {deliveryAddress.streetAddress}, {deliveryAddress.ward}, {deliveryAddress.district}, {deliveryAddress.city}
              </span>
              {deliveryAddress.isDefault && <span className="badge-default-mini">Mặc định</span>}
              <span className="address-change-btn" onClick={() => setShowAddressModal(true)}>Thay Đổi</span>
            </div>
          ) : (
            <div className="address-content">
              <span className="address-detail">Bạn chưa có địa chỉ nhận hàng.</span>
              <button className="address-change-btn" onClick={() => setShowAddressModal(true)}>+ Thêm Địa Chỉ</button>
            </div>
          )}
        </div>

        {/* 2. Danh sách sản phẩm */}
        <div className="checkout-section">
          <table className="checkout-product-list">
            <thead className="checkout-product-header">
              <tr>
                <th style={{width: '50%'}}>Sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th style={{textAlign: 'right'}}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {cart && cart.items.map(item => (
                <tr key={item.id} className="checkout-product-row">
                  <td>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <img src={item.productImageUrl} alt="" className="checkout-product-img" />
                      <div className="checkout-product-name">
                        {item.productName}
                        <span className="checkout-product-variant">Loại: {item.color}, {item.size}</span>
                      </div>
                    </div>
                  </td>
                  <td>{item.price.toLocaleString()} ₫</td>
                  <td>{item.quantity}</td>
                  <td style={{textAlign: 'right'}}>{(item.price * item.quantity).toLocaleString()} ₫</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Phương thức thanh toán */}
        <div className="checkout-section">
          <div className="address-header" style={{color: '#333'}}>Phương thức thanh toán</div>
          <div className="payment-methods">
            <button 
              className={`payment-method-btn ${paymentMethod === 'COD' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('COD')}
            >
              Thanh toán khi nhận hàng
            </button>
            <button 
              className={`payment-method-btn ${paymentMethod === 'VNPAY' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('VNPAY')}
            >
              Ví VNPay / Thẻ ATM
            </button>
          </div>
        </div>

        {/* 4. Tổng kết & Đặt hàng */}
        <div className="checkout-section checkout-summary">
          <div className="checkout-row">
            <span>Tổng tiền hàng</span>
            <span>{totalAmount.toLocaleString()} ₫</span>
          </div>
          <div className="checkout-row">
            <span>Phí vận chuyển</span>
            <span>{shippingFee.toLocaleString()} ₫</span>
          </div>
          <div className="checkout-row total">
            <span>Tổng thanh toán</span>
            <span className="checkout-total-price">{finalTotal.toLocaleString()} ₫</span>
          </div>
          
          <button className="checkout-btn" onClick={handlePlaceOrder}>
            Đặt hàng
          </button>
        </div>
      </div>

      <Footer />
      {/* MODAL CHỌN ĐỊA CHỈ (GIỐNG SHOPEE) */}
      {showAddressModal && (
        <div className="modal-overlay-fixed">
          <div className="modal-content-address">
            <div className="modal-header">
              <h3>Địa Chỉ Của Tôi</h3>
              <button onClick={() => setShowAddressModal(false)}><X /></button>
            </div>
            <div className="modal-body">
              {/* Tái sử dụng AddressBook với tính năng onSelect */}
              <AddressBook onSelect={handleSelectAddress} />
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowAddressModal(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;