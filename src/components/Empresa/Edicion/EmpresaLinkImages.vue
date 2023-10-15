<template>
  <div class="column full-width q-gutter-md">
    <div class="col row">
      <div class="col row">
        <div class="col">Nombre</div>
        <div class="col">{{ locacion.nombrecompleto }}</div>
      </div>
      <div class="col row">
        <div class="col">Nit</div>
        <div class="col">{{ locacion.empresa }}</div>
      </div>
    </div>
    <q-card class="col" v-for="(imagen, imgIndex) in imagenes">
      <q-card-section v-if="imagenesUploaded[imgIndex]">
        <imagen-visualizer :imagen="imagenesUploaded[imgIndex]"/>
      </q-card-section>
      <q-card-section>
        <q-item>
          <q-item-section>
            <q-file v-model="imagenes[imgIndex]" filled :label="`Imagen-${imgIndex + 1}`">
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
      <q-btn class="full-width empresa-advance-btn" label="Añadir Imagen" @click="addImg"></q-btn>
    </div>
    <div class="col row full-width items-end justify-end q-gutter-sm">
      <q-btn class="col-auto revert-btn" label="Cancelar" @click="cancelar"/>
      <q-btn class="col-auto empresa-advance-btn" label="Guardar" @click="materializeImg"/>
    </div>
    <q-inner-loading :showing="uploadState">
      <q-spinner-facebook size="100px" color="primary"/>
      <q-linear-progress stripe rounded size="20px" :value="progress" color="warning" class="q-mt-sm"/>
    </q-inner-loading>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref, Ref} from "vue";
import {useQuasar} from "quasar";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {Auth} from "aws-amplify";
import Locacion from "layer/Entidades/Locacion";
import {useLocacionStore} from "stores/locacion-store";
import ImagenVisualizer from "components/ImagenVisualizer.vue";

const props = defineProps<{
  locacion: Locacion
}>();

const emits = defineEmits([
  "ok",
  "cancel"
]);


const $q = useQuasar();
const locationStore = useLocacionStore();

const maxImg = 10;

const imagenes: Ref<(File | null)[]> = ref([]);

const uploadState = ref(false);

const imagenesUploaded: Ref<{ [key: string]: string }[]> = ref([]);

onMounted(() => {
  console.log(props.locacion.carpetaimagenes);
  if (props.locacion.carpetaimagenes.length > 0) {
    for (let i = 0; i < props.locacion.carpetaimagenes.length; i++) {
      addImg();
      imagenesUploaded.value.push(props.locacion.carpetaimagenes[i]);
    }
  }
});

function addImg() {
  if (imagenes.value.length < 10) {
    imagenes.value.push(null);
  } else {
    $q.notify("El maximo actual de imagenes por locación es de 10.");
  }
}

function removeImg(imgIndex: number) {
  imagenes.value.splice(imgIndex, 1);
}

const currentLoaded = ref(0);
const totalToLoad = ref(0);

const progress = computed(() => {
  return currentLoaded.value / (totalToLoad.value == 0 ? 1 : totalToLoad.value);
});

const testAsync = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("ok");
    }, 2000);
  })
}

async function materializeImg() {
  try {
    const cliente = new S3Client({
      region: "us-east-1",
      credentials: await Auth.currentUserCredentials()
    });
    const commands = [] as PutObjectCommand[];
    const carpetaImagenes: { [key: string]: string }[] = [];
    for (let i = 0; i < imagenes.value.length; i++) {
      if (imagenes.value[i] !== null) {
        let img: File = imagenes.value[i] as File;
        const imgExtension = img.name.substring(img.name.lastIndexOf('.'));
        const command = new PutObjectCommand({
          Bucket: "um-image-original",
          Key: `${props.locacion.id}-${i}${imgExtension}`,
          Body: img,
          ContentType: img.type,
          Metadata: {
            locacionId: props.locacion.id,
            imgIndex: String(i)
          }
        });
        commands.push(command);
      }
      carpetaImagenes.push({
        "LQ": `https://um-image-presentation.s3.amazonaws.com/${props.locacion.id}/${i}/LQ.jpeg`,
        "MQ": `https://um-image-presentation.s3.amazonaws.com/${props.locacion.id}/${i}/MQ.jpeg`,
        "HQ": `https://um-image-presentation.s3.amazonaws.com/${props.locacion.id}/${i}/HQ.jpeg`
      });
    }
    totalToLoad.value = commands.length;
    currentLoaded.value = 0;
    uploadState.value = true;
    for (let command of commands) {
      const response = await cliente.send(command);
      console.log(response);
      currentLoaded.value = currentLoaded.value + 1;
    }
    await locationStore.updateImagesLocacion(carpetaImagenes);
    uploadState.value = false;
  } catch (error) {
    console.log("Error uploading file: ", error);
    uploadState.value = false;
  }
}

async function cancelar() {
  emits("cancel");
}

</script>

<style scoped lang="scss">

</style>
