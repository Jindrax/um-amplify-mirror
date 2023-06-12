<template>
  <q-page class="column items-start justify-start">
    <q-card class="full-width">
      <q-card-section>
        <div class="text-h5 q-my-sm">
          Por pagar
        </div>
        <div class="full-width column q-gutter-y-sm">
          <q-card v-for="ticket in ticketsActivos" class="col">
            <q-card-section>
              <q-item>
                <q-item-section side>
                  <q-item-label overline>
                    Fecha
                  </q-item-label>
                  <q-item-label>
                    {{moment(new Date(ticket.fechaemision)).format("YYYY-MM-DD")}}
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label overline>
                    Nit empresa
                  </q-item-label>
                  <q-item-label>
                    {{ticket.emitidopor}}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label overline>
                    Comision
                  </q-item-label>
                  <q-item-label>
                    {{ticket.comision}}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-card>
    <q-card class="full-width q-mt-sm">
      <q-card-section>
        <div class="text-h5 q-my-sm">
          Historial
        </div>
        <div class="full-width column q-gutter-y-sm">
          <q-card v-for="ticket in tickets" class="col">
            <q-card-section>
              <q-item>
                <q-item-section side>
                  <q-item-label overline>
                    Fecha
                  </q-item-label>
                  <q-item-label>
                    {{moment(new Date(ticket.fechaemision)).format("YYYY-MM-DD")}}
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label overline>
                    Nit empresa
                  </q-item-label>
                  <q-item-label>
                    {{ticket.emitidopor}}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label overline>
                    Comision
                  </q-item-label>
                  <q-item-label>
                    {{ticket.comision}}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import {API} from "aws-amplify";
import {useLocacionStore} from "stores/locacion-store";
import {onMounted, ref} from "vue";
import {useSessionStore} from "stores/session-store";
import {storeToRefs} from "pinia";
import moment from "moment";

const {user, userInfo} = storeToRefs(useSessionStore());
const locationStore = useLocacionStore();

let ticketsActivos = ref([] as any[]);
let tickets = ref([] as any[]);

onMounted(async () => {
  const response = await API.get("umapi", "/agentes/comisiones/" + userInfo.value.sub, {});
  ticketsActivos.value = response.filter((val: { activo: any; }) => val.activo);
  tickets.value = response.filter((val: { activo: any; }) => !val.activo);
})
</script>
