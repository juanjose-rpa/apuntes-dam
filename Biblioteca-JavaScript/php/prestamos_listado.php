<?php
require_once("config.php");
try {
    $conexion = obtenerConexion();
    $incluirBajas = isset($_GET["incluirBajas"]) ? $_GET["incluirBajas"] : False;
    $buscar = isset($_GET["buscar"]) ? $_GET["buscar"] : "";

    $query = 
    "SELECT p.*, 
            l.titulo AS titulo_libro
    FROM prestamos_juanjorpa p
    INNER JOIN ejemplares_juanjo e ON p.id_ejemplar = e.id_ejemplar
    INNER JOIN libros_manuel l ON e.id_libro = l.id_libro
    WHERE 1=1 ";

    if ($incluirBajas){
        $query .= " AND p.fecha_baja IS NULL";
    }

    $buscar = trim($buscar);
    if ($buscar !== ""){
        $query .= " AND (l.titulo LIKE ? 
                    OR p.observaciones LIKE ? 
                    OR p.id_prestamo LIKE ?) ";
    }

    $query .= " ORDER BY p.id_prestamo ASC";

    $stmt = $conexion->prepare($query);
    if (!$stmt) {
        responder(null, false, "Error al preparar la consulta: " . $conexion->error, $conexion);
    }

    if ($buscar !== "") {
        $param = "%{$buscar}%";
        $stmt->bind_param("sss", $param, $param, $param);
    }

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