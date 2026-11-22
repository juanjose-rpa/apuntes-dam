const tbody = document.querySelector("#tabla-usuarios");

tbody.addEventListener("click", (event) => {
  const boton = event.target.closest("button[data-action]");
  if (!boton) return; // El clic no fue en un botón de acción

  const fila = boton.closest("tr");
  const id = fila.dataset.id;
  const accion = boton.dataset.action;

  if (accion === "edit") {
    editarRegistro(id);
  } else if (accion === "delete") {
    borrarRegistro(id);
  }
});
