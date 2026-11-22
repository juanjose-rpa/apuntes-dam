"use strict";

class Prestamo {
    #idPrestamo;
    #idEjemplar;
    #tituloLibro;
    #fechaPrestamo;
    #fechaLimite;
    #fechaDevolucion;
    #observaciones;
    #importeFianza;
    #tieneFianza;
    #urlImagen;
    #fechaBaja;

    constructor(idPrestamo, idEjemplar, tituloLibro = "", fechaPrestamo, fechaLimite, fechaDevolucion = null, observaciones = "", importeFianza = 0, tieneFianza, urlImagen = null, fechaBaja = null) {
        this.#idPrestamo = idPrestamo;
        this.#idEjemplar = idEjemplar;
        this.#tituloLibro = tituloLibro;
        this.#fechaPrestamo = fechaPrestamo;
        this.#fechaLimite = fechaLimite;
        this.#fechaDevolucion = fechaDevolucion;
        this.#observaciones = observaciones;
        this.#importeFianza = importeFianza;
        this.#tieneFianza = tieneFianza;
        this.#urlImagen = urlImagen;
        this.#fechaBaja = fechaBaja;
    }

    get idPrestamo() {return this.#idPrestamo;}
    set idPrestamo(valor) {this.#idPrestamo = valor;}

    get idEjemplar() {return this.#idEjemplar;}
    set idEjemplar(valor) {this.#idEjemplar = valor;}
    
    get tituloLibro() {return this.#tituloLibro;}
    set tituloLibro(valor) {this.#tituloLibro = valor;}

    get fechaPrestamo() {return this.#fechaPrestamo;}
    set fechaPrestamo(valor) {this.#fechaPrestamo = valor;} 
    
    get fechaLimite() {return this.#fechaLimite;}
    set fechaLimite(valor) {this.#fechaLimite = valor;}
    
    get fechaDevolucion() {return this.#fechaDevolucion;}
    set fechaDevolucion(valor) {this.#fechaDevolucion = valor;}
    
    get observaciones() {return this.#observaciones;}
    set observaciones(valor) {this.#observaciones = valor;}
    
    get importeFianza() {return this.#importeFianza;}
    set importeFianza(valor) {this.#importeFianza = valor;}
    
    get tieneFianza() {return this.#tieneFianza;}
    set tieneFianza(valor) {this.#tieneFianza = valor;}
    
    get urlImagen() {return this.#urlImagen;}
    set urlImagen(valor) {this.#urlImagen = valor;}
    
    get fechaBaja() {return this.#fechaBaja;}
    set fechaBaja(valor) {this.#fechaBaja = valor;}

    toJSON() {
        return {
            idPrestamo:      this.#idPrestamo,
            idEjemplar:      this.#idEjemplar,
            tituloLibro:     this.#tituloLibro,
            fechaPrestamo:   this.#fechaPrestamo,
            fechaLimite:     this.#fechaLimite,
            fechaDevolucion: this.#fechaDevolucion,
            observaciones:   this.#observaciones,
            importeFianza:   this.#importeFianza,
            tieneFianza:     this.#tieneFianza,
            urlImagen:       this.#urlImagen,
            fechaBaja:       this.#fechaBaja,
        };
    }
}
class LibrosDisponibles {
    #idLibro;
    #tituloLibro;
    #idEjemplar;
    #disponibles;

    constructor(idLibro, tituloLibro, idEjemplar, disponibles) {
        this.#idLibro = idLibro;
        this.#tituloLibro = tituloLibro;
        this.#idEjemplar = idEjemplar;
        this.#disponibles = disponibles; 
    }
    get idLibro() {return this.#idLibro;}
    set idLibro(valor) {this.#idLibro = valor;}

    get tituloLibro() {return this.#tituloLibro;}
    set tituloLibro(valor) {this.#tituloLibro = valor;}

    get idEjemplar() {return this.#idEjemplar;}
    set idEjemplar(valor) {this.#idEjemplar = valor;}

    get disponibles() {return this.#disponibles;}
    set disponibles(valor) {this.#disponibles = valor;}

    toJSON() {
        return {
            idLibro:     this.#idLibro,
            tituloLibro: this.#tituloLibro,
            idEjemplar:  this.#idEjemplar,
            disponibles: this.#disponibles,
        };
    }
}

class Biblioteca {
    async crearPrestamo(oPrestamo, archivoImagen = null) {
        let datos = new FormData();
        datos.append("prestamo", JSON.stringify(oPrestamo));
        let respuesta = await peticionPOST("prestamos_crear.php", datos);

        const nuevoId = respuesta?.datos;
        if (respuesta?.ok && archivoImagen && nuevoId) {
            const datosSubida = await this.subirImagenPrestamo(archivoImagen, nuevoId);
            const urlSubida = datosSubida?.datos?.url_imagen ?? datosSubida?.url_imagen;

            if (datosSubida?.ok && urlSubida) {
                oPrestamo.idPrestamo = nuevoId;
                oPrestamo.urlImagen = urlSubida;
                await this.modificarPrestamo(oPrestamo);
            } else {
                respuesta.mensaje = `${respuesta.mensaje}. Aviso con la imagen: ${datosSubida?.mensaje || "no se pudo subir"}`;
            }
        }

        return respuesta;
    }

    async listadoPrestamos() {
        let respuesta = await peticionGET("prestamos_listado.php");
        return respuesta;
    }

    async cambiarEstadoPrestamo(idPrestamo) {
        let datos = new FormData();
        datos.append("idPrestamo", idPrestamo);
        let respuesta = await peticionPOST("prestamos_cambiar_estado.php", datos);
        return respuesta;
    }

    async librosDisponibles(idEjemplar) {
        let datos = new FormData();
        datos.append("idEjemplar", idEjemplar);
        let respuesta = await peticionGET("prestamos_disponibles.php", datos);
        return respuesta;
    }

    async subirImagenPrestamo(archivo, idPrestamo) {
        let datos = new FormData();
        datos.append("imagen", archivo);
        if (idPrestamo !== null && idPrestamo !== undefined) {
            datos.append("idPrestamo", idPrestamo);
        }
        let respuesta = await peticionPOST("prestamos_guardar_imagen.php", datos);
        return respuesta;
    }

    async resolverUrlImagenEdicion(inputUrlImagen, urlActual = "", idPrestamo = null) {
        const archivoNuevo =
            inputUrlImagen && inputUrlImagen.type === "file"
                ? inputUrlImagen.files?.[0]
                : null;

        if (!archivoNuevo) {
            if (inputUrlImagen && inputUrlImagen.type !== "file") {
                return inputUrlImagen.value.trim() || urlActual;
            }
            return urlActual;
        }

        const datosSubida = await this.subirImagenPrestamo(archivoNuevo, idPrestamo);
        const urlSubida = datosSubida?.datos?.url_imagen ?? datosSubida?.url_imagen;

        if (!datosSubida?.ok || !urlSubida) {
            throw new Error(datosSubida?.mensaje || "No se pudo subir la nueva imagen.");
        }

        return urlSubida;
    }

    async modificarPrestamo(oPrestamo) {
        let datos = new FormData();
        datos.append("prestamo", JSON.stringify(oPrestamo));
        let respuesta = await peticionPOST("prestamos_modificar.php", datos);
        return respuesta;
    }
  
}