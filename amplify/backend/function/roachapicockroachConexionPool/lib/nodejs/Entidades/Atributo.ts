export default class Atributo {
    id: string;
    nombre: string;
    descripcion: string;
    prioridad: number;
    icono: string;
    csscolor: string;
    imagen?: string;

    constructor({
                    id,
                    nombre,
                    descripcion,
                    prioridad,
                    icono,
                    csscolor,
                    imagen
                }: { id?: string, nombre?: string, descripcion?: string, prioridad?: number, icono?: string, csscolor?: string, imagen?: string }) {
        this.id = id ? id : '';
        this.nombre = nombre ? nombre : '';
        this.descripcion = descripcion ? descripcion : '';
        this.prioridad = prioridad ? prioridad : 3;
        this.icono = icono ? icono : '';
        this.csscolor = csscolor ? csscolor : '#000000';
        if(prioridad == 1){
            this.imagen = imagen ? imagen : "";
        }
    }
}