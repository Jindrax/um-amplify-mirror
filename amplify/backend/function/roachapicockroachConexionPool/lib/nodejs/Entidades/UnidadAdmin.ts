export default class UnidadAdmin {
    id: string;
    nombre: string;
    capitalstr: string;

    constructor({id, nombre, capitalstr}: { id?: string, nombre?: string, capitalstr?: string }) {
        this.id = id ? id : '';
        this.nombre = nombre ? nombre : '';
        this.capitalstr = capitalstr ? capitalstr : '';
    }

}