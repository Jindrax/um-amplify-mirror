<template>
  <q-page class="column items-start justify-start">
    <q-list separator class="full-width">
      <propuesta-component v-for="propuesta in pendingPropuestas" :propuesta="propuesta" :key="`list-propuesta-${propuesta.id}`" />
    </q-list>
  </q-page>
</template>

<script lang="ts" setup>

import PropuestaComponent from "components/Agente/PropuestaComponent.vue";
import {onMounted, ref} from "vue";
import PropuestaEdicionLocacion from "layer/Entidades/PropuestaEdicionLocacion";
import {API} from "aws-amplify";
import {useSessionStore} from "stores/session-store";

const sessionStore = useSessionStore()
const pendingPropuestas = ref([] as PropuestaEdicionLocacion[]);

onMounted(async ()=>{
  pendingPropuestas.value = (await API.get("umapi", `/empresas/propuestas?agenteid=9f5d8539-ed6a-428b-9a96-9474f65c511f`, {}) as {success: any[]}).success.map((attr)=>{
    return new PropuestaEdicionLocacion(attr);
  });
  // pendingPropuestas.value = (await API.get("umapi", `/empresas/propuesta/${sessionStore.userInfo.sub}`, {}) as any[]).map((attr)=>{
  //   return new PropuestaEdicionLocacion(attr);
  // });
  // const resolve = await API.get("umapi", `/empresas/propuestas?agenteid=${sessionStore.userInfo.sub}`, {});
  // const resolve = await API.get("umapi", `/empresas/propuestas?agenteid=9f5d8539-ed6a-428b-9a96-9474f65c511f`, {});
});
</script>
