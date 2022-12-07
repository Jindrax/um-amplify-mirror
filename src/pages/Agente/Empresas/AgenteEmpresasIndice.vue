<template>
  <q-page class="column items-start justify-start">
    <div class="col-auto full-width">
      <q-btn icon="add" label="Nuevo" class="advance-btn full-width" :to="{ name: 'EmpresaNueva' }"/>
    </div>
    <div class="col-auto full-width">
      <empresas-table :data="locacionStore.getLocaciones(userInfo.sub)"/>
    </div>
    <div class="col-auto full-width">
      <table-board :element="elemento" :data="data"/>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import EmpresasTable from 'components/EmpresasTable.vue';
import TableBoard from "components/TableBoard.vue";
import {TableBoardElement, TableBoardItemStyle} from "src/interfaces/TableBoardInterfaces";
import {useSessionStore} from "stores/session-store";
import {ref, Ref} from "vue";
import {useLocacionStore} from "stores/locacion-store";
import {storeToRefs} from "pinia";

const {userInfo} = storeToRefs(useSessionStore());
const locacionStore = useLocacionStore();
const empresas: Ref<Location[]> = ref([]);
const elemento: TableBoardElement = {
  title: "Novedades",
  schema: [
    {
      title: "Empresa",
      style: TableBoardItemStyle.NONE
    },
    {
      title: "Tipo",
      style: TableBoardItemStyle.NONE
    },
    {
      title: "Fecha",
      style: TableBoardItemStyle.NONE
    },
    {
      title: "Estado",
      style: TableBoardItemStyle.BOLD
    }
  ]
};
const data: Ref<any[]> = ref([
  {
    empresa: "Granja Burguer",
    tipo: "Imagenes",
    fecha: "14 Dic 2021",
    estado: "Pendiente"
  }
]);

</script>

<style lang="scss" scoped>

</style>
