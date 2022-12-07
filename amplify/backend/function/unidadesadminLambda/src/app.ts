import express from 'express';
import bodyParser from 'body-parser';
import awsServerlessExpressMiddleware from "aws-serverless-express/middleware";
import {PoolClient} from "pg";
import {getCliente} from "/opt/nodejs/index";
import getControllerRegister from "./Controllers/GET";
import postControllerRegister from "./Controllers/POST";
import putControllerRegister from "./Controllers/PUT";

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

getControllerRegister(app);
postControllerRegister(app);
putControllerRegister(app);

app.listen(3000, function () {
    console.log("App started")
});

module.exports = app
