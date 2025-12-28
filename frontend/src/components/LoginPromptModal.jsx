import React from 'react';
import './LoginPromptModal.css'; // File CSS riêng cho modal này
import { X } from 'lucide-react';

/**
 * Đây là Modal "Yêu cầu đăng nhập" (ảnh image_4ecce4.jpg)
 * @param {boolean} isOpen - Trạng thái mở/đóng
 * @param {function} onClose - Hàm gọi khi bấm 'X'
 * @param {function} onConfirm - Hàm gọi khi bấm 'OK'
 */
const LoginPromptModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    // Lớp phủ nền mờ
    <div className="prompt-modal-overlay">
      {/* Nội dung Modal */}
      <div className="prompt-modal-content">
        {/* Nút X ở góc */}
        <button onClick={onClose} className="prompt-modal-close-btn">
          <X size={24} />
        </button>
        
        {/* Tiêu đề */}
        <h2 className="prompt-modal-title">YÊU CẦU ĐĂNG NHẬP</h2>
        
        {/* Nội dung */}
        <p className="prompt-modal-text">
          Vui lòng đến trang đăng nhập.
        </p>
        
        {/* Nút OK */}
        <button onClick={onConfirm} className="prompt-modal-confirm-btn">
          OK
        </button>
      </div>
    </div>
  );
};

export default LoginPromptModal;

