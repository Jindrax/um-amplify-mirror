export default class Empresa {
    identificacion: string;
    razonsocial: string;
    agente: string;
    email?: string;
    cognitoid?: string;

    constructor({
                    identificacion,
                    razonsocial,
                    agente,
                    email,
                    cognitoid
                }: { identificacion?: string, razonsocial?: string, agente?: string, email?: string, cognitoid?: string }) {
        this.identificacion = identificacion ? identificacion : '';
        this.razonsocial = razonsocial ? razonsocial : '';
        this.agente = agente ? agente : '';
        this.email = email ? email : "";
        this.cognitoid = cognitoid ? cognitoid : "";
    }

}