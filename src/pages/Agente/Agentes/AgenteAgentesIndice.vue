<template>
  <div class="col-auto full-width">
    <q-btn class="advance-btn full-width" icon="add" label="Nuevo" :to="{name: 'AgenteNuevo'}"/>
  </div>
  <div class="col-auto full-width">
    <agentes-table :agentes="getAgentes"/>
  </div>
</template>

<script lang="ts" setup>
import AgentesTable from "components/AgentesTable.vue";
import {storeToRefs} from "pinia";
import {useAgenteStore} from "stores/agente-store";

const {getAgentes} = storeToRefs(useAgenteStore());
</script>

<style lang="scss" scoped>

</style>
