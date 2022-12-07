<template>
  <div class="column q-gutter-y-sm">
    <div class="col row q-gutter-sm items-center">
      <q-item-label class="col-3 text-black text-subtitle1">Añadir Categoria</q-item-label>
      <q-select
          filled
          v-model="atributoSelector"
          :options="categorias"
          behavior="dialog"
          class="col"
          @update:model-value="addAtributo"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope['itemProps']">
            <q-item-section side>
              <q-avatar square>
                <img :src="scope.opt.value.imagen" alt="Imagen Categoria"/>
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
          @update:model-value="principalSelected"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope['itemProps']">
            <q-item-section side>
              <q-avatar square>
                <img :src="scope.opt.value.imagen" alt="Imagen Categoria"/>
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
          <q-chip v-if="Number(atributo.prioridad) === 1" class="col bg-white shadow-4">
            <template v-slot:default>
              <q-item>
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="atributo.imagen" alt="Imagen Categoria">
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
import {computed, Ref, ref} from "vue";
import Atributo from "layer/Entidades/Atributo";
import {useAtributoStore} from "stores/atributo-store";
import {storeToRefs} from "pinia";

type QSelectOption = { label: string, value: Atributo };

const atributosStore = useAtributoStore();

const props = defineProps<{
  modelValue: Atributo[]
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>();

const atributosHolder = ref([] as Atributo[]);
const atributoSelector: Ref<undefined | QSelectOption> = ref();
const {getAtributosOptions} = storeToRefs(atributosStore);
const categorias: QSelectOption[] = getAtributosOptions.value.filter((atributo) => atributo.value.prioridad == 1);
const atributos: QSelectOption[] = getAtributosOptions.value.filter((atributo) => atributo.value.prioridad != 1);
const categoriasDisponiblesOpciones = computed(() => {
  return atributosHolder.value.filter((atributo) => {
    return atributo.prioridad == 1;
  }).map((atributo) => {
    return {label: atributo.nombre, value: atributo}
  });
});
const categoriaPrincipalSeleccion = ref(undefined as unknown as QSelectOption);

function compareFn(a: Atributo, b: Atributo) {
  if (categoriaPrincipalSeleccion.value && Number(a.prioridad) === 1 && Number(b.prioridad) === 1) {
    if (a.id === categoriaPrincipalSeleccion.value.value.id) {
      return -1;
    } else {
      return 1;
    }
  } else {
    if (a.prioridad === b.prioridad) {
      return 0;
    }
    if (a.prioridad < b.prioridad) {
      return -1;
    } else {
      return 1;
    }
  }
}

function addAtributo(atributo: QSelectOption) {
  atributosHolder.value.push(atributo.value);
  atributoSelector.value = undefined;
  atributosHolder.value.sort(compareFn);
  emits("update:modelValue", atributosHolder.value);
}

function removeAtributo(indice: number) {
  atributosHolder.value.splice(indice, 1);
  atributosHolder.value.sort(compareFn);
  emits("update:modelValue", atributosHolder.value);
}

function resetComponent() {
  atributosHolder.value = [];
  atributoSelector.value = undefined;
}

function principalSelected() {
  atributosHolder.value.sort(compareFn);
}

defineExpose({
  resetComponent
})

</script>

<style lang="scss" scoped>

</style>
