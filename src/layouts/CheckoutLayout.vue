<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page>
        <q-input v-model="name" label="Nombre"/>
        <q-input v-model="email" label="E-mail"/>
        <q-input v-model="ammount" label="Cobro"/>
        <form>
          <component :is="'script'"
                     src="https://checkout.epayco.co/checkout.js"
                     class="epayco-button"
                     data-epayco-key="491d6a0b6e992cf924edd8d3d088aff1"
                     :data-epayco-amount="ammount"
                     data-epayco-name="Mensualidad UM"
                     data-epayco-description="Mensualidad UM"
                     data-epayco-currency="cop"
                     data-epayco-country="co"
                     data-epayco-test="true"
                     data-epayco-external="false"
                     data-epayco-response="https://webmaster.unminuto.co/#/confirmation"
                     data-epayco-confirmation="https://ejemplo.com/confirmacion"
                     data-epayco-methodconfirmation="get"
                     :data-epayco-email-billing="email"
                     :data-epayco-name-billing="name"
          >
          </component>
        </form>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>

import {ref} from "vue";

const name = ref("");
const email = ref("");
const ammount = ref(300000);


</script>
