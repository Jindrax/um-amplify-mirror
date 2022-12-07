"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const middleware_1 = __importDefault(require("aws-serverless-express/middleware"));
const index_1 = require("/opt/nodejs/index");
const Empresa_1 = __importDefault(require("/opt/nodejs/Entidades/Empresa"));
const PropuestaEdicionLocacion_1 = __importDefault(require("/opt/nodejs/Entidades/PropuestaEdicionLocacion"));
const { CognitoIdentityServiceProvider } = require('aws-sdk');
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(middleware_1.default.eventContext());
// Enable CORS for all methods
app.use(async function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers");
    req.clienteDB = await (0, index_1.getCliente)();
    next();
});
/**********************
 * Example get method *
 **********************/
app.get('/empresas', async function (req, res) {
    let results;
    try {
        results = await req.clienteDB.query("select * from empresa");
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
// app.get('/empresas/*', async function (req, res) {
//     res.json({success: 'get call succeed!', url: req.url});
// });
app.get('/empresas/identificacion', async function (req, res) {
    let results;
    try {
        results = await req.clienteDB.query("SELECT * FROM empresa WHERE identificacion = $1", [req.query.identificacion]);
        console.log(results);
    }
    catch (err) {
        console.error("error executing query:", err);
    }
    finally {
        req.clienteDB.release();
        res.json({ success: results.rows, url: req.url });
    }
});
/****************************
 * Example post method *
 ****************************/
app.post('/empresas', async function (req, res) {
    let results;
    const empresa = new Empresa_1.default(req.body);
    try {
        const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
        const registerEmpresaParams = {
            UserPoolId: "us-east-1_UzGFYco3O",
            Username: empresa.email,
            UserAttributes: [
                { Name: "email", Value: empresa.email },
                { Name: "custom:razon_social", Value: empresa.razonsocial },
                { Name: "custom:nit", Value: empresa.identificacion }
            ]
        };
        const addUserToEmpresasParams = {
            GroupName: "empresas",
            UserPoolId: "us-east-1_UzGFYco3O",
            Username: empresa.email,
        };
        const empresaRegistrationResult = await cognitoIdentityServiceProvider.adminCreateUser(registerEmpresaParams).promise();
        const attributes = empresaRegistrationResult.User.Attributes;
        empresa.cognitoid = attributes.find((attr) => attr.Name = "sub").Value;
        await cognitoIdentityServiceProvider.adminAddUserToGroup(addUserToEmpresasParams).promise();
        const insertarQuery = (0, index_1.insertarEntidad)(empresa, "empresa");
        results = await req.clienteDB.query(insertarQuery.query, insertarQuery.parametros);
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
app.get('/empresas/propuestas', async function (req, res) {
    let results;
    let params = req.query;
    console.log(params);
    try {
        if (params.agenteid) {
            results = await req.clienteDB.query("SELECT * FROM propuestaedicionlocacion p WHERE p.agenteid = $1", [params.agenteid]);
            console.log(results);
        }
        if (params.empresaid) {
            results = await req.clienteDB.query("SELECT * FROM propuestaedicionlocacion p WHERE p.empresaid = $1", [params.empresaid]);
            console.log(results);
        }
    }
    catch (err) {
        console.error("error executing query:", err);
    }
    finally {
        req.clienteDB.release();
        res.json({ success: results.rows, url: req.url });
    }
});
app.post('/empresas/propuesta', async function (req, res) {
    let results;
    try {
        const propuestaActualizacion = new PropuestaEdicionLocacion_1.default(req.body);
        const insertarQuery = (0, index_1.insertarEntidad)(propuestaActualizacion, "propuestaedicionlocacion");
        console.log(insertarQuery);
        results = await req.clienteDB.query(insertarQuery.query, insertarQuery.parametros);
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
app.post('/empresas/*', function (req, res) {
    // Add your code here
    res.json({ success: 'post call succeed!', url: req.url, body: req.body });
});
/****************************
 * Example put method *
 ****************************/
app.put('/empresas', function (req, res) {
    // Add your code here
    res.json({ success: 'put call succeed!', url: req.url, body: req.body });
});
app.put('/empresas/*', function (req, res) {
    // Add your code here
    res.json({ success: 'put call succeed!', url: req.url, body: req.body });
});
/****************************
 * Example delete method *
 ****************************/
app.delete('/empresas', function (req, res) {
    // Add your code here
    res.json({ success: 'delete call succeed!', url: req.url });
});
app.delete('/empresas/*', function (req, res) {
    // Add your code here
    res.json({ success: 'delete call succeed!', url: req.url });
});
app.listen(3000, function () {
    console.log("App started");
});
// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
exports.default = app;
