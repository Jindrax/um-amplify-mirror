"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("/opt/nodejs/index");
const Locacion_1 = __importDefault(require("/opt/nodejs/Entidades/Locacion"));
function registerController(app) {
    app.put('/atributos', actualizarAtributo);
}
exports.default = registerController;
async function actualizarAtributo(req, res) {
    let results;
    try {
        const actualizarQuery = (0, index_1.actualizarEntidad)(req.body, `id = '${req.body.id}'`, "atributo");
        results = await req.clienteDB.query(actualizarQuery.query, actualizarQuery.parametros);
        const locacionesAfectadas = (await req.clienteDB.query("SELECT * FROM locacion l JOIN atributosporlocacion a ON l.id = a.locacionid WHERE a.atributoid = $1", [req.body.id])).rows.map((locacionRaw) => {
            return new Locacion_1.default(locacionRaw);
        });
        for (let locacion of locacionesAfectadas) {
            const atributoIndex = locacion.atributos.findIndex((atributo) => {
                return atributo.id === req.body.id;
            });
            const llaves = Object.getOwnPropertyNames(req.body);
            for (let llave of llaves) {
                locacion.atributos[atributoIndex][llave] = req.body[llave];
            }
            await req.clienteDB.query("UPDATE locacion SET atributos = $1 WHERE id = $2", [JSON.stringify(locacion.atributos), locacion.id]);
        }
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
