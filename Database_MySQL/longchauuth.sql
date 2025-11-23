
-- Tạo bảng drugs
CREATE TABLE IF NOT EXISTS `drugs` (
  `id` int(11) NOT NULL AUTO_INCREMENT, -- ID của sản phẩm
  `sku` varchar(50) NOT NULL, -- Mã sản phẩm
  `name` varchar(255) NOT NULL, -- Tên sản phẩm
  `category` varchar(100) DEFAULT NULL, -- Danh mục
  `price` decimal(10,0) NOT NULL, -- Giá tiền
  `quantity` int(11) NOT NULL DEFAULT 0, -- Tồn kho
  `unit` varchar(50) DEFAULT NULL, -- Đơn vị tính
  `form` varchar(100) DEFAULT NULL, -- Dạng bào chế
  `ingredients` text DEFAULT NULL, -- Thành phần
  `manufacturer` varchar(255) DEFAULT NULL, -- Nhà sản xuất
  `specification` varchar(255) DEFAULT NULL, -- Quy cách
  `description` text DEFAULT NULL, -- Mô tả ngắn
  `usage_instruction` text DEFAULT NULL, -- Cách dùng
  `storage_instruction` text DEFAULT NULL, -- Bảo quản
  `image` text DEFAULT NULL, -- Đường dẫn ảnh
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(), -- Thời gian tạo
  PRIMARY KEY (`id`), -- Khóa chính
  UNIQUE KEY `sku` (`sku`) -- Khóa ngoại
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; -- Engine và charset
-- Thêm một vài dữ liệu mẫu
INSERT INTO `drugs` (`sku`, `name`, `category`, `price`, `quantity`, `unit`, `form`, `manufacturer`, `image`) VALUES
('PN001', 'Panadol Extra', 'Giảm đau, hạ sốt', 15000, 150, 'Vỉ', 'Viên nén', 'GSK', 'https://nhathuoclongchau.com.vn/images/product/2021/04/00029705-panadol-extra-do-12v-6571-606d_large.jpg'),
('EF500', 'Efferalgan 500mg', 'Giảm đau, hạ sốt', 48000, 45, 'Hộp', 'Viên sủi', 'UPSA', 'https://nhathuoclongchau.com.vn/images/product/2018/06/00000301-efferalgan-500mg-upsa-16v-6593-5b23_large.jpg');