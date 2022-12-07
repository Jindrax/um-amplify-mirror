"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UnidadAdmin_1 = __importDefault(require("/opt/nodejs/Entidades/UnidadAdmin"));
const index_1 = require("/opt/nodejs/index");
function registerController(app) {
    app.post('/unidadesadmin', crearUnidadAdministrativa);
}
exports.default = registerController;
async function crearUnidadAdministrativa(req, res) {
    let results;
    const unidadadmin = new UnidadAdmin_1.default(req.body);
    try {
        // results = await req.clienteDB!.query("insert into unidadadmin(id, nombre, descripcion) values ($1, $2, $3)", [unidadadmin.id, unidadadmin.nombre, unidadadmin.descripcion]);
        const insertarQuery = (0, index_1.insertarEntidad)(unidadadmin, "unidadadmin");
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
