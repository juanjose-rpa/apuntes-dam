<?php
require_once "conexion.php";

$cliente = isset($_GET["cliente"]) ? trim($_GET["cliente"]) : "";

$stmt = $conexion->prepare("
    SELECT p.idpedido, pl.nombre, p.unidades, pl.precio
    FROM pedidos p
    INNER JOIN platos pl ON p.idplato = pl.idplato
    WHERE p.cliente = ?
    ORDER BY p.idpedido ASC
");
$stmt->bind_param("s", $cliente);

if (!$stmt->execute()) {
    echo json_encode([
        "error" => true,
        "mensaje" => "Error al obtener los pedidos del cliente: " . $stmt->error,
        "datos" => null
    ]);
    exit;
}

$resultado = $stmt->get_result();
$pedidos = [];

while ($fila = $resultado->fetch_assoc()) {
    $fila["idpedido"] = (int) $fila["idpedido"];
    $fila["unidades"] = (int) $fila["unidades"];
    $fila["precio"] = (float) $fila["precio"];
    $pedidos[] = $fila;
}

echo json_encode([
    "error" => false,
    "mensaje" => "Pedidos recuperados correctamente",
    "datos" => $pedidos
]);

$stmt->close();
$conexion->close();
?>