import {defineStore} from 'pinia';
import {API} from "aws-amplify";
import Ciudad from "layer/Entidades/Ciudad";

export const useCiudadStore = defineStore('ciudad', {
    state: () => {
        return {
            ciudadesPorUnidadAdmin: {} as { [key: string]: { ciudades: Ciudad[], expiration: Number } },
            ciudades: [] as Ciudad[]
        }
    },
    getters: {
        getCiudadesPorUnidadAdmin: (state): (state: any) => Ciudad[] => {
            return (unidadAdminId: string): Ciudad[] => {
                // console.log("unidadAdminId", unidadAdminId);
                if (state.ciudadesPorUnidadAdmin[unidadAdminId] === undefined) {
                    state.ciudadesPorUnidadAdmin[unidadAdminId] = {
                        ciudades: [],
                        expiration: 0
                    };
                }
                if (state.ciudadesPorUnidadAdmin[unidadAdminId].expiration <= Date.now()) {
                    API.get("umapi", `/ciudades/unidadadmin/${unidadAdminId}`, {}).then((unidadAdminQuery) => {
                        // console.log(unidadAdminQuery);
                        state.ciudadesPorUnidadAdmin[unidadAdminId].ciudades = unidadAdminQuery.map((ciudad: any) => {
                            return new Ciudad(ciudad);
                        });
                        state.ciudadesPorUnidadAdmin[unidadAdminId].expiration = Date.now() + 86400000;
                    });
                }
                return state.ciudadesPorUnidadAdmin[unidadAdminId].ciudades;
            }
        },
        getCiudadesPorUnidadAdminSorted() {
            const getCiudades: (unidadAdminId: string) => Ciudad[] = this.getCiudadesPorUnidadAdmin;
            return (unidadAdminId: string) => {
                const ciudades = getCiudades(unidadAdminId);
                return ciudades.sort((a: Ciudad, b: Ciudad) => {
                    return a.nombre.localeCompare(b.nombre);
                });
            }
        },
        getCiudadesOptions() {
            const getCiudades: (unidadAdminId: string) => Ciudad[] = this.getCiudadesPorUnidadAdminSorted;
            return (unidadAdminId: string) => {
                const ciudades: Ciudad[] = getCiudades(unidadAdminId);
                return ciudades.map((ciudad) => {
                    return {label: ciudad.nombre, value: ciudad}
                });
            }
        }
    },
    actions: {
        async updateCache() {
        }
    },
    persist: true
});
