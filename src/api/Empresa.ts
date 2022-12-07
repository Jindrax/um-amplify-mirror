import {CategoriaEnum} from "src/api/CategoriaEnum";
import {MetodoPagoEnum} from "src/api/MetodoPagoEnum";
import {TipoPlanEnum} from "src/api/TipoPlanEnum";

type SocialProfile = { [key: string]: string }
export interface GeoData{
  latitude: number,
  longitude: number
}

export interface DaySchedule{
  from: string,
  to: string
}

export interface Schedule{
  monday: DaySchedule,
  tuesday: DaySchedule,
  wednesday: DaySchedule,
  thursday: DaySchedule,
  friday: DaySchedule,
  saturday: DaySchedule,
  sunday: DaySchedule
}

export class Empresa {
  nombre: string;
  nit: string;
  direccion: string;
  categoria: CategoriaEnum;
  descripcion: string;
  metodoPago: MetodoPagoEnum;
  tipoPlan: TipoPlanEnum;
  socialProfiles: SocialProfile;
  geoData: GeoData;
  shedule: Schedule;


  constructor(nombre: string, nit: string, direccion: string, categoria: CategoriaEnum, descripcion: string, metodoPago: MetodoPagoEnum, tipoPlan: TipoPlanEnum, socialProfiles: SocialProfile, geoData: GeoData, shedule: Schedule) {
    this.nombre = nombre;
    this.nit = nit;
    this.direccion = direccion;
    this.categoria = categoria;
    this.descripcion = descripcion;
    this.metodoPago = metodoPago;
    this.tipoPlan = tipoPlan;
    this.socialProfiles = socialProfiles;
    this.geoData = geoData;
    this.shedule = shedule;
  }
}
