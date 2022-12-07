import {Express, Request, Response} from "express";
import {actualizarEntidad} from "/opt/nodejs/index";
import Locacion from "/opt/nodejs/Entidades/Locacion";

export default function registerController(app: Express) {
    app.put('/atributos', actualizarAtributo);
}

async function actualizarAtributo(req: Request, res: Response) {
    let results;
    try {
        const actualizarQuery = actualizarEntidad(req.body, `id = '${req.body.id}'`, "atributo");
        results = await req.clienteDB!.query(actualizarQuery.query, actualizarQuery.parametros);
        const locacionesAfectadas = (await req.clienteDB!.query("SELECT * FROM locacion l JOIN atributosporlocacion a ON l.id = a.locacionid WHERE a.atributoid = $1", [req.body.id])).rows.map((locacionRaw) => {
            return new Locacion(locacionRaw);
        });
        for (let locacion of locacionesAfectadas) {
            const atributoIndex = locacion.atributos.findIndex((atributo) => {
                return atributo.id === req.body.id;
            });
            const llaves = Object.getOwnPropertyNames(req.body);
            for (let llave of llaves) {
                locacion.atributos[atributoIndex][llave] = req.body[llave];
            }
            await req.clienteDB!.query("UPDATE locacion SET atributos = $1 WHERE id = $2", [JSON.stringify(locacion.atributos), locacion.id]);
        }
        console.log(results);
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json(results);
    }
}