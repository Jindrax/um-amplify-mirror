import {Pool} from "pg";

let pool: Pool;
const DATABASE_URL = "postgresql://jairo:kGuOKjET19RegVwG9PWl3Q@free-tier14.aws-us-east-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&options=--cluster%3Dregal-crawler-2921";

export * as Agente from "./Entidades/Agente";
export * as Atributo from "./Entidades/Atributo";
export * as Categoria from "./Entidades/Categoria";
export * as Ciudad from "./Entidades/Ciudad";
export * as Locacion from "./Entidades/Locacion";
export * as UnidadAdmin from "./Entidades/UnidadAdmin";

export const getCliente = async () => {
    if (!pool) {
        pool = new Pool({
            host: "um-postgre.cxhhi2k6xdsb.us-east-1.rds.amazonaws.com",
            user: "yayo",
            password: "Calle9#1G23",
            database: "um",
            max: 1,
        });
    }
    return await pool.connect();
}

export const insertarEntidad: (entidad: any, tabla: string) => { query: string, parametros: any[] } = (entidad: any, tabla: string) => {
    const tupla = {
        query: "",
        parametros: [] as any[]
    };
    const llaves = Object.getOwnPropertyNames(entidad);
    const valores: any[] = Object.values(entidad);
    const indices = llaves.map((value, index) => `\$${index + 1}`);
    tupla.query = `INSERT INTO ${tabla}(${llaves.join(',')}) VALUES (${indices.join(',')})`;
    tupla.parametros = valores.map((value)=>{
        if (
            typeof value === 'object' &&
            !Array.isArray(value) &&
            value !== null
        ) {
            return JSON.stringify(value);
        }else{
            return value;
        }
    });
    return tupla;
}

export const actualizarEntidad: (entidad: any, condicion: string, tabla: string) => { query: string, parametros: any[] } = (entidad: any, condicion: string, tabla: string) => {
    const tupla = {
        query: "",
        parametros: [] as any[]
    };
    const llaves = Object.getOwnPropertyNames(entidad);
    const valores: any[] = Object.values(entidad);
    const indices = llaves.map((value, index) => `\$${index + 1}`);
    tupla.query = `UPDATE ${tabla} SET ${llaves.map((llave, indice) => `${llave}=${indices[indice]}`).join(',')} WHERE ${condicion}`;
    tupla.parametros = valores;
    return tupla;
}