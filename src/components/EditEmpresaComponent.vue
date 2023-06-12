<template>
  <horario-selector v-model:show="scheduleDialog" :horario="horarioLocal"/>
  <q-card>
    <q-card-section>
      <div class="column items-start justify-start">
        <div class="col-auto row full-width">
          <div class="col q-pa-sm">
            <span>Nit</span>
            <q-input v-model="empresa.identificacion" class="bg-white" readonly/>
          </div>
          <div class="col q-pa-sm">
            <span>Razón Social</span>
            <q-input v-model="empresa.razonsocial" class="bg-white" readonly/>
          </div>
        </div>
        <div class="col-auto row full-width">
          <div class="col q-pa-sm">
            <span>Nombre Completo</span>
            <q-input v-model="locacion.nombrecompleto" class="bg-white"
                     @update:model-value="(val)=>{registrarCambio('nombrecompleto', val)}" debounce="500"/>
          </div>
          <div class="col q-pa-sm">
            <span>Identificador en Empresa</span>
            <q-input v-model="locacion.identificador" class="bg-white"
                     @update:model-value="(val)=>{registrarCambio('identificador', val)}" debounce="500"/>
          </div>
        </div>
        <div class="col-auto row full-width">
          <div class="col q-pa-sm">
            <span>Titulo</span>
            <q-input v-model="locacion.titulo" class="bg-white"
                     @update:model-value="(val)=>{registrarCambio('titulo', val)}" debounce="500"/>
          </div>
          <div class="col q-pa-sm">
            <span>Subtitulo Superior</span>
            <q-input v-model="locacion.subtitulosuperior" class="bg-white"
                     @update:model-value="(val)=>{registrarCambio('subtitulosuperior', val)}" debounce="500"/>
          </div>
          <div class="col q-pa-sm">
            <span>Subtitulo Inferior</span>
            <q-input v-model="locacion.subtituloinferior" class="bg-white"
                     @update:model-value="(val)=>{registrarCambio('subtituloinferior', val)}" debounce="500"/>
          </div>
        </div>
        <div class="row full-width">
          <div class="col q-pa-sm">
            <span>Departamento</span>
            <q-input v-model="locacion.unidadadminstr" readonly/>
          </div>
          <div class="col q-pa-sm">
            <span>Municipio</span>
            <q-input v-model="locacion.ciudadstr" readonly/>
          </div>
        </div>
        <div class="row full-width">
          <div class="col q-pa-sm">
            <span>Telefono</span>
            <q-input v-model="locacion.telefono" class="bg-white"
                     @update:model-value="(val)=>{registrarCambio('telefono', val)}" debounce="500"/>
          </div>
          <div class="col q-pa-sm">
            <span>Dirección</span>
            <q-input v-model="locacion.direccion" class="bg-white"
                     @update:model-value="(val)=>{registrarCambio('direccion', val)}" debounce="500"/>
          </div>
        </div>
        <div class="col q-pa-sm full-width">
          <!--          <atributo-selector-editable ref="atributoselector" v-model="atributosLocal"/>-->
          <atributo-selector v-model="locacion.atributos" v-model:categoriamain="locacion.categoriamain"
                             v-model:categoriasub="locacion.categoriasub" ref="atributoSelector"
                             @update:categoriamain="(val)=>{registrarCambio('categoriamain', val)}"
                             @update:categoriasub="(val)=>{registrarCambio('categoriasub', val)}"/>
        </div>
        <div class="row full-width">
          <div class="col q-pa-sm">
            <span>Descripción</span>
            <q-input v-model="locacion.descripcion" class="bg-grey-11" type="textarea"
                     @update:model-value="(val)=>{registrarCambio('descripcion', val)}" debounce="500"/>
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
            <q-input v-model="perfilesSocialesLocal['facebook']" class="bg-white" label="Facebook"
                     :rules="[facebookRule]" debounce="300" lazy-rules="ondemand" ref="facebookInput"/>
            <q-input v-model="perfilesSocialesLocal['instagram']" class="bg-white" label="Instagram"
                     :rules="[instagramRule]" debounce="300" lazy-rules="ondemand" ref="instagramInput"/>
            <q-input v-model="perfilesSocialesLocal['whatsapp']" class="bg-white" label="Whatsapp"
                     :rules="[whatsappRule]" debounce="300" lazy-rules="ondemand" ref="whatsappInput"/>
            <q-input v-model="perfilesSocialesLocal['website']" class="bg-white" label="Pagina web"
                     debounce="300"/>
          </div>
          <div class="col-6 q-pa-sm">
            <span>Localización</span>
            <q-input v-model.number="locacion.latitud" type="number" class="bg-white" label="Latitud"
                     @update:model-value="(val)=>{registrarCambio('latitud', val)}" debounce="500"
                     :rules="[validarCoordenada]" ref="latitudInput"/>
            <q-input v-model.number="locacion.longitud" type="number" class="bg-white" label="Longitud"
                     @update:model-value="(val)=>{registrarCambio('longitud', val)}" debounce="500"
                     :rules="[validarCoordenada]" ref="longitudInput"/>
          </div>
        </div>
      </div>
      <div class="row full-width items-end justify-end q-gutter-sm">
        <q-btn class="col-auto revert-btn" label="Cancelar" to="/dashboard/Empresas"/>
        <q-btn class="col-auto advance-btn" label="Guardar" @click="actualizarLocacion"/>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import {defineProps, onBeforeUnmount, onMounted, ref, watch} from "vue";
