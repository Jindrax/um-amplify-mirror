<template>
  <q-card>
    <q-item>
      <q-item-section>
        <q-item-label>
          {{ element.title }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-markup-table>
      <thead>
      <tr>
        <th v-for="(itemSchema, index) in element.schema" :key="itemSchema.title + index" class="text-left">
          {{ itemSchema.title }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in data" :key="item[element.schema[0].title]">
        <td v-for="itemSchema in element.schema" :key="element.title + index + itemSchema.title"
            :class="itemSchema.style === TableBoardItemStyle.BOLD? 'item-bold' : ''">
          {{ item[itemSchema.title.toLowerCase()] }}
        </td>
      </tr>
      </tbody>
    </q-markup-table>
  </q-card>
</template>

<script lang="ts" setup>
import {TableBoardElement, TableBoardItemStyle} from "src/interfaces/TableBoardInterfaces";

const props = defineProps<{
  element: TableBoardElement,
  data: any[]
}>();
</script>

<style lang="scss" scoped>
.item-bold {
  font-weight: bold;
}
</style>
