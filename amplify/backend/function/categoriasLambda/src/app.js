"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const middleware_1 = __importDefault(require("aws-serverless-express/middleware"));
const index_1 = require("/opt/nodejs/index");
const Categoria_1 = __importDefault(require("/opt/nodejs/Entidades/Categoria"));
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
/**********************
 * Example get method *
 **********************/
app.get('/categorias', async function (req, res) {
    let results;
    try {
        results = await req.clienteDB.query("SELECT * FROM categoria");
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
app.get('/categorias/*', function (req, res) {
    // Add your code here
    res.json({ success: 'get call succeed!', url: req.url });
});
/****************************
 * Example post method *
 ****************************/
app.post('/categorias', async function (req, res) {
    let results;
    const categoria = new Categoria_1.default(req.body);
    try {
        // results = await req.clienteDB!.query("insert into categoria(id, nombre, descripcion) values ($1, $2, $3)", [categoria.id, categoria.nombre, categoria.descripcion]);
        const insertarQuery = (0, index_1.insertarEntidad)(categoria, "categoria");
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
app.post('/categorias/*', function (req, res) {
    // Add your code here
    res.json({ success: 'post call succeed!', url: req.url, body: req.body });
});
/****************************
 * Example put method *
 ****************************/
app.put('/categorias', async function (req, res) {
    let results;
    try {
        // results = await req.clienteDB!.query("insert into atributo(id, nombre, descripcion) values ($1, $2, $3)", [atributo.id, atributo.nombre, atributo.descripcion]);
        const actualizarQuery = (0, index_1.actualizarEntidad)(req.body, `id = '${req.body.id}'`, "categoria");
        results = await req.clienteDB.query(actualizarQuery.query, actualizarQuery.parametros);
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
app.put('/categorias/*', function (req, res) {
    // Add your code here
    res.json({ success: 'put call succeed!', url: req.url, body: req.body });
});
/****************************
 * Example delete method *
 ****************************/
app.delete('/categorias', function (req, res) {
    // Add your code here
    res.json({ success: 'delete call succeed!', url: req.url });
});
app.delete('/categorias/*', function (req, res) {
    // Add your code here
    res.json({ success: 'delete call succeed!', url: req.url });
});
app.listen(3000, function () {
    console.log("App started");
});
// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
