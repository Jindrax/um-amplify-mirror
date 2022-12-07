"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ActualizarAgente {
    constructor({ id, cambios }) {
        this.id = id ? id : '';
        this.cambios = cambios ? cambios : {};
    }
}
exports.default = ActualizarAgente;
