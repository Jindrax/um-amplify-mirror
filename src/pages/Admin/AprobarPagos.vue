<template>
  <q-page class="column items-start justify-start q-ml-md column q-gutter-y-sm q-mr-md">
    <q-card class="full-width q-mt-md">
      <q-card-section class="row q-gutter-sm justify-start">
        <q-markup-table separator="cell">
          <thead>
          <tr class="empresa-backgroung">
            <th class="text-center">
              <span class="text-body1">Nit</span>
            </th>
            <th class="text-center">
              <span class="text-body1">Agente</span>
            </th>
            <th class="text-center">
              <span class="text-body1">Fecha Orden</span>
            </th>
            <th class="text-center">
                <span class="text-body1">Cobro total</span>
            </th>
            <th class="text-center">
              <span class="text-body1">Meses</span>
            </th>
            <th class="text-center">
              <span class="text-body1">Plan</span>
            </th>
            <th class="text-center">
              <span class="text-body1">Aprobar</span>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="orden in ordenes">
            <td>
              {{orden.empresa}}
            </td>
            <td>
              {{orden.agente}}
            </td>
            <td>
              {{orden.fechapago}}
            </td>
            <td>
              {{orden.cobrototal}}
            </td>
            <td>
              {{orden.mesespago}}
            </td>
            <td>
              {{ orden.plan}}
            </td>
            <td class="text-right">
              <q-btn label="Aprobar" class="bg-green text-white"/>
            </td>
          </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import {computed, onBeforeMount, Ref, ref} from "vue";
import {API, Auth, syncExpression} from "aws-amplify";
import Locacion from "layer/Entidades/Locacion";
import moment from "moment";
import {useQuasar} from "quasar";

//Framework Sugar
const q = useQuasar();

//Custom interfaces

interface OrdenCobro {
  id: number,
  empresa: string,
  cobrototal: number,
  impuesto: number,
  agente: string,
  comisionagente: string,
  fechapago: Date,
  mesespago: number,
  estado: string,
  plan: string,
  mediopago: string
}

//Custom Data
const ordenes: Ref<OrdenCobro[]> = ref([] as OrdenCobro[]);

//CUSTOM LOGIC
const presentarValor = (valor: number) => {
  const formatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  });
  return formatter.format(valor);
}

onBeforeMount(async () => {
  const user = await Auth.currentAuthenticatedUser();
  ordenes.value = (await API.get("umapi", '/empresas/cobros/transferencias', {})) as unknown as OrdenCobro[];
});

async function pagar(factura: number) {
  const response = await API.post("umapi", `/empresas/cobros`, {
    body: {
      x_respuesta: 'Aceptada', x_id_factura: factura, x_id_invoice: factura
    }
  });
}

</script>

<style lang="scss" scoped>

</style>
