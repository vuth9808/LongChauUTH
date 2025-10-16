-- Tạo database
CREATE DATABASE IF NOT EXISTS longchauuth_pharmacy;
USE longchauuth_pharmacy;

-- Bảng danh mục thuốc
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng nhà sản xuất
CREATE TABLE manufacturers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng thuốc
CREATE TABLE medicines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200),
    image_url VARCHAR(500),
    category_id BIGINT,
    manufacturer_id BIGINT,
    unit VARCHAR(50) NOT NULL,
    dosage_form VARCHAR(100),
    strength VARCHAR(100),
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2) NOT NULL,
    barcode VARCHAR(100),
    expiry_date DATE,
    batch_number VARCHAR(50),
    status ENUM('ACTIVE', 'INACTIVE', 'EXPIRED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id)
);

-- Bảng nhà cung cấp
CREATE TABLE suppliers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    tax_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng khách hàng
CREATE TABLE customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    date_of_birth DATE,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng nhập kho
CREATE TABLE import_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    import_code VARCHAR(50) NOT NULL UNIQUE,
    supplier_id BIGINT,
    import_date DATE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    notes TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- Bảng chi tiết nhập kho
CREATE TABLE import_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    import_transaction_id BIGINT,
    medicine_id BIGINT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    expiry_date DATE,
    batch_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (import_transaction_id) REFERENCES import_transactions(id),
    FOREIGN KEY (medicine_id) REFERENCES medicines(id)
);

-- Bảng xuất kho
CREATE TABLE export_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    export_code VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT,
    export_date DATE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(12,2) NOT NULL,
    payment_method ENUM('CASH', 'CARD', 'TRANSFER') DEFAULT 'CASH',
    notes TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Bảng chi tiết xuất kho
CREATE TABLE export_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    export_transaction_id BIGINT,
    medicine_id BIGINT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (export_transaction_id) REFERENCES export_transactions(id),
    FOREIGN KEY (medicine_id) REFERENCES medicines(id)
);

-- Bảng tồn kho
CREATE TABLE inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medicine_id BIGINT,
    current_stock INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 0,
    max_stock INT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (medicine_id) REFERENCES medicines(id),
    UNIQUE KEY unique_medicine_inventory (medicine_id)
);

-- Bảng lịch sử tồn kho
CREATE TABLE inventory_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medicine_id BIGINT,
    transaction_type ENUM('IMPORT', 'EXPORT', 'ADJUSTMENT') NOT NULL,
    quantity_change INT NOT NULL,
    quantity_before INT NOT NULL,
    quantity_after INT NOT NULL,
    reference_id BIGINT,
    reference_type ENUM('IMPORT', 'EXPORT', 'ADJUSTMENT'),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medicine_id) REFERENCES medicines(id)
);

-- Insert dữ liệu mẫu
INSERT INTO categories (name, description) VALUES
('Thuốc kháng sinh', 'Các loại thuốc kháng sinh'),
('Thuốc giảm đau', 'Thuốc giảm đau, hạ sốt'),
('Thuốc tim mạch', 'Thuốc điều trị bệnh tim mạch'),
('Vitamin', 'Các loại vitamin và khoáng chất'),
('Thuốc da liễu', 'Thuốc điều trị bệnh ngoài da');

INSERT INTO manufacturers (name, address, phone, email) VALUES
('Công ty TNHH Dược phẩm ABC', '123 Đường ABC, Quận 1, TP.HCM', '028-1234567', 'info@abc.com.vn'),
('Công ty CP Dược phẩm XYZ', '456 Đường XYZ, Quận 2, TP.HCM', '028-7654321', 'contact@xyz.com.vn'),
('Công ty TNHH Dược phẩm DEF', '789 Đường DEF, Quận 3, TP.HCM', '028-9876543', 'support@def.com.vn');

INSERT INTO suppliers (name, contact_person, phone, email, address) VALUES
('Nhà phân phối thuốc ABC', 'Nguyễn Văn A', '0901234567', 'nguyenvana@abc.com', '123 Đường ABC, Quận 1, TP.HCM'),
('Công ty cung cấp dược phẩm XYZ', 'Trần Thị B', '0907654321', 'tranthib@xyz.com', '456 Đường XYZ, Quận 2, TP.HCM');

INSERT INTO medicines (code, name, generic_name, category_id, manufacturer_id, unit, dosage_form, strength, price, cost_price, barcode) VALUES
('MED001', 'Amoxicillin 500mg', 'Amoxicillin', 1, 1, 'Viên', 'Viên nang', '500mg', 2500, 2000, '1234567890123'),
('MED002', 'Paracetamol 500mg', 'Paracetamol', 2, 2, 'Viên', 'Viên nén', '500mg', 500, 400, '1234567890124'),
('MED003', 'Vitamin C 1000mg', 'Ascorbic Acid', 4, 3, 'Viên', 'Viên sủi', '1000mg', 15000, 12000, '1234567890125'),
('MED004', 'Aspirin 100mg', 'Acetylsalicylic Acid', 2, 1, 'Viên', 'Viên nén', '100mg', 800, 600, '1234567890126'),
('MED005', 'Atorvastatin 20mg', 'Atorvastatin', 3, 2, 'Viên', 'Viên nén', '20mg', 12000, 10000, '1234567890127');

-- Insert tồn kho ban đầu
INSERT INTO inventory (medicine_id, current_stock, min_stock, max_stock) VALUES
(1, 100, 10, 500),
(2, 200, 20, 1000),
(3, 50, 5, 200),
(4, 150, 15, 300),
(5, 80, 8, 400);
