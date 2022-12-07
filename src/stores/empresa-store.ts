import {defineStore} from 'pinia';
import Locacion from "layer/Entidades/Locacion";
import {API} from "aws-amplify";
import Empresa from "layer/Entidades/Empresa";

export const useEmpresaStore = defineStore('empresa', {
    state: () => ({
        empresas: [] as Empresa[],
        empresasIndex: {} as { [key: string]: Empresa }
    }),
    getters: {
        getEmpresas: state => {
            return state.empresas;
        }
    },
    actions: {
        async addEmpresa(empresa: Empresa) {
            try {
                const response = await API.post("umapi", "/empresas", {
                    body: empresa
                });
                if (response.success) {
                    this.empresas.push(empresa);
                    this.empresasIndex[empresa.identificacion] = empresa;
                    return "OK";
                } else {
                    return "ERROR";
                }
            } catch (e) {
                console.log(e);
                return "ERROR";
            }
        },
        queryEmpresa(identificacion: string): Promise<Empresa> {
            return new Promise((resolve, reject) => {
                if (this.empresasIndex[identificacion]) {
                    console.log("Encontrado en local: ", this.empresasIndex[identificacion]);
                    resolve(this.empresasIndex[identificacion]);
                } else {
                    try {
                        API.get("umapi", `/empresas/identificacion?identificacion=${identificacion}`, {}).then(response => {
                            console.log("Respuesta", response);
                            if (response.success) {
                                if (response.success.length > 0) {
                                    const empresa = new Empresa(response.success[0]);
                                    this.empresas.push(empresa);
                                    this.empresasIndex[empresa.identificacion] = empresa;
                                    console.log("Encontrado en servidor: ", this.empresasIndex[identificacion]);
                                    resolve(empresa);
                                } else {
                                    reject({
                                        error: "Empresa no encontrada"
                                    });
                                }
                            } else {
                                reject({
                                    error: "Error en el servidor no captado por el middleware"
                                });
                            }
                        });
                    } catch (e) {
                        reject(e);
                    }
                }
            });
        }
    },
    persist: true
});
