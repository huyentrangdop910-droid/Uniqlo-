// frontend/src/pages/customer/TrangTimKiem.jsx
/*import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Home, User, X } from 'lucide-react';

// SỬA: Import API "thật"
import { searchProducts } from '../../services/authService'; 
// XÓA: Không cần MOCK_PRODUCTS nữa

// Import các component tái sử dụng
import Header from '../../components/Header';
import Footer from '../../components/Footer'; 
import MenuOverlay from '../../components/MenuOverlay';
import DieuHuongNoi from '../../components/DieuHuongNoi';
import ProductCard from '../../components/ProductCard'; // Import Thẻ Sản phẩm

import './TrangTimKiem.css'; 

const TrangTimKiem = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(''); // Lưu nội dung gõ
  const [results, setResults] = useState([]); // Lưu kết quả từ API
  const [loading, setLoading] = useState(false);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) setIsAuthenticated(true);
  }, []);

  // SỬA: Dùng useEffect để gọi API sau khi người dùng ngừng gõ
  useEffect(() => {
    // Nếu ô tìm kiếm trống, xóa kết quả
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    setLoading(true);

    // Dùng "debounce": Chờ 500ms sau khi ngừng gõ mới gọi API
    const delayDebounceFn = setTimeout(async () => {
      try {
        const data = await searchProducts(query);
        setResults(data); // Cập nhật kết quả từ API
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
        setResults([]); // Lỗi thì xóa kết quả
      } finally {
        setLoading(false);
      }
    }, 500); // Chờ 0.5 giây

    // Hủy timeout cũ nếu người dùng gõ tiếp
    return () => clearTimeout(delayDebounceFn);
  }, [query]); // Chỉ chạy lại khi 'query' thay đổi

  // Hàm xử lý
  const handleLogoClick = () => navigate('/');
  const handleUserClick = () => {
    if (isAuthenticated) navigate('/member');
    else navigate('/auth');
  };

  return (
    <div className="search-page-layout"> 
      
      <Header 
        variant="solid"
        onMenuEnter={() => setIsMenuOpen(true)}
        onLogoClick={handleLogoClick}
      />

      <main className="search-page-main-scrollable">
        
        {query.trim() === '' ? (
            <>
              <MenuOverlay isOpen={true} onClose={() => {}} onMenuLeave={() => {}} />
              <Footer />
            </>
        ) : (
            <div className="search-results-container">
                {loading && (
                    <p className="search-status">Đang tìm kiếm...</p>
                )}
                {!loading && (
                    <>
                        {results.length > 0 ? (
                            <div className="search-results-grid">
                                {results.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <p className="search-status">Không tìm thấy sản phẩm nào.</p>
                        )}
                    </>
                )}
            </div>
        )}
      </main>
      
      <footer className="search-page-footer-fixed">
        <div className="search-footer-bar">
          <Search size={20} className="search-footer-icon" />
          <input 
            type="text"
            placeholder="Tìm kiếm theo từ khóa"
            className="search-footer-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)} // Cập nhật state 'query'
            autoFocus
          />
        </div>
        
        <DieuHuongNoi
          onUserClick={handleUserClick} 
        />
      </footer>

      <MenuOverlay 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onMenuLeave={() => setIsMenuOpen(false)} 
      />
    </div>
  );
};

export default TrangTimKiem;*/
// frontend/src/pages/customer/TrangTimKiem.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react'; // Thêm icon Filter

// Import API
import { searchProducts } from '../../services/authService'; 

// Import các component
import Header from '../../components/Header';
import Footer from '../../components/Footer'; 
import MenuOverlay from '../../components/MenuOverlay';
import DieuHuongNoi from '../../components/DieuHuongNoi';
import ProductCard from '../../components/ProductCard';

import './TrangTimKiem.css'; 

