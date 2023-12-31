import express from 'express';
import bodyParser from 'body-parser';
import awsServerlessExpressMiddleware from "aws-serverless-express/middleware";
import {PoolClient} from "pg";
import {actualizarEntidad, getCliente} from "/opt/nodejs/index";
import Locacion from "/opt/nodejs/Entidades/Locacion";
import Atributo from "/opt/nodejs/Entidades/Atributo";
import ActualizarLocacion from "/opt/nodejs/Entidades/ActualizarLocacion";
import * as console from "console";
import GeoHash from "latlon-geohash";

declare global {
    namespace Express {
        interface Request {
            clienteDB?: PoolClient
        }
    }
}

const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

app.use(async function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers");
    req.clienteDB = await getCliente();
    next();
});

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

app.get('/locaciones', async function (req, res) {
    let results;
    try {
        results = await req.clienteDB!.query("SELECT * FROM locacion");
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json(shuffle(results.rows));
    }
});

app.get('/locaciones/agente/:agenteid', async function (req, res) {
    let results;
    try {
        results = await req.clienteDB!.query("SELECT * FROM locacion WHERE agente = $1", [req.params.agenteid]);
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json(results.rows);
    }
});

app.get('/locaciones/empresa/:nit', async function (req, res) {
    let results;
    try {
        results = await req.clienteDB!.query("SELECT * FROM locacion WHERE empresa = $1", [req.params.nit]);
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json(results.rows);
    }
});

app.get('/locaciones/admin', async function (req, res) {
    let results;
    try {
        results = await req.clienteDB!.query("SELECT * FROM locacion");
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json(results.rows);
    }
});

app.get('/locaciones/np-query', async function (req, res) {
    let results;
    let params: any = req.query;
    const pageSize: number = params.pageSize ? Number(params.pageSize) : 30;
    const offset: number = params.page ? Number(params.page) * pageSize : 0;
    let queryLimit: string = ` LIMIT ${pageSize} OFFSET ${offset}`;
    if (params.geohash) {
        const latlon = GeoHash.decode(params.geohash);
        params.latitud = latlon.lat;
        params.longitud = latlon.lon;
    }
    try {
        if (params.unidadadmin) {
            results = await req.clienteDB!.query("SELECT * FROM locacion WHERE unidadadmin = $1 AND video <> '{}' AND carpetaimagenes <> '[]' AND longitud <> 0 AND latitud <> 0" + queryLimit, [params.unidadadmin]);
        }
        if (params.ciudad) {
            results = await req.clienteDB!.query("SELECT * FROM locacion WHERE ciudad = $1 AND video <> '{}' AND carpetaimagenes <> '[]' AND longitud <> 0 AND latitud <> 0" + queryLimit, [params.ciudad]);
        }
        if (params.radio) {
            if (params.categoria) {
                results = await req.clienteDB!.query("SELECT * FROM locacion l WHERE ST_DistanceSphere(l.geom, ST_MakePoint($2 , $3)) <= $1 * 1000 AND $4 in (l.categoriamain, l.categoriasub) AND video <> '{}' AND carpetaimagenes <> '[]' AND longitud <> 0 AND latitud <> 0" + queryLimit, [params.radio, params.longitud, params.latitud, params.categoria]);
            } else {
                results = await req.clienteDB!.query("SELECT * FROM locacion l WHERE ST_DistanceSphere(l.geom, ST_MakePoint($2 , $3)) <= $1 * 1000 AND video <> '{}' AND carpetaimagenes <> '[]' AND longitud <> 0 AND latitud <> 0" + queryLimit, [params.radio, params.longitud, params.latitud]);
            }
        }
        if (params.categoria && params.radio === undefined) {
            results = await req.clienteDB!.query("SELECT * FROM locacion l WHERE (l.categoriamain = $1 OR l.categoriasub = $1) AND video <> '{}' AND carpetaimagenes <> '[]' AND longitud <> 0 AND latitud <> 0 ORDER BY l.likes;" + queryLimit, [params.categoria]);
        }
        if (params.locacionid) {
            results = await req.clienteDB!.query("SELECT * FROM locacion WHERE id = $1" + queryLimit, [params.locacionid]);
        }
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json(shuffle(results.rows));
    }
});

