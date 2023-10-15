// This file is used to override the REST API resources configuration
import {AmplifyApiRestResourceStackTemplate, AmplifyProjectInfo} from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyApiRestResourceStackTemplate, amplifyProjectInfo: AmplifyProjectInfo) {
    // resources.restApi.addPropertyOverride("Body.components.securitySchemes", {
    //     "api_key": {
    //         "type": "apiKey",
    //         "name": "x-api-key",
    //         "in": "header"
    //     },
    //     "sigv4": {
    //         "type": "apiKey",
    //         "name": "Authorization",
    //         "in": "header",
    //         "x-amazon-apigateway-authtype": "awsSigv4"
    //     }
    // });
    resources.restApi.addPropertyOverride("Body.securityDefinitions", {
        ...resources.restApi.body.securityDefinitions,
        "api_key": {
            "type": "apiKey",
            "name": "x-api-key",
            "in": "header"
        }
    });
    const frontendEndpoints = ["/query", "/national"];
    for (const path in resources.restApi.body.paths) {
        if (!frontendEndpoints.includes(path) && false) {
            resources.restApi.addPropertyOverride(
                `Body.paths.${path}.x-amazon-apigateway-any-method.security`,
                [{
                    "sigv4": []
                }, {
                    "api_key": []
                }]
            );
        } else {
            resources.restApi.addPropertyOverride(
                `Body.paths.${path}.x-amazon-apigateway-any-method.security`,
                [{
                    "api_key": []
                }]
            );
        }
    }
    resources.restApi.addPropertyOverride("Body.paths./query.x-amazon-apigateway-any-method.parameters", [
        {
            "name": "geohash",
            "in": "query",
            "schema": {
                "type": "string"
            }
        },
        {
            "name": "radio",
            "in": "query",
            "schema": {
                "type": "number"
            }
        },
        {
            "name": "categoria",
            "in": "query",
            "schema": {
                "type": "string"
            }
        },
        {
            "name": "page",
            "in": "query",
            "schema": {
                "type": "number"
            }
        },
        {
            "name": "pageSize",
            "in": "query",
            "schema": {
                "type": "number"
            }
        }
    ]);
    resources.restApi.addPropertyOverride("Body.paths./national.x-amazon-apigateway-any-method.parameters", [
        {
            "name": "categoria",
            "in": "query",
            "schema": {
                "type": "string"
            }
        },
        {
            "name": "page",
            "in": "query",
            "schema": {
                "type": "number"
            }
        },
        {
            "name": "pageSize",
            "in": "query",
            "schema": {
                "type": "number"
            }
        }
    ]);
}
