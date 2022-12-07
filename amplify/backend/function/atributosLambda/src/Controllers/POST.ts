import {Express, Request, Response} from "express";
import Atributo from "/opt/nodejs/Entidades/Atributo";
import {insertarEntidad} from "/opt/nodejs/index";

export default function registerController(app: Express) {
    app.post('/atributos', crearAtributo);
}

async function crearAtributo(req: Request, res: Response) {
    let results;
    const atributo = new Atributo(req.body);
    try {
        // results = await req.clienteDB!.query("insert into atributo(id, nombre, descripcion) values ($1, $2, $3)", [atributo.id, atributo.nombre, atributo.descripcion]);
        const insertarQuery = insertarEntidad(atributo, "atributo");
        results = await req.clienteDB!.query(insertarQuery.query, insertarQuery.parametros);
        console.log(results);
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json(results);
    }
}