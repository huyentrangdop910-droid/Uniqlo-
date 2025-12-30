// frontend/src/pages/customer/TrangGioHang.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Minus ,ChevronDown} from 'lucide-react';
import { getCart, deleteCartItem, updateCartItemQuantity ,updateCartItemVariant} from '../../services/authService'; 
import VariantModal from '../../components/VariantModal'; // <-- THÊM DÒNG NÀY

// Import các component tái sử dụng
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import DieuHuongNoi from '../../components/DieuHuongNoi';

import './TrangGioHang.css'; 

// --- HÀM TRỢ GIÚP (HELPER) ---
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

// ===== Component Hàng sản phẩm (NÂNG CẤP) =====

const CartItemRow = ({ item, onUpdate, onDelete, onToggle, isSelected , onEdit}) => {
  
  const lineTotal = item.price * item.quantity;

  const handleUpdate = (change) => {
    onUpdate(item.id, change); 
  };
  const handleDelete = () => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      onDelete(item.id); 
    }
  };

  return (
    <tr className="cart-item-row">
      {/* THÊM MỚI: Cột Ô Tích */}
      <td>
        <input 
          type="checkbox" 
          className="cart-item-checkbox"
          checked={isSelected}
          onChange={() => onToggle(item.id)} // Gọi hàm cha khi bấm
        />
      </td>
      
      {/* Cột Sản phẩm */}
      <td>
        <div className="cart-item-info">
          <img src={item.productImageUrl} alt={item.productName} className="cart-item-image" />
          <div className="cart-item-details">
            <Link to={`/product/${item.productId}`} className="cart-item-name">
              {item.productName}
            </Link>
            <button className="cart-item-variant-button" onClick={() => onEdit(item)}>
              Màu: {item.color} / Kích cỡ: {item.size}
              <ChevronDown size={14} style={{ marginLeft: '4px' }} />
            </button>
          </div>
        </div>
      </td>
      {/* Cột Đơn giá */}
      <td>
        <span className="cart-item-price">{formatPrice(item.price)}</span>
      </td>
      {/* Cột Số lượng */}
      <td>
        <div className="cart-quantity-selector">
          <button onClick={() => handleUpdate(-1)}><Minus size={14}/></button>
          <span>{item.quantity}</span>
          <button onClick={() => handleUpdate(1)}><Plus size={14}/></button>
        </div>
      </td>
      {/* Cột Thành Tiền */}
      <td>
        <span className="cart-item-total">{formatPrice(lineTotal)}</span>
      </td>
      {/* Cột Thao tác */}
      <td>
        <span className="cart-item-delete" onClick={handleDelete}>Xóa</span>
      </td>
    </tr>
  );
};


// ===== Component Trang Giỏ Hàng chính (NÂNG CẤP) =====
const TrangGioHang = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // THÊM MỚI: State để theo dõi các sản phẩm được chọn
  const [selectedItems, setSelectedItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null); // (null = đóng)

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      setIsAuthenticated(true);
      fetchCart(); 
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  // --- HÀM GỌI API ---
  const fetchCart = async () => {
    try {
      setLoading(true);
      const cartData = await getCart(); 
      setCart(cartData);
      // THÊM MỚI: Mặc định chọn tất cả sản phẩm khi tải giỏ hàng
      setSelectedItems(cartData.items.map(item => item.id));
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await deleteCartItem(itemId);
      // Xóa khỏi danh sách chọn
      setSelectedItems(prev => prev.filter(id => id !== itemId));
      fetchCart(); // Tải lại giỏ hàng
    } catch (error) {
      alert(`Lỗi khi xóa: ${error.message}`);
    }
  };

  const updateQuantity = async (itemId, change) => {
    try {
      await updateCartItemQuantity(itemId, change);
      fetchCart(); // Tải lại giỏ hàng
    } catch (error) {
      alert(`Lỗi khi cập nhật: ${error.message}`);
    }
  };
  const handleUpdateVariant = async (itemId, variantData) => {
    try {
      await updateCartItemVariant(itemId, variantData);
      fetchCart(); // Tải lại giỏ hàng
    } catch (error) {
      alert(`Lỗi khi sửa phân loại: ${error.message}`);
    }
  };

  // --- HÀM MỚI: Xử lý Ô Tích ---
  const handleToggleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) // Bỏ chọn
        : [...prev, itemId] // Thêm vào
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedItems.length === cart.items.length) {
      setSelectedItems([]); // Bỏ chọn tất cả
    } else {
      setSelectedItems(cart.items.map(item => item.id)); // Chọn tất cả
    }
  };

  // --- Hàm xử lý cho UI ---
  const handleLogoClick = () => navigate('/');
  const handleUserClick = () => {
    if (isAuthenticated) navigate('/member');
    else navigate('/auth');
  };
  
  if (loading || !cart) {
    return <div>Đang tải giỏ hàng...</div>;
  }

  // --- TÍNH TOÁN MỚI (Dựa trên sản phẩm đã chọn) ---
  const selectedProducts = cart.items.filter(item => selectedItems.includes(item.id));
  const totalAmount = calculateTotal(selectedProducts);
  const isAllSelected = cart.items.length > 0 && selectedItems.length === cart.items.length;

  return (
    <div className="cart-page">
      <Header 
        variant="solid"
        onMenuEnter={() => {}} 
        onLogoClick={handleLogoClick}
      />

      <main className="cart-page-main">
        <h1 className="cart-title">Giỏ Hàng</h1>
        
        <table className="cart-table">
          <thead className="cart-table-header">
            <tr>
              {/* THÊM MỚI: Header cho Ô Tích */}
              <th>
                <input 
                  type="checkbox" 
                  className="cart-item-checkbox"
                  checked={isAllSelected}
                  onChange={handleToggleSelectAll}
                />
              </th>
              <th>Sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành Tiền</th> {/* SỬA: Đổi tên cột */}
              <th>Thao tác</th>
            </tr>
          </thead>
          
          <tbody>
            {cart.items.map(item => (
              <CartItemRow 
                key={item.id} 
                item={item} 
                onUpdate={updateQuantity} 
                onDelete={deleteItem}
                onToggle={handleToggleSelectItem} // Truyền hàm
                isSelected={selectedItems.includes(item.id)}
                onEdit={setEditingItem} // Truyền trạng thái
              />
            ))}
          </tbody>
        </table>

        
        <div className="cart-summary">
          <div className="cart-summary-total">
            <span>Tổng cộng ({selectedProducts.length} sản phẩm):</span>
            <span className="total-amount">{formatPrice(totalAmount)}</span>
          </div>
          
          <button 
  className="cart-checkout-button"
  onClick={() => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!");
    } else {
      // Chuyển hướng và GỬI KÈM dữ liệu selectedItems
      navigate('/checkout', { state: { selectedItems: selectedItems } });
    }
  }}
>
  Thanh Toán
</button>
        </div>
        
      </main>
      
      <DieuHuongNoi
        onUserClick={handleUserClick} 
      />
      <Footer />
      {editingItem && (
        <VariantModal
            item={editingItem}
            onClose={() => setEditingItem(null)} // Hàm đóng
            onConfirm={handleUpdateVariant} // Hàm xác nhận
          />
      )}
    </div>
  );
};

export default TrangGioHang;