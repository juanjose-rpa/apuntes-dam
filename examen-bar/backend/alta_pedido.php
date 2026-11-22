<?php
require_once "conexion.php";

$cliente = isset($_POST["cliente"]) ? trim($_POST["cliente"]) : "";
$idplato = isset($_POST["idplato"]) ? (int) $_POST["idplato"] : 0;
$unidades = isset($_POST["unidades"]) ? (int) $_POST["unidades"] : 0;

if ($cliente === "" || $idplato <= 0 || $unidades <= 0) {
    echo json_encode([
        "error" => true,
        "mensaje" => "Datos del pedido incompletos o no válidos",
        "datos" => null
    ]);
    exit;
}

$stmt = $conexion->prepare("INSERT INTO pedidos (cliente, idplato, unidades) VALUES (?, ?, ?)");
$stmt->bind_param("sii", $cliente, $idplato, $unidades);

if ($stmt->execute()) {
    echo json_encode([
        "error" => false,
        "mensaje" => "Pedido registrado correctamente",
        "datos" => [
            "idpedido" => $conexion->insert_id,
            "cliente" => $cliente,
            "idplato" => $idplato,
            "unidades" => $unidades
        ]
    ]);
} else {
    echo json_encode([
        "error" => true,
        "mensaje" => "Error al registrar el pedido: " . $stmt->error,
        "datos" => null
    ]);
}

$stmt->close();
$conexion->close();
?>