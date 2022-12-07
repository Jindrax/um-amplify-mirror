"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoCuentaEnum = exports.BancoEnum = void 0;
var BancoEnum;
(function (BancoEnum) {
    BancoEnum["BANCOLOMBIA"] = "Bancolombia";
    BancoEnum["DAVIVIENDA"] = "Davivienda";
    BancoEnum["BANCODEBOGOTA"] = "Banco de bogota";
})(BancoEnum = exports.BancoEnum || (exports.BancoEnum = {}));
var TipoCuentaEnum;
(function (TipoCuentaEnum) {
    TipoCuentaEnum["corriente"] = "Corriente";
    TipoCuentaEnum["ahorros"] = "Ahorros";
})(TipoCuentaEnum = exports.TipoCuentaEnum || (exports.TipoCuentaEnum = {}));
class Agente {
    constructor({ id, email, nombres, apellidos, cedula, direccion, ciudadstr, unidadadminstr, celular, banco, tipocuenta, numerocuenta, creadopor, cedulaarchivo, rutarchivo, antecedentesarchivo, unidadadmin, ciudad }) {
        this.id = id ? id : '';
        this.email = email ? email : '';
        this.nombres = nombres ? nombres : '';
        this.apellidos = apellidos ? apellidos : '';
        this.cedula = cedula ? cedula : '';
        this.direccion = direccion ? direccion : '';
        this.ciudadstr = ciudadstr ? ciudadstr : '';
        this.unidadadminstr = unidadadminstr ? unidadadminstr : '';
        this.celular = celular ? celular : '';
        this.banco = banco ? banco : '';
        this.tipocuenta = tipocuenta ? tipocuenta : '';
        this.numerocuenta = numerocuenta ? numerocuenta : '';
        this.creadopor = creadopor ? creadopor : '';
        this.cedulaarchivo = cedulaarchivo ? cedulaarchivo : '';
        this.rutarchivo = rutarchivo ? rutarchivo : '';
        this.antecedentesarchivo = antecedentesarchivo ? antecedentesarchivo : '';
        this.unidadadmin = unidadadmin ? unidadadmin : '';
        this.ciudad = ciudad ? ciudad : '';
    }
}
exports.default = Agente;
