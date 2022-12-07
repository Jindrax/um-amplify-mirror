"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ActualizarLocacion {
    constructor({ id, cambios, registroCambios }) {
        this.id = id ? id : '';
        this.cambios = cambios ? cambios : {};
        this.registroCambios = registroCambios ? registroCambios : {
            add: [],
            remove: []
        };
    }
}
exports.default = ActualizarLocacion;
