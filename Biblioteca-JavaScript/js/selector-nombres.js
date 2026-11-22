
document.addEventListener("DOMContentLoaded", function () {
  // Diccionario de responsables según el requisito de tu proyecto
  const responsablesPorSeccion = {
    inicio: "Grupo 4",
    editoriales: "Carlos García",
    libros: "Manuel Orozco",
    ejemplares: "Juan José Lobo",
    prestamos: "Juan José Rodríguez-Prat",
  };

  const elementoResponsable = document.getElementById("nombre-responsable");

  // Función para cambiar de sección de manera dinámica en la SPA
  function cambiarSeccion(seccionDeseada) {
    // Comprobar que la sección existe
    const seccionActivaHTML = document.getElementById(`sec-${seccionDeseada}`);

    if (!seccionActivaHTML) {
      seccionDeseada = "inicio";
    }

    // 1. Ocultar todas las secciones
    document.querySelectorAll(".seccion-spa").forEach((sec) => {
      sec.classList.add("d-none");
    });

    // 2. Mostrar la sección seleccionada
    document.getElementById(`sec-${seccionDeseada}`).classList.remove("d-none");

    // 3. Gestionar los estilos active de los botones del menú
    document.querySelectorAll(".nav-link[data-section]").forEach((el) => {
      if (el.dataset.section === seccionDeseada) {
        el.classList.add("active", "bg-success");
        el.classList.remove("text-white");
      } else {
        el.classList.remove("active", "bg-success");
        el.classList.add("text-white");
      }
    });

    // 4. Actualizar dinámicamente el nombre del responsable
    if (elementoResponsable) {
      elementoResponsable.textContent =
        responsablesPorSeccion[seccionDeseada] || "Bibliotecario en Turno";
    }
  }

  // 5. Asignar el evento click a todos los enlaces del menú y los logos
  document.querySelectorAll("[data-section]").forEach((enlace) => {
    enlace.addEventListener("click", function (e) {
      e.preventDefault();

      const seccion = this.dataset.section;

      // Actualizar la URL sin recargar la página
      if (window.location.hash !== `#${seccion}`) {
        history.pushState(null, "", `#${seccion}`);
      }

      cambiarSeccion(seccion);
    });
  });

  // 6. Inicializar según la sección indicada en la URL
  const seccionInicial = window.location.hash.substring(1) || "inicio";
  cambiarSeccion(seccionInicial);

  // 7. Gestionar los botones atrás y adelante del navegador
  window.addEventListener("popstate", function () {
    const seccion = window.location.hash.substring(1) || "inicio";
    cambiarSeccion(seccion);
  });
});
