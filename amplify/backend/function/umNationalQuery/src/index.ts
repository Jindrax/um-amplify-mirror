import console from "console";
// @ts-ignore
import {actualizarEntidad, getCliente} from "/opt/nodejs/index";

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

const query = async function (event, context) {
    let results;
    let params: any = event.queryStringParameters;
    let pageSize: number = 30;
    let offset: number = 0;
    if (params) {
        pageSize = params.pageSize ? Number(params.pageSize) : 30;
        offset = params.page ? Number(params.page) * pageSize : 0;
    }
    let queryLimit: string = ` LIMIT ${pageSize} OFFSET ${offset}`;
    let clienteDB = undefined;
    try {
        clienteDB = await getCliente();
        if (params.categoria) {
            results = await clienteDB!.query("SELECT * FROM locacion l WHERE (l.categoriamain = $1 OR l.categoriasub = $1) AND video <> '{}' AND carpetaimagenes <> '[]' AND longitud <> 0 AND latitud <> 0 ORDER BY l.likes" + queryLimit, [params.categoria]);
        } else {
            results = await clienteDB!.query("SELECT * FROM locacion l WHERE video <> '{}' AND carpetaimagenes <> '[]' AND longitud <> 0 AND latitud <> 0 ORDER BY l.likes" + queryLimit, []);
        }
    } catch (err) {
        console.error("error executing query:", err);
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        };
    } finally {
        if (clienteDB != undefined) {
            clienteDB!.release();
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify(shuffle(results.rows)),
        headers: {
            "content-type": "application/json; charset=utf-8"
        }
    };
}

exports.handler = query;