import awsServerlessExpress from "aws-serverless-express";
import app from "./app";

const server = awsServerlessExpress.createServer(app);

export const handler = (event:any, context:any) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};