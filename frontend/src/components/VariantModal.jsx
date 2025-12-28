// frontend/src/components/VariantModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getProductDetails } from '../services/authService';
import './VariantModal.css'; // File CSS sẽ tạo ở bước 3

const VariantModal = ({ item, onClose, onConfirm }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [selectedSize, setSelectedSize] = useState(item.size);
  const [selectedColor, setSelectedColor] = useState(item.color);

  // 1. Khi modal mở, gọi API lấy tất cả size/màu của sản phẩm
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = await getProductDetails(item.productId);
        setProductDetails(details);
        // Tìm tên màu dựa trên mã hex
        const colorName = details.colors.find(c => c.code === item.color)?.name || item.color;
        setSelectedColor({ code: item.color, name: colorName });
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      }
    };
    fetchDetails();
  }, [item]);

  // 2. Hàm xử lý khi bấm XÁC NHẬN
  const handleSubmit = () => {
    onConfirm(item.id, {
      size: selectedSize,
      color: selectedColor.code 
    });
    onClose();
  };
  
  // 3. Hàm chọn màu
  const handleSelectColor = (color) => {
    setSelectedColor(color);
  };

  if (!productDetails) {
    return (
      <div className="variant-modal-overlay">
        <div className="variant-modal-content">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="variant-modal-overlay" onClick={onClose}>
      <div className="variant-modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="variant-modal-close-btn">
          <X size={20} />
        </button>

        {/* Thông tin sản phẩm */}
        <div className="variant-modal-header">
          <img src={item.productImageUrl} alt={item.productName} className="variant-modal-image" />
          <div className="variant-modal-price">
            {item.price}
          </div>
        </div>

        {/* Chọn Màu Sắc */}
        <div className="variant-modal-group">
          <p className="variant-modal-label">Màu sắc: <span>{selectedColor.name}</span></p>
          <div className="variant-modal-swatches">
            {productDetails.colors.map(color => (
              <button
                key={color.code}
                className={`variant-color-swatch ${selectedColor.code === color.code ? 'selected' : ''}`}
                style={{ backgroundColor: color.code }}
                onClick={() => handleSelectColor(color)}
              />
            ))}
          </div>
        </div>

        {/* Chọn Kích Cỡ */}
        <div className="variant-modal-group">
          <p className="variant-modal-label">Size: <span>{selectedSize}</span></p>
          <div className="variant-modal-sizes">
            {productDetails.sizes.map(size => (
              <button
                key={size}
                className={`variant-size-btn ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        
        {/* Nút bấm */}
        <div className="variant-modal-actions">
          <button className="variant-btn-outline" onClick={onClose}>
            TRỞ LẠI
          </button>
          <button className="variant-btn-primary" onClick={handleSubmit}>
            XÁC NHẬN
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantModal;