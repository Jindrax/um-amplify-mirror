import express from "express";
import bodyParser from "body-parser";
import awsServerlessExpressMiddleware from "aws-serverless-express/middleware";
import {getCliente} from "/opt/nodejs/index";
import {PoolClient} from "pg";
import getRegisterController from "./Controllers/GET";
import postRegisterController from "./Controllers/POST";
import putRegisterController from "./Controllers/PUT";

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
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    req.clienteDB = await getCliente();
    next();
});

getRegisterController(app);
postRegisterController(app);
putRegisterController(app);

app.listen(3000, function () {
    console.log("App started")
});

export default app;
