<template>
  <div class="column q-py-sm q-gutter-y-sm">
    <q-input class="col bg-white" label="Buscar por nit" outlined v-model="filter">
      <template v-slot:append>
        <q-icon name="search"/>
      </template>
    </q-input>
    <q-input class="col bg-white" label="Buscar por nombre" outlined v-model="nombreFilter">
      <template v-slot:append>
        <q-icon name="search"/>
      </template>
    </q-input>
    <q-markup-table class="col">
      <thead>
      <tr>
        <th class="text-left">Nit</th>
        <th class="text-left">Nombre</th>
        <th class="text-left">Ciudad</th>
        <th class="text-left">Fecha inicio</th>
        <th class="text-left">Pago hasta</th>
        <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="empresa in filtered" :key="empresa.id">
        <td class="text-left">{{ empresa.empresa }}</td>
        <td>{{ empresa.nombrecompleto }}</td>
        <td>{{ empresa.ciudadstr }}</td>
        <td>{{ moment(empresa.creadoen).utc().format("DD-MM-YYYY") }}</td>
        <td>{{ moment(empresa.pagohasta).utc().format("DD-MM-YYYY") }}</td>
        <td class="text-center">
          <div class="row q-gutter-x-sm">
            <q-btn class="col" label="Editar" color="green" @click="editLocation(empresa)"/>
            <q-btn class="col" v-if="isAdmin" label="Eliminar" color="red" @click="deleteLocation(empresa)"/>
          </div>
        </td>
      </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script lang="ts" setup>
import moment from "moment";
import Locacion from "layer/Entidades/Locacion";
import {useLocacionStore} from "stores/locacion-store";
import {useRouter} from "vue-router";
import {useSessionStore} from "stores/session-store";
import {storeToRefs} from "pinia";
import {Dialog, Notify} from "quasar";
import {computed, ref} from "vue";

const props = defineProps<{
  data: Locacion[]
}>();

const locacionStore = useLocacionStore();
const router = useRouter();
const {isAdmin} = storeToRefs(useSessionStore());

const editLocation = async (locacion: Locacion) => {
  await locacionStore.editLocacion(locacion);
  await router.push({name: "EmpresaEditar"});
};

const filter = ref("");
const nombreFilter = ref("");

const filtered = computed(() => {
  if (filter.value === "") {
    if (nombreFilter.value === "") {
      return props.data;
    } else {
      return props.data.filter((locacion) => {
        return locacion.nombrecompleto.match(RegExp(".*" + nombreFilter.value + ".*", "i"));
      });
    }
  } else {
    return props.data.filter((locacion) => {
      return locacion.empresa.startsWith(filter.value);
    });
  }
})

const deleteLocation = (locacion: Locacion) => {
  Dialog.create({
    message: `Ingrese el nombre total de la locación para poder eliminarla, '${locacion.nombrecompleto}'`,
    title: "Eliminar locación",
    prompt: {
      type: "text",
      model: ""
    },
    cancel: "Cancelar",
    ok: {
      label: "Eliminar",
      color: "red"
    }
  }).onOk(async (payload) => {
    if (payload == locacion.nombrecompleto) {
      try {
        const res = await locacionStore.deleteLocacion(locacion.id);
        Notify.create({
          message: "La locación ha sido eliminada"
        });
      } catch (e) {
        console.log(e);
        Notify.create({
          message: "Ha ocurrido un error en el servidor"
        });
      }
    } else {
      Notify.create({
        message: "El nombre ingresado no corresponde al nombre de la locación"
      });
    }
    console.log(payload);
  });
}

</script>

<style lang="scss" scoped>

</style>
