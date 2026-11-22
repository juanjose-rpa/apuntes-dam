<?php
require_once("config.php");
try {
    $conexion = obtenerConexion();
    $idPrestamo = $_POST["idPrestamo"];
    
    $idPrestamo = (int) $idPrestamo;
    $query = "UPDATE prestamos_juanjorpa 
              SET fecha_baja = IF(fecha_baja IS NOT NULL, NULL, NOW()) 
              WHERE id_prestamo = ?";
    

    $stmt = $conexion->prepare($query);
    if (!$stmt) {
        responder(null, false, "Error al preparar la consulta: " . $conexion->error, $conexion);
    }
    
    $stmt->bind_param("i", $idPrestamo);
    $stmt->execute();
    $filas_afectadas = $stmt->affected_rows;
    $mensaje = $filas_afectadas == 0 ? "No se ha encontrado el id de prestamo" : "Actualizado el prestamo";

    responder($filas_afectadas, true, $mensaje, $conexion);

} catch (mysqli_sql_exception $e) {
    // Errores específicos de mysqli
    responder(null, false, "Error en la base de datos: " . $e->getMessage(), $conexion ?? null);

} catch (Exception $e) {
    // Captura cualquier otra excepción / error inesperado
    responder(null, false, "Error general: " . $e->getMessage(), $conexion ?? null);
}

?>