// frontend/src/pages/customer/PaymentResultPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Home } from 'lucide-react';

import { placeOrder, updateOrderStatus } from '../../services/authService';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './PaymentResultPage.css';

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); 
  
  // Chặn gọi API 2 lần (React Strict Mode)
  const hasCalledAPI = useRef(false);

  useEffect(() => {
    const checkPayment = async () => {
      const responseCode = searchParams.get('vnp_ResponseCode');

      // Nếu thanh toán thành công (Mã 00)
      if (responseCode === '00') {
        
        if (hasCalledAPI.current) return; 
        hasCalledAPI.current = true;

        try {
          // Kiểm tra: Đây là thanh toán ĐƠN CŨ hay ĐƠN MỚI?
          const existingOrderId = localStorage.getItem('payingExistingOrderId');

          if (existingOrderId) {
              // === TRƯỜNG HỢP 1: THANH TOÁN LẠI ĐƠN CŨ ===
              // Cập nhật trạng thái đơn hàng
              await updateOrderStatus(existingOrderId, "Đã Thanh Toán");
              
              // Dọn dẹp
              localStorage.removeItem('payingExistingOrderId');

          } else {
              // === TRƯỜNG HỢP 2: TẠO ĐƠN MỚI TỪ GIỎ HÀNG ===
              
              // 1. Lấy dữ liệu từ localStorage
              const storedItems = localStorage.getItem('pendingCheckoutItems');
              const storedAddressId = localStorage.getItem('pendingAddressId');

              // 2. Parse dữ liệu (chuyển từ chuỗi sang mảng/số)
              const selectedIds = storedItems ? JSON.parse(storedItems) : [];
              const addressId = storedAddressId ? parseInt(storedAddressId) : null;

              // 3. Gọi API tạo đơn (nếu có sản phẩm)
              if (selectedIds.length > 0) {
                 await placeOrder('VNPAY', selectedIds, addressId);
              }
              
              // 4. Dọn dẹp
              localStorage.removeItem('pendingCheckoutItems');
              localStorage.removeItem('pendingAddressId');
          }

          setStatus('success');
        } catch (error) {
          console.error("Lỗi xử lý thanh toán:", error);
          setStatus('error_save');
        }
      } else {
        // --- THANH TOÁN THẤT BẠI ---
        // Xóa các biến tạm để tránh lỗi lần sau
        localStorage.removeItem('payingExistingOrderId');
        localStorage.removeItem('pendingCheckoutItems');
        localStorage.removeItem('pendingAddressId');
        
        setStatus('error');
      }
    };

    checkPayment();
  }, [searchParams]);

  return (
    <div className="payment-result-page">
      <Header variant="solid" onMenuEnter={() => {}} onLogoClick={() => navigate('/')} />
      
      <main className="payment-result-main">
        <div className="result-card">
          {status === 'loading' && (
            <p>Đang xử lý kết quả thanh toán...</p>
          )}

          {status === 'success' && (
            <div className="result-content success">
              <CheckCircle size={64} color="#198754" />
              <h1>Thanh Toán Thành Công!</h1>
              <p>Cảm ơn bạn đã mua hàng tại UNIQLO.</p>
              <p>Đơn hàng của bạn đã được ghi nhận.</p>
              <button className="result-btn" onClick={() => navigate('/member?tab=orders')}>
                Xem Đơn Hàng Của Tôi
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="result-content error">
              <XCircle size={64} color="#d90429" />
              <h1>Thanh Toán Thất Bại</h1>
              <p>Giao dịch bị hủy hoặc có lỗi xảy ra.</p>
              <button className="result-btn" onClick={() => navigate('/cart')}>
                Quay lại Giỏ Hàng
              </button>
            </div>
          )}

          {status === 'error_save' && (
            <div className="result-content error">
              <XCircle size={64} color="#d90429" />
              <h1>Lỗi Lưu Đơn Hàng</h1>
              <p>Thanh toán thành công nhưng hệ thống gặp lỗi khi lưu đơn hàng.</p>
              <p>Vui lòng liên hệ CSKH.</p>
              <button className="result-btn" onClick={() => navigate('/member?tab=orders')}>
                Kiểm tra Đơn Hàng
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentResultPage;