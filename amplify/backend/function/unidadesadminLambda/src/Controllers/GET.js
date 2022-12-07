"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function registerController(app) {
    app.get('/unidadesadmin', obtenerTodasLasUnidadesAdministrativas);
    app.get('/unidadesadmin/tops', obtenerTopPorUnidadAdministrativa);
}
exports.default = registerController;
const categoriasTops = {
    Restaurantes: "aeea2eb2-f812-409f-afe7-48fa8a5ca0be",
    Gastrobares: "c95218c8-b65b-4033-9e72-ef7107175766",
    Miradores: "7a58d98f-9a6d-49f7-8f0a-07cc3a3b2318",
    Hoteles: "4329f705-e2e9-45ac-b019-6eeadcf3680a"
};
async function obtenerTodasLasUnidadesAdministrativas(req, res) {
    let results;
    try {
        results = await req.clienteDB.query("select * from unidadadmin");
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
async function obtenerTopPorUnidadAdministrativa(req, res) {
    let { unidadadminid } = req.query;
    let results = [];
    try {
        const top10 = await req.clienteDB.query("SELECT * FROM locacion l WHERE l.ciudad = $1 ORDER BY l.likes, l.marcados LIMIT 10", [unidadadminid]);
        results.push({ title: "Top 10", data: top10.rows });
        for (let cat in categoriasTops) {
            const topCat = await req.clienteDB.query("SELECT * FROM locacion l JOIN atributosporlocacion a ON l.id = a.locacionid WHERE a.atributoid = $1 AND l.unidadadmin = $2 ORDER BY l.likes LIMIT 10", [categoriasTops[cat], unidadadminid]);
            results.push({ title: `Top 10 ${cat}`, data: topCat.rows });
        }
    }
    catch (err) {
        console.error("error executing query:", err);
    }
    finally {
        req.clienteDB.release();
        res.json(results);
    }
}
