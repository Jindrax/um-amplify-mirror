import express from "express";
import bodyParser from "body-parser";
import awsServerlessExpressMiddleware from "aws-serverless-express/middleware";
import {actualizarEntidad, getCliente, insertarEntidad} from "/opt/nodejs/index";
import {PoolClient} from "pg";
import Empresa from "/opt/nodejs/Entidades/Empresa";
import PropuestaEdicionLocacion from "/opt/nodejs/Entidades/PropuestaEdicionLocacion";
import * as console from "console";
import Locacion from "/opt/nodejs/Entidades/Locacion";
import moment from "moment";


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

// Enable CORS for all methods
app.use(async function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers");
    req.clienteDB = await getCliente();
    next();
});

/**********************
 * Planes *
 **********************/

app.get('/empresas/br/planes', async function (req, res) {
    let results;
    try {
        results = await req.clienteDB!.query("SELECT * FROM planes WHERE activo = true ORDER BY orden ASC");
        console.log(results);
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json({success: results.rows, url: req.url});
    }
});

app.get('/empresas/br/planPioneros', async function (req, res) {
    let results;
    try {
        results = await req.clienteDB!.query("SELECT count(E.identificacion) FROM empresa E");
        console.log(results);

    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json({success: results, url: req.url});
    }
});


/**********************
 * Example get method *
 **********************/

app.get('/empresas', async function (req, res) {
    let results;
    try {
        results = await req.clienteDB!.query("select * from empresa");
        console.log(results);
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json({success: results, url: req.url});
    }
});

// app.get('/empresas/*', async function (req, res) {
//     res.json({success: 'get call succeed!', url: req.url});
// });

app.get('/empresas/identificacion', async function (req, res) {
    let results;
    try {
        results = await req.clienteDB!.query("SELECT * FROM empresa WHERE identificacion = $1", [req.query.identificacion]);
        console.log(results);
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json({success: results.rows, url: req.url});
    }
});

/****************************
 * Example post method *
 ****************************/

app.post('/empresas', async function (req, res) {
    let results;
    const empresa = new Empresa(req.body);
    try {
        const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
        const registerEmpresaParams = {
            UserPoolId: "us-east-1_UzGFYco3O",
            Username: empresa.email,
            UserAttributes: [
                {Name: "email", Value: empresa.email},
                {Name: "custom:razon_social", Value: empresa.razonsocial},
                {Name: "custom:nit", Value: empresa.identificacion}
            ]
        };
        const addUserToEmpresasParams = {
            GroupName: "empresas",
            UserPoolId: "us-east-1_UzGFYco3O",
            Username: empresa.email,
        };
        const empresaRegistrationResult = await cognitoIdentityServiceProvider.adminCreateUser(registerEmpresaParams).promise();
        const attributes: [{ Name: string, Value: string }] = empresaRegistrationResult.User.Attributes;
        empresa.cognitoid = attributes.find((attr) => attr.Name = "sub").Value;
        await cognitoIdentityServiceProvider.adminAddUserToGroup(addUserToEmpresasParams).promise();
        const insertarQuery = insertarEntidad(empresa, "empresa");
        results = await req.clienteDB!.query(insertarQuery.query, insertarQuery.parametros);
        console.log(results);
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json({success: results, url: req.url});
    }
});

app.get('/empresas/propuestas', async function (req, res) {
    let results;
    let params: any = req.query;
    console.log(params);
    try {
        if (params.agenteid) {
            results = await req.clienteDB!.query("SELECT * FROM propuestaedicionlocacion p WHERE p.agenteid = $1", [params.agenteid]);
            console.log(results);
        }
        if (params.empresaid) {
            results = await req.clienteDB!.query("SELECT * FROM propuestaedicionlocacion p WHERE p.empresaid = $1", [params.empresaid]);
            console.log(results);
        }
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json({success: results.rows, url: req.url});
    }
});

app.post('/empresas/propuesta', async function (req, res) {
    let results;
    try {
        const propuestaActualizacion = new PropuestaEdicionLocacion(req.body);
        const insertarQuery = insertarEntidad(propuestaActualizacion, "propuestaedicionlocacion");
        console.log(insertarQuery);
        results = await req.clienteDB!.query(insertarQuery.query, insertarQuery.parametros);
        console.log(results);
    } catch (err) {
        console.error("error executing query:", err);
    } finally {
        req.clienteDB!.release();
        res.json({success: results, url: req.url});
    }
});

app.post('/empresas/cobros', async function (req, res) {
    const {empresa, cobrototal, mesespago, locaciones, plan, mediopago} = req.body;
    const impuestoPorcentual = 0.19;
    const impuesto = cobrototal - (cobrototal / (1 + impuestoPorcentual));
    const empresaObject = await req.clienteDB!.query("SELECT * FROM empresa e WHERE e.identificacion = $1", [empresa]);
    const ordencobro = [
        empresa,
        cobrototal,
        impuesto,
        empresaObject.rows[0].agente,
        cobrototal - impuesto,
        new Date(),
        mesespago,
        plan,
        mediopago
    ];
    const orden = await req.clienteDB!.query("INSERT INTO ordencobro(empresa, cobrototal, impuesto, agente, comisionagente, fechapago, mesespago, plan, mediopago) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id", ordencobro);
    console.log(orden);
    const ordenId = orden.rows[0].id;
    for (let locacion of locaciones) {
        await req.clienteDB!.query("INSERT INTO locacionporordencobro(orden, locacion, ejecutado) VALUES ($1, $2, false)", [ordenId, locacion]);
    }
    res.json({
        ordenId
    });
});

app.get('/empresas/cobros/transferencias', async function (req, res) {
    try {
        const results = await req.clienteDB!.query("SELECT O.id, empresa, cobrototal, impuesto, concat_ws(' ', nombres, apellidos) AS agente, comisionagente, fechapago, mesespago, estado, plan, mediopago FROM ordencobro O LEFT JOIN agente A ON o.agente = A.id WHERE O.mediopago = 'transfer'");
        console.log(results);
        return res.json(results.rows);
    } catch (e) {
        console.log(e);
        return res.json([]);
    }
});

app.post('/empresas/pagos', async function (req, res) {
    try {
        console.log("Inicia la ejecucion del algoritmo");
        const {x_respuesta, x_id_factura, x_id_invoice} = req.query;
        if (x_respuesta === 'Aceptada') {
            //x_id_factura: codigo de la orden de cobro
            console.log("Es una transaccion aceptada");
            const ordenCobroRow = await req.clienteDB!.query("SELECT * FROM ordencobro O WHERE O.id = $1", [x_id_factura]);
            const ordenCobro = ordenCobroRow.rows[0];
            const locaciones = await req.clienteDB!.query("SELECT * FROM locacionporordencobro O WHERE O.orden = $1", [x_id_factura]);
            for (const locacionId of locaciones.rows) {
                console.log("Esta recorriendo las locaciones de la orden");
                console.log("LocacionID: " + locacionId.locacion);
                const locacionRow = await req.clienteDB!.query("SELECT * FROM locacion L WHERE L.id = $1", [locacionId.locacion]);
                console.log("Si esto no aparece aqui se esta reventando");
                const locacion: Locacion = locacionRow.rows[0];
                const pagoHasta = moment(locacion.pagohasta);
                const ahora = moment();
                let date = new Date();
                let lanzamiento = moment("20230707", "YYYYMMDD");
                if (ahora.isBefore(lanzamiento, "day")) {
                    lanzamiento.add("month", ordenCobro.mesespago);
                    date = lanzamiento.toDate();
                } else if (pagoHasta.isBefore(ahora, "day")) {
                    //El pago esta vencido
                    ahora.add("month", ordenCobro.mesespago);
                    date = ahora.toDate();
                } else {
                    pagoHasta.add("month", ordenCobro.mesespago);
                    date = pagoHasta.toDate();
                }
                console.log("Va a crear el ticket del agente");
                const ticket = await req.clienteDB!.query("INSERT INTO ticketagente(agenteid, fechaemision, comision, activo, emitidopor) VALUES ($1, $2, $3, $4, $5) RETURNING id", [ordenCobro.agente, new Date(), ordenCobro.comisionagente, true, ordenCobro.empresa]);
                console.log(ticket);
                console.log("Va a actualizar la locacion");
                await req.clienteDB!.query("UPDATE locacion SET pagohasta = $2 WHERE id = $1", [locacionId.locacion, date]);
                await req.clienteDB!.query("UPDATE locacionporordencobro SET ejecutado = true WHERE locacion = $1 AND orden = $2", [locacionId.locacion, x_id_factura]);
            }
            console.log("Va a actualizar el plan y la orden de cobro");
            await req.clienteDB!.query("UPDATE planes SET disponibilidad = disponibilidad - $1 WHERE titulo = $2", [locaciones.rowCount, ordenCobro.plan]);
            await req.clienteDB!.query("UPDATE ordencobro SET estado = 'Pagado' WHERE id = $1", [x_id_factura]);
        }
        res.json({
            success: true
        });
    } catch (e) {
        console.log("Capturando el error en pagos");
        console.log(e);
        res.json({
            success: true
        });
    }
});

app.post('/empresas/comision', async function (req, res) {
    const {agenteid, comision, emitidopor} = req.body;
    const ticket = await req.clienteDB!.query("INSERT INTO ticketagente(agenteid, fechaemision, comision, activo, emitidopor) VALUES ($1, $2, $3, $4, $5) RETURNING id", [agenteid, new Date(), comision, true, emitidopor]);
    res.json({
        success: true,
        ticket: ticket
    });
});

/****************************
 * Example put method *
 ****************************/

app.put('/empresas', function (req, res) {
    // Add your code here
    res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/empresas/*', function (req, res) {
    // Add your code here
    res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
 * Example delete method *
 ****************************/

app.delete('/empresas', function (req, res) {
    // Add your code here
    res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/empresas/*', function (req, res) {
    // Add your code here
    res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function () {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
export default app
