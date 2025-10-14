# Frontend - Hệ thống quản lý thuốc LONGCHAUUTH

## Mô tả

Giao diện web cho hệ thống quản lý thuốc sử dụng HTML5, CSS3, JavaScript và Bootstrap 5.

## Tính năng

- ✅ Dashboard tổng quan
- ✅ Quản lý thông tin thuốc
- ✅ Quản lý tồn kho
- ✅ Tìm kiếm và lọc dữ liệu
- ✅ Responsive design
- ✅ Modern UI/UX

## Cấu trúc dự án

```
frontend/
├── index.html          # Trang chủ
├── css/
│   └── style.css       # Custom CSS
├── js/
│   └── app.js          # JavaScript chính
└── README.md
```

## Cách sử dụng

### 1. Mở trực tiếp

Mở file `index.html` trong trình duyệt web.

### 2. Sử dụng Live Server (khuyến nghị)

```bash
# Cài đặt Live Server extension trong VS Code
# Hoặc sử dụng Python
python -m http.server 8000

# Truy cập: http://localhost:8000
```

### 3. Sử dụng Node.js

```bash
# Cài đặt http-server
npm install -g http-server

# Chạy server
http-server -p 8000

# Truy cập: http://localhost:8000
```

## Yêu cầu

- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Backend API đang chạy tại http://localhost:8080

## Công nghệ sử dụng

- **HTML5** - Cấu trúc trang web
- **CSS3** - Styling và responsive design
- **JavaScript (ES6+)** - Logic xử lý
- **Bootstrap 5** - UI framework
- **Bootstrap Icons** - Icon set
- **Fetch API** - Giao tiếp với backend

## Tính năng chi tiết

### Dashboard

- Thống kê tổng quan
- Số lượng thuốc
- Tình trạng tồn kho
- Hoạt động gần đây

### Quản lý thuốc

- Xem danh sách thuốc
- Thêm thuốc mới
- Tìm kiếm thuốc
- Lọc theo trạng thái
- Chỉnh sửa thông tin (đang phát triển)
- Xóa thuốc (đang phát triển)

### Quản lý tồn kho

- Xem tồn kho hiện tại
- Nhập kho
- Xuất kho
- Lọc theo trạng thái tồn kho
- Điều chỉnh tồn kho (đang phát triển)

## API Integration

Frontend giao tiếp với backend thông qua REST API:

```javascript
// Ví dụ gọi API
const response = await fetch("http://localhost:8080/api/medicines");
const medicines = await response.json();
```

## Responsive Design

- Mobile-first approach
- Breakpoints: 576px, 768px, 992px, 1200px
- Tối ưu cho mọi thiết bị

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Phát triển thêm

- [ ] Form validation nâng cao
- [ ] Export/Import dữ liệu
- [ ] Charts và graphs
- [ ] Print functionality
- [ ] Offline support
- [ ] Progressive Web App (PWA)
- [ ] Dark mode
- [ ] Multi-language support

## Troubleshooting

### Lỗi CORS

Nếu gặp lỗi CORS, đảm bảo backend đã cấu hình CORS đúng cách.

### API không kết nối được

Kiểm tra:

1. Backend có đang chạy không
2. URL API có đúng không
3. Port 8080 có bị chặn không

### Giao diện không hiển thị đúng

Kiểm tra:

1. Kết nối internet (để load Bootstrap CDN)
2. Console có lỗi JavaScript không
3. File CSS có được load không
