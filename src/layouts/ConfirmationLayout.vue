<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page>
        {{data}}
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
const route = useRoute();
const data = ref();
const epaycoAPI = "https://secure.epayco.co/validation/v1/reference/";

onMounted(async ()=>{
  try {
    const response = await axios.get(epaycoAPI + route.query.ref_payco);
    data.value = JSON.stringify(response.data);
    console.log(data.value);
  } catch (e) {
    console.log(e);
  }
});

</script>
