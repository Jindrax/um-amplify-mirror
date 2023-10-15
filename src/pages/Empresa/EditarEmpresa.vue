<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" maximized>
    <q-card class="q-dialog-plugin">
      <q-tabs
          v-model="tab"
          active-color="white"
          active-bg-color="accent"
          align="justify"
          narrow-indicator
          class="full-width"
      >
        <q-tab label="Editar" name="edit"/>
        <q-tab label="Enlazar Video" name="linkVideo"/>
        <q-tab label="Enlazar Imagenes" name="linkImages"/>
      </q-tabs>
      <q-tab-panels v-model="tab" animated class="full-width">
        <q-tab-panel name="edit">
                <empresa-edit-empresa-component :locacion="locacionEditable" @ok="ok" @cancel="cancel"/>
        </q-tab-panel>

        <q-tab-panel name="linkVideo">
                <empresa-link-video :locacion="locacionEditable" @ok="ok" @cancel="cancel"/>
        </q-tab-panel>

        <q-tab-panel name="linkImages">
                <empresa-link-images :locacion="locacionEditable" @ok="ok" @cancel="cancel"/>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {useLocacionStore} from "stores/locacion-store";
import {storeToRefs} from "pinia";
import EmpresaEditEmpresaComponent from "components/Empresa/Edicion/EmpresaEditEmpresaComponent.vue";
import EmpresaLinkVideo from "components/Empresa/Edicion/EmpresaLinkVideo.vue";
import EmpresaLinkImages from "components/Empresa/Edicion/EmpresaLinkImages.vue";
import {useDialogPluginComponent} from 'quasar'

defineEmits([
  ...useDialogPluginComponent.emits
]);

const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent();

function ok() {
  onDialogOK();
}

function cancel() {
  onDialogCancel();
}

const tab = ref("edit");

const {locacionEditable} = storeToRefs(useLocacionStore());

</script>

<style lang="scss" scoped>
span {
  font-size: 2vh;
}
</style>
