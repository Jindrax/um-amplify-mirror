import {defineStore} from 'pinia';
import {API} from "aws-amplify";
import UnidadAdmin from "layer/Entidades/UnidadAdmin";

export const useUnidadAdminStore = defineStore('unidadAdmin', {
    state: () => {
        return {
            unidadesAdmin: [] as UnidadAdmin[],
            expiration: 0
        }
    },
    getters: {
        getUnidadesAdmin: (state): UnidadAdmin[] => {
            // if (state.expiration <= Date.now()) {
                API.get("umapi", "/unidadesadmin", {}).then((unidadAdminQuery) => {
                    state.unidadesAdmin = unidadAdminQuery.map((unidadAdmin: any) => {
                        return new UnidadAdmin(unidadAdmin);
                    });
                    state.expiration = Date.now() + 604800000;
                });
            // }
            return state.unidadesAdmin;
        },
        getUnidadesAdminSorted() {
            const unidadesAdmin: UnidadAdmin[] = this.getUnidadesAdmin;
            return unidadesAdmin.sort((a: UnidadAdmin, b: UnidadAdmin) => {
                return a.nombre.localeCompare(b.nombre);
            });
        },
        getUnidadesAdminOptions() {
            const unidadesAdmin: UnidadAdmin[] = this.getUnidadesAdminSorted;
            return unidadesAdmin.map((unidad) => {
                return {label: unidad.nombre, value: unidad}
            });
        }
    },
    actions: {
        async updateCache() {
        }
    },
    persist: true
});
