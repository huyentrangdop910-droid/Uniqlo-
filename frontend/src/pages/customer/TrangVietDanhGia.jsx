// frontend/src/pages/customer/TrangVietDanhGia.jsx
/*import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star } from 'lucide-react';
// Import các API cần thiết
import { createReview, updateReview, getReviewsForProduct } from '../../services/authService';
import { MOCK_PRODUCTS } from '../../duLieu.js'; 

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import DieuHuongNoi from '../../components/DieuHuongNoi';

import './TrangVietDanhGia.css'; 

// Component chọn sao
const StarRatingInput = ({ rating, setRating }) => {
  return (
    <div className="star-rating-input">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={ratingValue}
            className={`star-btn ${ratingValue <= rating ? 'active' : ''}`}
            onClick={() => setRating(ratingValue)}
          >
            <Star size={24} fill="currentColor" stroke="none" />
          </button>
        );
      })}
    </div>
  );
};

// Component chính
const TrangVietDanhGia = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy ID bài đánh giá cần sửa (nếu có) từ URL (?edit=123)
  const queryParams = new URLSearchParams(location.search);
  const editReviewId = queryParams.get('edit'); 
  
  // State cho form
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  
  // State cho UI
  const [product, setProduct] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  useEffect(() => {
    // 1. Tìm thông tin sản phẩm (để hiển thị ảnh)
    const foundProduct = MOCK_PRODUCTS.find(p => p.id === parseInt(productId));
    if (foundProduct) {
      setProduct(foundProduct);
    }

    // 2. Kiểm tra đăng nhập
    const token = localStorage.getItem('userToken');
    if (!token) {
      alert("Vui lòng đăng nhập để viết đánh giá.");
      navigate('/auth');
    } else {
      setIsAuthenticated(true);
    }

    // 3. (MỚI) NẾU LÀ CHẾ ĐỘ SỬA: Tải nội dung review cũ lên form
    if (editReviewId) {
      const fetchOldReview = async () => {
        try {
          // Lấy tất cả review của sản phẩm này từ server
          const reviews = await getReviewsForProduct(productId);
          
          // Tìm bài review cần sửa trong danh sách đó
          const reviewToEdit = reviews.find(r => r.id === parseInt(editReviewId));
          
          if (reviewToEdit) {
            // Điền dữ liệu cũ vào form
            setRating(reviewToEdit.rating);
            setTitle(reviewToEdit.title);
            setComment(reviewToEdit.comment);
          }
        } catch (error) {
          console.error("Lỗi tải review cũ:", error);
        }
      };
      fetchOldReview();
    }
  }, [productId, navigate, editReviewId]);

  // Hàm xử lý khi bấm GỬI / CẬP NHẬT
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dữ liệu
    if (rating === 0) {
      alert("Vui lòng chọn số sao đánh giá.");
      return;
    }
    if (comment.length < 2) {
      alert("Bình luận phải có ít nhất 2 ký tự.");
      return;
    }

    const reviewData = {
      productId: parseInt(productId),
      rating: rating,
      title: title,
      comment: comment
    };

    try {
      if (editReviewId) {
        // --- TRƯỜNG HỢP SỬA ---
        await updateReview(editReviewId, reviewData);
        alert("Cập nhật đánh giá thành công!");
      } else {
        // --- TRƯỜNG HỢP TẠO MỚI ---
        await createReview(reviewData);
        alert("Gửi đánh giá thành công!");
      }
      // Quay về trang chi tiết
      navigate(`/product/${productId}`); 
    } catch (error) {
      console.error("Lỗi:", error);
      alert(`Lỗi: ${error.message}`);
    }
  };

  // Hàm xử lý cho UI
  const handleLogoClick = () => navigate('/');
  const handleUserClick = () => {
    if (isAuthenticated) navigate('/member');
    else navigate('/auth');
  };

  if (!product) return <div>Đang tải...</div>;

  return (
    <div className="review-page">
      <Header 
        variant="solid"
        onMenuEnter={() => {}} 
        onLogoClick={handleLogoClick}
      />

      <main className="review-page-main">
        
        <h1 className="review-form-title">
          {editReviewId ? "Sửa Đánh Giá" : "Viết Bài Đánh Giá"}
        </h1>
        
        <div className="review-form-layout">
        
          <form onSubmit={handleSubmit} className="review-form-left">
           
            <div className="review-form-group">
              <label className="review-form-label">ĐÁNH GIÁ*</label>
              <StarRatingInput rating={rating} setRating={setRating} />
            </div>

            
            <div className="review-form-group">
              <label htmlFor="review-title" className="review-form-label">TIÊU ĐỀ*</label>
              <input 
                id="review-title"
                className="review-form-input" 
                type="text" 
                placeholder="Tóm tắt đánh giá của bạn"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <p className="review-form-hint">Tiêu đề của bạn phải ít hơn 100 ký tự.</p>
            </div>

           
            <div className="review-form-group">
              <label htmlFor="review-comment" className="review-form-label">BÌNH LUẬN*</label>
              <textarea 
                id="review-comment"
                className="review-form-textarea"
                placeholder="Bạn vui lòng viết ít nhất 2 ký tự tại đây."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="review-submit-btn">
              {editReviewId ? "CẬP NHẬT" : "GỬI"}
            </button>
          </form>

        
          <div className="review-form-right">
           
            <img 
              src={product.imageUrls[0]} 
              alt={product.name} 
              className="review-product-image" 
            />
          </div>
        </div>
      </main>
      
      <DieuHuongNoi
        onUserClick={handleUserClick} 
      />
      <Footer />
    </div>
  );
};

export default TrangVietDanhGia;*/
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star } from 'lucide-react';

