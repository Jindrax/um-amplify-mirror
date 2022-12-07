<template>
  <q-expansion-item class="full-width" header-class="bg-black">
    <template v-slot:header>
      <q-item class="full-width bg-black text-white">
        <q-item-section>
          <q-item-label>Nit Empresa</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ propuesta.empresaid }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ propuesta.ts }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <q-card class="full-width">
      <q-card-section class="q-pa-none">
        <q-tabs
            v-model="propuestaTab"
            dense
            class="text-white bg-black"
            active-class="text-black bg-white"
            indicator-color="black"
            align="justify"
            narrow-indicator
        >
          <q-tab name="info" label="Info"/>
          <q-tab name="imagenes" label="Imagenes" v-if="propuesta.registrocambiosfotos.add.length > 0"/>
          <q-tab name="video" label="Video" v-if="propuesta.registrocambiovideo"/>
        </q-tabs>

        <q-separator/>

        <q-tab-panels v-model="propuestaTab" animated>
          <q-tab-panel name="info">
            <div v-for="infoCambio in attrAvaliableOptions"
                 :key="`propuesta-cambio-info-${infoCambio.value}}`">
              <q-item v-if="propuesta.registrocambiosinfo[infoCambio.value]">
                <q-item-section side>
                  <q-item-label>{{ infoCambio.label }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label v-if="infoCambio[0]!=='horario'">{{ propuesta.registrocambiosinfo[infoCambio.value] }}
                  </q-item-label>
                  <horario-presenter v-else :horario="infoCambio[1]"/>
                </q-item-section>
              </q-item>
            </div>
            <q-item v-if="propuesta.registrocambiosinfo.horario">
              <q-item-section side>
                <q-item-label>Horario</q-item-label>
              </q-item-section>
              <q-item-section>
                <horario-presenter :horario="propuesta.registrocambiosinfo.horario"/>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section side>
                Atributos
              </q-item-section>
              <q-item-section>
                <q-chip v-for="categoria in propuesta.registrocambiosatributos.add" :key="`categoria-${categoria.id}`"
                        class="bg-white shadow-4">
                  <template v-slot:default>
                    <q-item>
                      <q-item-section avatar>
                        <q-avatar>
                          <img :src="categoria.imagen">
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ categoria.nombre }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-chip>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section side>
                Redes Sociales
              </q-item-section>
              <q-item-section>
                <div class="col row full-width">
                  <q-input v-model="propuesta.registrocambiosinfo['perfilessociales']['facebook']" class="col-6 bg-white"
                           label="Facebook" readonly>
                    <template v-slot:before>
                      <q-icon name="img:SVG/facebook-square-logo.svg" size="md"/>
                    </template>
                  </q-input>
                  <q-input v-model="propuesta.registrocambiosinfo['perfilessociales']['instagram']" class="col-6 bg-white"
                           label="Instagram" readonly>
                    <template v-slot:before>
                      <q-icon name="img:SVG/instagram-square-logo.svg" size="md"/>
                    </template>
                  </q-input>
                  <q-input v-model="propuesta.registrocambiosinfo['perfilessociales']['whatsapp']" class="col-6 bg-white"
                           label="Whatsapp" readonly>
                    <template v-slot:before>
                      <q-icon name="img:SVG/whatsapp-square-logo.svg" size="md"/>
                    </template>
                  </q-input>
                  <q-input v-model="propuesta.registrocambiosinfo['perfilessociales']['website']" class="col-6 bg-white"
                           label="Pagina web"
                           debounce="300" readonly>
                    <template v-slot:before>
                      <q-icon name="img:SVG/web-square-logo.svg" size="md"/>
                    </template>
                  </q-input>
                </div>
              </q-item-section>
            </q-item>
          </q-tab-panel>

          <q-tab-panel name="imagenes">
            <q-carousel
                swipeable
                animated
                v-model="cambioImagenSlide"
                thumbnails
                infinite
            >
              <q-carousel-slide v-for="(img, imgIndex) in propuesta.registrocambiosfotos.add" :name="imgIndex"
                                :img-src="`https://um-empresa-proposal-resources.s3.amazonaws.com/${img.url}`"/>
            </q-carousel>
          </q-tab-panel>

          <q-tab-panel name="video">
            <video :src="`https://um-empresa-proposal-resources.s3.amazonaws.com/${propuesta.registrocambiovideo}`"
                   controls/>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <q-card-actions class="row q-gutter-x-sm">
        <q-btn label="Rechazar" class="col revert-btn"/>
        <q-btn label="Aprobar" class="col advance-btn"/>
      </q-card-actions>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts" setup>
import PropuestaEdicionLocacion from "layer/Entidades/PropuestaEdicionLocacion";
import HorarioPresenter from "components/HorarioPresenter.vue";
import {ref} from "vue";

const props = defineProps<{
  propuesta: PropuestaEdicionLocacion
}>();

const cambioImagenSlide = ref(0);
const propuestaTab = ref("info");

const attrAvaliableOptions: { label: string, value: string }[] = [
  {label: "Identificador Interno", value: "identificador"},
  {label: "Nombre Completo", value: "nombrecompleto"},
  {label: "Subtitulo Superior", value: "subtitulosuperior"},
  {label: "Titulo", value: "titulo"},
  {label: "Direccion", value: "direccion"},
  {label: "Telefono", value: "telefono"},
  {label: "Descripcion", value: "descripcion"}
];

</script>

<style lang="scss" scoped>
.cambio-img {
  width: 50vw;
}

video {
  height: 50vh;
}
</style>
