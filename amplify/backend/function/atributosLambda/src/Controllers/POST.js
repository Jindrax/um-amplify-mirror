"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Atributo_1 = __importDefault(require("/opt/nodejs/Entidades/Atributo"));
const index_1 = require("/opt/nodejs/index");
function registerController(app) {
    app.post('/atributos', crearAtributo);
}
exports.default = registerController;
async function crearAtributo(req, res) {
    let results;
    const atributo = new Atributo_1.default(req.body);
    try {
        // results = await req.clienteDB!.query("insert into atributo(id, nombre, descripcion) values ($1, $2, $3)", [atributo.id, atributo.nombre, atributo.descripcion]);
        const insertarQuery = (0, index_1.insertarEntidad)(atributo, "atributo");
        results = await req.clienteDB.query(insertarQuery.query, insertarQuery.parametros);
        console.log(results);
    }
    catch (err) {
        console.error("error executing query:", err);
    }
    finally {
        req.clienteDB.release();
        res.json(results);
    }
}
