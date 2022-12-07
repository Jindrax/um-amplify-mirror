export enum BancoEnum{
    "BANCOLOMBIA" = "Bancolombia",
    "DAVIVIENDA" = "Davivienda",
    "BANCODEBOGOTA" = "Banco de bogota"
}

export enum TipoCuentaEnum{
    "corriente" = "Corriente",
    "ahorros" = "Ahorros"
}

export default class Agente {
    id: string;
    email: string;
    nombres: string;
    apellidos: string;
    cedula: string;
    direccion: string;
    ciudadstr: string;
    unidadadminstr: string;
    celular: string;
    banco: string;
    tipocuenta: string;
    numerocuenta: string;
    creadopor: string;
    cedulaarchivo: string;
    rutarchivo: string;
    antecedentesarchivo: string;
    unidadadmin: string;
    ciudad: string;

    constructor({
                    id,
                    email,
                    nombres,
                    apellidos,
                    cedula,
                    direccion,
                    ciudadstr,
                    unidadadminstr,
                    celular,
                    banco,
                    tipocuenta,
                    numerocuenta,
                    creadopor,
                    cedulaarchivo,
                    rutarchivo,
                    antecedentesarchivo,
                    unidadadmin,
                    ciudad
                }: { id?: string, email?: string, nombres?: string, apellidos?: string, cedula?: string, direccion?: string, ciudadstr?: string, unidadadminstr?: string, celular?: string, banco?: string, tipocuenta?: string, numerocuenta?: string, creadopor?: string, cedulaarchivo?: string, rutarchivo?: string, antecedentesarchivo?: string, unidadadmin?: string, ciudad?: string }) {
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