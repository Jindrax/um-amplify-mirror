"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Categoria {
    constructor({ id, nombre, descripcion }) {
        this.id = id ? id : '';
        this.nombre = nombre ? nombre : '';
        this.descripcion = descripcion ? descripcion : '';
    }
}
exports.default = Categoria;
