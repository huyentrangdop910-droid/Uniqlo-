// URL backend (đã sửa, phải có /v1)
const API_URL = 'http://localhost:8080/api/v1';

/**
 * Hàm trợ giúp xử lý phản hồi từ API
 *
 * SỬA LỖI QUAN TRỌNG:
 * Chúng ta phải kiểm tra "response.ok" TRƯỚC KHI cố gắng parse .json().
 * Đây là lý do bạn bị lỗi "Unexpected end of JSON input" khi server trả về 403.
 */
/**
 * THÊM MỚI: Gọi API Thêm vào giỏ hàng
 * @param {object} cartData - Gói dữ liệu
 * @param {number} cartData.productId - ID sản phẩm
 * @param {number} cartData.quantity - Số lượng
 * @param {string} cartData.size - Size đã chọn
 * @param {string} cartData.color - Mã màu hex đã chọn
 */
/*const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Phản hồi lỗi từ server:", errorText);
    throw new Error(errorText || `Lỗi ${response.status}: ${response.statusText}`);
  }

  try {
    // Thử parse JSON, nếu thất bại (vì body rỗng) thì trả về text
    const data = await response.json();
    return data;
  } catch (e) {
    return response.text(); // Trả về text nếu không phải JSON
  }
};*/
/**
 * Hàm trợ giúp xử lý phản hồi từ API
 * (SỬA: Dùng clone() để tránh lỗi "body stream already read")
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    // Nếu là lỗi (4xx, 5xx), luôn đọc text
    const errorText = await response.text(); 
    throw new Error(errorText || `Lỗi ${response.status}`);
  }

  // Nếu OK (2xx), chúng ta không biết nó là JSON hay TEXT
  // (ví dụ: getCart là JSON, deleteCartItem là TEXT)
  // Vì vậy, chúng ta clone nó.
  const responseClone = response.clone();
  
  try {
    // 1. Thử đọc như JSON trước
    const data = await response.json();
    return data;
  } catch (e) {
    // 2. Nếu thất bại (vì nó là text), đọc text từ clone
    return responseClone.text(); 
  }
};


/**
 * Gọi API Đăng Ký
 * (Chấp nhận 1 object userData, code này đã đúng)
 */
export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  // Gửi response cho hàm trợ giúp mới để xử lý
  return handleResponse(response);
};


/**
 * Gọi API Đăng Nhập
 */
export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  
  const data = await handleResponse(response);

  // SỬA: Backend chúng ta xây dựng chỉ trả về token
  if (data.token) {
    localStorage.setItem('userToken', data.token);
    localStorage.setItem('username', username);
  } else {
    throw new Error("Không nhận được token từ server.");
  }
  
  return data;
};


/**
 * (Tùy chọn) Gọi API lấy thông tin người dùng hiện tại
 * (Lưu ý: Bạn chưa tạo endpoint /api/v1/auth/me ở backend)
 */

