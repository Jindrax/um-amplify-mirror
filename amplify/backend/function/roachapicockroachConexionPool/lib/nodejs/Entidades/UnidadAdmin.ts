export default class UnidadAdmin {
    id: string;
    nombre: string;
    capitalstr: string;
    dane: string;

    constructor({id, nombre, capitalstr, dane}: { id?: string, nombre?: string, capitalstr?: string, dane?: string }) {
        this.id = id ? id : '';
        this.nombre = nombre ? nombre : '';
        this.capitalstr = capitalstr ? capitalstr : '';
        this.dane = dane ? dane : '';
    }

}