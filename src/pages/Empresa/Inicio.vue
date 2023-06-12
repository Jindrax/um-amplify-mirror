<template>
  <q-page class="column items-start justify-start">

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
import {useRouter} from "vue-router";

const {user, userInfo} = storeToRefs(useSessionStore());
const locationStore = useLocacionStore();
const locaciones = locationStore.getLocaciones(userInfo.value.sub);

const router = useRouter();

onMounted(async () => {
  await router.push({name: "Locaciones"});
})

</script>
