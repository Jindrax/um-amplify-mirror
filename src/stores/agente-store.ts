import {defineStore} from 'pinia';
import {API} from "aws-amplify";
import Agente from "layer/Entidades/Agente";
import ActualizarAgente from "layer/Entidades/ActualizarAgente";

export const useAgenteStore = defineStore('agente', {
    state: () => ({
        agentes: [] as Agente[],
        expiration: 0,
        agenteEditable: new Agente({})
    }),
    getters: {
        getAgentes: state => {
            if (state.expiration <= Date.now()) {
                API.get("umapi", "/agentes", {}).then((agenteQuery) => {
                    state.agentes = agenteQuery.success.rows.map((agente: any) => {
                        return new Agente(agente);
                    });
                    state.expiration = Date.now() + 30000;
                    console.log(agenteQuery);
                });
            }
            console.log(state.agentes);
            return state.agentes;
        },
        getLocacionEditable: (state) => {
            return state.agenteEditable;
        }
    },
    actions: {
        async addAgente(agente: Agente) {
            try {
                const response = await API.post("umapi", "/agentes", {
                    body: agente
                });
                if (response.success) {
                    this.agentes.push(agente);
                    return "OK";
                } else {
                    return "ERROR";
                }
            } catch (e) {
                console.log(e);
                return "ERROR";
            }
        },
        editAgente(agente: Agente) {
            this.agenteEditable = agente;
        },
        async updateAgente(actualizarLocacion: ActualizarAgente) {
            try {
                const response = await API.put("umapi", "/agentes", {
                    body: actualizarLocacion
                });
                const agenteActualizado = new Agente(response.success.rows[0]);
                const indiceAgente = this.agentes.findIndex(agente => agente.id === actualizarLocacion.id);
                this.agentes[indiceAgente] = agenteActualizado;
                this.agenteEditable = agenteActualizado;
            } catch (e) {
                console.log(e);
            }
        }
    },
    persist: true
});
