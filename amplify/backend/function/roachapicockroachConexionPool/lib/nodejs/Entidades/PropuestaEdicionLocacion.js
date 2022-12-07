"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PropuestaEdicionLocacion {
    constructor({ id, registrocambiosinfo, registrocambiosatributos, registrocambiosfotos, registrocambiovideo, ts, locacionid, agenteid, empresaid }) {
        this.id = id ? id : '';
        this.registrocambiosinfo = registrocambiosinfo ? registrocambiosinfo : {};
        this.registrocambiosatributos = registrocambiosatributos ? registrocambiosatributos : {
            add: [],
            remove: []
        };
        this.registrocambiosfotos = registrocambiosfotos ? registrocambiosfotos : {
            add: [],
            remove: []
        };
        this.registrocambiovideo = registrocambiovideo ? registrocambiovideo : "";
        this.ts = ts ? ts : new Date().toISOString();
        this.locacionid = locacionid ? locacionid : "";
        this.agenteid = agenteid ? agenteid : "";
        this.empresaid = empresaid ? empresaid : "";
    }
}
exports.default = PropuestaEdicionLocacion;
