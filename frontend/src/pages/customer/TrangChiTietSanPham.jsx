
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate , Link } from 'react-router-dom';
import { Plus, Minus, ChevronDown, ChevronUp, Star } from 'lucide-react';

// Import API
import { addToCart, buyNow, getReviewsForProduct, deleteReview, getProductById } from '../../services/authService'; 
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MenuOverlay from '../../components/MenuOverlay';
import FloatingNavbar from '../../components/DieuHuongNoi';

import './TrangChiTietSanPham.css';

const AccordionItem = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="accordion-item">
      <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && <div className="accordion-content"><p>{content}</p></div>}
    </div>
  );
};

const TrangChiTietSanPham = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]); 
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState(null);

  // --- SỬA PHẦN USE EFFECT ĐỂ GỌI API AN TOÀN ---
  useEffect(() => {
    const fetchData = async () => {
        try {
            // 1. Gọi API lấy thông tin sản phẩm thật
            const productData = await getProductById(productId);
            setProduct(productData);

            // Tự động chọn màu/size đầu tiên nếu có
            if (productData.colors && productData.colors.length > 0) {
                setSelectedColor(productData.colors[0].code); 
            }
            if (productData.sizes && productData.sizes.length > 0) {
                setSelectedSize(productData.sizes[0]);
            }

            // 2. Lấy Review (SỬA ĐỂ TRÁNH LỖI MAP IS NOT A FUNCTION)
            setLoadingReviews(true);
            try {
                const reviewData = await getReviewsForProduct(productId);
                
                // --- LOGIC MỚI: XỬ LÝ CẢ MẢNG VÀ OBJECT ĐƠN ---
                if (Array.isArray(reviewData)) {
                    // Trường hợp chuẩn: Backend trả về danh sách
                    setReviews(reviewData);
                } else if (reviewData && typeof reviewData === 'object') {
                    // Trường hợp lỗi Backend: Trả về 1 object đơn -> Ép thành mảng
                    console.warn("Backend đang trả về Object thay vì Array. Đã tự động fix.");
                    setReviews([reviewData]);
                } else {
                    setReviews([]); 
                }
            } catch (err) {
                console.error("Lỗi tải review:", err);
                setReviews([]); // Lỗi thì trả về mảng rỗng
            }
        } catch (error) {
            console.error("Lỗi tải dữ liệu sản phẩm:", error);
        } finally {
            setLoadingReviews(false);
        }
    };

    fetchData();

    // Check Login
    const token = localStorage.getItem('userToken');
    if (token){ 
        setIsAuthenticated(true); 
        setLoggedInUsername(localStorage.getItem('username'));
    }
  }, [productId]);

  const handleQuantityChange = (amount) => {
    setQuantity(prev => (prev + amount < 1 ? 1 : prev + amount));
  };

  const handleLogoClick = () => navigate('/');
  const handleUserClick = () => isAuthenticated ? navigate('/member') : navigate('/auth');

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng!');
      navigate('/auth');
      return;
    }
    const cartData = {
      productId: product.id,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor 
    };
    try {
      await addToCart(cartData);
      alert("Thêm vào giỏ hàng thành công");
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để mua hàng!');
      navigate('/auth');
      return;
    }
    const cartData = {
      productId: product.id,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor 
    };
    try {
      const responseData = await buyNow(cartData);
      let newItem = responseData;
      if (typeof responseData === 'string') {
          try { newItem = JSON.parse(responseData); } catch (e) {}
      }
      if (newItem && newItem.id) {
          navigate('/checkout', { state: { selectedItems: [newItem.id] } });
      } else {
          navigate('/cart');
      }
    } catch (error) {
      console.error("Lỗi khi mua ngay:", error);
      navigate('/cart');
    }
  };


  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Xóa đánh giá này?")) return;
    try {
      await deleteReview(reviewId);
      alert("Đã xóa đánh giá");
      
      // Tải lại review sau khi xoá
      const reviewData = await getReviewsForProduct(productId);
      
      // Kiểm tra an toàn y hệt useEffect
      if (Array.isArray(reviewData)) {
          setReviews(reviewData);
      } else {
          setReviews([]);
      }
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  // --- HIỂN THỊ LOADING NẾU CHƯA TẢI XONG PRODUCT ---
  if (!product) {
    return <div style={{textAlign:'center', marginTop:'50px'}}>Đang tải sản phẩm...</div>;
  }
  
  return (
    <div className="pdp-page">
      <Header variant="solid" onMenuEnter={() => setIsMenuOpen(true)} onLogoClick={handleLogoClick}/>
      
      <main className="pdp-main-content">
        <div className="pdp-layout">
          {/* CỘT TRÁI */}
          <div className="pdp-col-left">
            <div className="pdp-image-collage">
               {product.imageUrls && product.imageUrls.map((url, index) => (
                  <img key={index} src={url} alt={product.name} className="pdp-image-item" />
               ))}
            </div>
            
            <div className="pdp-info-section">
              <h2 className="pdp-section-title">Mô tả</h2>
              <p>{product.description}</p>
              <AccordionItem title="Chi tiết" content={product.details || "Đang cập nhật"} />
            </div>

            <div className="pdp-info-section">
              <h2 className="pdp-section-title">Đánh giá</h2>
              <div className="pdp-rating-summary">
                 <Star size={16} /> {product.rating ? product.rating.stars : 0} ({product.rating ? product.rating.count : 0} đánh giá)
              </div>
              <Link to={`/write-review/${product.id}`} className="pdp-btn-outline" style={{textDecoration: 'none'}}>Viết đánh giá</Link>
              
              <div className="review-list">
                {loadingReviews ? <p>Đang tải...</p> : (
                  reviews.length > 0 ? reviews.map(review => (
                    <div key={review.id} className="review-item">
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (<Star key={i} size={14} fill={i < review.rating ? "#facc15" : "#e5e5e5"} stroke="none" />))}
                      </div>
                      <h3 className="review-title">{review.title}</h3>
                      <p className="review-comment">{review.comment}</p>
                      <div className="review-meta-row">
                        <p className="review-meta">{review.user.username} - {new Date(review.createdAt).toLocaleDateString()}</p>
                        {loggedInUsername === review.user.username && (
                          <div className="review-actions">
                            <button className="review-edit-btn" onClick={() => navigate(`/write-review/${product.id}?edit=${review.id}`)}>Sửa</button>
                            <span className="review-action-divider">|</span>
                            <button className="review-delete-btn" onClick={() => handleDeleteReview(review.id)}>Xóa</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )) : <p>Chưa có đánh giá nào.</p>
                )}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI */}
          <div className="pdp-col-right">
            <div className="pdp-sticky-box">
              <h1 className="pdp-title">{product.name}</h1>
              <p className="pdp-price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
              <hr className="pdp-divider" />

              <div className="pdp-option-group">
                <p className="pdp-option-label">MÀU SẮC: <span>{product.colors && product.colors.find(c => c.code === selectedColor)?.name}</span></p>
                <div className="pdp-color-swatches">
                  {product.colors && product.colors.map(color => (
                    <button key={color.code} className={`pdp-color-swatch ${selectedColor === color.code ? 'selected' : ''}`}
                      style={{ backgroundColor: color.code }} onClick={() => setSelectedColor(color.code)}/>
                  ))}
                </div>
              </div>

              <div className="pdp-option-group">
                <p className="pdp-option-label">KÍCH CỠ: <span>{selectedSize}</span></p>
                <div className="pdp-size-buttons">
                  {product.sizes && product.sizes.map(size => (
                    <button key={size} className={`pdp-size-btn ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}>{size}</button>
                  ))}
                </div>
              </div>

              <div className="pdp-option-group">
                <p className="pdp-option-label">SỐ LƯỢNG (Còn: {product.stockQuantity})</p>
                <div className="pdp-quantity-selector">
                  <button onClick={() => handleQuantityChange(-1)}><Minus size={16}/></button>
                  <span>{quantity}</span>
                  <button onClick={() => handleQuantityChange(1)}><Plus size={16}/></button>
                </div>
              </div>

              <div className="pdp-actions">
                <button className="pdp-btn-primary" onClick={handleAddToCart}>THÊM VÀO GIỎ HÀNG</button>
                <button className="pdp-btn-outline" onClick={handleBuyNow}>MUA NGAY</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FloatingNavbar onHomeClick={handleLogoClick} onUserClick={handleUserClick} />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onMenuLeave={() => setIsMenuOpen(false)} />
      <Footer />
    </div>
  );
};

export default TrangChiTietSanPham;