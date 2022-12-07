<template>
  <q-page class="column items-start justify-start">
<!--    <q-card>-->
<!--      <q-card-section>-->
<!--        <span class="text-h4">Categorias</span>-->
<!--        <q-separator class="q-my-sm"/>-->
<!--        <div class="row q-gutter-sm justify-start items-center">-->
<!--          <q-item v-for="categoria in categorias" :key="`categoria-${categoria.value.id}`" :class="categoriaSeleccion === categoria.value? 'bg-primary text-white shadow-4' : 'bg-white shadow-4'" clickable @click="seleccionarCategoria(categoria.value)" dense>-->
<!--            <q-item-section avatar>-->
<!--              <q-avatar square>-->
<!--                <img :src="categoria.value.imagen">-->
<!--              </q-avatar>-->
<!--            </q-item-section>-->
<!--            <q-item-section>-->
<!--              <q-item-label>{{ categoria.label }}</q-item-label>-->
<!--            </q-item-section>-->
<!--          </q-item>-->
<!--        </div>-->
<!--        <q-card-section>-->
<!--          <span class="text-h6">Atributos</span>-->
<!--          <q-separator class="q-my-sm"/>-->
<!--          <div class="row q-gutter-sm justify-start">-->
<!--            <q-chip v-for="atributo in atributos" :key="`atributo-${atributo.value.id}`" :class="atributosSeleccion.includes(atributo)? 'bg-primary text-white' : 'bg-white'" clickable @click="seleccionarAtributo(atributo)" :icon="`um-${atributo.value.icono}`" outline>{{ atributo.label }}</q-chip>-->
<!--          </div>-->
<!--        </q-card-section>-->
<!--      </q-card-section>-->
<!--    </q-card>-->

  </q-page>
</template>

<script lang="ts" setup>
// import {useAtributoStore} from "stores/atributo-store";
// import Atributo from "layer/Entidades/Atributo";
// import {ref} from "vue";
//
// const atributoStore = useAtributoStore();
// const atributosOpciones: { label: string, value: Atributo }[] = atributoStore.getAtributosOptions;
// const categorias = atributosOpciones.filter((atributo) => atributo.value.prioridad == 1);
// const atributos = atributosOpciones.filter((atributo) => atributo.value.prioridad != 1);
//
// const categoriaSeleccion = ref();
// const categoriaAnterior = ref();
// const atributosSeleccion = ref([] as {label: string, value: Atributo}[]);
// const categoriaMapAtributos = ref(new Map());
//
// function seleccionarCategoria(val: Atributo) {
//   categoriaSeleccion.value = val;
//   if (!categoriaMapAtributos.value.has(val.nombre)) {
//     categoriaMapAtributos.value.set(val.nombre, []);
//   }
//   if (categoriaSeleccion.value !== undefined) {
//     categoriaMapAtributos.value.set(categoriaAnterior.value, atributosSeleccion.value);
//   }
//   atributosSeleccion.value = categoriaMapAtributos.value.get(val.nombre);
//   categoriaAnterior.value = val.nombre;
// }
//
// function seleccionarAtributo(val: {label: string, value: Atributo}){
//   if(atributosSeleccion.value.includes(val)){
//     const foundIndex = atributosSeleccion.value.indexOf(val);
//     atributosSeleccion.value.splice(foundIndex, 1);
//   }else{
//     atributosSeleccion.value.push(val);
//   }
// }
import {S3Client} from "@aws-sdk/client-s3";
import {Auth} from "aws-amplify";

const cliente = new S3Client({
  region: "us-east-1",
  credentials: await Auth.currentUserCredentials()
});


</script>

<style lang="scss" scoped>

</style>
