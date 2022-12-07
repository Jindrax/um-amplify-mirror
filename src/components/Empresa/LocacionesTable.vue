<template>
  <q-list class="full-width" separator>
    <q-resize-observer @resize="resizeEvent"/>
    <EmpresaView v-for="locacion in locaciones" :locacion="locacion" :width="allocableWidth"/>
  </q-list>
</template>

<script lang="ts" setup>
import EmpresaView from "./LocacionView.vue";
import {onMounted, ref} from "vue";
import Locacion from "layer/Entidades/Locacion";
import {API} from "aws-amplify";

const locaciones = ref();

onMounted(async () => {
  locaciones.value = await API.get("umapi", `/locaciones/admin`, {});
})

const allocableWidth = ref(100);

const resizeEvent = (size: { height: number, width: number }) => {
  allocableWidth.value = size.width;
};

</script>

<style lang="scss" scoped>

</style>
