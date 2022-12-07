export default class ActualizarAgente {
    id: string;
    cambios: { [key: string]: any };

    constructor({
                    id,
                    cambios
                }: { id: string, cambios?: { [key: string]: any } }) {
        this.id = id ? id : '';
        this.cambios = cambios ? cambios : {};
    }

}