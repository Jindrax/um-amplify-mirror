<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="column items-start justify-start">
          <div class="row full-width">
            <div class="col q-pa-sm">
              <span>Email</span>
              <q-input v-model="agente.email" class="bg-grey-4"/>
            </div>
          </div>
          <div class="col-auto row full-width">
            <div class="col q-pa-sm">
              <span>Nombres</span>
              <q-input v-model="agente.nombres" class="bg-grey-4"/>
            </div>
            <div class="col q-pa-sm">
              <span>Apellidos</span>
              <q-input v-model="agente.apellidos" class="bg-grey-4"/>
            </div>
            <div class="col q-pa-sm">
              <span>Cedula</span>
              <q-input v-model="agente.cedula" class="bg-grey-4"/>
            </div>
          </div>
          <div class="row full-width">
            <div class="col q-pa-sm">
              <span>Dirección</span>
              <q-input v-model="agente.direccion" class="bg-grey-4"/>
            </div>
          </div>
          <div class="row full-width">
            <div class="col q-pa-sm">
              <span>Departamento</span>
              <unidad-admin-selector v-model="agente.unidadadmin" v-model:str="agente.unidadadminstr"
                                     class="bg-grey-4"/>
            </div>
            <div class="col q-pa-sm">
              <span>Ciudad</span>
              <ciudad-selector v-model="agente.ciudad" :unidad-admin-id="agente.unidadadmin"
                               v-model:str="agente.ciudadstr"
                               class="bg-grey-4"/>
            </div>
            <div class="col q-pa-sm">
              <span>Celular</span>
              <q-input v-model="agente.celular" class="bg-grey-4"/>
            </div>
          </div>
          <div class="row full-width">
            <div class="col q-pa-sm">
              <span>Banco</span>
              <q-select v-model="agente.banco" :options="opcionesBanco" class="bg-grey-4" emit-value/>
            </div>
            <div class="col q-pa-sm">
              <span>Tipo de cuenta</span>
              <q-select v-model="agente.tipocuenta" :options="opcionesTipoCuenta" class="bg-grey-4" emit-value/>
            </div>
            <div class="col q-pa-sm">
              <span>No. Cuenta</span>
              <q-input v-model="agente.numerocuenta" class="bg-grey-4"/>
            </div>
          </div>
<!--          <div class="col-auto row full-width q-px-sm q-py-md">-->
<!--            <div class="col">-->
<!--              <span>Documentos</span>-->
<!--              <q-file v-model="cedulaFile" class="bg-grey-4" filled label="Cedula">-->
<!--                <template v-slot:prepend>-->
<!--                  <q-icon name="cloud_upload" @click.stop/>-->
<!--                </template>-->
<!--                <template v-slot:append>-->
<!--                  <q-icon class="cursor-pointer" name="close" @click.stop="nuevoAgente.cedulaArchivo = null"/>-->
<!--                </template>-->
<!--              </q-file>-->
<!--              <br>-->
<!--              <q-file v-model="rutFile" class="bg-grey-4" filled label="RUT">-->
<!--                <template v-slot:prepend>-->
<!--                  <q-icon name="cloud_upload" @click.stop/>-->
<!--                </template>-->
<!--                <template v-slot:append>-->
<!--                  <q-icon class="cursor-pointer" name="close" @click.stop="nuevoAgente.rutArchivo = null"/>-->
<!--                </template>-->
<!--              </q-file>-->
<!--              <br>-->
<!--              <q-file v-model="antecedentesFile" class="bg-grey-4" filled-->
<!--                      label="Antecedentes judiciales">-->
<!--                <template v-slot:prepend>-->
<!--                  <q-icon name="cloud_upload" @click.stop/>-->
<!--                </template>-->
<!--                <template v-slot:append>-->
<!--                  <q-icon class="cursor-pointer" name="close" @click.stop="nuevoAgente.antecedentesArchivo = null"/>-->
<!--                </template>-->
<!--              </q-file>-->
<!--            </div>-->
<!--          </div>-->
        </div>
        <div class="row full-width items-end justify-end q-gutter-sm">
          <q-btn class="col-auto revert-btn" label="Cancelar" to="/dashboard/Agentes"/>
          <q-btn class="col-auto advance-btn" label="Guardar" @click="addAgent"/>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import {defineProps, ref} from "vue";
import Agente from "layer/Entidades/Agente";

const props = defineProps<{
  agente: Agente
}>();

</script>

<style lang="scss" scoped>

</style>
