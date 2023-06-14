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
        <q-option-group :options="opcionesLocaciones" v-model="seleccion" type="checkbox"
                        @update:model-value="actualizarSeleccion"/>
      </q-card-section>
    </q-card>
    <!--    <q-card class="col-auto full-width">-->
    <!--      <q-card-section class="col q-gutter-y-sm">-->
    <!--        <q-input class="col" label="Valor mes (Test)" outlined type="number" v-model.number="valorMes"/>-->
    <!--        <q-input class="col" label="Meses a pagar" outlined type="number" v-model.number="meses"/>-->
    <!--      </q-card-section>-->
    <!--    </q-card>-->
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
          <tr v-for="orden in ordenes">
            <td>{{
                `${orden.locacion.identificador} - hasta: ${moment(orden.locacion.pagohasta).add("month", orden.meses).format("DD/MM/yyyy")}`
              }}
            </td>
            <td class="text-right">{{ valorFormateado(sinImpuestos(orden.valor)) }}</td>
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
        <q-option-group :options="opcionesPago" v-model="opcionPagoSeleccionada"/>
        <br>
        <q-item class="full-width q-pa-none">
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
const seleccion = ref([] as Locacion[]);
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

const opcionesPago = [
  {
    label: "Pago en linea",
    value: "online"
  },
  {
    label: "Transferencia",
    value: "transfer"
  }
];

const opcionesPagoDict: {[key: string]: string} = {
  online: "pago en linea",
  transfer: "transferencia"
}

const opcionPagoSeleccionada = ref("online");

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
    test: false
  });
  planes.value = (await API.get("umapi", '/empresas/br/planes', {})).success as unknown as Plan[];

});

const opcionesLocaciones = computed(() => {
  return locaciones.value.map((locacion: Locacion) => {
    return {
      label: `${locacion.identificador} - Pago hasta: ${moment(locacion.pagohasta).format("DD/MM/yyyy")}`,
      value: locacion
    }
  });
});

const locacionesSeleccionadas = computed(() => {
  return locaciones.value.filter((locacion: Locacion) => {
    return seleccion.value.includes(locacion.id);
  });
})

const totalCobroNumero = computed(() => {
  let value = 0;
  for (let orden of ordenes.value) {
    value += orden.valor;
  }
  return value;
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
  if(planSeleccionado.value === ""){
    q.notify("Primero debe seleccionar un plan sobre el que realizar el pago");
    return;
  }
  if(ordenes.value.length === 0){
    q.notify("Debe seleccionar al menos una locación sobre la que desea generar el pago");
    return;
  }
  q.dialog({
    message: `¿Esta seguro de que desea hacer el pago a traves del medio ${opcionesPagoDict[opcionPagoSeleccionada.value]}?`,
    cancel: true
  }).onOk(async (payload)=>{
    q.loading.show();
    const response = await API.post("umapi", `/empresas/cobros`, {
      body: {
        empresa: nit.value,
        cobrototal: totalCobroNumero.value,
        mesespago: meses.value,
        locaciones: seleccion.value.map(locacion => locacion.id),
        plan: planSeleccionado.value,
        mediopago: opcionPagoSeleccionada.value
      }
    });
    q.loading.hide();
    if(opcionPagoSeleccionada.value === "online"){
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
    }else{
      q.notify("Su orden de cobro se ha generado correctamente contactese con su agente para continuar el proceso de pago");
    }
  }).onCancel(()=>{
    q.notify("Se ha cancelado la orden de cobro");
  })
}

async function seleccionarPlan(plan: Plan) {
  planSeleccionado.value = plan.titulo;
  meses.value = plan.meses;
  valorMes.value = plan.valor;
  await actualizarSeleccion(seleccion.value);
}

async function actualizarSeleccion(seleccion: Locacion[]) {
  ordenes.value = [] as Orden[];
  if (planSeleccionado.value === "Básico") {
    for (let locacion of seleccion) {
      ordenes.value.push({
        concepto: `${locacion.identificador} - hasta: ${moment(locacion.pagohasta).add("month", meses.value).format("DD/MM/yyyy")}`,
        locacion: locacion,
        meses: meses.value,
        valor: valorMes.value
      });
    }
  } else {
    for (let locacion of seleccion) {
      ordenes.value.push({
        concepto: `${locacion.identificador} - Plan ${planSeleccionado.value} - hasta: ${moment(locacion.pagohasta).add("month", meses.value).format("DD/MM/yyyy")}`,
        locacion: locacion,
        meses: meses.value,
        valor: valorMes.value
      });
    }
  }
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
