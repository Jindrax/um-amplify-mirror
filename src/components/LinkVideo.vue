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
    <div class="col">
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
    </div>
    <div class="col">
      <video id="video" controls></video>
    </div>
    <div class="col row full-width items-end justify-end q-gutter-sm">
      <q-btn class="col-auto revert-btn" label="Cancelar" to="/dashboard/Empresas"/>
      <q-btn class="col-auto advance-btn" label="Guardar" @click="uploadVideo"/>
    </div>
    <q-inner-loading :showing="uploadState">
      <q-spinner-facebook size="100px" color="primary"/>
    </q-inner-loading>
    <q-btn @click="test"/>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, Ref} from "vue";
import Locacion from "layer/Entidades/Locacion";
import {Auth} from "aws-amplify";
import Hls from "hls.js";
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";

const props = defineProps<{
  locacion: Locacion
}>();

const uploadState = ref(false);

onMounted(() => {
  if (props.locacion.video.HLS) {
    let video: HTMLMediaElement | null = document.getElementById('video') as HTMLMediaElement;
    let videoSrc = props.locacion.video.HLS;
    if (Hls.isSupported()) {
      let hls = new Hls();
      hls.loadSource(videoSrc);
      if (video) {
        hls.attachMedia(video);
        video.play();
      }
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
    }
  }
});

const videoSelector: Ref<File> = ref(new File([], ""));

const uploadVideo = async () => {
  const typeIndex = videoSelector.value.name.lastIndexOf(".");
  const videoKey = props.locacion.id + videoSelector.value.name.substring(typeIndex);
  try {
    const cliente = new S3Client({
      region: "us-east-1",
      credentials: await Auth.currentUserCredentials()
    });
    const command = new PutObjectCommand({
      Bucket: "videoprocess-source-1nqha3vxbh9t1",
      Key: videoKey,
      Body: videoSelector.value,
      ContentType: videoSelector.value.type
    });
    uploadState.value = true;
    const response = await cliente.send(command);
    uploadState.value = false;
  } catch (error) {
    console.log("Error uploading file: ", error);
    uploadState.value = false;
  }
};

function test(){
  console.log(props.locacion);
}
</script>

<style lang="scss" scoped>
#video {
  height: 40vh;
  object-fit: contain;
}
</style>
