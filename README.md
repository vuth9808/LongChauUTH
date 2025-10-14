# HỆ THỐNG QUẢN LÝ THÔNG TIN THUỐC - NHÀ THUỐC LONGCHAUUTH

## Mô tả dự án

Phần mềm quản lý thông tin thuốc cho nhà thuốc LONGCHAUUTH với các chức năng chính:

- Quản lý thông tin thuốc
- Quản lý nhập - xuất - tồn kho thuốc

## Công nghệ sử dụng

- **Frontend**: JavaScript, Bootstrap, HTML5, CSS3
- **Backend**: Java, Spring Boot, Spring Data JPA
- **Database**: MySQL
- **Build Tool**: Maven

## Cấu trúc dự án

```
LONGCHAUUTH/
├── backend/                 # Spring Boot Backend
│   ├── src/
│   ├── pom.xml
│   └── README.md
├── frontend/               # Frontend Web Application
│   ├── css/
│   ├── js/
│   ├── pages/
│   └── index.html
├── database/               # Database Scripts
│   └── schema.sql
└── README.md
```

## Hướng dẫn chạy dự án

### 1. Cài đặt Database

- Tạo database MySQL tên: `longchauuth_pharmacy`
- Import file `database/schema.sql`

### 2. Chạy Backend

```bash
cd backend
mvn spring-boot:run
```

Backend sẽ chạy tại: http://localhost:8080

### 3. Chạy Frontend

Mở file `frontend/index.html` trong trình duyệt hoặc sử dụng live server.

## API Endpoints

### Quản lý thuốc

- GET /api/medicines - Lấy danh sách thuốc
- POST /api/medicines - Thêm thuốc mới
- PUT /api/medicines/{id} - Cập nhật thông tin thuốc
- DELETE /api/medicines/{id} - Xóa thuốc

### Quản lý kho

- GET /api/inventory - Lấy danh sách tồn kho
- POST /api/inventory/import - Nhập kho
- POST /api/inventory/export - Xuất kho
- GET /api/inventory/reports - Báo cáo tồn kho

## Tác giả

Phát triển cho nhà thuốc LONGCHAUUTH
