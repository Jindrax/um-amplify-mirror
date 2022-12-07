import {Express, Request, Response} from "express";
import Ciudad from "/opt/nodejs/Entidades/Ciudad";
import {actualizarEntidad, insertarEntidad} from "/opt/nodejs/index";

export default function registerController(app: Express) {
    app.post('/ciudades', crearCiudad);
    app.put('/ciudades', actualizarCiudad);
}

async function crearCiudad(req: Request, res: Response) {
    let results;
    const ciudad = new Ciudad(req.body);
    try {
        // results = await req.clienteDB!.query("insert into ciudad(id, nombre, descripcion) values ($1, $2, $3)", [ciudad.id, ciudad.nombre, ciudad.descripcion]);
        const insertarQuery = insertarEntidad(ciudad, "ciudad");
        results = await req.clienteDB!.query(insertarQuery.query, insertarQuery.parametros);
        console.log(results);
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json({success: results, url: req.url});
    }
}

async function actualizarCiudad(req: Request, res: Response) {
    let results;
    try {
        const actualizarQuery = actualizarEntidad(req.body, `id = '${req.body.id}'`, "ciudad");
        results = await req.clienteDB!.query(actualizarQuery.query, actualizarQuery.parametros);
        console.log(results);
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json(results);
    }
}