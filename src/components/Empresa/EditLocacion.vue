<template>
  <q-page>
    <q-card>
      <q-card-section>
        <q-list>
          <q-expansion-item label="Información" class="empresa-advance-btn">
            <horario-selector v-model:show="scheduleDialog" :horario="horarioLocal"/>
            <q-card>
              <q-card-section>
                <div class="column items-start justify-start q-gutter-y-sm">
                  <q-card class="col full-width">
                    <q-card-section class="column q-gutter-y-sm">
                      <q-item-label class="col text-h6 text-black">Información básica</q-item-label>
                      <div class="row full-width q-gutter-x-sm">
                        <q-select class="col" v-model="attrSelectedOption" :options="attrAvaliableOptions"
                                  placeholder="Información" label="Información de la locación" stack-label/>
                        <q-input v-if="attrSelectedOption.value !== 'descripcion'" class="col"
                                 v-model="locacionEditable[attrSelectedOption.value]"
                                 :label="locacionEditable[attrSelectedOption]"/>
                        <q-input v-else class="col" v-model="locacionEditable[attrSelectedOption.value]"
                                 :label="locacionEditable[attrSelectedOption]" type="textarea"/>
                      </div>
                      <div class="col row full-width">
                        <div class="col q-pa-sm">
                          <span>Departamento</span>
                          <q-input v-model="locacionEditable.unidadadminstr" readonly label="Departamento" stack-label/>
                        </div>
                        <div class="col q-pa-sm">
                          <span>Municipio</span>
                          <q-input v-model="locacionEditable.ciudadstr" readonly label="Municipio" stack-label/>
                        </div>
                      </div>
                      <div class="col row full-width">
                        <div class="col row items-center">
                          <q-btn class="empresa-advance-btn full-width" label="Editar Horario"
                                 @click="scheduleDialog=!scheduleDialog"/>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                  <q-card class="col full-width">
                    <q-card-section class="column q-gutter-y-sm">
                      <q-item-label class="col text-h6 text-black q-my-sm">Categorias y atributos</q-item-label>
                      <div class="col q-pa-sm full-width">
                        <atributo-selector ref="atributoselector" v-model="atributosLocal" v-model:categoriamain="locacionEditable.categoriamain" v-model:categoriasub="locacionEditable.categoriasub"/>
                      </div>
                    </q-card-section>
                  </q-card>
                  <q-card class="col full-width">
                    <q-card-section class="column q-gutter-y-sm">
                      <q-item-label class="col text-h6 text-black q-my-sm">Redes sociales</q-item-label>
                      <div class="col column full-width">
                        <q-input v-model="perfilesSocialesLocal['facebook']" class="col bg-white" label="Facebook"
                                 :rules="[facebookRule]" debounce="300" lazy-rules="ondemand" ref="facebookInput">
                          <template v-slot:before>
                            <q-icon name="img:SVG/facebook-square-logo.svg" size="md"/>
                          </template>
                        </q-input>
                        <q-input v-model="perfilesSocialesLocal['instagram']" class="col bg-white" label="Instagram"
                                 :rules="[instagramRule]" debounce="300" lazy-rules="ondemand" ref="instagramInput">
                          <template v-slot:before>
                            <q-icon name="img:SVG/instagram-square-logo.svg" size="md"/>
                          </template>
                        </q-input>
                        <q-input v-model="perfilesSocialesLocal['whatsapp']" class="col bg-white" label="Whatsapp"
                                 :rules="[whatsappRule]" debounce="300" lazy-rules="ondemand" ref="whatsappInput">
                          <template v-slot:before>
                            <q-icon name="img:SVG/whatsapp-square-logo.svg" size="md"/>
                          </template>
                        </q-input>
                        <q-input v-model="perfilesSocialesLocal['website']" class="col bg-white" label="Pagina web"
                                 debounce="300">
                          <template v-slot:before>
                            <q-icon name="img:SVG/web-square-logo.svg" size="md"/>
                          </template>
                        </q-input>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-expansion-item label="Imagenes" class="empresa-advance-btn">
            <q-card class="q-pa-none q-ma-none">
              <q-card-section class="q-ma-none">
                <div class="column full-width q-gutter-md">
                  <div class="col row">
                    <div class="col row">
                      <div class="col">Nombre</div>
                      <div class="col">{{ locacionEditable.nombrecompleto }}</div>
                    </div>
                    <div class="col row">
                      <div class="col">Nit</div>
                      <div class="col">{{ locacionEditable.empresa }}</div>
                    </div>
                  </div>
                  <q-card class="col" v-for="(_, imgIndex) in imagenes">
                    <q-card-section v-if="imagenesUploaded[imgIndex]">
                      <imagen-visualizer :imagen="imagenesUploaded[imgIndex]"/>
                    </q-card-section>
                    <q-card-section>
                      <q-item>
                        <q-item-section>
                          <q-file v-model="imagenes[imgIndex]" filled :label="`Imagen-${imgIndex + 1}`"
                                  @update:model-value="">
                            <template v-slot:prepend>
                              <q-icon name="cloud_upload" @click.stop/>
                            </template>
                            <template v-slot:append>
                              <q-icon class="cursor-pointer" name="close" @click.stop="removeImg(imgIndex)"/>
                            </template>
                            <template v-slot:hint>
                              {{ `Imagen-${imgIndex + 1}` }}
                            </template>
                          </q-file>
                        </q-item-section>
                      </q-item>
                    </q-card-section>
                  </q-card>
                  <div class="col">
                    <q-btn class="full-width advance-btn" label="Añadir Imagen" @click="addImg"></q-btn>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-expansion-item label="Video" header-class="empresa-advance-btn">
            <q-card>
              <q-card-section>
                <div class="column full-width q-gutter-md">
                  <div class="col row">
                    <q-item-label class="text-h6">Video actual</q-item-label>
                  </div>
                  <div class="col row">
                    <video class="col full-width" id="video" controls></video>
                  </div>
                  <div class="col">
                    <q-item>
                      <q-item-section side class="text-black">Propuesta de actualización</q-item-section>
                      <q-item-section>
                        <q-file v-model="videoSelector" bottom-slots counter filled label="Video">
                          <template v-slot:prepend>
                            <q-icon name="cloud_upload" @click.stop/>
                          </template>
                          <template v-slot:append>
                            <q-icon class="cursor-pointer" name="close" @click.stop="videoSelector = null"/>
                          </template>
                          <template v-slot:hint>
                            Video
                          </template>
                        </q-file>
                      </q-item-section>
                    </q-item>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card-section>
      <q-card-actions class="row">
        <q-btn class="col revert-btn" label="Cancelar" :to="{name: 'Locaciones'}"/>
        <q-btn class="col empresa-advance-btn" label="Guardar" @click="realizarPropuesta"/>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import {useLocacionStore} from "stores/locacion-store";