import Locacion from "layer/Entidades/Locacion";
import HorarioSelector from "components/HorarioSelector.vue";
import Empresa from "layer/Entidades/Empresa";
import {useEmpresaStore} from "stores/empresa-store";
import AtributoSelector from "components/AtributoSelector.vue";
import ActualizarLocacion from "layer/Entidades/ActualizarLocacion";
import {useLocacionStore} from "stores/locacion-store";
import {useQuasar} from "quasar";
import {SocialProfiles} from "layer/Entidades/SocialProfile";
import {Schedule} from "layer/Entidades/Schedule";

const props = defineProps<{
  locacion: Locacion
}>();

const empresaStore = useEmpresaStore();
const empresa = ref(new Empresa({}));
const horarioLocal = ref();
const perfilesSocialesLocal = ref(props.locacion.perfilessociales);
const atributosLocal = ref(props.locacion.atributos);
const locacionStore = useLocacionStore();
const {notify} = useQuasar();

const facebookInput = ref();
const instagramInput = ref();
const whatsappInput = ref();

const latitudInput = ref();
const longitudInput = ref();

const whatsappRegEx = /\+57\d{10}$/;
const facebookRegEx = /https:\/\/ww?e?w?b?\.facebook\.com\/([^\/]+)\/?$/;
const instagramRegEx = /https:\/\/www\.instagram\.com\/([^\/]+)\/?$/;

const whatsappRule = (value: string) => {
  return whatsappRegEx.test(value) ? true : "El numero de whatsapp tiene un formato incorrecto, recuerde añadir el codigo del pais, +57 para colombia.";
}

const facebookRule = (value: string) => {
  return facebookRegEx.test(value) ? true : "El link tiene un formato incorrecto.";
}

const instagramRule = (value: string) => {
  return instagramRegEx.test(value) ? true : "El link tiene un formato incorrecto.";
}

onMounted(async () => {
  empresa.value = await empresaStore.queryEmpresa(props.locacion.empresa);
  if ((props.locacion.horario as Schedule).wednesday.shifts === undefined) {
    horarioLocal.value = new Schedule({});
  }
  console.log(horarioLocal.value);
})

const scheduleDialog = ref(false);
const atributoselector = ref();
const registroCambiosLocacion = ref({} as { [key: string]: any });

function registrarCambio(llave: string, valor: any) {
  switch (llave) {
    case "horario":
      registroCambiosLocacion.value[llave] = JSON.stringify(valor);
      break;
    case "perfilessociales":
      registroCambiosLocacion.value[llave] = JSON.stringify(valor);
      break;
    case "atributos":
      registroCambiosLocacion.value[llave] = JSON.stringify(valor);
      break;
    default:
      registroCambiosLocacion.value[llave] = valor;
      break;
  }
}

const horarioWatcher = watch(horarioLocal, () => {
  registrarCambio("horario", horarioLocal.value);
}, {deep: true});

const perfilWatcher = watch(perfilesSocialesLocal, () => {
  registrarCambio("perfilessociales", perfilesSocialesLocal.value);
}, {deep: true});

const atributosWatcher = watch(atributosLocal, () => {
  registrarCambio("atributos", atributosLocal.value);
}, {deep: true});

onBeforeUnmount(() => {
  horarioWatcher();
  perfilWatcher();
  atributosWatcher();
});

const validarCoordenada = (coordenada: number | string) => {
  if (coordenada === "") {
    return "Debe ingresar una coordenada en este campo";
  }
  if (coordenada === 0) {
    return "For favor ingrese una coordenada valida para la locación actual";
  }
  return true;
}

async function actualizarLocacion() {
  try {
    let error = false;
    console.log("Validacion de longitud: ", longitudInput.value.validate());
    error = latitudInput.value.validate() === false;
    error = longitudInput.value.validate() === false;
    const perfiles: SocialProfiles = perfilesSocialesLocal.value as SocialProfiles;
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
    if (error) {
      notify("Uno o mas campos se encuentran en un estado invalido, por favor revise la información.");
      return;
    }
    const actualizarLocacionObj = new ActualizarLocacion({
      id: props.locacion.id,
      cambios: registroCambiosLocacion.value
    });
    await locacionStore.updateLocacion(actualizarLocacionObj);
    notify("Se ha actualizado la locación correctamente");
  } catch (e) {
    console.log(e);
    notify("Ocurrio un error en el servidor");
  }
}

</script>

<style lang="scss" scoped>

</style>
