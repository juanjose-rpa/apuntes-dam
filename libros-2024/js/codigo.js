"use strict";

// MAIN
var oLibreria = new Libreria();
var contenedorListado = null;

registrarEventos();

function registrarEventos() {
  // Opciones de menú (evitamos que "#" mueva la página o recargue)
  document.getElementById("mnuCrearLibro").addEventListener("click", (e) => {
    e.preventDefault();
    mostrarFormulario(e);
  });

  document.getElementById("mnuListado").addEventListener("click", (e) => {
    e.preventDefault();
    mostrarFormulario(e);
  });

  // Botones
  frmCrearLibro.btnCrearLibro.addEventListener("click", procesarAltaLibro);
  frmListado.btnListado.addEventListener("click", procesarListado);
}

function obtenerContenedorListado() {
  if (!contenedorListado) {
    contenedorListado = document.createElement("div");
    contenedorListado.id = "zonaListadoLibros";
    contenedorListado.className = "d-none mt-3";
    document.getElementById("formularios").appendChild(contenedorListado);
  }
  return contenedorListado;
}

function mostrarFormulario(oEvento) {
  let opcion = oEvento.target.id;

  ocultarVistas();

  switch (opcion) {
    case "mnuCrearLibro":
      cargarDesplegables();
      frmCrearLibro.classList.remove("d-none");
      break;

    case "mnuListado":
      cargarDesplegables();
      frmListado.classList.remove("d-none");
      break;
  }
}

function ocultarVistas() {
  frmCrearLibro.classList.add("d-none");
  frmListado.classList.add("d-none");
  obtenerContenedorListado().classList.add("d-none");
}

async function cargarDesplegables() {
  let respuesta = await oLibreria.getGeneros();
  let options = "";

  if (respuesta.ok) {
    for (let genero of respuesta.datos) {
      options += `<option value="${genero.idgenero}">${genero.genero}</option>`;
    }

    frmCrearLibro.lstGenero.innerHTML = options;
    frmListado.lstGenero.innerHTML = options;
  } else {
    alert("No se han podido cargar los géneros literarios: " + respuesta.mensaje);
  }
}

async function procesarAltaLibro() {
  // Recoger campos del formulario
  let titulo = frmCrearLibro.txtTitulo.value.trim();
  let autor = frmCrearLibro.txtAutor.value.trim();
  let descripcion = frmCrearLibro.txtDescripcion.value.trim();
  let imagen = frmCrearLibro.txtImagen.value.trim();
  let idgenero = frmCrearLibro.lstGenero.value.trim();

  // Llamamos al servidor
  let respuesta = await oLibreria.crearLibro(
    new Libro(null, idgenero, titulo, autor, descripcion, imagen)
  );

  alert(respuesta.mensaje);

  if (respuesta.ok) {
    frmCrearLibro.reset();
    frmCrearLibro.classList.add("d-none");
  }
}

async function procesarListado() {
  let idgenero = frmListado.lstGenero.value.trim();
  let nombreGenero =
    frmListado.lstGenero.options[frmListado.lstGenero.selectedIndex]?.textContent || "";

  let respuesta = await oLibreria.getLibrosGenero(idgenero);

  if (respuesta.ok) {
    const zona = obtenerContenedorListado();
    zona.innerHTML = oLibreria.generarHTMLListado(respuesta.datos, nombreGenero);
    zona.classList.remove("d-none");
  } else {
    alert("Error al obtener el listado de libros: " + respuesta.mensaje);
  }
}
