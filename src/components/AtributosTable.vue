<template>
  <div class="column">
    <div class="col-auto q-py-sm">
      <q-markup-table wrap-cells>
        <thead>
        <tr>
          <th class="text-left">Nombre</th>
          <th class="text-left">Descripción</th>
          <th class="text-left">Prioridad</th>
          <th class="text-left">Icono</th>
          <th class="text-left">Imagen</th>
          <th class="text-left">Acción</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="atributo in data" :key="atributo.id">
          <td class="text-left">{{ atributo.nombre }}</td>
          <td style="word-wrap: break-word">{{ atributo.descripcion }}</td>
          <td>{{ atributo.prioridad }}</td>
          <td>
            <q-icon :name="`um-${atributo.icono}`" size="lg" :style="{'color': atributo.csscolor}">
              <q-tooltip style="font-size: 1.5vw">{{ atributo.descripcion }}</q-tooltip>
            </q-icon>
          </td>
          <td>
            <q-img v-if="atributo.imagen" ratio="4/3" fit="contain" :src="atributo.imagen" :alt="`Imagen-${atributo.nombre}`"
                   style="height: 100px"/>
          </td>
          <td>
            <q-btn label="editar" color="green" @click="editarAtributo(atributo)"/>
          </td>
        </tr>
        </tbody>
      </q-markup-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Atributo from "layer/Entidades/Atributo";

const props = defineProps<{
  data: Atributo[]
}>();

const emits = defineEmits<{
  (e: 'edit', value: Atributo): void
}>();

function editarAtributo(atributo: Atributo) {
  emits('edit', atributo);
}

</script>

<style lang="scss" scoped>

</style>
