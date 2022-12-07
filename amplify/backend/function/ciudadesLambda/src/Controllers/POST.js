"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Ciudad_1 = __importDefault(require("/opt/nodejs/Entidades/Ciudad"));
const index_1 = require("/opt/nodejs/index");
function registerController(app) {
    app.post('/ciudades', crearCiudad);
    app.put('/ciudades', actualizarCiudad);
}
exports.default = registerController;
async function crearCiudad(req, res) {
    let results;
    const ciudad = new Ciudad_1.default(req.body);
    try {
        // results = await req.clienteDB!.query("insert into ciudad(id, nombre, descripcion) values ($1, $2, $3)", [ciudad.id, ciudad.nombre, ciudad.descripcion]);
        const insertarQuery = (0, index_1.insertarEntidad)(ciudad, "ciudad");
        results = await req.clienteDB.query(insertarQuery.query, insertarQuery.parametros);
        console.log(results);
    }
    catch (err) {
        console.error("error executing query:", err);
    }
    finally {
        req.clienteDB.release();
        res.json({ success: results, url: req.url });
    }
}
async function actualizarCiudad(req, res) {
    let results;
    try {
        const actualizarQuery = (0, index_1.actualizarEntidad)(req.body, `id = '${req.body.id}'`, "ciudad");
        results = await req.clienteDB.query(actualizarQuery.query, actualizarQuery.parametros);
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
