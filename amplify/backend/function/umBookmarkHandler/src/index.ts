import {createClient} from "redis";

const redisClient = createClient({
    socket: {
        host: "um-markers-cache.2vr39r.ng.0001.use1.cache.amazonaws.com",
        port: 6379
    }
});

export const handler = async (event: any) => {
    try {
        const body = JSON.parse(event.body);
        if (body.id === undefined || body.id === null) {
            return {
                statusCode: "400",
                body: JSON.stringify({"error": "Argumentos faltantes"}),
                isBase64Encoded: false
            };
        }
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
        if (body.marcado == undefined) {
            body.marcado = true;
        }
        const response = {
            res: 0
        };
        if (body.marcado) {
            response.res = await redisClient.HINCRBY(body.id, "BOOKMARK", 1);
        } else {
            response.res = await redisClient.HINCRBY(body.id, "BOOKMARK", -1);
        }
        return {
            statusCode: "200",
            body: JSON.stringify(response),
            isBase64Encoded: false
        };
    } catch (e) {
        console.log(e);
        return {
            statusCode: "400",
            body: JSON.stringify({"error": "Petición invalida"}),
            isBase64Encoded: false
        };
    }
}