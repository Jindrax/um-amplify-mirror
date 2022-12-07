import {defineStore, storeToRefs} from 'pinia';
import Locacion from "layer/Entidades/Locacion";
import {API} from "aws-amplify";
import ActualizarLocacion from "layer/Entidades/ActualizarLocacion";

import {useSessionStore} from "./session-store";
import Agente from "layer/Entidades/Agente";

const {isAdmin} = storeToRefs(useSessionStore());

export const useLocacionStore = defineStore('locacion', {
    state: () => ({
        locaciones: [] as Locacion[],
        expiration: 0,
        locacionEditable: new Locacion({})
    }),
    getters: {
        getLocaciones: state => {
            return (agenteId: string) => {
                if (state.expiration <= Date.now()) {
                    if (isAdmin.value) {
                        API.get("umapi", `/locaciones/admin`, {}).then((locacionQuery) => {
                            state.locaciones = locacionQuery.map((locacion: any) => {
                                return new Locacion(locacion);
                            });
                            state.expiration = Date.now() + 5000;
                        });
                    } else {
                        if (agenteId !== "" && state.expiration <= Date.now()) {
                            API.get("umapi", `/locaciones/agente/${agenteId}`, {}).then((locacionQuery) => {
                                state.locaciones = locacionQuery.map((locacion: any) => {
                                    return new Locacion(locacion);
                                });
                                state.expiration = Date.now() + 5000;
                            });
                        }
                    }
                }
                return state.locaciones;
            }
        },
        getLocacionEditable: (state) => {
            return state.locacionEditable;
        }
    },
    actions: {
        async addLocacion(locacion: Locacion) {
            try {
                locacion.perfilessociales = JSON.stringify(locacion.perfilessociales);
                locacion.carpetaimagenes = JSON.stringify(locacion.carpetaimagenes);
                locacion.video = JSON.stringify(locacion.video);
                locacion.horario = JSON.stringify(locacion.horario);
                locacion.atributos = JSON.stringify(locacion.atributos);
                const response = await API.post("umapi", "/locaciones", {
                    body: locacion
                });
                if (response) {
                    this.locaciones.push(locacion);
                    return "OK";
                } else {
                    return "ERROR";
                }
            } catch (e) {
                console.log(e);
                return "ERROR";
            }
        },
        async editLocacion(locacion: Locacion) {
            this.locacionEditable = locacion;
        },
        async updateImagesLocacion(carpetaImagenes: { [key: string]: string }[]) {
            const updatedEditable = await API.post("umapi", "/locaciones/images", {
                body: {
                    id: this.locacionEditable.id,
                    carpetaimagenes: JSON.stringify(carpetaImagenes)
                }
            });
            const updatedLocacion = new Locacion(updatedEditable[0]);
            this.editLocacion(updatedLocacion);
        },
        async updateLocacion(actualizarLocacion: ActualizarLocacion) {
            try {
                const response = await API.put("umapi", "/locaciones", {
                    body: actualizarLocacion
                });
                const locacionActualizada = new Locacion(response[0]);
                const indiceLocacion = this.locaciones.findIndex(locacion => locacion.id === actualizarLocacion.id);
                this.locaciones[indiceLocacion] = locacionActualizada;
                this.locacionEditable = locacionActualizada;
            } catch (e) {
                console.log(e);
            }
        },
        async deleteLocacion(locacionID: string) {
            try {
                const response = await API.del("umapi", `/locaciones/admin/${locacionID}`, {});
                const indiceLocacion = this.locaciones.findIndex(locacion => locacion.id === locacionID);
                this.locaciones.splice(indiceLocacion, 1);
            } catch (e) {
                console.log(e);
            }
        },
        reset() {
            this.locaciones = [];
            this.expiration = 0;
            this.locacionEditable = new Locacion({});
        }
    },
    persist: true
});