import {useStateStore} from "stores/state-store";
import {storeToRefs} from "pinia";
import {onBeforeUnmount, onMounted, ref, watch, computed, Ref} from "vue";
import HorarioSelector from "components/HorarioSelector.vue";
import Empresa from "layer/Entidades/Empresa";
import PropuestaEdicionLocacion from "layer/Entidades/PropuestaEdicionLocacion";
import {useEmpresaStore} from "stores/empresa-store";
import AtributoSelector from "components/AtributoSelector.vue";
import {uid, useQuasar} from "quasar";
import {SocialProfiles} from "layer/Entidades/SocialProfile";
import {Schedule} from "layer/Entidades/Schedule";
import {API, Auth} from "aws-amplify";
import Hls from "hls.js";
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import ImagenVisualizer from "components/ImagenVisualizer.vue";
import {useRouter} from "vue-router";

/*###### COMUN #####*/
const empresaStore = useEmpresaStore();
const locacionStore = useLocacionStore();
const stateStore = useStateStore();
const {notify} = useQuasar();
const {locacionEditable} = storeToRefs(locacionStore);
const router = useRouter();

/*###### INFORMACION #####*/
const attrAvaliableOptions: { label: string, value: string }[] = [
  {label: "Identificador Interno", value: "identificador"},
  {label: "Nombre Completo", value: "nombrecompleto"},
  {label: "Subtitulo Superior", value: "subtitulosuperior"},
  {label: "Titulo", value: "titulo"},
  {label: "Direccion", value: "direccion"},
  {label: "Telefono", value: "telefono"},
  {label: "Descripcion", value: "descripcion"}
];
const attrSelectedOption = ref({label: "Identificador Interno", value: "identificador"});
const empresa = ref(new Empresa({}));
const horarioLocal = ref();
const perfilesSocialesLocal = ref(locacionEditable.value.perfilessociales);
const atributosLocal = ref(locacionEditable.value.atributos);
const facebookInput = ref();
const instagramInput = ref();
const whatsappInput = ref();
const whatsappRegEx = /\+57\d{10}$/;
const facebookRegEx = /https:\/\/ww?e?w?b?\.facebook\.com\/([^\/]+)\/?$/;
const instagramRegEx = /https:\/\/www\.instagram\.com\/([^\/]+)\/?$/;
const scheduleDialog = ref(false);
const atributoselector = ref();
const registroCambiosLocacion = ref({} as { [key: string]: any });
const locacionMemento = JSON.parse(JSON.stringify(locacionEditable.value));
const horarioWatcher = watch(horarioLocal, () => {
  registrarCambio("horario", horarioLocal.value);
}, {deep: true});

