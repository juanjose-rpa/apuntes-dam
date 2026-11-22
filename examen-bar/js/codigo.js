"use strict";

"use strict";

var oBar = new Bar();

registrarEventos();

function registrarEventos() {
    // Opciones de menú
    document.querySelector("#mnuAltaPedido").addEventListener("click", mostrarFormulario);
    document.querySelector("#mnuListadoPedidosCliente").addEventListener("click", mostrarFormulario);

    // Botones de los formularios
    document.querySelector("#btnAceptarAltaPedido").addEventListener("click", procesarAltaPedido);
    document.querySelector("#btnListadoPedidosCliente").addEventListener("click", procesarListadoPedidosCliente);
}

function ocultarTodo() {
    frmAltaPedido.style.display = "none";
    frmListadoPedidosCliente.style.display = "none";
    document.querySelector("#listado").style.display = "none";
    document.querySelector("#listado").innerHTML = "";
}

function mostrarFormulario(oEvento) {
    let opcionMenu = oEvento.target.id;

    ocultarTodo();

    if (opcionMenu === "mnuAltaPedido") {
        frmAltaPedido.style.display = "block";
        cargarDesplegablePlatos();
    } else if (opcionMenu === "mnuListadoPedidosCliente") {
        frmListadoPedidosCliente.style.display = "block";
    }
}

async function cargarDesplegablePlatos() {
    let listaPlatos = await oBar.getPlatos();
    let opciones = "";

    if (listaPlatos) {
        for (let plato of listaPlatos) {
            opciones += `<option value="${plato.idplato}">${plato.nombre}</option>`;
        }
    }

    frmAltaPedido.lstPlatos.innerHTML = opciones;
}

async function procesarAltaPedido() {
    let cliente = frmAltaPedido.txtCliente.value.trim();
    let idplato = parseInt(frmAltaPedido.lstPlatos.value);
    let unidades = parseInt(frmAltaPedido.rbtUnidades.value);

    // El idpedido es autonumérico en la BD, se pasa null
    let oPedido = new Pedido(null, cliente, idplato, unidades);

    let respuesta = await oBar.altaPedido(oPedido);

    alert(respuesta.mensaje);

    if (!respuesta.error) {
        frmAltaPedido.reset();
        frmAltaPedido.style.display = "none";
    }
}

async function procesarListadoPedidosCliente() {
    let nombreCliente = frmListadoPedidosCliente.txtNombreClienteListado.value.trim();

    let tablaHTML = await oBar.listadoPedidosCliente(nombreCliente);

    let capaListado = document.querySelector("#listado");
    capaListado.innerHTML = tablaHTML;
    capaListado.style.display = "block";
}
