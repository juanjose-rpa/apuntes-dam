<?php
require_once("config.php");

try {
    $conexion = obtenerConexion();
    $prestamo = json_decode($_POST['prestamo'] ?? '', true);

    if (!is_array($prestamo)) {
        responder(null, false, "Datos del préstamo no válidos", $conexion);
    }

    $idPrestamo = isset($prestamo['idPrestamo']) ? (int) $prestamo['idPrestamo'] : 0;
    if ($idPrestamo <= 0) {
        responder(null, false, "ID de préstamo no válido", $conexion);
    }

    $idEjemplar    = (int) ($prestamo['idEjemplar'] ?? 0);
    $fechaPrestamo = $prestamo['fechaPrestamo'] ?? null;
    $fechaLimite   = $prestamo['fechaLimite'] ?? null;
    $tieneFianza   = isset($prestamo['tieneFianza']) ? (int) $prestamo['tieneFianza'] : 0;
    $importeFianza = isset($prestamo['importeFianza']) ? (float) $prestamo['importeFianza'] : 0;
    $urlImagen     = $prestamo['urlImagen'] ?? null;
    $observaciones = $prestamo['observaciones'] ?? "";

    $query = "UPDATE prestamos_juanjorpa
              SET id_ejemplar = ?,
                  fecha_prestamo = ?,
                  fecha_limite = ?,
                  tiene_fianza = ?,
                  importe_fianza = ?,
                  url_imagen = ?,
                  observaciones = ?
              WHERE id_prestamo = ?";

    $stmt = $conexion->prepare($query);
    if (!$stmt) {
        responder(null, false, "Error al preparar la consulta: " . $conexion->error, $conexion);
    }

    $stmt->bind_param(
        "issidssi",
        $idEjemplar,
        $fechaPrestamo,
        $fechaLimite,
        $tieneFianza,
        $importeFianza,
        $urlImagen,
        $observaciones,
        $idPrestamo
    );

    $stmt->execute();
    $filas_afectadas = $stmt->affected_rows;

    if ($filas_afectadas > 0) {
        responder($filas_afectadas, true, "Préstamo actualizado correctamente", $conexion);
    } else {
        responder(0, false, "No se ha encontrado el préstamo o no hubo cambios", $conexion);
    }
} catch (mysqli_sql_exception $e) {
    responder(null, false, "Error en la base de datos: " . $e->getMessage(), $conexion ?? null);
} catch (Exception $e) {
    responder(null, false, "Error general: " . $e->getMessage(), $conexion ?? null);
}
