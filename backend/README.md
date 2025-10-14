# Backend - Hệ thống quản lý thuốc LONGCHAUUTH

## Mô tả

Backend API cho hệ thống quản lý thuốc sử dụng Spring Boot, Spring Data JPA và MySQL.

## Yêu cầu hệ thống

- Java 17 hoặc cao hơn
- Maven 3.6+
- MySQL 8.0+

## Cài đặt và chạy

### 1. Cài đặt Database

```sql
-- Tạo database
CREATE DATABASE longchauuth_pharmacy;

-- Import schema từ file database/schema.sql
mysql -u root -p longchauuth_pharmacy < ../database/schema.sql
```

### 2. Cấu hình Database

Chỉnh sửa file `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/longchauuth_pharmacy?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password_here
```

### 3. Chạy ứng dụng

```bash
# Cài đặt dependencies
mvn clean install

# Chạy ứng dụng
mvn spring-boot:run
```

Ứng dụng sẽ chạy tại: http://localhost:8080

## API Endpoints

### Quản lý thuốc

- `GET /api/medicines` - Lấy danh sách tất cả thuốc
- `GET /api/medicines/active` - Lấy danh sách thuốc đang hoạt động
- `GET /api/medicines/{id}` - Lấy thông tin thuốc theo ID
- `GET /api/medicines/code/{code}` - Lấy thông tin thuốc theo mã
- `GET /api/medicines/search?keyword={keyword}` - Tìm kiếm thuốc
- `POST /api/medicines` - Thêm thuốc mới
- `PUT /api/medicines/{id}` - Cập nhật thông tin thuốc
- `DELETE /api/medicines/{id}` - Xóa thuốc
- `GET /api/medicines/stats/count` - Thống kê số lượng thuốc

### Quản lý tồn kho

- `GET /api/inventory` - Lấy danh sách tồn kho
- `GET /api/inventory/in-stock` - Lấy danh sách hàng còn trong kho
- `GET /api/inventory/low-stock` - Lấy danh sách hàng sắp hết
- `GET /api/inventory/out-of-stock` - Lấy danh sách hàng hết
- `GET /api/inventory/medicine/{medicineId}` - Lấy tồn kho theo thuốc
- `POST /api/inventory/medicine/{medicineId}/add-stock?quantity={qty}` - Nhập kho
- `POST /api/inventory/medicine/{medicineId}/reduce-stock?quantity={qty}` - Xuất kho
- `GET /api/inventory/stats` - Thống kê tồn kho

### Quản lý danh mục

- `GET /api/categories` - Lấy danh sách danh mục
- `POST /api/categories` - Thêm danh mục mới
- `PUT /api/categories/{id}` - Cập nhật danh mục
- `DELETE /api/categories/{id}` - Xóa danh mục

### Quản lý nhà sản xuất

- `GET /api/manufacturers` - Lấy danh sách nhà sản xuất
- `POST /api/manufacturers` - Thêm nhà sản xuất mới
- `PUT /api/manufacturers/{id}` - Cập nhật nhà sản xuất
- `DELETE /api/manufacturers/{id}` - Xóa nhà sản xuất

## Cấu trúc dự án

```
src/
├── main/
│   ├── java/com/longchauuth/pharmacy/
│   │   ├── PharmacyManagementApplication.java
│   │   ├── config/
│   │   │   └── CorsConfig.java
│   │   ├── controller/
│   │   │   ├── MedicineController.java
│   │   │   ├── InventoryController.java
│   │   │   ├── CategoryController.java
│   │   │   └── ManufacturerController.java
│   │   ├── entity/
│   │   │   ├── Medicine.java
│   │   │   ├── Category.java
│   │   │   ├── Manufacturer.java
│   │   │   └── Inventory.java
│   │   ├── repository/
│   │   │   ├── MedicineRepository.java
│   │   │   ├── InventoryRepository.java
│   │   │   ├── CategoryRepository.java
│   │   │   └── ManufacturerRepository.java
│   │   └── service/
│   │       ├── MedicineService.java
│   │       └── InventoryService.java
│   └── resources/
│       └── application.properties
└── test/
```

## Dependencies chính

- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Validation
- MySQL Connector
- Spring Boot Starter Test

## Tính năng

- ✅ Quản lý thông tin thuốc (CRUD)
- ✅ Quản lý tồn kho
- ✅ Tìm kiếm và lọc thuốc
- ✅ Thống kê tồn kho
- ✅ CORS configuration
- ✅ Validation
- ✅ Error handling
- ✅ Pagination support

## Phát triển thêm

- [ ] Quản lý nhập/xuất kho chi tiết
- [ ] Báo cáo thống kê
- [ ] Quản lý khách hàng
- [ ] Quản lý nhà cung cấp
- [ ] Authentication & Authorization
- [ ] Logging
- [ ] Unit tests
