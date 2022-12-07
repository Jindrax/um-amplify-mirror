import {SocialProfiles} from "./SocialProfile";
import {Schedule} from "./Schedule";

export default class Locacion {
    id: string;
    nombrecompleto: string;
    titulo: string;
    subtitulosuperior: string;
    subtituloinferior: string;
    direccion: string;
    longitud: number;
    latitud: number;
    geom: string;
    telefono: string;
    descripcion: string;
    perfilessociales: SocialProfiles | string;
    carpetaimagenes: any[] | string;
    video: any;
    horario: Schedule | string;
    atributos: any | string;
    pagohasta: string;
    likes: number;
    marcados: number;
    ciudad: string;
    ciudadstr: string;
    unidadadmin: string;
    unidadadminstr: string;
    creadoen: string;
    empresa: string;
    identificador: string;
    agente: string;

    constructor({
                    id,
                    nombrecompleto,
                    titulo,
                    subtitulosuperior,
                    subtituloinferior,
                    direccion,
                    longitud,
                    latitud,
                    geom,
                    telefono,
                    descripcion,
                    perfilessociales,
                    carpetaimagenes,
                    video,
                    horario,
                    atributos,
                    likes,
                    marcados,
                    ciudad,
                    ciudadstr,
                    unidadadmin,
                    unidadadminstr,
                    creadoen,
                    pagohasta,
                    empresa,
                    identificador,
                    agente
                }: { id?: string, nombrecompleto?: string, titulo?: string, subtitulosuperior?: string, subtituloinferior?: string, direccion?: string, longitud?: number, latitud?: number, geom?: string, telefono?: string, descripcion?: string, perfilessociales?: any, carpetaimagenes?: any[], video?: any, horario?: any, atributos?: any, likes?: number, marcados?: number, ciudad?: string, ciudadstr?: string, unidadadmin?: string, unidadadminstr?: string, creadoen?: string, empresa?: string, identificador?: string, pagohasta?: string, agente?: string }) {
        this.id = id ? id : '';
        this.nombrecompleto = nombrecompleto ? nombrecompleto : '';
        this.titulo = titulo ? titulo : '';
        this.subtitulosuperior = subtitulosuperior ? subtitulosuperior : '';
        this.subtituloinferior = subtituloinferior ? subtituloinferior : '';
        this.direccion = direccion ? direccion : '';
        this.longitud = longitud ? longitud : 0;
        this.latitud = latitud ? latitud : 0;
        this.geom = geom ? geom : '';
        this.telefono = telefono ? telefono : '';
        this.descripcion = descripcion ? descripcion : '';
        this.perfilessociales = perfilessociales ? perfilessociales : {};
        this.carpetaimagenes = carpetaimagenes ? carpetaimagenes : [];
        this.video = video ? video : {};
        this.horario = horario ? new Schedule(horario) : new Schedule({});
        this.atributos = atributos ? atributos : {};
        this.pagohasta = pagohasta ? pagohasta : '';
        this.likes = likes ? likes : 0;
        this.marcados = marcados ? marcados : 0;
        this.ciudad = ciudad ? ciudad : '';
        this.ciudadstr = ciudadstr ? ciudadstr : '';
        this.unidadadmin = unidadadmin ? unidadadmin : '';
        this.unidadadminstr = unidadadminstr ? unidadadminstr : '';
        this.creadoen = creadoen ? creadoen : '';
        this.empresa = empresa ? empresa : '';
        this.identificador = identificador ? identificador : '';
        this.agente = agente ? agente : '';
    }

}