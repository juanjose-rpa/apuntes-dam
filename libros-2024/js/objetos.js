"use strict";

class Libro {
  #idlibro;
  #idgenero;
  #titulo;
  #autor;
  #descripcion;
  #imagen;

  constructor(idlibro, idgenero, titulo, autor, descripcion, imagen) {
    this.#idlibro = idlibro;
    this.#idgenero = idgenero;
    this.#titulo = titulo;
    this.#autor = autor;
    this.#descripcion = descripcion;
    this.#imagen = imagen;
  }

  get idlibro() {
    return this.#idlibro;
  }
  set idlibro(valor) {
    this.#idlibro = valor;
  }

  get idgenero() {
    return this.#idgenero;
  }
  set idgenero(valor) {
    this.#idgenero = valor;
  }

  get titulo() {
    return this.#titulo;
  }
  set titulo(valor) {
    this.#titulo = valor;
  }

  get descripcion() {
    return this.#descripcion;
  }
  set descripcion(valor) {
    this.#descripcion = valor;
  }

  get autor() {
    return this.#autor;
  }
  set autor(valor) {
    this.#autor = valor;
  }

  get imagen() {
    return this.#imagen;
  }
  set imagen(valor) {
    this.#imagen = valor;
  }

  toJSON() {
    return {
      idlibro: this.#idlibro,
      idgenero: this.#idgenero,
      titulo: this.#titulo,
      autor: this.#autor,
      descripcion: this.#descripcion,
      imagen: this.#imagen,
    };
  }
}

class Genero {
  #idgenero;
  #genero;

  constructor(idgenero, genero) {
    this.#idgenero = idgenero;
    this.#genero = genero;
  }

  get idgenero() {
    return this.#idgenero;
  }
  set idgenero(valor) {
    this.#idgenero = valor;
  }

  get genero() {
    return this.#genero;
  }
  set genero(valor) {
    this.#genero = valor;
  }

  toJSON() {
    return {
      idgenero: this.#idgenero,
      genero: this.#genero,
    };
  }
}

class Libreria {
  async crearLibro(oLibro) {
    let datos = new FormData();
    datos.append("libro", JSON.stringify(oLibro));

    // Puedes usar "crear_libro_sentencia_preparada.php" o "crear_libro.php"
    let respuesta = await peticionPOST("crear_libro_sentencia_preparada.php", datos);
    return respuesta;
  }

  async getLibrosGenero(idgenero) {
    let datos = new FormData();
    datos.append("idgenero", idgenero);

    let respuesta = await peticionGET("get_libros_genero.php", datos);
    return respuesta;
  }

  async getGeneros() {
    return await peticionGET("get_generos.php", new FormData());
  }

  /**
   * Genera el HTML de tarjetas/listado para un array de libros de un género
   */
  generarHTMLListado(libros, nombreGenero) {
    if (!libros || libros.length === 0) {
      return `
        <div class="mt-4">
          <h3>Libros del género: ${nombreGenero}</h3>
          <div class="alert alert-info mt-3">No hay libros registrados en este género.</div>
        </div>
      `;
    }

    let cards = "";
    for (let libro of libros) {
      const imgSrc = libro.imagen && libro.imagen.trim() !== ""
        ? libro.imagen
        : "favicon.png";

      cards += `
        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow-sm">
            <img src="${imgSrc}" class="card-img-top" alt="${libro.titulo}" style="height: 220px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${libro.titulo}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Autor: ${libro.autor}</h6>
              <p class="card-text flex-grow-1">${libro.descripcion || ""}</p>
            </div>
            <div class="card-footer text-muted small">
              Género: ${libro.genero || nombreGenero}
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="mt-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="mb-0">Libros del género: ${nombreGenero}</h3>
          <span class="badge bg-secondary">${libros.length} libro(s)</span>
        </div>
        <div class="row">
          ${cards}
        </div>
      </div>
    `;
  }
}
