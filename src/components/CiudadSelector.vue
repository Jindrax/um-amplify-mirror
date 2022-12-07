<template>
  <q-select v-model="ciudadHolder" :options="ciudadOpcionesFiltrado" class="bg-white" use-input
            input-debounce="300" @filter="ciudadFilter" @update:model-value="bubbleUp"/>
</template>

<script lang="ts" setup>
import {onBeforeUnmount, ref, Ref, watchEffect} from "vue";
import {useCiudadStore} from "stores/ciudad-store";
import Ciudad from "layer/Entidades/Ciudad";

const props = defineProps<{
  modelValue: string,
  str: string,
  unidadAdminId: string | undefined
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void,
  (e: 'update:str', value: string): void
}>()

interface SelectOption<T> {
  label: string;
  value: T;
}

const ciudadStore = useCiudadStore();
const ciudadHolder: Ref<undefined | SelectOption<Ciudad>> = ref();
let ciudadOpcionesFiltrado: Ref<{ label: string, value: Ciudad }[]> = ref([]);

const unidadAdminWatcher = watchEffect(() => {
  if (props.unidadAdminId === undefined || props.unidadAdminId === "") {
    ciudadOpcionesFiltrado.value = [];
  } else {
    ciudadOpcionesFiltrado.value = ciudadStore.getCiudadesOptions(props.unidadAdminId);
  }
});

onBeforeUnmount(() => {
  unidadAdminWatcher();
});

const ciudadFilter = (filterVal: string, update: Function) => {
  update(() => {
    if (filterVal === "") {
      ciudadOpcionesFiltrado.value = ciudadStore.getCiudadesOptions(props.unidadAdminId!);
    } else {
      ciudadOpcionesFiltrado.value = ciudadStore.getCiudadesOptions(props.unidadAdminId!).filter((val) => {
        return val.label.match(new RegExp(`.*${filterVal}.*`));
      });
    }
  });
}

function bubbleUp(value: SelectOption<Ciudad>) {
  emits("update:modelValue", value.value.id);
  emits("update:str", value.value.nombre);
}

</script>

<style lang="scss" scoped>

</style>
