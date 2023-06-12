<template>
  <q-page>
    <horario-selector v-model:show="scheduleDialog" :horario="nuevaLocacion.horario"/>
    <q-card>
      <q-card-section>
        <div class="column items-start justify-start q-gutter-y-sm">
          <div class="col column full-width" style="border: solid black 1px">
            <div class="col-auto row full-width">
              <div class="col q-pa-sm">
                <span>Nit</span>
                <q-input v-model="nuevaEmpresa.identificacion" class="bg-white" @blur="queryEmpresa">
                  <q-inner-loading :showing="loadState">
                    <q-spinner-facebook size="100px" color="primary"/>
                  </q-inner-loading>
                </q-input>
              </div>
              <div class="col q-pa-sm">
                <span>Razón Social</span>
                <q-input v-model="nuevaEmpresa.razonsocial" class="bg-white" :readonly="!nuevaEmpresaFlag">
                  <q-inner-loading :showing="loadState">
                    <q-spinner-facebook size="100px" color="primary"/>
                  </q-inner-loading>
                </q-input>
              </div>
            </div>
            <div v-if="nuevaEmpresaFlag" class="col-auto row full-width">
              <div class="col q-pa-sm">
                <span>Email</span>
                <q-input v-model="nuevaEmpresa.email" class="bg-white" ref="empresaCorreo" :rules="[validarCorreo]"/>
              </div>
            </div>
          </div>
          <div class="col-auto row full-width">
            <div class="col q-pa-sm">
              <span>Nombre Completo</span>
              <q-input v-model="nuevaLocacion.nombrecompleto" class="bg-white"/>
            </div>
            <div class="col q-pa-sm">
              <span>Identificador en Empresa</span>
              <q-input v-model="nuevaLocacion.identificador" class="bg-white"/>
            </div>
          </div>
          <div class="col-auto row full-width">
            <div class="col-6 container">
              <q-resize-observer @resize="resizeEvent"/>
              <div class="full-height column items-start justify-end">
                <div class="col-auto pre-title"
                     :style="{'font-size': `${preTituloFont}px`, 'margin-bottom': `${preTituloMarginBottom}dp`, 'margin-left': `${preTituloMarginLeft}dp`}">
                  {{ nuevaLocacion.subtitulosuperior }}
                </div>
                <div class="col-auto title" :style="{'font-size': `${tituloFont}px`}">{{ nuevaLocacion.titulo }}</div>
              </div>
            </div>
            <div class="col-6 column">
              <div class="col q-pa-sm">
                <span>Subtitulo Superior</span>
                <q-input v-model="nuevaLocacion.subtitulosuperior" class="bg-white"/>
              </div>
              <div class="col q-pa-sm">
                <span>Titulo</span>
                <q-input v-model="nuevaLocacion.titulo" class="bg-white"/>
              </div>
              <div class="col q-pa-sm">
                <span>Subtitulo Inferior</span>
                <q-input v-model="nuevaLocacion.subtituloinferior" class="bg-white"/>
              </div>
            </div>
          </div>
          <div class="row full-width">
            <div class="col q-pa-sm">
              <span>Departamento {{ nuevaLocacion.unidadadminstr }}</span>
              <unidad-admin-selector v-model="nuevaLocacion.unidadadmin" v-model:str="nuevaLocacion.unidadadminstr"
                                     class="bg-white"/>
            </div>
            <div class="col q-pa-sm">
              <span>Ciudad</span>
              <ciudad-selector v-model="nuevaLocacion.ciudad" v-model:str="nuevaLocacion.ciudadstr"
                               :unidad-admin-id="nuevaLocacion.unidadadmin" class="bg-white"/>
            </div>
          </div>
          <div class="row full-width">
            <div class="col q-pa-sm">
              <span>Telefono</span>
              <q-input v-model="nuevaLocacion.telefono" class="bg-white"/>
            </div>
            <div class="col q-pa-sm">
              <span>Dirección</span>
              <q-input v-model="nuevaLocacion.direccion" class="bg-white"/>
            </div>
          </div>
          <div class="col q-pa-sm full-width">
            <atributo-selector v-model="nuevaLocacion.atributos" v-model:categoriamain="nuevaLocacion.categoriamain"
                               v-model:categoriasub="nuevaLocacion.categoriasub" ref="atributoSelector"/>
          </div>
          <div class="row full-width">
            <div class="col q-pa-sm">
              <span>Descripción</span>
              <q-input v-model="nuevaLocacion.descripcion" class="bg-grey-11" type="textarea"/>
            </div>
          </div>
          <div class="row full-width">
            <div class="col row items-center">
              <q-btn class="advance-btn full-width" label="Editar Horario" @click="scheduleDialog=!scheduleDialog"/>
            </div>
          </div>
          <div class="col-auto row full-width">
            <div class="col-6 q-pa-sm">
              <span>Redes Sociales</span>
              <q-input v-model="nuevaLocacion.perfilessociales['facebook']" class="bg-white" label="Facebook"
                       :rules="[facebookRule]" debounce="300" lazy-rules="ondemand" ref="facebookInput"/>
              <q-input v-model="nuevaLocacion.perfilessociales['instagram']" class="bg-white" label="Instagram"
                       :rules="[instagramRule]" debounce="300" lazy-rules="ondemand" ref="instagramInput"/>
              <q-input v-model="nuevaLocacion.perfilessociales['whatsapp']" class="bg-white" label="Whatsapp"
                       :rules="[whatsappRule]" debounce="300" lazy-rules="ondemand" ref="whatsappInput"/>
              <q-input v-model="nuevaLocacion.perfilessociales['website']" class="bg-white" label="Pagina web"
                       debounce="300"/>
            </div>
            <div class="col-6 q-pa-sm">
              <span>Localización</span>
              <q-input v-model.number="nuevaLocacion.latitud" type="number" class="bg-white" label="Latitud"
                       ref="latitudInput" :rules="[validarCoordenada]"/>
              <q-input v-model.number="nuevaLocacion.longitud" type="number" class="bg-white" label="Longitud"
                       ref="longitudInput" :rules="[validarCoordenada]"/>
            </div>
          </div>
        </div>
        <div class="row full-width items-end justify-end q-gutter-sm">
          <q-btn class="col revert-btn" label="Cancelar" to="/dashboard/Empresas"/>
          <q-btn class="col advance-btn" label="Guardar" @click="insertLocacion"/>
        </div>
      </q-card-section>
    </q-card>
    <q-inner-loading :showing="creationState">
      <q-spinner-facebook size="100px" color="primary"/>
    </q-inner-loading>
  </q-page>
