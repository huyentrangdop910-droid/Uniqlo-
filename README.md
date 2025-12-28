#  Rentzy - Hệ thống Bán hàng Thời trang (Uniqlo Clone)


## 🚀 Công nghệ sử dụng
- **Backend:** Java Spring Boot 3.0, Hibernate, JWT.
- **Frontend:** ReactJS, Vite.
- **Database:** MySQL.
- **Tools:** Docker, DBeaver, VS Code.

## ⚙️ Hướng dẫn Cài đặt & Chạy

### 1. Chuẩn bị Database
1. Tạo database trong MySQL tên là: `rentzy_store`
2. Import file `database.sql` (nằm ở thư mục gốc) vào database vừa tạo.
3. **Lưu ý cấu hình:**
   - Mở file `backend/src/main/resources/application.properties`.
   - Cập nhật `username` và `password` MySQL tương ứng với máy của bạn.

### 2. Chạy Backend (Spring Boot)
cd backend
./mvnw spring-boot:run -DskipTests
# Server sẽ chạy tại: http://localhost:8080

### 3. Chạy Frontend (React)
cd frontend
npm install
npm run dev
# Website sẽ chạy tại: http://localhost:5173

### Tài khoản Demo
Để trải nghiệm quyền Admin và Khách hàng, vui lòng sử dụng tài khoản sau:
- **Admin:** admin / admin123456
- **User:** user / user123456
- **Staff:** nv1 / 1
