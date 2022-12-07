<template>
  <q-page>
    <q-tabs
        v-model="tab"
        active-color="white"
        active-bg-color="black"
        align="justify"
        narrow-indicator
    >
      <q-tab label="Editar" name="edit"/>
      <q-tab label="Enlazar Video" name="linkVideo"/>
      <q-tab label="Enlazar Imagenes" name="linkImages"/>
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="edit">
        <edit-empresa-component :locacion="locacionEditable"/>
      </q-tab-panel>

      <q-tab-panel name="linkVideo">
        <link-video :locacion="locacionEditable"/>
      </q-tab-panel>

      <q-tab-panel name="linkImages">
        <link-images :locacion="locacionEditable"/>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import EditEmpresaComponent from "components/EditEmpresaComponent.vue";
import LinkVideo from "components/LinkVideo.vue";
import LinkImages from "components/LinkImages.vue";
import {useLocacionStore} from "stores/locacion-store";
import {storeToRefs} from "pinia";

const tab = ref("edit");

const {locacionEditable} = storeToRefs(useLocacionStore());

</script>

<style lang="scss" scoped>
span {
  font-size: 2vh;
}
</style>
