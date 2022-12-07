"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const middleware_1 = __importDefault(require("aws-serverless-express/middleware"));
const index_1 = require("/opt/nodejs/index");
const GET_1 = __importDefault(require("./Controllers/GET"));
const POST_1 = __importDefault(require("./Controllers/POST"));
const PUT_1 = __importDefault(require("./Controllers/PUT"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(middleware_1.default.eventContext());
app.use(async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    req.clienteDB = await (0, index_1.getCliente)();
    next();
});
(0, GET_1.default)(app);
(0, POST_1.default)(app);
(0, PUT_1.default)(app);
app.listen(3000, function () {
    console.log("App started");
});
exports.default = app;