// SỬA: Import getProductById thay vì MOCK_PRODUCTS
import { 
  createReview, 
  updateReview, 
  getReviewsForProduct, 
  getProductById 
} from '../../services/authService';

// --- XOÁ DÒNG NÀY ---
// import { MOCK_PRODUCTS } from '../../duLieu.js'; 

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import DieuHuongNoi from '../../components/DieuHuongNoi';

import './TrangVietDanhGia.css'; 

// Component chọn sao (Giữ nguyên)
const StarRatingInput = ({ rating, setRating }) => {
  return (
    <div className="star-rating-input">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={ratingValue}
            className={`star-btn ${ratingValue <= rating ? 'active' : ''}`}
            onClick={() => setRating(ratingValue)}
          >
            <Star size={24} fill="currentColor" stroke="none" />
          </button>
        );
      })}
    </div>
  );
};

// Component chính
const TrangVietDanhGia = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const editReviewId = queryParams.get('edit'); 
  
  // State
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  
  const [product, setProduct] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  useEffect(() => {
    // 1. Kiểm tra đăng nhập
    const token = localStorage.getItem('userToken');
    if (!token) {
      alert("Vui lòng đăng nhập để viết đánh giá.");
      navigate('/auth');
      return;
    } else {
      setIsAuthenticated(true);
    }

    // 2. Tải dữ liệu thật từ API (Sản phẩm & Review cũ nếu có)
    const loadData = async () => {
        try {
            // A. Tải thông tin sản phẩm thật
            const productData = await getProductById(productId);
            setProduct(productData);

            // B. Nếu đang ở chế độ Sửa (Edit), tải nội dung review cũ
            if (editReviewId) {
                const reviews = await getReviewsForProduct(productId);
                const reviewToEdit = reviews.find(r => r.id === parseInt(editReviewId));
                
                if (reviewToEdit) {
                    setRating(reviewToEdit.rating);
                    setTitle(reviewToEdit.title);
                    setComment(reviewToEdit.comment);
                }
            }
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
            // alert("Không thể tải thông tin sản phẩm");
        }
    };

    loadData();

  }, [productId, navigate, editReviewId]);

  // Hàm xử lý Submit (Giữ nguyên logic)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert("Vui lòng chọn số sao đánh giá.");
      return;
    }
    if (comment.length < 2) {
      alert("Bình luận phải có ít nhất 2 ký tự.");
      return;
    }

    const reviewData = {
      productId: parseInt(productId),
      rating: rating,
      title: title,
      comment: comment
    };

    try {
      if (editReviewId) {
        await updateReview(editReviewId, reviewData);
        alert("Cập nhật đánh giá thành công!");
      } else {
        await createReview(reviewData);
        alert("Gửi đánh giá thành công!");
      }
      navigate(`/product/${productId}`); 
    } catch (error) {
      console.error("Lỗi:", error);
      alert(`Lỗi: ${error.message}`);
    }
  };

  const handleLogoClick = () => navigate('/');
  const handleUserClick = () => {
    if (isAuthenticated) navigate('/member');
    else navigate('/auth');
  };

  if (!product) return <div style={{textAlign:'center', marginTop:'50px'}}>Đang tải thông tin...</div>;

  return (
    <div className="review-page">
      <Header variant="solid" onMenuEnter={() => {}} onLogoClick={handleLogoClick} />

      <main className="review-page-main">
        <h1 className="review-form-title">
          {editReviewId ? "Sửa Đánh Giá" : "Viết Bài Đánh Giá"}
        </h1>
        
        <div className="review-form-layout">
          {/* Cột 1: Form */}
          <form onSubmit={handleSubmit} className="review-form-left">
            <div className="review-form-group">
              <label className="review-form-label">ĐÁNH GIÁ*</label>
              <StarRatingInput rating={rating} setRating={setRating} />
            </div>

            <div className="review-form-group">
              <label htmlFor="review-title" className="review-form-label">TIÊU ĐỀ*</label>
              <input 
                id="review-title"
                className="review-form-input" 
                type="text" 
                placeholder="Tóm tắt đánh giá của bạn"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <p className="review-form-hint">Tiêu đề của bạn phải ít hơn 100 ký tự.</p>
            </div>

            <div className="review-form-group">
              <label htmlFor="review-comment" className="review-form-label">BÌNH LUẬN*</label>
              <textarea 
                id="review-comment"
                className="review-form-textarea"
                placeholder="Bạn vui lòng viết ít nhất 2 ký tự tại đây."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="review-submit-btn">
              {editReviewId ? "CẬP NHẬT" : "GỬI"}
            </button>
          </form>

          {/* Cột 2: Ảnh sản phẩm (Lấy từ dữ liệu thật) */}
          <div className="review-form-right">
            <img 
              src={product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : 'https://placehold.co/400'} 
              alt={product.name} 
              className="review-product-image" 
            />
             {/* Hiển thị thêm tên sản phẩm cho rõ */}
             <p style={{marginTop:'10px', fontWeight:'bold', textAlign:'center'}}>{product.name}</p>
          </div>
        </div>
      </main>
      
      <DieuHuongNoi onUserClick={handleUserClick} />
      <Footer />
    </div>
  );
};

export default TrangVietDanhGia;