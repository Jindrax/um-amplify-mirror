<template>
  <div class="column">
    <q-item class="col-auto">
      <q-item-section>
        <q-item-label class="index-item-title">{{ index.title }}</q-item-label>
      </q-item-section>
      <q-btn color="green" icon="arrow_upward" size="xs" round/>
    </q-item>
    <q-separator class="col-auto"/>
    <q-item class="col-auto">
      <q-item-section>
        <q-item-label class="index-item-value">{{ index.value }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-item v-if="index.subtitle !== undefined" class="col-auto">
      <q-item-section>
        <q-item-label class="index-item-subtitle">{{ index.subtitle }}</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script lang="ts" setup>

import {InicioIndexItem} from "src/interfaces/InicioIndexInterfaces";

const props = defineProps<{
  index: InicioIndexItem
}>();

</script>

<style lang="scss" scoped>
.index-item-title {
  font-size: 2vh;
}

.index-item-value {
  font-size: 4vh;
  font-weight: bold;
}

.index-item-subtitle {
  font-size: 1vh;
}
</style>
