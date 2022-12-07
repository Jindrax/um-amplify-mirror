<template>
  <div class="column">
    <div class="col column q-gutter-sm">
      <q-input class="col" v-model="nuevoAtributo.nombre" label="Nombre"/>
      <q-input class="col" v-model="nuevoAtributo.descripcion" label="Descripción"/>
      <q-select v-model.number="nuevoAtributo.prioridad" :options="[1, 2, 3]" emit-value label="Prioridad"/>
      <q-select
          filled
          v-model="iconoSelector"
          :options="iconos"
          label="Icono"
          clearable
          use-input
          input-debounce="300"
          @filter="iconosFilter"
          behavior="dialog"
      >
        <template v-slot:prepend>
          <q-icon :name="iconoSelector? iconoSelector.icon : 'um-null'" :color="colorPicker.cssColor"/>
        </template>
        <template v-slot:option="scope">
          <q-item v-bind="scope['itemProps']">
            <q-item-section avatar>
              <q-icon :name="scope.opt.icon"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <div class="col row items-center">
        <q-icon class="col" :name="iconoSelector? iconoSelector.icon : 'um-null'"
                :style="{'color': colorPicker.cssColor}" size="20vw"/>
        <ColorPicker class="col" v-model="colorPicker" color="black" :visible-formats="['hex']" :default-format="'hex'"
                     alpha-channel="hide" @color-change="changeColor">
          <template slot="copy-button">
            <div></div>
          </template>
        </ColorPicker>
      </div>
      <q-file v-if="nuevoAtributo.prioridad === 1" v-model="fileImageHolder" filled label="Imagen Asociada">
        <template v-slot:prepend>
          <q-icon name="cloud_upload" @click.stop/>
        </template>
        <template v-slot:append>
          <q-icon class="cursor-pointer" name="close" @click.stop=""/>
        </template>
        <template v-slot:hint>
          Imagen Asociada
        </template>
      </q-file>
      <q-btn v-if="!editable" label="Nuevo Atributo" class="col full-width advance-btn" @click="insertAtributo"/>
      <div v-if="editable" class="col row q-gutter-x-sm">
        <q-btn label="Cancelar Edición" class="col revert-btn" @click="cancelEditAtributo"/>
        <q-btn label="Actualizar Atributo" class="col advance-btn" @click="insertAtributo"/>
      </div>
    </div>
    <atributos-table class="col" :data="getAtributos" @edit="editarAtributo"/>
    <q-inner-loading :showing="loadState">
      <q-spinner-facebook size="100px" color="primary"/>
    </q-inner-loading>
  </div>
</template>

<script lang="ts" setup>
import AtributosTable from "components/AtributosTable.vue";
import {ref} from "vue";
import Atributo from "layer/Entidades/Atributo";
import {uid, useQuasar} from "quasar";
import {useAtributoStore} from "stores/atributo-store";
import {storeToRefs} from "pinia";

const atributoStore = useAtributoStore();
const {getAtributos, editable} = storeToRefs(atributoStore);
const {notify} = useQuasar();
const loadState = ref(false);
import {ColorPicker} from 'vue-accessible-color-picker'

import glyphmap from "src/assets/glyphmap.json";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {Auth} from "aws-amplify";

const fileImageHolder = ref();

const iconos = ref(Object.keys(glyphmap).map((icono) => {
  return {label: icono, icon: `um-${icono}`};
}) as { label: string, icon: string }[]);

const colorPicker = ref({cssColor: 'black'});

const iconosFilter = (filterVal: string, update: Function) => {
  update(() => {
    if (filterVal === "") {
      iconos.value = Object.keys(glyphmap).map((icono) => {
        return {label: icono, icon: `um-${icono}`};
      });
    } else {
      const filtrados = Object.keys(glyphmap).filter((val) => {
        return val.match(new RegExp(`.*${filterVal}.*`, "i"));
      });
      iconos.value = filtrados.map((val) => {
        return {label: val, icon: `um-${val}`};
      });
    }
  });
}

const nuevoAtributo = ref(new Atributo({id: uid()}));
const iconoSelector = ref();

const insertAtributo = async () => {
  try {
    nuevoAtributo.value.icono = iconoSelector.value.label;
    nuevoAtributo.value.csscolor = colorPicker.value.cssColor;
    loadState.value = true;
    if (nuevoAtributo.value.prioridad === 1 && fileImageHolder.value !== undefined) {
      const cliente = new S3Client({
        region: "us-east-1",
        credentials: await Auth.currentUserCredentials()
      });
      let img: File = fileImageHolder.value as File;
      const imgExtension = img.name.substring(img.name.lastIndexOf('.'));
      const command = new PutObjectCommand({
        Bucket: "um-category-image-source",
        Key: `${nuevoAtributo.value.id}${imgExtension}`,
        Body: img,
        ContentType: img.type,
        Metadata: {
          atributoId: nuevoAtributo.value.id
        }
      });
      await cliente.send(command);
      await (new Promise((resolve)=>{
        setTimeout(()=>{
          resolve({});
        }, 5000)
      }));
      nuevoAtributo.value.imagen = `https://um-category-image-presentation.s3.amazonaws.com/${nuevoAtributo.value.id}/100.jpeg`
    }
    await atributoStore.addAtributo(nuevoAtributo.value);
    loadState.value = false;
    notify("Atributo creado correctamente");
    nuevoAtributo.value = new Atributo({id: uid()});
    iconoSelector.value = undefined;
    colorPicker.value = {cssColor: 'black'}
    fileImageHolder.value = undefined;
  } catch (e) {
    loadState.value = false;
    console.log(e);
    notify("Ha ocurrido un error en el servidor");
  }
};

function changeColor(event: any) {
  colorPicker.value = event;
}

function editarAtributo(atributo: Atributo) {
  nuevoAtributo.value = atributo;
  iconoSelector.value = {label: atributo.icono, icon: `um-${atributo.icono}`}
  colorPicker.value.cssColor = atributo.csscolor;
  atributoStore.editAtributo(atributo);
}

function cancelEditAtributo() {
  atributoStore.cancelEditAtributo();
  iconoSelector.value = undefined;
  colorPicker.value = {cssColor: 'black'}
}

</script>

<style lang="scss" scoped>

</style>