const perfilWatcher = watch(perfilesSocialesLocal, () => {
  registrarCambio("perfilessociales", perfilesSocialesLocal.value);
}, {deep: true});

const atributosWatcher = watch(atributosLocal, () => {
  registrarCambio("atributos", atributosLocal.value);
}, {deep: true});

/*###### IMAGENES #####*/
const maxImg = 10;
const imagenes: Ref<(File | null)[]> = ref([]);
const imagenesUploaded: Ref<{ [key: string]: string }[]> = ref([]);
const currentLoaded = ref(0);
const totalToLoad = ref(0);
const progress = computed(() => {
  return currentLoaded.value / (totalToLoad.value == 0 ? 1 : totalToLoad.value);
});

/*###### VIDEO #####*/
const videoSelector: Ref<File> = ref(new File([], ""));


/*###### METHODS #####*/
/*###### COMUN #####*/
onMounted(async () => {
  horarioLocal.value = new Schedule(locacionEditable.value.horario as Schedule);
  empresa.value = await empresaStore.queryEmpresa(locacionEditable.value.empresa);
  if (locacionEditable.value.carpetaimagenes.length > 0) {
    for (let i = 0; i < locacionEditable.value.carpetaimagenes.length; i++) {
      addImg();
      imagenesUploaded.value.push(locacionEditable.value.carpetaimagenes[i]);
    }
  }
  if (locacionEditable.value.video.HLS) {
    let video: HTMLMediaElement | null = document.getElementById('video') as HTMLMediaElement;
    let videoSrc = locacionEditable.value.video.HLS;
    if (Hls.isSupported()) {
      let hls = new Hls();
      hls.loadSource(videoSrc);
      if (video) {
        hls.attachMedia(video);
        // await video.play();
      }
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
    }
  }
})

onBeforeUnmount(() => {
  horarioWatcher();
  perfilWatcher();
  atributosWatcher();
});

