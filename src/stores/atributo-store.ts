import {defineStore} from 'pinia';
import {API} from "aws-amplify";
import Atributo from "layer/Entidades/Atributo";

export const useAtributoStore = defineStore('atributo', {
    state: () => ({
        atributos: [] as Atributo[],
        expiration: 0,
        editable: undefined as Atributo | undefined
    }),
    getters: {
        getAtributos: (state) => {
            if (state.expiration <= Date.now()) {
                API.get("umapi", "/atributos", {}).then((atributoQuery) => {
                    console.log(atributoQuery);
                    state.atributos = atributoQuery.map((atributo: any) => {
                        return new Atributo(atributo);
                    });
                    state.expiration = Date.now() + 300000;
                });
            }
            return state.atributos;
        },
        getAtributosOptions(): {label: string, value: Atributo}[] {
            const atributos: Atributo[] = this.getAtributos;
            return atributos.map(atributo => ({label: atributo.nombre, value: atributo}));
        }
    },
    actions: {
        async addAtributo(atributo: Atributo) {
            try {
                if (this.editable) {
                    const response = await API.put("umapi", "/atributos", {
                        body: atributo
                    });
                    if (response) {
                        const index = this.atributos.findIndex(atributoLocal => atributo.id === atributoLocal.id);
                        this.atributos[index] = atributo;
                        this.editable = undefined;
                        return "OK";
                    } else {
                        return "ERROR";
                    }
                } else {
                    const response = await API.post("umapi", "/atributos", {
                        body: atributo
                    });
                    if (response) {
                        this.atributos.push(atributo);
                        return "OK";
                    } else {
                        return "ERROR";
                    }
                }
            } catch (e) {
                console.log(e);
                return "ERROR";
            }
        },
        editAtributo(atributo: Atributo) {
            try {
                this.editable = atributo;
            } catch (e) {
                console.log(e);
            }
        },
        cancelEditAtributo() {
            try {
                this.editable = undefined;
            } catch (e) {
                console.log(e);
            }
        }
    },
    persist: true
});
