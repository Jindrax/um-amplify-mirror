import {createClient} from "redis";
import {Client} from "pg";

const redisClient = createClient({
    socket: {
        host: "um-markers-cache.2vr39r.ng.0001.use1.cache.amazonaws.com",
        port: 6379
    }
});

interface MaterializarRequest {
    locacionId: string
    likes?: number
    bookmarks?: number
}

function materializarLikeQueryGenerator(request: MaterializarRequest[]) {
    let query = "";
    for (let req of request) {
        query = query + `UPDATE locacion SET ${req.likes? "likes = likes + " + req.likes : ""}${req.likes && req.bookmarks? ", ": ""}${req.bookmarks? "marcados = marcados + " + req.bookmarks : ""} WHERE id = '${req.locacionId}';`;
    }
    return query;
}

export const handler = async (event: any) => {
    try {
        const pgClient = new Client({
            host: "um-postgre.cxhhi2k6xdsb.us-east-1.rds.amazonaws.com",
            user: "yayo",
            password: "Calle9#1G23",
            port: 5432,
            database: "um"
        });
        await pgClient.connect();
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
        const materializarRequest: MaterializarRequest[] = [];
        for await (const key of redisClient.scanIterator()) {
            const request: MaterializarRequest = {
                locacionId: key
            };
            const likes = await redisClient.HGET(key, "LIKE");
            if (likes !== undefined) {
                request.likes = Number(likes);
            }
            const bookmarks = await redisClient.HGET(key, "BOOKMARK");
            if (bookmarks !== undefined) {
                request.bookmarks = Number(bookmarks);
            }
            materializarRequest.push(request);
        }
        const query = materializarLikeQueryGenerator(materializarRequest);
        await pgClient!.query(query);
        for (let req of materializarRequest) {
            await redisClient.del(req.locacionId);
        }
        return {success: true}
    } catch (e) {
        return {error: e};
    }
}