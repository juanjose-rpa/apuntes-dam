<?php
header("Content-Type: application/json; charset=utf-8");

$host = "localhost";
$usuario = "root";
$password = "test";
$bd = "bar"; // Cambia "bar" por el nombre real de tu base de datos

$conexion = new mysqli($host, $usuario, $password, $bd);

if ($conexion->connect_error) {
    echo json_encode([
        "error" => true,
        "mensaje" => "Error de conexión a la base de datos: " . $conexion->connect_error,
        "datos" => null
    ]);
    exit;
}

$conexion->set_charset("utf8");
?>