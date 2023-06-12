import express from "express";
import bodyParser from "body-parser";
import awsServerlessExpressMiddleware from "aws-serverless-express/middleware";
import {getCliente, insertarEntidad} from "/opt/nodejs/index";
import {PoolClient} from "pg";
import Agente from "/opt/nodejs/Entidades/Agente";

const {CognitoIdentityServiceProvider} = require('aws-sdk');

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

app.get('/agentes/info/:id', async function (req, res) {
    let results;
    try {
        results = await req.clienteDB!.query("SELECT (id, nombres, apellidos)  FROM agente a WHERE a.id = $1", [req.params.id]);
        console.log(results);
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json({success: results, url: req.url});
    }
});

app.get('/agentes', async function (req, res) {
    let results;
    try {
        results = await req.clienteDB!.query("select * from agente");
        console.log(results);
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json({success: results, url: req.url});
    }
});

//app.get('/agentes/*', function (req, res) {
//    res.json({success: 'get call succeed!', url: req.url});
//});

app.get('/agentes/comisionesActivas/:id', async function (req, res) {
    const results = await req.clienteDB!.query("SELECT * FROM ticketagente WHERE agenteid = $1 and activo = $2", [req.params.id, true]);
    res.json(results.rows);
});

app.get('/agentes/comisiones/:id', async function (req, res) {
    const results = await req.clienteDB!.query("SELECT * FROM ticketagente WHERE agenteid = $1", [req.params.id]);
    res.json(results.rows);
});

app.post('/agentes', async function (req, res) {
    let results;
    const agente = new Agente(req.body);
    try {
        const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
        const registerAgenteParams = {
            UserPoolId: "us-east-1_UzGFYco3O",
            Username: agente.email,
            UserAttributes: [
                {Name: "email", Value: agente.email},
                {Name: "custom:nombres", Value: agente.nombres},
                {Name: "custom:apellidos", Value: agente.apellidos},
                {Name: "custom:cedula", Value: agente.cedula}
            ]
        };
        const addUserToAgentesParams = {
            GroupName: "agentes",
            UserPoolId: "us-east-1_UzGFYco3O",
            Username: agente.email,
        };
        const agenteRegistrationResult = await cognitoIdentityServiceProvider.adminCreateUser(registerAgenteParams).promise();
        const attributes: [{ Name: string, Value: string }] = agenteRegistrationResult.User.Attributes;
        agente.id = attributes.find((attr) => attr.Name = "sub").Value;
        await cognitoIdentityServiceProvider.adminAddUserToGroup(addUserToAgentesParams).promise();
        const insertarQuery = insertarEntidad(agente, "agente");
        results = await req.clienteDB!.query(insertarQuery.query, insertarQuery.parametros);
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json({success: results, url: req.url});
    }
});

app.post('/agentes/*', function (req, res) {
    // Add your code here
    res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.put('/agentes', function (req, res) {
    // Add your code here
    res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/agentes/*', function (req, res) {
    // Add your code here
    res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.delete('/agentes', function (req, res) {
    // Add your code here
    res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/agentes/*', function (req, res) {
    // Add your code here
    res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function () {
    console.log("App started")
});

export default app;
