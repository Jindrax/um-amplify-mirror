import {SocialProfiles} from "src/api/SocialProfile";
import {Video} from "src/api/Video";
import {Schedule} from "src/api/Schedule";

export interface LocacionClassConstructor {
    id?: string;
    nombrecompleto?: string;
    titulo?: string;
    subtitulosuperior?: string;
    subtituloinferior?: string;
    direccion?: string;
    longitud?: number;
    latitud?: number;
    geom?: string;
    telefono?: string;
    identificacion?: string;
    ciudadstr?: string;
    unidadadminstr?: string;
    descripcion?: string;
    perfilessociales?: any;
    carpetaimagenes?: any;
    video?: any;
    horario?: any;
    atributos?: any;
    tipopago?: string;
    planactivo?: string;
    pagohasta?: Date;
    premium?: boolean;
    esplafamiliar?: boolean;
    esplanpareja?: boolean;
    likes?: number;
    marcados?: number;
    categoriastr?: string;
    agente?: string;
}

export class LocacionClass {
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
    identificacion: string;
    ciudadstr: string;
    unidadadminstr: string;
    descripcion: string;
    perfilessociales: SocialProfiles;
    carpetaimagenes: any;
    video: Video;
    horario: Schedule;
    atributos: any;
    tipopago: string;
    planactivo: string;
    pagohasta: Date;
    premium: boolean;
    esplafamiliar: boolean;
    esplanpareja: boolean;
    likes: number;
    marcados: number;
    categoriastr: string;
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
                    identificacion,
                    ciudadstr,
                    unidadadminstr,
                    descripcion,
                    perfilessociales,
                    carpetaimagenes,
                    video,
                    horario,
                    atributos,
                    tipopago,
                    planactivo,
                    pagohasta,
                    premium,
                    esplafamiliar,
                    esplanpareja,
                    likes,
                    marcados,
                    categoriastr,
                    agente
                }: LocacionClassConstructor) {
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
        this.identificacion = identificacion ? identificacion : '';
        this.ciudadstr = ciudadstr ? ciudadstr : '';
        this.unidadadminstr = unidadadminstr ? unidadadminstr : '';
        this.descripcion = descripcion ? descripcion : '';
        this.perfilessociales = perfilessociales ? this.parseSocialProfiles(perfilessociales) : {};
        this.carpetaimagenes = carpetaimagenes ? carpetaimagenes : '';
        this.video = new Video(video);
        this.horario = horario ? new Schedule(horario) : new Schedule();
        this.atributos = atributos ? atributos : '';
        this.tipopago = tipopago ? tipopago : '';
        this.planactivo = planactivo ? planactivo : '';
        this.pagohasta = pagohasta ? pagohasta : new Date();
        this.premium = premium ? premium : false;
        this.esplafamiliar = esplafamiliar ? esplafamiliar : false;
        this.esplanpareja = esplanpareja ? esplanpareja : false;
        this.likes = likes ? likes : 0;
        this.marcados = marcados ? marcados : 0;
        this.categoriastr = categoriastr ? categoriastr : '';
        this.agente = agente ? agente : '';
    }

    // attributes: AttributeHandler;

    // this.socialProfiles = socialProfiles ? this.parseSocialProfiles(socialProfiles) : {};
    // this.video = new Video(video);
    // this.timetable = timetable ? new Schedule(timetable) : new Schedule();
    // this.attributes = new AttributeHandler(attributes);

    parseSocialProfiles(socialProfiles: string): SocialProfiles {
        return JSON.parse(socialProfiles);
    }
}