export const addToCart = async (cartData) => {
  // Lấy token từ localStorage
  const token = localStorage.getItem('userToken');
  
  if (!token) {
    // Nếu chưa đăng nhập, ném lỗi ngay
    throw new Error('Bạn cần đăng nhập để thêm vào giỏ hàng.');
  }

  const response = await fetch(`${API_URL}/cart/add`, { // SỬA: URL API là /api/v1/auth/cart/add
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // THÊM: Gửi Token để backend biết bạn là ai
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(cartData),
  });
  
  // Dùng lại hàm handleResponse (nhưng sửa 1 chút)
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Lỗi ${response.status}`);
  }
  
  // API này chỉ trả về text ("Thêm vào giỏ hàng thành công")
  // nên chúng ta .text() thay vì .json()
  return response.text(); 
};
// ... (code handleResponse, register, login, addToCart giữ nguyên) ...

/**
 * THÊM MỚI: Gọi API Lấy thông tin giỏ hàng
 */
// ... (code cũ giữ nguyên) ...

/**
 * THÊM MỚI: Gửi 1 review mới
 */
export const createReview = async (reviewData) => {
  const token = localStorage.getItem('userToken');
  if (!token) throw new Error('Bạn cần đăng nhập để đánh giá.');

  const response = await fetch(`${API_URL}/reviews`, { // API: POST /api/v1/reviews
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(reviewData)
  });
  return handleResponse(response);
};

/**
 * THÊM MỚI: Lấy tất cả review của 1 sản phẩm
 */
export const getReviewsForProduct = async (productId) => {
  const response = await fetch(`${API_URL}/reviews/product/${productId}`, { // API: GET /api/v1/reviews/product/{id}
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse(response);
};
export const getCart = async () => {
  const token = localStorage.getItem('userToken');
  
  if (!token) {
    // Nếu chưa đăng nhập, ném lỗi
    throw new Error('Bạn cần đăng nhập để xem giỏ hàng.');
  }

  const response = await fetch(`${API_URL}/cart`, { // API: GET /api/v1/cart
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Gửi token
    },
  });
  
  // API này trả về 1 file JSON (CartDto), nên ta dùng handleResponse
  return handleResponse(response); 
};
// ... (hàm getCart giữ nguyên) ...

/**
 * THÊM MỚI: Xóa 1 món hàng
 */
export const deleteCartItem = async (itemId) => {
  const token = localStorage.getItem('userToken');
  if (!token) throw new Error('Chưa đăng nhập');

  const response = await fetch(`${API_URL}/cart/item/${itemId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
};

/**
 * THÊM MỚI: Cập nhật số lượng
 * @param {number} change - (1 hoặc -1)
 */
export const updateCartItemQuantity = async (itemId, change) => {
  const token = localStorage.getItem('userToken');
  if (!token) throw new Error('Chưa đăng nhập');

  const response = await fetch(`${API_URL}/cart/item/${itemId}?change=${change}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
};
// ... (code cũ giữ nguyên) ...

/**
 * THÊM MỚI: Lấy chi tiết sản phẩm (để lấy size/màu có sẵn)
 */
export const getProductDetails = async (productId) => {
  const response = await fetch(`${API_URL}/products/${productId}`, { // API: GET /api/v1/products/{id}
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse(response); // Trả về 1 object Product
};

/**
 * THÊM MỚI: Cập nhật Phân loại hàng (Size/Màu)
 */
export const updateCartItemVariant = async (itemId, variantData) => {
  const token = localStorage.getItem('userToken');
  if (!token) throw new Error('Chưa đăng nhập');

  const response = await fetch(`${API_URL}/cart/item/${itemId}/variant`, { // API: PUT /api/v1/cart/item/{id}/variant
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(variantData) // Gửi { size: "M", color: "#CODE" }
  });
  return handleResponse(response);
};

/*export const searchProducts = async (query) => {
  const response = await fetch(`${API_URL}/products/search?query=${query}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse(response); // Trả về một mảng [Product]
};*/
// frontend/src/services/authService.js

// ... các hàm khác ...

// Cập nhật hàm searchProducts
export const searchProducts = async (query, minPrice = 0, maxPrice = 9999999999) => {
    try {
        // Tạo URL với các tham số: query, min, max
        // Backend API: /api/v1/products/search?query=...&min=...&max=...
        const url = `http://localhost:8080/api/v1/products/search?query=${encodeURIComponent(query)}&min=${minPrice}&max=${maxPrice}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Lỗi khi tìm kiếm sản phẩm');
        }

        return await response.json();
    } catch (error) {
        console.error("Search API error:", error);
        throw error;
    }
};
/**
 * (Tùy chọn) Gọi API lấy thông tin người dùng hiện tại
 */
// ... (code getMe giữ nguyên) ...
// ... (code getReviewsForProduct giữ nguyên) ...

/**
 * THÊM MỚI: Xóa 1 review
 */
export const deleteReview = async (reviewId) => {
  const token = localStorage.getItem('userToken');
  if (!token) throw new Error('Chưa đăng nhập');

  const response = await fetch(`${API_URL}/reviews/${reviewId}`, { // API: DELETE /api/v1/reviews/{id}
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}` 
    },
  });
  return handleResponse(response);
};
export const getMe = async () => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error('Chưa đăng nhập.');
  }

  const response = await fetch(`${API_URL}/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Gửi token để xác thực
    },
  });
  
  return handleResponse(response);
};
// ... (code cũ)

/**
 * THÊM MỚI: Sửa review
 */
export const updateReview = async (reviewId, reviewData) => {
  const token = localStorage.getItem('userToken');
  if (!token) throw new Error('Chưa đăng nhập');

  const response = await fetch(`${API_URL}/reviews/${reviewId}`, { // API: PUT /api/v1/reviews/{id}
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(reviewData)
  });
  return handleResponse(response);
};
/**
 * API: Đặt hàng (Chuyển giỏ hàng thành đơn hàng)
 */
export const placeOrder = async (method, selectedIds,addressId) => { // Nhận thêm selectedIds
  const token = localStorage.getItem('userToken');
  if (!token) throw new Error('Chưa đăng nhập');

  const response = await fetch(`${API_URL}/orders/place`, {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
    },
    // Gửi JSON body
    body: JSON.stringify({
        paymentMethod: method,
        selectedCartItemIds: selectedIds,
        addressId: addressId
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
  return response.text();
};
export const getMyOrders = async () => {
  const token = localStorage.getItem('userToken');
  const response = await fetch(`${API_URL}/orders/my-orders`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
};
export const buyNow = async (cartData) => {
  const token = localStorage.getItem('userToken');
  if (!token) throw new Error('Bạn cần đăng nhập.');

  const response = await fetch(`${API_URL}/cart/buy-now`, { // Gọi API mới
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(cartData),
  });
  return handleResponse(response); 
};
// ... (các code cũ giữ nguyên) ...

/**
 * API ĐỊA CHỈ
 */
export const getMyAddresses = async () => {
  const token = localStorage.getItem('userToken');
  const response = await fetch(`${API_URL}/addresses`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
};

export const addAddress = async (addressData) => {
  const token = localStorage.getItem('userToken');
  const response = await fetch(`${API_URL}/addresses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(addressData)
  });
  return handleResponse(response);
};

