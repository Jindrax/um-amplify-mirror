"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function registerController(app) {
    app.get('/atributos', obtenerTodosLosAtributos);
    app.get('/atributos/prioridad/:prioridad', obtenerTodasLasCategorias);
}
exports.default = registerController;
async function obtenerTodosLosAtributos(req, res) {
    let results;
    try {
        results = await req.clienteDB.query("SELECT * FROM atributo");
        console.log(results);
    }
    catch (err) {
        console.error("error executing query:", err);
    }
    finally {
        req.clienteDB.release();
        res.json(results.rows);
    }
}
async function obtenerTodasLasCategorias(req, res) {
    let results;
    try {
        results = await req.clienteDB.query("SELECT * FROM atributo WHERE prioridad = $1", [req.params.prioridad]);
        console.log(results);
    }
    catch (err) {
        console.error("error executing query:", err);
    }
    finally {
        req.clienteDB.release();
        res.json(results.rows);
    }
}
