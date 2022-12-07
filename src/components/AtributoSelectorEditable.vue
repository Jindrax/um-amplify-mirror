<template>
  <div class="column q-gutter-y-sm">
    <div class="col row q-gutter-sm items-center">
      <q-item-label class="col-3 text-black text-subtitle1">Añadir Categoria</q-item-label>
      <q-select
          filled
          v-model="atributoSelector"
          :options="categorias"
          use-input
          input-debounce="300"
          @filter="atributosFilter"
          behavior="dialog"
          class="col"
          @update:model-value="addAtributo"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope['itemProps']">
            <q-item-section side>
              <q-avatar square>
                <img :src="scope.opt.value.imagen"/>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.label }}</q-item-label>
              <q-item-label caption>{{ scope.opt.value.description }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="col row q-gutter-sm items-center">
      <q-item-label class="col-3 text-black text-subtitle1">Añadir Atributo</q-item-label>
      <q-select
          filled
          v-model="atributoSelector"
          :options="atributos"
          use-input
          input-debounce="300"
          @filter="atributosFilter"
          behavior="dialog"
          class="col"
          @update:model-value="addAtributo"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope['itemProps']">
            <q-item-section avatar>
              <q-icon :name="`um-${scope.opt.value.icono}`"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.label }}</q-item-label>
              <q-item-label caption>{{ scope.opt.value.description }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="col row q-gutter-sm items-center">
      <q-item-label class="col-3 text-black text-subtitle1">Categoria Principal</q-item-label>
      <q-select
          filled
          v-model="categoriaPrincipalSeleccion"
          :options="categoriasDisponiblesOpciones"
          use-input
          input-debounce="300"
          class="col"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope['itemProps']">
            <q-item-section side>
              <q-avatar square>
                <img :src="scope.opt.value.imagen"/>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.label }}</q-item-label>
              <q-item-label caption>{{ scope.opt.value.description }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="col row q-gutter-sm items-center">
      <q-item-label class="col-3 text-black text-subtitle1">Atributos</q-item-label>
      <div class="col row">
        <div v-for="(atributo, indice) in atributosHolder" :key="`atributo-${atributo.id}`">
          <q-chip v-if="atributo.prioridad == 1" class="col bg-white shadow-4">
            <template v-slot:default>
              <q-item>
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="atributo.imagen">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ atributo.nombre }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn icon="cancel" flat padding="none" @click="removeAtributo(indice)"/>
                </q-item-section>
              </q-item>
            </template>
          </q-chip>
          <q-chip v-else class="col bg-white" :icon="`um-${atributo.icono}`"
                  outline removable @remove="removeAtributo(indice)">{{ atributo.nombre }}
          </q-chip>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {computed, onBeforeUnmount, onMounted, Ref, ref, watchEffect} from "vue";
import Atributo from "layer/Entidades/Atributo";
import {useAtributoStore} from "stores/atributo-store";
import {RegistroCambiosAtributos} from "layer/Entidades/ActualizarLocacion";
import {storeToRefs} from "pinia";

const atributosStore = useAtributoStore();

const props = defineProps<{
  modelValue: Atributo[]
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>();

const atributosHolder = ref([] as Atributo[]);
const atributoSelector: Ref<undefined | { label: string, value: Atributo }> = ref();
const atributosOpciones = ref([] as { label: string, value: Atributo }[]);
const {getAtributosOptions} = storeToRefs(atributosStore);
const categorias = getAtributosOptions.value.filter((atributo) => atributo.value.prioridad == 1);
const atributos = getAtributosOptions.value.filter((atributo) => atributo.value.prioridad != 1);
const registroCambios: Ref<RegistroCambiosAtributos> = ref({
  add: [],
  remove: []
});
const categoriasDisponiblesOpciones = computed(() => {
  return atributosHolder.value.filter((atributo) => {
    return atributo.prioridad == 1;
  }).map((atributo) => {
    return {label: atributo.nombre, value: atributo}
  });
});
const categoriaPrincipalSeleccion = ref();

onMounted(() => {
  atributosHolder.value = props.modelValue.map((val) => val);
});

const atributosWatcher = watchEffect(() => {
  atributosOpciones.value = atributosStore.getAtributosOptions;
});

onBeforeUnmount(() => {
  atributosWatcher();
});

const addAtributo = (atributo: { label: string, value: Atributo }) => {
  registrarAdicion(atributo.value);
  atributosHolder.value.push(atributo.value);
  atributoSelector.value = undefined;
  atributosHolder.value.sort((a: Atributo, b: Atributo) => {
    return a.prioridad - b.prioridad;
  });
  emits("update:modelValue", atributosHolder.value);
};

const removeAtributo = (indice: number) => {
  registrarEliminacion(atributosHolder.value[indice]);
  atributosHolder.value.splice(indice, 1);
  emits("update:modelValue", atributosHolder.value);
}

function registrarEliminacion(atributo: Atributo) {
  const indiceEncontrado = registroCambios.value.add.findIndex((atr) => atr.id === atributo.id);
  if (indiceEncontrado !== -1) {
    registroCambios.value.add.splice(indiceEncontrado, 1);
  } else {
    registroCambios.value.remove.push(atributo);
  }
}

function registrarAdicion(atributo: Atributo) {
  const indiceEncontrado = registroCambios.value.remove.findIndex((atr) => atr.id === atributo.id);
  if (indiceEncontrado !== -1) {
    registroCambios.value.remove.splice(indiceEncontrado, 1);
  } else {
    registroCambios.value.add.push(atributo);
  }
}

const atributosFilter = (filterVal: string, update: Function) => {
  update(() => {
    if (filterVal === "") {
      atributosOpciones.value = atributosStore.getAtributosOptions;
    } else {
      atributosOpciones.value = atributosStore.getAtributosOptions.filter((val) => {
        return val.value.nombre.match(new RegExp(`.*${filterVal}.*`, 'i'));
      });
    }
  });
}

function resetComponent() {
  atributosHolder.value = [];
  atributoSelector.value = undefined;
  registroCambios.value = {
    add: [],
    remove: []
  };
}

function getCambios() {
  return registroCambios.value;
}

defineExpose({
  resetComponent,
  getCambios
});

function test() {
  console.log(registroCambios.value);
}

</script>

<style lang="scss" scoped>

</style>
