# HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN

## Hệ thống quản lý thuốc LONGCHAUUTH

### Yêu cầu hệ thống

- **Java**: JDK 17 hoặc cao hơn
- **Maven**: 3.6+
- **MySQL**: 8.0+
- **Trình duyệt**: Chrome, Firefox, Safari, Edge (phiên bản mới)

### Bước 1: Cài đặt Database

#### 1.1 Tạo database

```sql
-- Kết nối MySQL
mysql -u root -p

-- Tạo database
CREATE DATABASE longchauuth_pharmacy;
USE longchauuth_pharmacy;

-- Import schema
SOURCE database/schema.sql;
```

#### 1.2 Hoặc sử dụng MySQL Workbench

1. Mở MySQL Workbench
2. Kết nối đến MySQL server
3. Tạo database mới tên `longchauuth_pharmacy`
4. Import file `database/schema.sql`

### Bước 2: Cấu hình Backend

#### 2.1 Cập nhật thông tin database

Chỉnh sửa file `backend/src/main/resources/application.properties`:

```properties
# Thay đổi thông tin database nếu cần
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

#### 2.2 Chạy Backend

**Trên Windows:**

```cmd
# Chạy script tự động
run.bat

# Hoặc chạy thủ công
cd backend
mvn clean install
mvn spring-boot:run
```

**Trên Linux/Mac:**

```bash
# Chạy script tự động
./run.sh

# Hoặc chạy thủ công
cd backend
mvn clean install
mvn spring-boot:run
```

Backend sẽ chạy tại: http://localhost:8080

### Bước 3: Chạy Frontend

#### 3.1 Mở trực tiếp

Mở file `frontend/index.html` trong trình duyệt

#### 3.2 Sử dụng Live Server (khuyến nghị)

1. Cài đặt Live Server extension trong VS Code
2. Click chuột phải vào file `frontend/index.html`
3. Chọn "Open with Live Server"

#### 3.3 Sử dụng Python

```bash
cd frontend
python -m http.server 8000
# Truy cập: http://localhost:8000
```

### Bước 4: Kiểm tra hệ thống

1. **Backend**: Truy cập http://localhost:8080/api/medicines
2. **Frontend**: Mở giao diện web
3. **Database**: Kiểm tra dữ liệu mẫu đã được import

## Cấu trúc dự án

```
LONGCHAUUTH/
├── backend/                 # Spring Boot Backend
│   ├── src/
│   │   ├── main/java/com/longchauuth/pharmacy/
│   │   │   ├── PharmacyManagementApplication.java
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── entity/
│   │   │   ├── repository/
│   │   │   └── service/
│   │   └── resources/
│   │       └── application.properties
│   ├── pom.xml
│   └── README.md
├── frontend/               # Frontend Web Application
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   ├── index.html
│   └── README.md
├── database/               # Database Scripts
│   └── schema.sql
├── run.bat                 # Script chạy Windows
├── run.sh                  # Script chạy Linux/Mac
├── README.md
└── SETUP.md
```

## Tính năng chính

### ✅ Đã hoàn thành

- **Quản lý thông tin thuốc**: CRUD operations
- **Quản lý tồn kho**: Xem, nhập, xuất kho
- **Dashboard**: Thống kê tổng quan
- **Tìm kiếm và lọc**: Theo tên, mã, trạng thái
- **Responsive design**: Tương thích mobile
- **API RESTful**: Đầy đủ endpoints

### 🔄 Đang phát triển

- Chỉnh sửa thông tin thuốc
- Xóa thuốc
- Điều chỉnh tồn kho
- Báo cáo chi tiết

### 📋 Kế hoạch phát triển

- Quản lý khách hàng
- Quản lý nhà cung cấp
- Báo cáo thống kê
- Authentication & Authorization
- Export/Import dữ liệu

## Troubleshooting

### Lỗi kết nối Database

```
Error: Could not create connection to database server
```

**Giải pháp:**

1. Kiểm tra MySQL có đang chạy không
2. Kiểm tra username/password trong application.properties
3. Kiểm tra database đã được tạo chưa

### Lỗi CORS

```
Access to fetch at 'http://localhost:8080' from origin 'null' has been blocked by CORS policy
```

**Giải pháp:**

1. Sử dụng Live Server thay vì mở file trực tiếp
2. Kiểm tra CORS configuration trong backend

### Lỗi Port đã được sử dụng

```
Port 8080 was already in use
```

**Giải pháp:**

1. Dừng ứng dụng đang chạy trên port 8080
2. Hoặc thay đổi port trong application.properties

### Lỗi Maven

```
Could not resolve dependencies
```

**Giải pháp:**

1. Kiểm tra kết nối internet
2. Chạy `mvn clean install -U`
3. Xóa thư mục `.m2/repository` và chạy lại

## Liên hệ hỗ trợ

Nếu gặp vấn đề trong quá trình cài đặt, vui lòng:

1. Kiểm tra log lỗi chi tiết
2. Đảm bảo đã cài đặt đầy đủ yêu cầu hệ thống
3. Tham khảo README.md trong từng thư mục

---

**Phát triển bởi**: Hệ thống quản lý thuốc LONGCHAUUTH
