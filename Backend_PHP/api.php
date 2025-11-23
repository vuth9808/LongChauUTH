<?php
// Cho phép gọi API từ bên ngoài (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json; charset=UTF-8");

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM drugs ORDER BY id DESC";
        $result = $conn->query($sql);
        $drugs = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                // Ép kiểu số cho đúng định dạng JSON
                $row['id'] = (int)$row['id'];
                $row['price'] = (float)$row['price'];
                $row['quantity'] = (int)$row['quantity'];
                $drugs[] = $row;
            }
        }
        echo json_encode($drugs);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        
        if(!isset($data['name']) || !isset($data['sku'])) {
            echo json_encode(["message" => "Thiếu dữ liệu bắt buộc"]);
            exit();
        }

        $stmt = $conn->prepare("INSERT INTO drugs (name, sku, category, price, quantity, unit, form, ingredients, manufacturer, specification, description, usage_instruction, storage_instruction, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->bind_param("sssdisssssssss", 
            $data['name'], $data['sku'], $data['category'], $data['price'], 
            $data['quantity'], $data['unit'], $data['form'], $data['ingredients'], 
            $data['manufacturer'], $data['specification'], $data['description'], 
            $data['usage_instruction'], $data['storage_instruction'], $data['image']
        );

        if ($stmt->execute()) {
            echo json_encode(["message" => "Thêm thuốc thành công", "id" => $stmt->insert_id]);
        } else {
            echo json_encode(["message" => "Lỗi: " . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        
        if(!isset($data['id'])) {
            echo json_encode(["message" => "Thiếu ID sản phẩm"]);
            exit();
        }

        $stmt = $conn->prepare("UPDATE drugs SET name=?, sku=?, category=?, price=?, quantity=?, unit=?, form=?, ingredients=?, manufacturer=?, specification=?, description=?, usage_instruction=?, storage_instruction=?, image=? WHERE id=?");
        
        $stmt->bind_param("sssdisssssssssi", 
            $data['name'], $data['sku'], $data['category'], $data['price'], 
            $data['quantity'], $data['unit'], $data['form'], $data['ingredients'], 
            $data['manufacturer'], $data['specification'], $data['description'], 
            $data['usage_instruction'], $data['storage_instruction'], $data['image'],
            $data['id']
        );

        if ($stmt->execute()) {
            echo json_encode(["message" => "Cập nhật thành công"]);
        } else {
            echo json_encode(["message" => "Lỗi: " . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'DELETE':
        if(isset($_GET['id'])) {
            $id = $_GET['id'];
            $stmt = $conn->prepare("DELETE FROM drugs WHERE id = ?");
            $stmt->bind_param("i", $id);
            if ($stmt->execute()) {
                echo json_encode(["message" => "Xóa thành công"]);
            } else {
                echo json_encode(["message" => "Lỗi xóa dữ liệu"]);
            }
            $stmt->close();
        } else {
            echo json_encode(["message" => "Thiếu ID để xóa"]);
        }
        break;
}

$conn->close();
?>