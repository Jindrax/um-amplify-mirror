"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("/opt/nodejs/index");
function registerController(app) {
    app.put('/unidadesadmin', actualizarUnidadAdministrativa);
}
exports.default = registerController;
async function actualizarUnidadAdministrativa(req, res) {
    let results;
    try {
        // results = await req.clienteDB!.query("insert into atributo(id, nombre, descripcion) values ($1, $2, $3)", [atributo.id, atributo.nombre, atributo.descripcion]);
        const actualizarQuery = (0, index_1.actualizarEntidad)(req.body, `id = '${req.body.id}'`, "unidadadmin");
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
