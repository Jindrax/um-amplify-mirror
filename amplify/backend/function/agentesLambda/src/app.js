"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const middleware_1 = __importDefault(require("aws-serverless-express/middleware"));
const index_1 = require("/opt/nodejs/index");
const Agente_1 = __importDefault(require("/opt/nodejs/Entidades/Agente"));
const { CognitoIdentityServiceProvider } = require('aws-sdk');
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(middleware_1.default.eventContext());
app.use(async function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers");
    req.clienteDB = await (0, index_1.getCliente)();
    next();
});
app.get('/agentes', async function (req, res) {
    let results;
    try {
        results = await req.clienteDB.query("select * from agente");
        console.log(results);
    }
    catch (err) {
        console.error("error executing query:", err);
    }
    finally {
        req.clienteDB.release();
        res.json({ success: results, url: req.url });
    }
});
app.get('/agentes/*', function (req, res) {
    res.json({ success: 'get call succeed!', url: req.url });
});
app.post('/agentes', async function (req, res) {
    let results;
    const agente = new Agente_1.default(req.body);
    try {
        const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
        const registerAgenteParams = {
            UserPoolId: "us-east-1_UzGFYco3O",
            Username: agente.email,
            UserAttributes: [
                { Name: "email", Value: agente.email },
                { Name: "custom:nombres", Value: agente.nombres },
                { Name: "custom:apellidos", Value: agente.apellidos },
                { Name: "custom:cedula", Value: agente.cedula }
            ]
        };
        const addUserToAgentesParams = {
            GroupName: "agentes",
            UserPoolId: "us-east-1_UzGFYco3O",
            Username: agente.email,
        };
        const agenteRegistrationResult = await cognitoIdentityServiceProvider.adminCreateUser(registerAgenteParams).promise();
        const attributes = agenteRegistrationResult.User.Attributes;
        agente.id = attributes.find((attr) => attr.Name = "sub").Value;
        await cognitoIdentityServiceProvider.adminAddUserToGroup(addUserToAgentesParams).promise();
        const insertarQuery = (0, index_1.insertarEntidad)(agente, "agente");
        results = await req.clienteDB.query(insertarQuery.query, insertarQuery.parametros);
    }
    catch (err) {
        console.error("error executing query:", err);
    }
    finally {
        req.clienteDB.release();
        res.json({ success: results, url: req.url });
    }
});
app.post('/agentes/*', function (req, res) {
    // Add your code here
    res.json({ success: 'post call succeed!', url: req.url, body: req.body });
});
app.put('/agentes', function (req, res) {
    // Add your code here
    res.json({ success: 'put call succeed!', url: req.url, body: req.body });
});
app.put('/agentes/*', function (req, res) {
    // Add your code here
    res.json({ success: 'put call succeed!', url: req.url, body: req.body });
});
app.delete('/agentes', function (req, res) {
    // Add your code here
    res.json({ success: 'delete call succeed!', url: req.url });
});
app.delete('/agentes/*', function (req, res) {
    // Add your code here
    res.json({ success: 'delete call succeed!', url: req.url });
});
app.listen(3000, function () {
    console.log("App started");
});
exports.default = app;