app.get('/locaciones/query', async function (req, res) {
    let results;
    let params: any = req.query;
    try {
        if (params.unidadadmin) {
            results = await req.clienteDB!.query("SELECT * FROM locacion WHERE unidadadmin = $1 AND video <> '{}' AND carpetaimagenes <> '[]' AND longitud <> 0 AND latitud <> 0", [params.unidadadmin]);
        }
        if (params.ciudad) {
            results = await req.clienteDB!.query("SELECT * FROM locacion WHERE ciudad = $1 AND video <> '{}' AND carpetaimagenes <> '[]' AND longitud <> 0 AND latitud <> 0", [params.ciudad]);
        }
        if (params.radio) {
            if (params.categoria) {
                results = await req.clienteDB!.query("SELECT * FROM locacion l WHERE ST_DistanceSphere(l.geom, ST_MakePoint($2 , $3)) <= $1 * 1000 AND $4 in (l.categoriamain, l.categoriasub) AND video <> '{}' AND carpetaimagenes <> '[]' AND longitud <> 0 AND latitud <> 0", [params.radio, params.longitud, params.latitud, params.categoria]);
            } else {
                results = await req.clienteDB!.query("SELECT * FROM locacion l WHERE ST_DistanceSphere(l.geom, ST_MakePoint($2 , $3)) <= $1 * 1000 AND video <> '{}' AND carpetaimagenes <> '[]' AND longitud <> 0 AND latitud <> 0", [params.radio, params.longitud, params.latitud]);
            }
        }
        if (params.categoria && params.radio === undefined) {
            results = await req.clienteDB!.query("SELECT * FROM locacion l WHERE (l.categoriamain = $1 OR l.categoriasub = $1) AND video <> '{}' AND carpetaimagenes <> '[]' AND longitud <> 0 AND latitud <> 0 ORDER BY l.likes;", [params.categoria]);
        }
        if (params.locacionid) {
            results = await req.clienteDB!.query("SELECT * FROM locacion WHERE id = $1", [params.locacionid]);
        }
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json(shuffle(results.rows));
    }
});


const categoriasTops = {
    Restaurantes: "aeea2eb2-f812-409f-afe7-48fa8a5ca0be",
    Gastrobares: "c95218c8-b65b-4033-9e72-ef7107175766",
    Miradores: "7a58d98f-9a6d-49f7-8f0a-07cc3a3b2318",
    Hoteles: "4329f705-e2e9-45ac-b019-6eeadcf3680a"
}

app.get('/locaciones/tops', async function (req, res) {
    let results: { title: string, data: any[] }[] = [];
    try {
        const top10 = await req.clienteDB!.query("SELECT * FROM locacion l ORDER BY l.likes, l.marcados LIMIT 10");
        results.push({title: "Top 10", data: top10.rows});
        for (let cat in categoriasTops) {
            const topCat = await req.clienteDB!.query("SELECT * FROM locacion l JOIN atributosporlocacion a ON l.id = a.locacionid WHERE a.atributoid = $1 ORDER BY l.likes LIMIT 10", [categoriasTops[cat]]);
            results.push({title: `Top 10 ${cat}`, data: topCat.rows});
        }
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json(results);
    }
});

const insertarEntidad: (entidad: any, tabla: string) => { query: string, parametros: any[] } = (entidad: any, tabla: string) => {
    const tupla = {
        query: "",
        parametros: [] as unknown[]
    };
    const llaves = Object.getOwnPropertyNames(entidad);
    let indexActual = 0;
    const entradas = Object.entries(entidad);
    const valores: any[] = [];
    let latitud = 0, longitud = 0;
    tupla.query = `INSERT INTO ${tabla}(${llaves.join(',')}) VALUES (${entradas.map((entrada)=>{
    if(entrada[0] === "latitud"){
      latitud = entrada[1] as number;
    }
    if(entrada[0] === "longitud"){
      longitud = entrada[1] as number;
    }
    if(entrada[0] === "geom"){
      return `ST_GeomFromText('POINT(${longitud} ${latitud})')`;
    }
    valores.push(entrada[1]);
    indexActual = indexActual + 1;
    return `\$${indexActual}`;
  }).join(',')})`;
    tupla.parametros = valores;
    return tupla;
}

function insertAtributos(atributos: Atributo[], locacionid: string) {
    let query = "INSERT INTO atributosporlocacion (locacionid, atributoid) VALUES ";
    const values = atributos.map((atributo) => {
        return `('${locacionid}', '${atributo.id}')`;
    });
    query = query + values.join(", ");
    return query;
}

