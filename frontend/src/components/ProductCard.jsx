// frontend/src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import './ProductCard.css'; // File CSS mới ta vừa tạo

// DÁN CODE COMPONENT ProductCard CỦA BẠN VÀO ĐÂY
const ProductCard = ({ product }) => (
  <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-link">
        {/* SỬA: Đọc từ product.imageUrl */}
        <img src={product.imageUrls[0]} alt={product.name} className="product-image" />
      </Link>
      <div className="product-details">
        <div className="product-colors">
          {product.colors.map((color) => (
            <span
              key={color.code}
              className="product-color-swatch"
              style={{ backgroundColor: color.code }}
            ></span>
          ))}
        </div>
        
        {/* THÊM: Hiển thị Kích cỡ (nếu có) */}
        {product.sizes && product.sizes.length > 0 &&(
          <div className="product-sizes">{product.sizes[0]} - {product.sizes[product.sizes.length - 1]}</div>
        )}
  
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price}</p>
        
        {/* THÊM: Hiển thị Đánh giá (nếu có) */}
        {product.rating && (
          <div className="product-rating">
            <Star size={14} fill="#facc15" stroke="none" />
            <Star size={14} fill="#facc15" stroke="none" />
            <Star size={14} fill="#facc15" stroke="none" />
            <Star size={14} fill="#facc15" stroke="none" />
            <Star size={14} fill={product.rating.stars >= 4.5 ? "#facc15" : "#e5e5e5"} stroke="none" />
            <span className="rating-count">({product.rating.count})</span>
          </div>
        )}
      </div>
    </div>
  // ... (code thẻ sản phẩm của bạn) ...
);

export default ProductCard;