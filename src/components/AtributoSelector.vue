<template>
  <div class="column q-gutter-y-sm">
    <div class="col row q-gutter-sm items-center">
      <q-item-label class="col-3 text-black text-subtitle1">Categoria principal</q-item-label>
      <q-select
          filled
          v-model="categoriaMain"
          :options="categorias"
          behavior="dialog"
          class="col"
          @update:model-value="setCategoriaMain"
          map-options
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
      <q-item-label class="col-3 text-black text-subtitle1">Categoria secundaria</q-item-label>
      <q-select
          filled
          v-model="categoriaSub"
          :options="categorias"
          behavior="dialog"
          class="col"
          @update:model-value="setCategoriaSub"
          map-options
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
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, Ref, ref} from "vue";
import Atributo from "layer/Entidades/Atributo";
import {useAtributoStore} from "stores/atributo-store";
import {storeToRefs} from "pinia";

type QSelectOption = { label: string, value: Atributo };

const atributosStore = useAtributoStore();

const props = defineProps<{
  modelValue: Atributo[],
  categoriamain: string,
  categoriasub: string
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: Atributo[]): void,
  (e: 'update:categoriamain', value: string): void,
  (e: 'update:categoriasub', value: string): void
}>();

const atributosHolder = ref([{}, {}] as Atributo[]);
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
const categoriaMain = ref();
const categoriaSub = ref();

onMounted(() => {
  let main = props.categoriamain, sub = props.categoriasub;
  categorias.forEach((categoria) => {
    if (main !== "") {
      if (categoria.value.id === main) {
        categoriaMain.value = {
          label: categoria.label,
          value: categoria.value
        }
      }
    }
    if (sub !== "") {
      if (categoria.value.id === sub) {
        categoriaSub.value = {
          label: categoria.label,
          value: categoria.value
        }
      }
    }
  });
});

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

function setCategoriaMain(atributo: QSelectOption) {
  categoriaMain.value = atributo.value;
  atributosHolder.value[0] = atributo.value;
  emits("update:modelValue", atributosHolder.value);
  emits("update:categoriamain", categoriaMain.value.id);
}

function setCategoriaSub(atributo: QSelectOption) {
  categoriaSub.value = atributo.value;
  atributosHolder.value[1] = atributo.value;
  emits("update:modelValue", atributosHolder.value);
  emits("update:categoriasub", categoriaSub.value.id);
}

function resetComponent() {
  atributosHolder.value = [];
  categoriaMain.value = undefined;
  categoriaSub.value = undefined;
}

defineExpose({
  resetComponent
})

</script>

<style lang="scss" scoped>

</style>