async function realizarPropuesta() {
  try {
    stateStore.awaitResponse("Enviando propuesta al servidor");
    let error = false;
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
      return;
    }

    const propuesta = new PropuestaEdicionLocacion({
      id: uid(),
      locacionid: locacionEditable.value.id,
      agenteid: locacionEditable.value.agente,
      empresaid: locacionEditable.value.empresa
    });

    /* Informacion validada */

    const s3Client = new S3Client({
      region: "us-east-1",
      credentials: await Auth.currentUserCredentials()
    });
    const imagesUploadCommands = [] as PutObjectCommand[];
    for (let i = 0; i < imagenes.value.length; i++) {
      if (imagenes.value[i] !== null) {
        let img: File = imagenes.value[i] as File;
        const imgExtension = img.name.substring(img.name.lastIndexOf('.'));
        const imageUploadCommand = new PutObjectCommand({
          Bucket: "um-empresa-proposal-resources",
          Key: `${locacionEditable.value.id}/${propuesta.id}/img/${locacionEditable.value.id}-${i}${imgExtension}`,
          Body: img,
          ContentType: img.type,
          Metadata: {
            locacionId: locacionEditable.value.id,
            imgIndex: String(i)
          }
        });
        imagesUploadCommands.push(imageUploadCommand);
        propuesta.registrocambiosfotos.add.push({
          indice: i,
          url: `${locacionEditable.value.id}/${propuesta.id}/img/${locacionEditable.value.id}-${i}${imgExtension}`
        });
      }
    }
    if (imagesUploadCommands.length > 0) {
      totalToLoad.value = imagesUploadCommands.length;
      currentLoaded.value = 0;
      stateStore.awaitResponse(`Cargando Imagenes 0/${totalToLoad.value}`);
      for (let command of imagesUploadCommands) {
        await s3Client.send(command);
        currentLoaded.value = currentLoaded.value + 1;
        stateStore.awaitResponse(`Cargando Imagenes ${currentLoaded.value}/${totalToLoad.value}`);
      }
    }

    /* Imagenes validadas */

    if (videoSelector.value.size !== 0) {
      const videoTypeIndex = videoSelector.value.name.lastIndexOf(".");
      const videoKey = `${locacionEditable.value.id}/${propuesta.id}/video/${locacionEditable.value.id + videoSelector.value.name.substring(videoTypeIndex)}`;

      const uploadVideoCommand = new PutObjectCommand({
        Bucket: "um-empresa-proposal-resources",
        Key: videoKey,
        Body: videoSelector.value,
        ContentType: videoSelector.value.type
      });

      stateStore.awaitResponse(`Cargando Video`);

      await s3Client.send(uploadVideoCommand);
      propuesta.registrocambiovideo = videoKey;
    }

    /* Video validado */

    propuesta.registrocambiosinfo = {...registroCambiosLocacion.value, ...extraerCambios(locacionMemento, locacionEditable.value)};
    propuesta.registrocambiosatributos = atributoselector.value.getCambios();

    stateStore.awaitResponse(`Enviando propuesta de edición al servidor`);

    console.log(propuesta);

    await API.post("umapi", "/empresas/propuesta", {
      body: propuesta
    });

    stateStore.stopWaiting();
    notify("Se ha realizado la propuesta correctamente");
    await router.push({name: 'Locaciones'});
  } catch (e) {
    console.log(e);
    stateStore.stopWaiting();
    notify("Ocurrio un error en el servidor");
  }
}

/*###### INFORMACION #####*/
function whatsappRule(value: string) {
  return whatsappRegEx.test(value) ? true : "El numero de whatsapp tiene un formato incorrecto, recuerde añadir el codigo del pais, +57 para colombia.";
}

function facebookRule(value: string) {
  return facebookRegEx.test(value) ? true : "El link tiene un formato incorrecto.";
}

function instagramRule(value: string) {
  return instagramRegEx.test(value) ? true : "El link tiene un formato incorrecto.";
}

function registrarCambio(llave: string, valor: any) {
  switch (llave) {
    case "horario":
      registroCambiosLocacion.value[llave] = valor;
      break;
    case "perfilessociales":
      registroCambiosLocacion.value[llave] = valor;
      break;
    case "atributos":
      registroCambiosLocacion.value[llave] = valor;
      break;
    default:
      registroCambiosLocacion.value[llave] = valor;
      break;
  }
}

function extraerCambios(memento: { [key: string]: any }, valorActual: { [key: string]: any }) {
  const cambios: { [key: string]: any } = {};
  for (let {value} of attrAvaliableOptions) {
    if (memento[value] != valorActual[value]) {
      cambios[value] = valorActual[value];
    }
  }
  return cambios;
}

/*###### IMAGENES #####*/
function addImg() {
  if (imagenes.value.length < maxImg) {
    imagenes.value.push(null);
  } else {
    notify(`El maximo actual de imagenes por locación es de ${maxImg}.`);
  }
}

function removeImg(imgIndex: number) {
  imagenes.value.splice(imgIndex, 1);
}

</script>

<style lang="scss" scoped>
span {
  font-size: 2vh;
}

#video {
  height: 50vh;
  object-fit: contain;
}
</style>