</template>

<script lang="ts" setup>
import {Ref, ref} from 'vue';
import {useSessionStore} from "stores/session-store";
import {uid, useQuasar} from "quasar";
import Locacion from "layer/Entidades/Locacion";
import AtributoSelector from "components/AtributoSelector.vue";
import {useLocacionStore} from "stores/locacion-store";
import moment from "moment";
import UnidadAdminSelector from "components/UnidadAdminSelector.vue";
import CiudadSelector from "components/CiudadSelector.vue";
import Empresa from "layer/Entidades/Empresa";
import {useEmpresaStore} from "stores/empresa-store";
import HorarioSelector from "components/HorarioSelector.vue";
import {SocialProfiles} from "layer/Entidades/SocialProfile";

const scheduleDialog = ref(false);
const time = ref("");
const {notify} = useQuasar();
const locacionStore = useLocacionStore();
const empresaStore = useEmpresaStore();
const loadState = ref(false);
const creationState = ref(false);
const atributoSelector = ref();


const facebookInput = ref();
const instagramInput = ref();
const whatsappInput = ref();

const whatsappRegEx = /\+57\d{10}$/;
const facebookRegEx = /https:\/\/ww?e?w?b?\.facebook\.com\/([^\/]+)\/?$/;
const instagramRegEx = /https:\/\/www\.instagram\.com\/([^\/]+)\/?$/;

const latitudInput = ref();
const longitudInput = ref();
const empresaCorreo = ref();


const sizeRef = ref({
  height: 100,
  width: 100
});

const scale = (size: number) => sizeRef.value.width / guidelineBaseWidth * size;


const resizeEvent = (size: { height: number, width: number }) => {
  sizeRef.value = size;
  preTituloFont.value = scale(15);
  preTituloMarginBottom.value = scale(-5);
  preTituloMarginLeft.value = scale(3);
  if (nuevaLocacion.value.titulo.length < 15) {
    tituloFont.value = scale(30);
  } else if (nuevaLocacion.value.titulo.length < 18) {
    tituloFont.value = scale(25);
  } else if (nuevaLocacion.value.titulo.length < 25) {
    tituloFont.value = scale(20);
  }
};

let preTituloFont = ref(1);
let preTituloMarginBottom = ref(1);
let preTituloMarginLeft = ref(1);

let tituloFont = ref(1);

const guidelineBaseWidth = 350;

const nuevaLocacion: Ref<Locacion> = ref(new Locacion({
  id: uid(),
  agente: useSessionStore().userInfo.sub
}));

const nuevaEmpresa: Ref<Empresa> = ref(new Empresa({
  agente: useSessionStore().userInfo.sub
}));

const nuevaEmpresaFlag = ref(false);

