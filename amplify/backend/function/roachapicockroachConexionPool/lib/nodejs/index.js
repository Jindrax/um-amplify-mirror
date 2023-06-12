"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualizarEntidad = exports.insertarEntidad = exports.getCliente = exports.UnidadAdmin = exports.Locacion = exports.Ciudad = exports.Categoria = exports.Atributo = exports.Agente = void 0;
const pg_1 = require("pg");
let pool;
const DATABASE_URL = "postgresql://jairo:kGuOKjET19RegVwG9PWl3Q@free-tier14.aws-us-east-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&options=--cluster%3Dregal-crawler-2921";
exports.Agente = __importStar(require("./Entidades/Agente"));
exports.Atributo = __importStar(require("./Entidades/Atributo"));
exports.Categoria = __importStar(require("./Entidades/Categoria"));
exports.Ciudad = __importStar(require("./Entidades/Ciudad"));
exports.Locacion = __importStar(require("./Entidades/Locacion"));
exports.UnidadAdmin = __importStar(require("./Entidades/UnidadAdmin"));
const getCliente = async () => {
    if (!pool) {
        pool = new pg_1.Pool({
            host: "um-postgre.cxhhi2k6xdsb.us-east-1.rds.amazonaws.com",
            user: "yayo",
            password: "Calle9#1G23",
            database: "um",
            max: 1,
        });
    }
    return await pool.connect();
};
exports.getCliente = getCliente;
const insertarEntidad = (entidad, tabla) => {
    const tupla = {
        query: "",
        parametros: []
    };
    const llaves = Object.getOwnPropertyNames(entidad);
    const valores = Object.values(entidad);
    const indices = llaves.map((value, index) => `\$${index + 1}`);
    tupla.query = `INSERT INTO ${tabla}(${llaves.join(',')}) VALUES (${indices.join(',')})`;
    tupla.parametros = valores.map((value) => {
        if (typeof value === 'object' &&
            !Array.isArray(value) &&
            value !== null) {
            return JSON.stringify(value);
        }
        else {
            return value;
        }
    });
    return tupla;
};
exports.insertarEntidad = insertarEntidad;
const actualizarEntidad = (entidad, condicion, tabla) => {
    const tupla = {
        query: "",
        parametros: []
    };
    const llaves = Object.getOwnPropertyNames(entidad);
    const valores = Object.values(entidad);
    const indices = llaves.map((value, index) => `\$${index + 1}`);
    tupla.query = `UPDATE ${tabla} SET ${llaves.map((llave, indice) => `${llave}=${indices[indice]}`).join(',')} WHERE ${condicion}`;
    tupla.parametros = valores;
    return tupla;
};
exports.actualizarEntidad = actualizarEntidad;