export const updateAddress = async (id, addressData) => {
  const token = localStorage.getItem('userToken');
  const response = await fetch(`${API_URL}/addresses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(addressData)
  });
  return handleResponse(response);
};

export const deleteAddress = async (id) => {
  const token = localStorage.getItem('userToken');
  const response = await fetch(`${API_URL}/addresses/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
};
export const cancelOrder = async (orderId) => {
  const token = localStorage.getItem('userToken');
  const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
};

/**
 * THÊM MỚI: Cập nhật địa chỉ đơn hàng
 */
export const updateOrderAddress = async (orderId, addressId) => {
  const token = localStorage.getItem('userToken');
  const response = await fetch(`${API_URL}/orders/${orderId}/address?addressId=${addressId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
};
/**
 * THÊM MỚI: Cập nhật phương thức thanh toán đơn hàng
 */
export const updateOrderPaymentMethod = async (orderId, method) => {
  const token = localStorage.getItem('userToken');
  const response = await fetch(`${API_URL}/orders/${orderId}/payment?method=${method}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
};
// frontend/src/services/authService.js

// ... (các hàm cũ) ...

/**
 * THÊM MỚI: Cập nhật trạng thái đơn hàng (VD: Đã Thanh Toán)
 */
export const updateOrderStatus = async (orderId, status) => {
  const token = localStorage.getItem('userToken');
  // Mã hóa tham số status vì nó có thể chứa khoảng trắng (VD: "Đã Thanh Toán")
  const encodedStatus = encodeURIComponent(status); 
  
  const response = await fetch(`${API_URL}/orders/${orderId}/status?status=${encodedStatus}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
};
/**
 * API USER
 */
// frontend/src/services/authService.js

// ... (các hàm login, register... cũ giữ nguyên)

/**
 * API: Lấy thông tin người dùng hiện tại (để check quyền)
 */
export const getUserProfile = async () => {
  const token = localStorage.getItem('userToken');
  if (!token) throw new Error("No token found");

  const response = await fetch(`${API_URL}/auth/me`, { // Hoặc endpoint bạn đã định nghĩa ở backend
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return handleResponse(response);
};

export const updateUserProfile = async (profileData) => {
  const token = localStorage.getItem('userToken');
  const response = await fetch(`${API_URL}/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(profileData)
  });
  return handleResponse(response);
};

export const changePassword = async (passwordData) => {
  const token = localStorage.getItem('userToken');
  const response = await fetch(`${API_URL}/users/me/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(passwordData)
  });
  return handleResponse(response);
};
export const deleteAccount = async () => {
  const token = localStorage.getItem('userToken');
  const response = await fetch(`${API_URL}/users/me`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
};
// ... (các code cũ) ...

/**
 * API QUẢN LÝ (MANAGER)
 */
// Thêm vào authService.js
export const getProductById = async (productId) => {
    const response = await fetch(`http://localhost:8080/api/v1/products/${productId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error('Không thể tải thông tin sản phẩm');
    }
    return await response.json();
};
// Trong file authService.js
// Thêm vào frontend/src/services/authService.js

export const getAllProducts = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/v1/products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Không thể tải danh sách sản phẩm');
        }
        return await response.json();
    } catch (error) {
        console.error("Lỗi get products:", error);
        return []; // Trả về mảng rỗng nếu lỗi
    }
};