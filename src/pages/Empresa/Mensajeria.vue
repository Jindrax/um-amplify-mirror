<template>
  <q-page class="column items-start justify-start">
    <q-card class="full-width q-ma-none q-pa-none">
      <q-card-section class="full-width q-ma-none q-pa-none">
        <q-list class="full-width" separator>
          <q-item v-for="locacion in locaciones" :key="`msg-${locacion.id}`" class="full-width">
            <q-item-section side>
              <q-avatar rounded size="48px">
                <img :src="locacion.carpetaimagenes[0].LQ" />
                <q-badge floating color="teal">0</q-badge>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ locacion.nombrecompleto }}</q-item-label>
              <q-item-label>{{ locacion.identificador }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn label="Abrir Chat" class="empresa-advance-btn"/>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import Locacion from "layer/Entidades/Locacion";

const locaciones = ref([
  new Locacion({
    "id": "6beb9e8b-f085-42da-8ebf-7886ca6abcf6",
    "nombrecompleto": "Frenessí",
    "titulo": "Frenessí",
    "subtitulosuperior": "Restaurante",
    "subtituloinferior": "Bogotá",
    "direccion": "Autopista Norte No. 114 - 44 Bogotá",
    "longitud": -74.05360409400653,
    "latitud": 4.698637191107196,
    "geom": "010100000025ACDD3F6E8352C0804C3E8C67CB1240",
    "telefono": "(601) 7443466",
    "descripcion": "la cápsula de inmersión gastronómica que traspasa los límites de la realidad\n\nNo te quedes con la curiosidad y conoce el primer restaurante de Colombia con una única mesa y un sinfín de experiencias creadas por medio de realidad virtual.",
    "perfilessociales": {
      "website": "https://www.frenessi.co/",
      "facebook": "https://www.facebook.com/frenessibog",
      "whatsapp": "+573227256479",
      "instagram": "https://www.instagram.com/frenessibog/"
    },
    "carpetaimagenes": [
      {
        "HQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/0/HQ.jpeg",
        "LQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/0/LQ.jpeg",
        "MQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/0/MQ.jpeg"
      },
      {
        "HQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/1/HQ.jpeg",
        "LQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/1/LQ.jpeg",
        "MQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/1/MQ.jpeg"
      },
      {
        "HQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/2/HQ.jpeg",
        "LQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/2/LQ.jpeg",
        "MQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/2/MQ.jpeg"
      },
      {
        "HQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/3/HQ.jpeg",
        "LQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/3/LQ.jpeg",
        "MQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/3/MQ.jpeg"
      },
      {
        "HQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/4/HQ.jpeg",
        "LQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/4/LQ.jpeg",
        "MQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/4/MQ.jpeg"
      },
      {
        "HQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/5/HQ.jpeg",
        "LQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/5/LQ.jpeg",
        "MQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/5/MQ.jpeg"
      },
      {
        "HQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/6/HQ.jpeg",
        "LQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/6/LQ.jpeg",
        "MQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/6/MQ.jpeg"
      },
      {
        "HQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/7/HQ.jpeg",
        "LQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/7/LQ.jpeg",
        "MQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/7/MQ.jpeg"
      },
      {
        "HQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/8/HQ.jpeg",
        "LQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/8/LQ.jpeg",
        "MQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/8/MQ.jpeg"
      },
      {
        "HQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/9/HQ.jpeg",
        "LQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/9/LQ.jpeg",
        "MQ": "https://um-image-presentation.s3.amazonaws.com/6beb9e8b-f085-42da-8ebf-7886ca6abcf6/9/MQ.jpeg"
      }
    ],
    "video": {
      "HLS": "https://d115m0gdlmaitf.cloudfront.net/out/v1/b3abb1143882441781e0ccbc808989bf/64697b258f93432f935f27674daf80e2/1fc6d2d39fb143cfb18651ddb67cabbf/index.m3u8",
      "MSS": "https://d115m0gdlmaitf.cloudfront.net/out/v1/b3abb1143882441781e0ccbc808989bf/ba50a81cd9d643fda4f366ce8d6e1b33/8cd7cdc75af043a5ac1ada42e6977139/index.ism/Manifest",
      "CMAF": "https://d115m0gdlmaitf.cloudfront.net/out/v1/b3abb1143882441781e0ccbc808989bf/837ebe49684f439da34b57100fd1e1b5/b1aad2591ed443e091ece00ed3ac45f4/index.m3u8",
      "DASH": "https://d115m0gdlmaitf.cloudfront.net/out/v1/b3abb1143882441781e0ccbc808989bf/b4b2ea3f4b4746f093e54302507da9bf/35c747386e8f42d1b2128bd27b200f5d/index.mpd"
    },
    "horario": {
      "monday": {
        "active": false,
        "from": "",
        "to": ""
      },
      "tuesday": {
        "active": false,
        "from": "",
        "to": ""
      },
      "wednesday": {
        "active": false,
        "from": "",
        "to": ""
      },
      "thursday": {
        "active": false,
        "from": "",
        "to": ""
      },
      "friday": {
        "active": false,
        "from": "",
        "to": ""
      },
      "saturday": {
        "active": false,
        "from": "",
        "to": ""
      },
      "sunday": {
        "active": false,
        "from": "",
        "to": ""
      }
    },
    "atributos": [
      {
        "id": "aeea2eb2-f812-409f-afe7-48fa8a5ca0be",
        "icono": "food-outline",
        "nombre": "Restaurante",
        "csscolor": "#e4e002",
        "prioridad": "1",
        "descripcion": ""
      },
      {
        "id": "21bfc154-9cc3-456f-bc0e-c2774695d673",
        "icono": "alpha-a-box-outline",
        "nombre": "Alta Cocina",
        "csscolor": "black",
        "prioridad": "3",
        "descripcion": "Este establecimiento ofrece alimentos de gran calidad"
      },
      {
        "id": "951bb5ac-aabc-454b-9476-a6e24f555bac",
        "icono": "alpha-t-circle-outline",
        "nombre": "Temático",
        "csscolor": "#000000",
        "prioridad": "3",
        "descripcion": "Este establecimiento ofrece una experiencia Temática "
      }
    ],
    "pagohasta": "2022-09-18T00:00:00.000Z",
    "likes": 0,
    "marcados": 0,
    "ciudad": "89e2d176-b272-4160-95e8-4218d94c3280",
    "ciudadstr": "Bogotá D.C.",
    "unidadadmin": "b02de748-22bf-4a36-8329-405d8da397e8",
    "unidadadminstr": "Bogotá D.C.",
    "creadoen": "2022-09-18T00:00:00.000Z",
    "empresa": "2",
    "identificador": "Bogota",
    "agente": "9f5d8539-ed6a-428b-9a96-9474f65c511f"
  }),
  new Locacion({
    "id": "66f372c9-8780-41d4-856a-c179279dcd26",
    "nombrecompleto": "La Picaderia",
    "titulo": "La Picaderia",
    "subtitulosuperior": "Restaurante",
    "subtituloinferior": "Bogotá ",
    "direccion": "Carrera 7 # 218-30, Bogotá, Colombia",
    "longitud": -74.03028440111541,
    "latitud": 4.794139439947274,
    "geom": "0101000000A817FC2DF08152C03126ACE3322D1340",
    "telefono": "311 574 9234",
    "descripcion": "Restaurante de cocina Colombiana ",
    "perfilessociales": {
      "facebook": "https://www.facebook.com/Rest.lapicaderia",
      "whatsapp": "+573115749234",
      "instagram": "https://www.instagram.com/lapicaderia/"
    },
    "carpetaimagenes": [
      {
        "HQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/0/HQ.jpeg",
        "LQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/0/LQ.jpeg",
        "MQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/0/MQ.jpeg"
      },
      {
        "HQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/1/HQ.jpeg",
        "LQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/1/LQ.jpeg",
        "MQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/1/MQ.jpeg"
      },
      {
        "HQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/2/HQ.jpeg",
        "LQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/2/LQ.jpeg",
        "MQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/2/MQ.jpeg"
      },
      {
        "HQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/3/HQ.jpeg",
        "LQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/3/LQ.jpeg",
        "MQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/3/MQ.jpeg"
      },
      {
        "HQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/4/HQ.jpeg",
        "LQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/4/LQ.jpeg",
        "MQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/4/MQ.jpeg"
      },
      {
        "HQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/5/HQ.jpeg",
        "LQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/5/LQ.jpeg",
        "MQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/5/MQ.jpeg"
      },
      {
        "HQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/6/HQ.jpeg",
        "LQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/6/LQ.jpeg",
        "MQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/6/MQ.jpeg"
      },
      {
        "HQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/7/HQ.jpeg",
        "LQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/7/LQ.jpeg",
        "MQ": "https://um-image-presentation.s3.amazonaws.com/66f372c9-8780-41d4-856a-c179279dcd26/7/MQ.jpeg"
      }
    ],
    "video": {
      "HLS": "https://d115m0gdlmaitf.cloudfront.net/out/v1/2fea6faaa3ec4da8986ee8fa453e7caf/64697b258f93432f935f27674daf80e2/1fc6d2d39fb143cfb18651ddb67cabbf/index.m3u8",
      "MSS": "https://d115m0gdlmaitf.cloudfront.net/out/v1/2fea6faaa3ec4da8986ee8fa453e7caf/ba50a81cd9d643fda4f366ce8d6e1b33/8cd7cdc75af043a5ac1ada42e6977139/index.ism/Manifest",
      "CMAF": "https://d115m0gdlmaitf.cloudfront.net/out/v1/2fea6faaa3ec4da8986ee8fa453e7caf/837ebe49684f439da34b57100fd1e1b5/b1aad2591ed443e091ece00ed3ac45f4/index.m3u8",
      "DASH": "https://d115m0gdlmaitf.cloudfront.net/out/v1/2fea6faaa3ec4da8986ee8fa453e7caf/b4b2ea3f4b4746f093e54302507da9bf/35c747386e8f42d1b2128bd27b200f5d/index.mpd"
    },
    "horario": {
      "monday": {
        "active": false,
        "from": "",
        "to": ""
      },
      "tuesday": {
        "active": false,
        "from": "",
        "to": ""
      },
      "wednesday": {
        "active": false,
        "from": "",
        "to": ""
      },
      "thursday": {
        "active": false,
        "from": "",
        "to": ""
      },
      "friday": {
        "active": false,
        "from": "",
        "to": ""
      },
      "saturday": {
        "active": false,
        "from": "",
        "to": ""
      },
      "sunday": {
        "active": false,
        "from": "",
        "to": ""
      }
    },
    "atributos": [
      {
        "id": "aeea2eb2-f812-409f-afe7-48fa8a5ca0be",
        "icono": "food-outline",
        "nombre": "Restaurante",
        "csscolor": "#e4e002",
        "prioridad": "1",
        "descripcion": ""
      },
      {
        "id": "c95218c8-b65b-4033-9e72-ef7107175766",
        "icono": "glass-cocktail",
        "nombre": "Gastrobar",
        "csscolor": "#03b6de",
        "prioridad": "1",
        "descripcion": ""
      },
      {
        "id": "0a5ae9d8-710d-4895-aff7-47765483c857",
        "icono": "parking",
        "nombre": "Parqueadero",
        "csscolor": "#d70606",
        "prioridad": "3",
        "descripcion": "Este establecimiento cuenta con parqueadero"
      },
      {
        "id": "a84d8bee-5193-4ccd-94f0-a8917e626961",
        "icono": "alpha-c-circle-outline",
        "nombre": "Campestre ",
        "csscolor": "#05602b",
        "prioridad": "3",
        "descripcion": "Este establecimiento cuenta con un espacio campestre"
      }
    ],
    "pagohasta": "2022-09-18T00:00:00.000Z",
    "likes": 0,
    "marcados": 0,
    "ciudad": "89e2d176-b272-4160-95e8-4218d94c3280",
    "ciudadstr": "Bogotá D.C.",
    "unidadadmin": "b02de748-22bf-4a36-8329-405d8da397e8",
    "unidadadminstr": "Bogotá D.C.",
    "creadoen": "2022-09-18T00:00:00.000Z",
    "empresa": "4",
    "identificador": "La Picaderia Bogotá ",
    "agente": "9f5d8539-ed6a-428b-9a96-9474f65c511f"
  })
]);
</script>

<style lang="scss" scoped>

</style>
