"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnidadAdmin {
    constructor({ id, nombre, capitalstr }) {
        this.id = id ? id : '';
        this.nombre = nombre ? nombre : '';
        this.capitalstr = capitalstr ? capitalstr : '';
    }
}
exports.default = UnidadAdmin;
