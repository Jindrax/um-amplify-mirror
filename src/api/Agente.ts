export enum BancoEnum{
  "BANCOLOMBIA" = "Bancolombia",
  "DAVIVIENDA" = "Davivienda",
  "BANCODEBOGOTA" = "Banco de bogota"
}

export enum TipoCuentaEnum{
  "CORRIENTE" = "corriente",
  "AHORROS" = "ahorros"
}

export class Agente {
  email: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  celular: string;
  correo: string;
  cedulaArchivo: File;
  rutArchivo: File;
  antecedentesArchivo: File;
  banco: BancoEnum;
  tipoCuenta: TipoCuentaEnum;
  numeroCuenta: string;


  constructor(email: string, nombres: string, apellidos: string, cedula: string, direccion: string, ciudad: string, departamento: string, celular: string, correo: string, cedulaArchivo: File, rutArchivo: File, antecedentesArchivo: File, banco: BancoEnum, tipoCuenta: TipoCuentaEnum, numeroCuenta: string) {
    this.email = email;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.cedula = cedula;
    this.direccion = direccion;
    this.ciudad = ciudad;
    this.departamento = departamento;
    this.celular = celular;
    this.correo = correo;
    this.cedulaArchivo = cedulaArchivo;
    this.rutArchivo = rutArchivo;
    this.antecedentesArchivo = antecedentesArchivo;
    this.banco = banco;
    this.tipoCuenta = tipoCuenta;
    this.numeroCuenta = numeroCuenta;
  }
}
