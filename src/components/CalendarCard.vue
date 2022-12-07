<template>
  <div class="column q-pa-sm vertical-list-component">
    <q-item>
      <q-item-section>
        <q-item-label class="vertical-list-title">Calendario</q-item-label>
      </q-item-section>
    </q-item>
    <q-date
      v-model="date"
      minimal
    />
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
const date = ref("");
</script>

<style lang="scss" scoped>
.vertical-list-title {
  font-size: 2vh;
  font-weight: bold;
}

.vertical-list-item {
  font-size: 2vh;
}

.vertical-list-container {
  background: white;
}

.vertical-list-component {
  width: 20vw;
}

.floating-button {
  position: absolute;
  right: -10px;
  bottom: -10px;
}
</style>
