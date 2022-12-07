import Atributo from "./Atributo";

export default class Categoria {
    id: string;
    nombre: string;
    descripcion: string;

    constructor({
                    id,
                    nombre,
                    descripcion
                }: { id?: string, nombre?: string, descripcion?: string }) {
        this.id = id ? id : '';
        this.nombre = nombre ? nombre : '';
        this.descripcion = descripcion ? descripcion : '';
    }

}