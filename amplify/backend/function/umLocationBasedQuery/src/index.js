"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = __importDefault(require("console"));
// @ts-ignore
const index_1 = require("/opt/nodejs/index");
const latlon_geohash_1 = __importDefault(require("latlon-geohash"));
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
    return array;
}
const queryDeprecated = async (event, context) => {
    let results;
    let params = event.queryStringParameters;
    let clienteDB = undefined;
    try {
        clienteDB = await (0, index_1.getCliente)();
        if (params.unidadadmin) {
            results = await clienteDB.query("SELECT * FROM locacion WHERE unidadadmin = $1 AND video <> '{}' AND carpetaimagenes <> '[]' AND longitud <> 0 AND latitud <> 0", [params.unidadadmin]);
        }
        if (params.ciudad) {
            results = await clienteDB.query("SELECT * FROM locacion WHERE ciudad = $1 AND video <> '{}' AND carpetaimagenes <> '[]' AND longitud <> 0 AND latitud <> 0", [params.ciudad]);
        }
        if (params.radio) {
            if (params.categoria) {
                results = await clienteDB.query("SELECT * FROM locacion l WHERE ST_DistanceSphere(l.geom, ST_MakePoint($2 , $3)) <= $1 * 1000 AND $4 in (l.categoriamain, l.categoriasub) AND video <> '{}' AND carpetaimagenes <> '[]' AND longitud <> 0 AND latitud <> 0", [params.radio, params.longitud, params.latitud, params.categoria]);
            }
            else {
                results = await clienteDB.query("SELECT * FROM locacion l WHERE ST_DistanceSphere(l.geom, ST_MakePoint($2 , $3)) <= $1 * 1000 AND video <> '{}' AND carpetaimagenes <> '[]' AND longitud <> 0 AND latitud <> 0", [params.radio, params.longitud, params.latitud]);
            }
        }
        if (params.categoria && params.radio === undefined) {
            results = await clienteDB.query("SELECT * FROM locacion l WHERE (l.categoriamain = $1 OR l.categoriasub = $1) AND video <> '{}' AND carpetaimagenes <> '[]' AND longitud <> 0 AND latitud <> 0 ORDER BY l.likes;", [params.categoria]);
        }
        if (params.locacionid) {
            results = await clienteDB.query("SELECT * FROM locacion WHERE id = $1", [params.locacionid]);
        }
    }
    catch (err) {
        console_1.default.error("error executing query:", err);
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        };
    }
    finally {
        if (clienteDB != undefined) {
            clienteDB.release();
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify(shuffle(results.rows))
    };
};
const query = async function (event, context) {
    let results;
    let params = event.queryStringParameters;
    let pageSize = 30;
    let offset = 0;
    if (params) {
        pageSize = params.pageSize ? Number(params.pageSize) : 30;
        offset = params.page ? Number(params.page) * pageSize : 0;
    }
    else {
        return {
            statusCode: 400,
            body: "BAD REQUEST QUERY PARAMS NOT PRESENT"
        };
    }
    let queryLimit = ` LIMIT ${pageSize} OFFSET ${offset}`;
    if (params.geohash) {
        const latlon = latlon_geohash_1.default.decode(params.geohash);
        params.latitud = latlon.lat;
        params.longitud = latlon.lon;
        console_1.default.info(`Geohash decoded {lat:${latlon.lat}, long:${latlon.lon}}`);
    }
    let clienteDB = undefined;
    try {
        clienteDB = await (0, index_1.getCliente)();
        if (params.unidadadmin) {
            results = await clienteDB.query("SELECT * FROM locacion WHERE unidadadmin = $1 AND video <> '{}' AND carpetaimagenes <> '[]' AND longitud <> 0 AND latitud <> 0" + queryLimit, [params.unidadadmin]);
        }
        if (params.ciudad) {
            results = await clienteDB.query("SELECT * FROM locacion WHERE ciudad = $1 AND video <> '{}' AND carpetaimagenes <> '[]' AND longitud <> 0 AND latitud <> 0" + queryLimit, [params.ciudad]);
        }
        if (params.radio) {
            if (params.categoria) {
                results = await clienteDB.query("SELECT * FROM locacion l WHERE ST_DistanceSphere(l.geom, ST_MakePoint($2 , $3)) <= $1 * 1000 AND $4 in (l.categoriamain, l.categoriasub) AND video <> '{}' AND carpetaimagenes <> '[]' AND longitud <> 0 AND latitud <> 0" + queryLimit, [params.radio, params.longitud, params.latitud, params.categoria]);
            }
            else {
                results = await clienteDB.query("SELECT * FROM locacion l WHERE ST_DistanceSphere(l.geom, ST_MakePoint($2 , $3)) <= $1 * 1000 AND video <> '{}' AND carpetaimagenes <> '[]' AND longitud <> 0 AND latitud <> 0" + queryLimit, [params.radio, params.longitud, params.latitud]);
            }
        }
        if (params.locacionid) {
            results = await clienteDB.query("SELECT * FROM locacion WHERE id = $1" + queryLimit, [params.locacionid]);
        }
    }
    catch (err) {
        console_1.default.error("error executing query:", err);
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        };
    }
    finally {
        if (clienteDB != undefined) {
            clienteDB.release();
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify(shuffle(results.rows)),
        headers: {
            "content-type": "application/json; charset=utf-8"
        }
    };
};
exports.handler = query;
