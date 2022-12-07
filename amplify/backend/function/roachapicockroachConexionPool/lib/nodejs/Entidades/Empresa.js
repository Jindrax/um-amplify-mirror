"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Empresa {
    constructor({ identificacion, razonsocial, agente, email, cognitoid }) {
        this.identificacion = identificacion ? identificacion : '';
        this.razonsocial = razonsocial ? razonsocial : '';
        this.agente = agente ? agente : '';
        this.email = email ? email : "";
        this.cognitoid = cognitoid ? cognitoid : "";
    }
}
exports.default = Empresa;
