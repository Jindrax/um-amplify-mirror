"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Schedule_1 = require("./Schedule");
class Locacion {
    constructor({ id, nombrecompleto, titulo, subtitulosuperior, subtituloinferior, direccion, longitud, latitud, geom, telefono, descripcion, perfilessociales, carpetaimagenes, video, horario, atributos, likes, marcados, ciudad, ciudadstr, unidadadmin, unidadadminstr, creadoen, pagohasta, empresa, identificador, agente, categoriamain, categoriasub }) {
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
        this.horario = horario ? new Schedule_1.Schedule(horario) : new Schedule_1.Schedule({});
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
        this.categoriamain = categoriamain ? categoriamain : '';
        this.categoriasub = categoriasub ? categoriasub : '';
    }
}
exports.default = Locacion;
