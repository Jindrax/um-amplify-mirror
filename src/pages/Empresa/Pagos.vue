<template>
  <q-page class="column items-start justify-start q-ml-md column q-gutter-y-sm q-mr-md">
    <q-card class="full-width">
      <q-card-section class="row q-gutter-sm justify-start">
        <q-card v-for="(plan, indicePlan) in planes"
                :class="['col-5', planSeleccionado === plan.titulo? 'plan-seleccionado' : 'plan']"
                @click="seleccionarPlan(plan)">
          <q-card-section class="plan-header">
            <div class="row">
              <p style="font-size: 1.6em; font-weight: bold" class="q-ma-none q-pa-none col-auto">Plan
                {{ plan.titulo }}</p>
            </div>
          </q-card-section>
          <q-separator/>
          <q-card-section>
            <p>{{ plan.descripcion }}</p>
          </q-card-section>
          <q-separator/>
          <q-card-section>
            <p>{{ presentarValor(plan.valor) }}</p>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
    <q-card class="col-auto full-width">
      <q-card-section>
        <q-item-label class="text-h6">Locaciones disponibles para pago</q-item-label>
        <br>
        <q-option-group :options="opcionesLocaciones" v-model="seleccion" type="checkbox"/>
      </q-card-section>
    </q-card>
    <q-card class="col-auto full-width">
      <q-card-section class="col q-gutter-y-sm">
        <q-input class="col" label="Valor mes (Test)" outlined type="number" v-model.number="valorMes"/>
        <q-input class="col" label="Meses a pagar" outlined type="number" v-model.number="meses"/>
      </q-card-section>
    </q-card>
    <q-card class="col-auto full-width">
      <q-card-section>
        <q-markup-table separator="cell">
          <thead>
          <tr class="empresa-backgroung">
            <th class="text-center">
              <span class="text-body1">Concepto</span>
            </th>
            <th class="text-center">
              <span class="text-body1">Valor</span>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="locacion in locacionesSeleccionadas">
            <td>{{
                `${locacion.identificador} - hasta: ${moment(locacion.pagohasta).add("month", meses).format("DD/MM/yyyy")}`
              }}
            </td>
            <td class="text-right">{{ valorFormateado(sinImpuestos(valorMes * meses)) }}</td>
          </tr>
          <tr>
            <td>Subtotal</td>
            <td class="text-right">{{ valorFormateado(sinImpuestos(totalCobroNumero)) }}</td>
          </tr>
          <tr>
            <td>IVA</td>
            <td class="text-right">{{ valorFormateado(impuesto) }}</td>
          </tr>
          <tr>
            <td>Total</td>
            <td class="text-right">{{ totalCobro }}</td>
          </tr>
          </tbody>
        </q-markup-table>
        <br>
        <q-item class="full-width q-pa-none" clickable>
          <q-item-section>
            <q-item-label class="text-h6"><b>Total</b></q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6">
              {{ totalCobro }}
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-btn class="bg-green text-white" label="PAGAR" rounded @click="pagar"/>
          </q-item-section>
        </q-item>
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

const locaciones = ref([]);
const nit = ref();
const seleccion = ref([] as string[]);
const meses = ref(1);
const valorMes = ref(350000);
const valorImpuesto = ref(0.19);
let handler: any = {};
const q = useQuasar();

//LOCAL DATA SPACE
interface Plan {
  titulo: string,
  descripcion: string,
  valor: number,
  meses: number,
  disponibilidad: number
}

interface Orden {
  concepto: string,
  valor: number,
  locacion: Locacion,
  meses: number
}

const planes: Ref<Plan[]> = ref([
  {
    titulo: "Básico",
    descripcion: "Texto de prueba",
    valor: 300000,
    meses: 1,
    disponibilidad: 10000000
  },
]);

const planSeleccionado = ref("");

const ordenes: Ref<Orden[]> = ref([] as Orden[]);

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
  nit.value = user.attributes["custom:nit"];
  locaciones.value = await API.get("umapi", `/locaciones/empresa/${nit.value}`, {});
  //@ts-ignore
  handler = ePayco.checkout.configure({
    key: '791fc4f72faf72b71a2569e6bc1eb26a',
    test: true
  });
  planes.value = (await API.get("umapi", '/empresas/br/planes', {})).success as unknown as Plan[];

});

const opcionesLocaciones = computed(() => {
  return locaciones.value.map((locacion: Locacion) => {
    return {
      label: `${locacion.identificador} - Pago hasta: ${moment(locacion.pagohasta).format("DD/MM/yyyy")}`,
      value: locacion.id
    }
  });
});

const locacionesSeleccionadas = computed(() => {
  return locaciones.value.filter((locacion: Locacion) => {
    return seleccion.value.includes(locacion.id);
  });
})

const totalCobroNumero = computed(() => {
  return (valorMes.value * meses.value) * seleccion.value.length;
})

const impuesto = computed(() => {
  return (totalCobroNumero.value * valorImpuesto.value);
})

const totalCobro = computed(() => {
  return valorFormateado(totalCobroNumero.value);
})

function valorFormateado(valor: number) {
  return "$ " + valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function sinImpuestos(valor: number) {
  return Math.round(valor - (valor * valorImpuesto.value));
}

function test() {
  console.log(seleccion.value);
}

async function pagar() {
  q.loading.show();
  const response = await API.post("umapi", `/empresas/cobros`, {
    body: {
      empresa: nit.value,
      cobrototal: totalCobroNumero.value,
      mesespago: meses.value,
      locaciones: seleccion.value
    }
  });
  q.loading.hide();
  let data = {
    //Parametros compra (obligatorio)
    name: "Subscripcion a UnMinuto.co",
    description: `Pago de la subscripcion a UnMinuto de las locaciones ${locacionesSeleccionadas.value.map((locacion: Locacion) => locacion.identificador).join(",")} por ${meses.value} ${meses.value == 1 ? 'mes' : 'meses'}.`,
    invoice: `${response.ordenId}`,
    currency: "cop",
    amount: `${totalCobroNumero.value}`,
    tax_base: `${sinImpuestos(totalCobroNumero.value)}`,
    tax: `${impuesto.value}`,
    country: "co",
    lang: "es",

    //Onpage="false" - Standard="true"
    external: "true",

    //Atributos opcionales
    extra1: `${response.ordenId}`
  };
  handler.open(data);
}

async function seleccionarPlan(plan: Plan) {
  planSeleccionado.value = plan.titulo;
  meses.value = plan.meses;
  valorMes.value = plan.valor;
}

</script>

<style lang="scss" scoped>
.plan {
  transition-duration: 0.2s;
}

.plan:hover {
  transform: scale(1.05);
  transition-duration: 0.2s;
  z-index: 1;
}

.plan:hover > .plan-header {
  background: #00216a;
  color: white;
}

.plan-seleccionado {
}

.plan-seleccionado > .plan-header {
  background: #00216a;
  color: white;
}

</style>
