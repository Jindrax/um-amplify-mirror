"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Atributo {
    constructor({ id, nombre, descripcion, prioridad, icono, csscolor, imagen }) {
        this.id = id ? id : '';
        this.nombre = nombre ? nombre : '';
        this.descripcion = descripcion ? descripcion : '';
        this.prioridad = prioridad ? prioridad : 3;
        this.icono = icono ? icono : '';
        this.csscolor = csscolor ? csscolor : '#000000';
        if (prioridad == 1) {
            this.imagen = imagen ? imagen : "";
        }
    }
}
exports.default = Atributo;
