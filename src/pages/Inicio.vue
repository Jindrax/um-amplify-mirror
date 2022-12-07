<template>
  <q-page class="column items-start justify-start">
    <div class="col-auto row full-width">
      <div v-for="plug in plugins" :key="plug.title" class="col-2 q-pa-sm">
        <inicio-index :index="plug"/>
      </div>
    </div>
    <div class="col-auto row">
      <vertical-list :list="empresas" title="Mis empresas" action-url="/sdasf"/>
      <vertical-list :list="boletines" title="Boletines"/>
      <vertical-list :list="novedades" title="Novedades"/>
      <calendar-card/>
    </div>
    <q-btn label="test" @click="test"/>
  </q-page>
</template>

<script lang="ts" setup>
import VerticalList from 'components/VerticalList.vue';
import InicioIndex from 'components/InicioIndex.vue';
import CalendarCard from 'components/CalendarCard.vue';
import {VerticalListItem} from "src/interfaces/VerticalListInterfaces";
import {InicioIndexItem} from "src/interfaces/InicioIndexInterfaces";
import {Auth} from "aws-amplify";
import {useLocacionStore} from "stores/locacion-store";
import {computed, onMounted, Ref, ref} from "vue";
import {useSessionStore} from "stores/session-store";
import {storeToRefs} from "pinia";
import {CognitoUser} from "@aws-amplify/auth";

const {user, userInfo} = storeToRefs(useSessionStore());
const locationStore = useLocacionStore();
const locaciones = locationStore.getLocaciones(userInfo.value.sub);

const numLocaciones = computed(() => {
  return locationStore.getLocaciones(userInfo.value.sub).length;
});

const plugins: Ref<InicioIndexItem[]> = ref([
  {title: "Mis locaciones", value: numLocaciones},
  {title: "Proximo Pago", value: "$4.000.000", subtitle: "05/01/2022"}
]);
const empresas: VerticalListItem[] = locaciones.map((locacion) => {
  return {name: locacion.nombrecompleto, link: ""};
});
const boletines: VerticalListItem[] = [
  {
    name: "Concurso Abril",
    link: "/sd"
  },
  {
    name: "Revisar Empresas Febrero",
    link: "/sd"
  }
];
const novedades: VerticalListItem[] = [
  {
    name: "Nuevo Horario Pique y re pique",
    link: "/sd"
  },
  {
    name: "Cambio imagenes Granja Burger",
    link: "/sd"
  }
]

</script>
