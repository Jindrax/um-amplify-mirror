import Atributo from "./Atributo";

export interface RegistroCambiosAtributos {
    add: Atributo[];
    remove: Atributo[];
}

export interface CambioFoto {
    indice: number;
    url: string;
}

export interface RegistroCambiosFotos {
    add: CambioFoto[];
    remove: CambioFoto[];
}

export default class PropuestaEdicionLocacion {
    id: string;
    registrocambiosinfo: { [key: string]: any };
    registrocambiosatributos: RegistroCambiosAtributos;
    registrocambiosfotos: RegistroCambiosFotos;
    registrocambiovideo: string;
    ts: string;
    locacionid: string;
    agenteid: string;
    empresaid: string;

    constructor({
                    id,
                    registrocambiosinfo,
                    registrocambiosatributos,
                    registrocambiosfotos,
                    registrocambiovideo,
                    ts,
                    locacionid,
                    agenteid,
                    empresaid
                }: { id?: string, registrocambiosinfo?: { [key: string]: any }, registrocambiosatributos?: RegistroCambiosAtributos, registrocambiosfotos?: RegistroCambiosFotos, registrocambiovideo?: string, ts?: string, locacionid?: string, agenteid?: string, empresaid?: string }) {
        this.id = id ? id : '';
        this.registrocambiosinfo = registrocambiosinfo ? registrocambiosinfo : {};
        this.registrocambiosatributos = registrocambiosatributos ? registrocambiosatributos : {
            add: [],
            remove: []
        };
        this.registrocambiosfotos = registrocambiosfotos ? registrocambiosfotos : {
            add: [],
            remove: []
        }
        this.registrocambiovideo = registrocambiovideo ? registrocambiovideo : "";
        this.ts = ts ? ts : new Date().toISOString();
        this.locacionid = locacionid ? locacionid : "";
        this.agenteid = agenteid ? agenteid : "";
        this.empresaid = empresaid ? empresaid : "";
    }

}