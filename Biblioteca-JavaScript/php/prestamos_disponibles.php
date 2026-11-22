<?php
require_once("config.php");
try {
    $conexion = obtenerConexion();
    $ejemplar = isset($_GET['idEjemplar']) ? $_GET['idEjemplar'] : 0;
    
    $query = "SELECT 
                l.id_libro,
                l.titulo AS titulo_libro,
                MIN(e.id_ejemplar) AS id_ejemplar,
                COUNT(e.id_ejemplar) AS disponibles
              FROM libros_manuel l
              INNER JOIN ejemplares_juanjo e ON l.id_libro = e.id_libro
              WHERE l.fecha_baja IS NULL 
                AND e.fecha_baja IS NULL
                AND (
                    e.id_ejemplar NOT IN (
                        SELECT p.id_ejemplar 
                        FROM prestamos_juanjorpa p 
                        WHERE p.fecha_devolucion IS NULL 
                          AND p.fecha_baja IS NULL
                    )
                    OR e.id_ejemplar = ?
                )
              GROUP BY l.id_libro, l.titulo
              ORDER BY l.titulo ASC";

    $stmt = $conexion->prepare($query);
    if (!$stmt) {
        responder(null, false, "Error al preparar la consulta: " . $conexion->error, $conexion);
    }
    $stmt->bind_param("i", $param_ejemplar);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $prestamos = $resultado ? $resultado->fetch_all(MYSQLI_ASSOC) : [];

    responder($prestamos, true, "Datos recuperados correctamente", $conexion);

} catch (mysqli_sql_exception $e) {
    // Errores específicos de mysqli
    responder(null, false, "Error en la base de datos: " . $e->getMessage(), $conexion ?? null);

} catch (Exception $e) {
    // Captura cualquier otra excepción / error inesperado
    responder(null, false, "Error general: " . $e->getMessage(), $conexion ?? null);
}

?>