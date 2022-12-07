<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="column items-start justify-start">
          <div class="row full-width">
            <div class="col q-pa-sm">
              <span>Email</span>
              <q-input v-model="nuevoAgente.email" class="bg-grey-4"/>
            </div>
          </div>
          <div class="col-auto row full-width">
            <div class="col q-pa-sm">
              <span>Cedula</span>
              <q-input v-model="nuevoAgente.cedula" class="bg-grey-4"/>
            </div>
            <div class="col q-pa-sm">
              <span>Nombres</span>
              <q-input v-model="nuevoAgente.nombres" class="bg-grey-4"/>
            </div>
            <div class="col q-pa-sm">
              <span>Apellidos</span>
              <q-input v-model="nuevoAgente.apellidos" class="bg-grey-4"/>
            </div>
          </div>
          <div class="row full-width">
            <div class="col q-pa-sm">
              <span>Celular</span>
              <q-input v-model="nuevoAgente.celular" class="bg-grey-4"/>
            </div>
            <div class="col q-pa-sm">
              <span>Dirección</span>
              <q-input v-model="nuevoAgente.direccion" class="bg-grey-4"/>
            </div>
          </div>
          <div class="row full-width">
            <div class="col q-pa-sm">
              <span>Departamento</span>
              <unidad-admin-selector v-model="nuevoAgente.unidadadmin" v-model:str="nuevoAgente.unidadadminstr"
                                     class="bg-grey-4"/>
            </div>
            <div class="col q-pa-sm">
              <span>Ciudad</span>
              <ciudad-selector v-model="nuevoAgente.ciudad" :unidad-admin-id="nuevoAgente.unidadadmin"
                               v-model:str="nuevoAgente.ciudadstr"
                               class="bg-grey-4"/>
            </div>
          </div>
          <div class="row full-width">
            <div class="col q-pa-sm">
              <span>Banco</span>
              <q-select v-model="nuevoAgente.banco" :options="opcionesBanco" class="bg-grey-4" emit-value/>
            </div>
            <div class="col q-pa-sm">
              <span>Tipo de cuenta</span>
              <q-select v-model="nuevoAgente.tipocuenta" :options="opcionesTipoCuenta" class="bg-grey-4" emit-value/>
            </div>
            <div class="col q-pa-sm">
              <span>No. Cuenta</span>
              <q-input v-model="nuevoAgente.numerocuenta" class="bg-grey-4"/>
            </div>
          </div>
          <div class="col-auto row full-width q-px-sm q-py-md">
            <div class="col">
              <span>Documentos</span>
              <q-file v-model="cedulaFile" class="bg-grey-4" filled label="Cedula">
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" @click.stop/>
                </template>
                <template v-slot:append>
                  <q-icon class="cursor-pointer" name="close" @click.stop="nuevoAgente.cedulaArchivo = null"/>
                </template>
              </q-file>
              <br>
              <q-file v-model="rutFile" class="bg-grey-4" filled label="RUT">
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" @click.stop/>
                </template>
                <template v-slot:append>
                  <q-icon class="cursor-pointer" name="close" @click.stop="nuevoAgente.rutArchivo = null"/>
                </template>
              </q-file>
              <br>
              <q-file v-model="antecedentesFile" class="bg-grey-4" filled
                      label="Antecedentes judiciales">
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" @click.stop/>
                </template>
                <template v-slot:append>
                  <q-icon class="cursor-pointer" name="close" @click.stop="nuevoAgente.antecedentesArchivo = null"/>
                </template>
              </q-file>
            </div>
          </div>
        </div>
        <div class="row full-width items-end justify-end q-gutter-sm">
          <q-btn class="col revert-btn" label="Cancelar" to="/dashboard/Agentes"/>
          <q-btn class="col advance-btn" label="Guardar" @click="addAgent"/>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import Agente, {BancoEnum, TipoCuentaEnum} from "layer/Entidades/Agente";
import {API, Auth} from "aws-amplify";
import {useSessionStore} from "stores/session-store";
import UnidadAdminSelector from "components/UnidadAdminSelector.vue";
import CiudadSelector from "components/CiudadSelector.vue";
import {useAgenteStore} from "stores/agente-store";
import {useQuasar} from "quasar";

const agenteStore = useAgenteStore();
const {notify} = useQuasar();

const nuevoAgente = ref(new Agente({}));

const cedulaFile = ref(new File([], ""));
const rutFile = ref(new File([], ""));
const antecedentesFile = ref(new File([], ""));

const opcionesBanco = Object.entries(BancoEnum).map(enumerator => {
  return {
    label: enumerator[1],
    value: enumerator[0]
  }
});

const opcionesTipoCuenta = Object.entries(TipoCuentaEnum).map(enumerator => {
  return {
    label: enumerator[1],
    value: enumerator[0]
  }
});

const addAgent = async () => {
  try {
    nuevoAgente.value.cedulaarchivo = "";
    nuevoAgente.value.rutarchivo = "";
    nuevoAgente.value.antecedentesarchivo = "";
    nuevoAgente.value.creadopor = useSessionStore().userInfo.sub;
    const response = await agenteStore.addAgente(nuevoAgente.value);
    if (response === "OK") {
      notify("Agente creado correctamente");
    } else {
      notify("Ocurrio un problema en el servidor");
    }
  } catch (e) {
    console.log(e);
    notify("Ocurrio un problema en el servidor");
  }
};

</script>

<style lang="scss" scoped>
span {
  font-size: 2vh;
}
</style>
