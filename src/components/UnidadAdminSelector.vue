<template>
  <q-select v-model="unidadAdminHolder" :options="unidadAdminStore.getUnidadesAdminOptions"
            class="bg-white" @update:model-value="bubbleUp"/>
</template>

<script lang="ts" setup>
import {ref, Ref} from "vue";
import UnidadAdmin from "layer/Entidades/UnidadAdmin";
import {useUnidadAdminStore} from "stores/unidadadmin-store";

const props = defineProps<{
  modelValue: string,
  str: string
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void,
  (e: 'update:str', value: string): void,
}>()

interface SelectOption<T> {
  label: string;
  value: T;
}

const unidadAdminHolder: Ref<undefined | SelectOption<UnidadAdmin>> = ref();
const unidadAdminStore = useUnidadAdminStore();

function bubbleUp(value: SelectOption<UnidadAdmin>) {
  emits("update:modelValue", value.value.id);
  emits("update:str", value.value.nombre);
}

</script>

<style lang="scss" scoped>

</style>
