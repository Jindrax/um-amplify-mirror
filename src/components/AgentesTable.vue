<template>
  <div class="column">
    <!--    <div class="col-auto q-py-sm">-->
    <!--      <div class="row justify-end">-->
    <!--        <q-btn class="col-auto advance-btn q-ml-xs" icon="settings"/>-->
    <!--        <q-btn class="col-auto advance-btn q-ml-xs" icon="download" label="Descargar CSV"/>-->
    <!--        <q-btn class="col-auto advance-btn q-ml-xs" icon="download" label="Exportar"/>-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="col-auto q-py-sm">
      <q-markup-table>
        <thead>
        <tr>
          <th class="text-left">Cedula</th>
          <th class="text-left">Nombre</th>
          <th class="text-left">Ciudad</th>
          <th class="text-left">Telefono</th>
          <th class="text-left">E-mail</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="agente in agentes" :key="agente.id">
          <td class="text-left">{{ agente.cedula }}</td>
          <td>{{ `${agente.nombres} ${agente.apellidos}` }}</td>
          <td>{{ `${agente.ciudadstr}, ${agente.unidadadminstr}` }}</td>
          <td>{{ agente.celular }}</td>
          <td>{{ agente.email }}</td>
          <td class="text-center">
            <q-btn label="Editar" color="green" @click="editAgente(agente)" disable/>
          </td>
        </tr>
        </tbody>
      </q-markup-table>
    </div>
  </div>
</template>

<script lang="ts" setup>

import Agente from "layer/Entidades/Agente";
import {useAgenteStore} from "stores/agente-store";
import {useRouter} from "vue-router";

const agenteStore = useAgenteStore();
const router = useRouter();

const props = defineProps<{
  agentes: Agente[]
}>();

function editAgente(agente: Agente) {
  agenteStore.editAgente(agente);
  router.push("/dashboard/Editar_Agente");
}

</script>

<style lang="scss" scoped>

</style>
