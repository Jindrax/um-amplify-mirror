<template>
  <q-card-section v-if="imagen" class="col column q-gutter-md">
    <div class="col row q-gutter-lg">
      <q-select stack-label label="Resolución" class="col" v-model="imagenSelected" :options="['LQ', 'MQ', 'HQ']"/>
      <q-select stack-label label="Tamaño" class="col" v-model="tamSelected" :options="['200', '400', '600']"/>
    </div>
    <div class="col">
      <q-img ratio="4/3" fit="contain" :src="imagen[imagenSelected]" :alt="imagen[imagenSelected]"
             :style="{height: `${tamSelected}px`}"/>
    </div>
  </q-card-section>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref, Ref} from "vue";
import {useQuasar} from "quasar";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {Auth} from "aws-amplify";
import Locacion from "layer/Entidades/Locacion";
import {useLocacionStore} from "stores/locacion-store";

const props = defineProps<{
  imagen: { [key: string]: string }
}>();
const imagenSelected = ref("LQ");
const tamSelected = ref("200")
</script>

<style scoped lang="scss">

</style>
