<?php
require_once "conexion.php";

$sql = "SELECT idplato, nombre, descripcion, precio FROM platos ORDER BY nombre ASC";
$resultado = $conexion->query($sql);

if (!$resultado) {
    echo json_encode([
        "error" => true,
        "mensaje" => "Error al consultar los platos: " . $conexion->error,
        "datos" => null
    ]);
    exit;
}

$platos = [];
while ($fila = $resultado->fetch_assoc()) {
    $fila["idplato"] = (int) $fila["idplato"];
    $fila["precio"] = (float) $fila["precio"];
    $platos[] = $fila;
}

echo json_encode([
    "error" => false,
    "mensaje" => "Platos recuperados correctamente",
    "datos" => $platos
]);

$conexion->close();
?>