function resetComponent() {
  nuevaLocacion.value = new Locacion({
    id: uid(),
    agente: useSessionStore().userInfo.sub
  });
  nuevaEmpresa.value = new Empresa({
    agente: useSessionStore().userInfo.sub
  });
  nuevaEmpresaFlag.value = true;
  atributoSelector.value.resetComponent();
  creationState.value = false;
}

const validarCoordenada = (coordenada: number | string) => {
  if (coordenada === "") {
    return "Debe ingresar una coordenada en este campo";
  }
  if (coordenada === 0) {
    return "For favor ingrese una coordenada valida para la locación actual";
  }
  return true;
}

const validarCorreo = (correo: string) => {
  const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  if (correo.match(regex)) {
    return true;
  }
  return "Por favor introduzca un correo valido."
}

const insertLocacion = async () => {
  let error = false;
  error = latitudInput.value.validate() === false;
  error = longitudInput.value.validate() === false;
  const locacion = nuevaLocacion.value;
  const fecha = moment().toISOString();
  locacion.geom = "";
  locacion.creadoen = fecha;
  locacion.pagohasta = fecha;
  locacion.empresa = nuevaEmpresa.value.identificacion;
  const perfiles: SocialProfiles = locacion.perfilessociales as SocialProfiles;
  if (perfiles.facebook && perfiles.facebook != "") {
    if (!facebookInput.value.validate()) {
      notify("El perfil de Facebook no se ha validado correctamente.");
      error = true;
    }
  }
  if (perfiles.instagram && perfiles.instagram != "") {
    if (!instagramInput.value.validate()) {
      notify("El perfil de Instagram no se ha validado correctamente.");
      error = true;
    }
  }
  if (perfiles.whatsapp && perfiles.whatsapp != "") {
    if (!whatsappInput.value.validate()) {
      notify("El numero de Whatsapp no se ha validado correctamente.");
      error = true;
    }
  }
  if (locacion.categoriamain === '') {
    notify("Se necesita al menos una categoria principal");
    error = true;
  }
  if (error) {
    notify("Uno o mas campos se encuentran en un estado invalido, por favor revise la información.");
    return;
  }
  creationState.value = true;
  console.log(locacion);
  if (nuevaEmpresaFlag.value) {
    const empresaResponse = await empresaStore.addEmpresa(nuevaEmpresa.value);
    // const empresaResponse = "OK";
    if (empresaResponse == "OK") {
      const response = await locacionStore.addLocacion(nuevaLocacion.value);
      // const response = "OK";
      if (response == "OK") {
        notify("Empresa creada correctamente");
        resetComponent();
      } else {
        creationState.value = false;
        notify("Ocurrió un error en el servidor");
      }
    } else {
      creationState.value = false;
      notify("Ocurrió un error en el servidor");
    }
  } else {
    const response = await locacionStore.addLocacion(nuevaLocacion.value);
    // const response = "OK";
    if (response == "OK") {
      notify("Empresa creada correctamente");
      resetComponent();
    } else {
      creationState.value = false;
      notify("Ocurrió un error en el servidor");
    }
  }
}

async function queryEmpresa() {
  try {
    loadState.value = true;
    nuevaEmpresa.value = await empresaStore.queryEmpresa(nuevaEmpresa.value.identificacion);
    loadState.value = false;
    nuevaEmpresaFlag.value = false;
  } catch (e) {
    loadState.value = false;
    notify("No se encontró la empresa a la que desea asociar la locación, si es una nueva empresa será creada con la locación");
    nuevaEmpresaFlag.value = true;
  }
}

const whatsappRule = (value: string) => {
  return whatsappRegEx.test(value) ? true : "El numero de whatsapp tiene un formato incorrecto, recuerde añadir el codigo del pais, +57 para colombia.";
}

const facebookRule = (value: string) => {
  return facebookRegEx.test(value) ? true : "El link tiene un formato incorrecto.";
}

const instagramRule = (value: string) => {
  return instagramRegEx.test(value) ? true : "El link tiene un formato incorrecto.";
}

</script>

<style lang="scss" scoped>
span {
  font-size: 2vh;
}

.container {
  align-items: flex-start;
  justify-content: center;
  border: solid 1px black;
  padding: 10px 15px;
  background-image: url('/login-art.png');
}

.pre-title {
  font-weight: 400;
  text-shadow: 0 2px 2.62px rgba(51, 51, 51, 0.6);
  elevation: 4deg;
  color: white;
}

.title {
  font-weight: 600;
  text-shadow: 0 2px 2.62px rgba(51, 51, 51, 0.6);
  elevation: 4deg;
  color: white;
}
</style>
