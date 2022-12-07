import {Express, Request, Response} from "express";
import {actualizarEntidad} from "/opt/nodejs/index";

export default function registerController(app: Express) {
    app.put('/unidadesadmin', actualizarUnidadAdministrativa);
}

async function actualizarUnidadAdministrativa(req: Request, res: Response) {
    let results;
    try {
        // results = await req.clienteDB!.query("insert into atributo(id, nombre, descripcion) values ($1, $2, $3)", [atributo.id, atributo.nombre, atributo.descripcion]);
        const actualizarQuery = actualizarEntidad(req.body, `id = '${req.body.id}'`, "unidadadmin");
        results = await req.clienteDB!.query(actualizarQuery.query, actualizarQuery.parametros);
        console.log(results);
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json(results);
    }
}

