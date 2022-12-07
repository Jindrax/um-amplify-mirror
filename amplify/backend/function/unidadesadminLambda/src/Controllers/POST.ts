import {Express, Request, Response} from "express";
import UnidadAdmin from "/opt/nodejs/Entidades/UnidadAdmin";
import {insertarEntidad} from "/opt/nodejs/index";

export default function registerController(app: Express) {
    app.post('/unidadesadmin', crearUnidadAdministrativa);
}

async function crearUnidadAdministrativa(req: Request, res: Response) {
    let results;
    const unidadadmin = new UnidadAdmin(req.body);
    try {
        // results = await req.clienteDB!.query("insert into unidadadmin(id, nombre, descripcion) values ($1, $2, $3)", [unidadadmin.id, unidadadmin.nombre, unidadadmin.descripcion]);
        const insertarQuery = insertarEntidad(unidadadmin, "unidadadmin");
        results = await req.clienteDB!.query(insertarQuery.query, insertarQuery.parametros);
        console.log(results);
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json(results);
    }
}

