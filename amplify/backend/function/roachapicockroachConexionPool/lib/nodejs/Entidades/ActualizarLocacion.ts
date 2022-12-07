import Atributo from "./Atributo";

export interface RegistroCambiosAtributos {
    add: Atributo[];
    remove: Atributo[];
}

export default class ActualizarLocacion {
    id: string;
    cambios: { [key: string]: any };
    registroCambios: RegistroCambiosAtributos;

    constructor({
                    id,
                    cambios,
                    registroCambios
                }: { id: string, cambios?: { [key: string]: any }, registroCambios?: RegistroCambiosAtributos }) {
        this.id = id ? id : '';
        this.cambios = cambios ? cambios : {};
        this.registroCambios = registroCambios ? registroCambios : {
            add: [],
            remove: []
        };
    }

}