"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnidadAdmin {
    constructor({ id, nombre, capitalstr, dane }) {
        this.id = id ? id : '';
        this.nombre = nombre ? nombre : '';
        this.capitalstr = capitalstr ? capitalstr : '';
        this.dane = dane ? dane : '';
    }
}
exports.default = UnidadAdmin;
