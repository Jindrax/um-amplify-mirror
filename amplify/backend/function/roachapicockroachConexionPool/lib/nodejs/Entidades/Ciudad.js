"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Ciudad {
    constructor({ id, nombre, unidadadminstr, significativo, unidadadmin }) {
        this.id = id ? id : '';
        this.nombre = nombre ? nombre : '';
        this.unidadadminstr = unidadadminstr ? unidadadminstr : '';
        this.significativo = significativo ? significativo : false;
        this.unidadadmin = unidadadmin ? unidadadmin : undefined;
    }
}
exports.default = Ciudad;
