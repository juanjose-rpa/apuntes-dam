"use strict";

"use strict";

class Pedido {
    #idpedido;
    #cliente;
    #idplato;
    #unidades;

    constructor(idpedido, cliente, idplato, unidades) {
        this.#idpedido = idpedido;
        this.#cliente = cliente;
        this.#idplato = idplato;
        this.#unidades = unidades;
    }

    get idpedido() {
        return this.#idpedido;
    }
    set idpedido(valor) {
        this.#idpedido = valor;
    }

    get cliente() {
        return this.#cliente;
    }
    set cliente(valor) {
        this.#cliente = valor;
    }

    get idplato() {
        return this.#idplato;
    }
    set idplato(valor) {
        this.#idplato = valor;
    }

    get unidades() {
        return this.#unidades;
    }
    set unidades(valor) {
        this.#unidades = valor;
    }
}

class Plato {
    #idplato;
    #nombre;
    #descripcion;
    #precio;

    constructor(idplato, nombre, descripcion, precio) {
        this.#idplato = idplato;
        this.#nombre = nombre;
        this.#descripcion = descripcion;
        this.#precio = precio;
    }

    get idplato() {
        return this.#idplato;
    }
    set idplato(valor) {
        this.#idplato = valor;
    }

    get nombre() {
        return this.#nombre;
    }
    set nombre(valor) {
        this.#nombre = valor;
    }

    get descripcion() {
        return this.#descripcion;
    }
    set descripcion(valor) {
        this.#descripcion = valor;
    }

    get precio() {
        return this.#precio;
    }
    set precio(valor) {
        this.#precio = valor;
    }
}

class Bar {
    async altaPedido(oPedido) {
        let datos = new FormData();
        datos.append("cliente", oPedido.cliente);
        datos.append("idplato", oPedido.idplato);
        datos.append("unidades", oPedido.unidades);

        let respuesta = await peticionPOST("alta_pedido.php", datos);
        return respuesta;
    }

    async getPlatos() {
        let datos = new FormData();
        let respuesta = await peticionGET("get_platos.php", datos);
        return respuesta.datos;
    }

    async listadoPedidosCliente(nombreCliente) {
        let datos = new FormData();
        datos.append("cliente", nombreCliente);

        let respuesta = await peticionGET("get_pedidos_cliente.php", datos);

        if (respuesta.error) {
            return `<div class="alert alert-danger">${respuesta.mensaje}</div>`;
        }

        let listado = `<h3>PEDIDOS DE ${nombreCliente}</h3>`;
        listado += `<table class="table table-striped">`;
        listado += `<thead><tr>
        <th>IDPEDIDO</th>
        <th>PLATO</th>
        <th>UNIDADES</th>
        <th>PRECIO</th>
        <th>TOTAL</th>
        </tr></thead><tbody>`;

        for (let fila of respuesta.datos) {
            let total = (parseFloat(fila.unidades) * parseFloat(fila.precio)).toFixed(2);
            listado += `<tr>
            <td>${fila.idpedido}</td>
            <td>${fila.nombre}</td>
            <td>${fila.unidades}</td>
            <td>${parseFloat(fila.precio).toFixed(2)}</td>
            <td>${total}</td>
            </tr>`;
        }

        listado += `</tbody></table>`;
        return listado;
    }
}
