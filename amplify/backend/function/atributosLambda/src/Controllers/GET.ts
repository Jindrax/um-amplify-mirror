import {Express, Request, Response} from "express";

export default function registerController(app: Express) {
    app.get('/atributos', obtenerTodosLosAtributos);
    app.get('/atributos/prioridad/:prioridad', obtenerTodasLasCategorias);
}

async function obtenerTodosLosAtributos(req: Request, res: Response) {
    let results;
    try {
        results = await req.clienteDB!.query("SELECT * FROM atributo");
        console.log(results);
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json(results.rows);
    }
}

async function obtenerTodasLasCategorias(req: Request, res: Response) {
    let results;
    try {
        results = await req.clienteDB!.query("SELECT * FROM atributo WHERE prioridad = $1", [req.params.prioridad]);
        console.log(results);
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json(results.rows);
    }
}