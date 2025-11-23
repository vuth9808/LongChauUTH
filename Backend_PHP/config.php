<?php
$host = 'localhost';
$username = 'sql_nhom62_itimi';
$password = 'f97c87f9298e6';
$dbname = 'sql_nhom62_itimi';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Thiết lập charset UTF-8 để không bị lỗi font tiếng Việt
$conn->set_charset("utf8mb4");
?>