app.post('/locaciones', async function (req, res) {
    let results;
    try {
        // const locacion = new Locacion(req.body);
        if (req.body.categoriasub === "") {
            delete req.body.categoriasub;
        }
        const insertarQuery = insertarEntidad(req.body, "locacion");
        console.log(insertarQuery);
        results = await req.clienteDB!.query(insertarQuery.query, insertarQuery.parametros);
        // const atributos = JSON.parse(locacion.atributos);
        // if (atributos.length > 0) {
        //     const insertarAtributosQuery = insertAtributos(JSON.parse(locacion.atributos), locacion.id);
        //     await req.clienteDB!.query(insertarAtributosQuery);
        // }
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json(results);
    }
});

app.post('/locaciones/reportar', async function (req, res) {
    let {locacionid} = req.body;
    try {
        await req.clienteDB!.query("INSERT INTO reporteslocaciones(locacionid, ts) VALUES ($1, $2)", [locacionid, new Date().toISOString()]);
    } catch (err) {
        console.error("error executing query:", err);
        req.clienteDB!.release();
        res.json({
            ...req.body,
            success: false,
            code: 500
        });
    } finally {
        req.clienteDB!.release();
        res.json({
            ...req.body,
            success: true,
            code: 200
        });
    }
});

app.post('/locaciones/video', async function (req, res) {
    let results;
    try {
        results = await req.clienteDB!.query("UPDATE locacion SET video = $1 WHERE id = $2", [req.body.video, req.body.id]);
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json(results);
    }
});

app.post('/locaciones/images', async function (req, res) {
    let results;
    try {
        results = await req.clienteDB!.query("UPDATE locacion SET carpetaimagenes = $1 WHERE id = $2 RETURNING *", [req.body.carpetaimagenes, req.body.id]);
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json(results);
    }
});

function adicionarAtributos(atributos: Atributo[], locacionid: string) {
    let query = "INSERT INTO atributosporlocacion (locacionid, atributoid) VALUES ";
    const values = atributos.map((atributo) => {
        return `('${locacionid}', '${atributo.id}')`;
    });
    query = query + values.join(", ");
    return query;
}

function removerAtributos(atributos: Atributo[], locacionid: string) {
    let query = "INSERT INTO atributosporlocacion (locacionid, atributoid) VALUES ";
    const values = atributos.map((atributo) => {
        return `('${locacionid}', '${atributo.id}')`;
    });
    query = query + values.join(", ");
    return query;
}

app.put('/locaciones', async function (req, res) {
    let results;
    try {
        const actualizarLocacion = new ActualizarLocacion(req.body);
        const actualizarQuery = actualizarEntidad(actualizarLocacion.cambios, `id = '${actualizarLocacion.id}'`, "locacion");
        results = await req.clienteDB!.query(actualizarQuery.query, actualizarQuery.parametros);
        if (actualizarLocacion.registroCambios.add.length > 0) {
            const adicionarAtributosQuery = adicionarAtributos(actualizarLocacion.registroCambios.add, actualizarLocacion.id);
            await req.clienteDB!.query(adicionarAtributosQuery);
        }
        if (actualizarLocacion.registroCambios.remove.length > 0) {
            const removerAtributosQuery = removerAtributos(actualizarLocacion.registroCambios.remove, actualizarLocacion.id);
            await req.clienteDB!.query(removerAtributosQuery);
        }
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json(results);
    }
});


interface MaterializarLikeRequest {
    locacionId: string
    likes: number
}

function materializarLikeQueryGenerator(request: MaterializarLikeRequest[]) {
    let query = "";
    for (let req of request) {
        query = query + `UPDATE locacion SET likes = likes + ${req.likes} WHERE id = '${req.locacionId}';`;
    }
    return query;
}

app.put('/locaciones/like/materializar', async function (req, res) {
    let results;
    try {
        results = await req.clienteDB!.query(materializarLikeQueryGenerator(req.body.request));
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json(results);
    }
});

// app.put('/locaciones/*', function (req, res) {
//     // Add your code here
//     res.json({success: 'put call succeed!', url: req.url, body: req.body})
// });
//
//

app.delete('/locaciones/admin/:id', async function (req, res) {
    let results;
    try {
        results = await req.clienteDB!.query("DELETE FROM locacion WHERE id = $1", [req.params.id]);
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json(results.rows);
    }
});

app.listen(3000, function () {
    console.log("App started")
});

module.exports = app
