export default class Ciudad {
    id: string;
    nombre: string;
    unidadadminstr: string;
    significativo: boolean;
    unidadadmin: string | undefined;

    dane: string

    constructor({
                    id,
                    nombre,
                    unidadadminstr,
                    significativo,
                    unidadadmin,
                    dane
                }: { id?: string, nombre?: string, unidadadminstr?: string, significativo?: boolean, unidadadmin?: string, dane?: string }) {
        this.id = id ? id : '';
        this.nombre = nombre ? nombre : '';
        this.unidadadminstr = unidadadminstr ? unidadadminstr : '';
        this.significativo = significativo ? significativo : false;
        this.unidadadmin = unidadadmin ? unidadadmin : undefined;
        this.dane = dane ? dane : '';
    }

}