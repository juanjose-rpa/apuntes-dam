<?php
require_once("config.php");

try {
    $conexion = obtenerConexion();

    if (!isset($_FILES["imagen"]) || $_FILES["imagen"]["error"] !== UPLOAD_ERR_OK) {
        responder(null, false, "No se ha recibido ninguna imagen válida", $conexion);
    }

    $idPrestamo = isset($_POST["idPrestamo"]) ? (int) $_POST["idPrestamo"] : 0;
    if ($idPrestamo <= 0) {
        responder(null, false, "ID de préstamo no válido para nombrar la imagen", $conexion);
    }

    $permitidos = [
        "image/jpeg" => "jpg",
        "image/png"  => "png",
        "image/webp" => "webp",
        "image/gif"  => "gif"
    ];

    $mime = mime_content_type($_FILES["imagen"]["tmp_name"]);
    if (!isset($permitidos[$mime])) {
        responder(null, false, "Formato de imagen no permitido", $conexion);
    }

    $carpeta = __DIR__ . "/../img/prestamos/";
    if (!is_dir($carpeta)) {
        mkdir($carpeta, 0775, true);
    }

    $prefijo = "P" . str_pad((string) $idPrestamo, 2, "0", STR_PAD_LEFT);

    // Elimina cualquier imagen previa del mismo préstamo (con cualquier extensión)
    foreach (glob($carpeta . $prefijo . ".*") ?: [] as $archivoPrevio) {
        if (is_file($archivoPrevio)) {
            unlink($archivoPrevio);
        }
    }

    $nombre = $prefijo . "." . $permitidos[$mime];
    $destino = $carpeta . $nombre;

    if (!move_uploaded_file($_FILES["imagen"]["tmp_name"], $destino)) {
        responder(null, false, "Error al guardar la imagen", $conexion);
    }

    $urlImagen = "img/prestamos/" . $nombre;
    responder(["url_imagen" => $urlImagen], true, "Imagen subida correctamente", $conexion);

} catch (mysqli_sql_exception $e) {
    responder(null, false, "Error en la base de datos: " . $e->getMessage(), $conexion ?? null);
} catch (Exception $e) {
    responder(null, false, "Error general: " . $e->getMessage(), $conexion ?? null);
}
?>