const TrangTimKiem = () => {
  const navigate = useNavigate();
  
  // State tìm kiếm
  const [query, setQuery] = useState(''); 
  const [minPrice, setMinPrice] = useState(''); // Giá thấp nhất
  const [maxPrice, setMaxPrice] = useState(''); // Giá cao nhất

  const [results, setResults] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [showFilter, setShowFilter] = useState(false); // Bật tắt bộ lọc giá

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) setIsAuthenticated(true);
  }, []);

  // --- LOGIC GỌI API (Debounce) ---
  useEffect(() => {
    // Nếu ô tìm kiếm trống VÀ không nhập giá -> Xóa kết quả
    if (query.trim() === '' && !minPrice && !maxPrice) {
      setResults([]);
      return;
    }

    setLoading(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        // Xử lý giá trị mặc định gửi lên server
        const min = minPrice ? parseFloat(minPrice) : 0;
        const max = maxPrice ? parseFloat(maxPrice) : 2000000000; // Giá max lớn

        // Gọi API với cả tên và khoảng giá
        const data = await searchProducts(query, min, max);
        setResults(data); 
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500); // Chờ 0.5s sau khi ngừng thao tác

    return () => clearTimeout(delayDebounceFn);
  }, [query, minPrice, maxPrice]); // Chạy lại khi query HOẶC giá thay đổi

  // Hàm xử lý điều hướng
  const handleLogoClick = () => navigate('/');
  const handleUserClick = () => {
    if (isAuthenticated) navigate('/member');
    else navigate('/auth');
  };

  return (
    <div className="search-page-layout"> 
      
      <Header 
        variant="solid"
        onMenuEnter={() => setIsMenuOpen(true)}
        onLogoClick={handleLogoClick}
      />

      {/* NỘI DUNG CUỘN */}
      <main className="search-page-main-scrollable">
        
        {/* LOGIC HIỂN THỊ: Chưa tìm gì -> Hiện Menu. Đã tìm -> Hiện kết quả */}
        {(query.trim() === '' && !minPrice && !maxPrice) ? (
            <>
              <MenuOverlay isOpen={true} onClose={() => {}} onMenuLeave={() => {}} />
              <Footer />
            </>
        ) : (
            <div className="search-results-container">
                {/* Hiển thị thông tin đang lọc */}
                <div style={{padding: '10px 20px', color: '#666', fontSize: '14px'}}>
                    {loading ? 'Đang tìm kiếm...' : `Tìm thấy ${results.length} sản phẩm`}
                    {(minPrice || maxPrice) && <span> trong khoảng giá {minPrice || 0} - {maxPrice || '∞'}</span>}
                </div>

                {loading && <div className="loader" style={{margin:'20px auto'}}></div>}
                
                {!loading && (
                    <>
                        {results.length > 0 ? (
                            <div className="search-results-grid">
                                {results.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div style={{textAlign: 'center', marginTop: '50px', color: '#888'}}>
                                <p>Không tìm thấy sản phẩm nào phù hợp.</p>
                                <button 
                                    onClick={() => {setMinPrice(''); setMaxPrice(''); setQuery('')}}
                                    style={{marginTop: '10px', padding: '5px 15px', cursor: 'pointer', background:'#333', color:'white', border:'none', borderRadius:'4px'}}
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        )}
      </main>
      
      {/* FOOTER CỐ ĐỊNH (THANH TÌM KIẾM + BỘ LỌC) */}
      <footer className="search-page-footer-fixed" style={{flexDirection: 'column', height: 'auto', paddingBottom: '10px'}}>
        
        {/* 1. Bộ lọc giá (Hiện ra khi bấm nút Filter) */}
        {showFilter && (
            <div className="price-filter-bar" style={{
                display: 'flex', gap: '10px', padding: '10px 20px', 
                background: '#f9f9f9', width: '100%', justifyContent: 'center', borderBottom: '1px solid #eee'
            }}>
                <input 
                    type="number" placeholder="Giá thấp nhất" value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    style={{padding: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '120px'}}
                />
                <span style={{alignSelf:'center'}}>-</span>
                <input 
                    type="number" placeholder="Giá cao nhất" value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={{padding: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '120px'}}
                />
                <button onClick={() => {setMinPrice(''); setMaxPrice('')}} style={{border:'none', background:'none', color:'#888', cursor:'pointer'}}><X size={16}/></button>
            </div>
        )}

        {/* 2. Thanh tìm kiếm chính */}
        <div style={{display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px'}}>
            <div className="search-footer-bar" style={{flex: 1}}>
              <Search size={20} className="search-footer-icon" />
              <input 
                type="text"
                placeholder="Tìm kiếm theo tên sản phẩm..."
                className="search-footer-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)} 
                autoFocus
              />
            </div>

            {/* Nút bật/tắt bộ lọc giá */}
            <button 
                onClick={() => setShowFilter(!showFilter)}
                style={{
                    background: showFilter ? '#333' : '#f0f0f0',
                    color: showFilter ? 'white' : 'black',
                    border: 'none', borderRadius: '50%', width: '40px', height: '40px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '10px', cursor: 'pointer'
                }}
            >
                <Filter size={20} />
            </button>
        </div>
        
        {/* 3. Icon điều hướng */}
        <div style={{width: '100%'}}>
             <DieuHuongNoi onUserClick={handleUserClick} />
        </div>
      </footer>

      <MenuOverlay 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onMenuLeave={() => setIsMenuOpen(false)} 
      />
    </div>
  );
};

export default TrangTimKiem;