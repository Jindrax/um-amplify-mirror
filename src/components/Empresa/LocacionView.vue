<template>
  <q-item>
    <q-item-section>
      <q-card>
        <q-card-section>
          <div class="div-container">
            <div class="inner-container" :style="{width: `${width*0.25}px`}">
              <q-resize-observer @resize="resizeEvent"/>
              <q-btn v-if="!playerState" class="play-btn" icon="play_arrow" round size="xl" @click="play"/>
              <q-btn v-if="playerState" class="pause-btn" icon="pause" round size="xl" @click="pause"/>
              <div class="column items-start justify-end video-overlay blur-effect">
                <div class="col-auto pre-title"
                     :style="{'font-size': `${preTituloFont}px`, 'margin-bottom': `${preTituloMarginBottom}dp`, 'margin-left': `${preTituloMarginLeft}dp`}">
                  {{ locacion.subtitulosuperior }}
                </div>
                <div class="col-auto title" :style="{'font-size': `${tituloFont}px`}">{{ locacion.titulo }}</div>
              </div>
              <video ref="videoPlayer" class="video-js vjs-tech"></video>
            </div>
            <div class="side-div column" :style="{width: `${width*0.68}px`}">
              <q-tabs
                  v-model="currentTab"
                  class="empresa-backgroung text-white"
                  align="justify"
                  narrow-indicator
              >
                <q-tab name="info" label="Info"/>
                <q-tab name="photos" label="Fotos"/>
                <q-tab name="map" label="Mapa"/>
              </q-tabs>

              <q-separator/>

              <q-tab-panels v-model="currentTab" animated class="bg-white">
                <q-tab-panel name="info" class="column q-gutter-y-sm">
                  <q-field label="Nombre completo" stack-label readonly>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline">{{ locacion.nombrecompleto }}</div>
                    </template>
                  </q-field>
                  <q-field label="Municipio" stack-label readonly>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline">{{ locacion.ciudadstr }}</div>
                    </template>
                  </q-field>
                  <q-field label="Departamento" stack-label readonly>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline">{{ locacion.unidadadminstr }}</div>
                    </template>
                  </q-field>
                  <q-field label="Whatsapp" stack-label readonly>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline">{{ locacion.perfilessociales["whatsapp"] }}</div>
                    </template>
                  </q-field>
                  <div class="col row q-gutter-sm justify-start items-center">
                    <span class="col text-h6">Categorias</span>
                    <q-chip v-for="categoria in categorias" :key="`categoria-${categoria.value.id}`"
                            class="col bg-white shadow-4">
                      <template v-slot:default>
                        <q-item>
                          <q-item-section avatar>
                            <q-avatar>
                              <img :src="categoria.value.imagen">
                            </q-avatar>
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ categoria.label }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-chip>
                  </div>
                  <div class="col row q-gutter-sm justify-start">
                    <span class="col text-h6">Atributos</span>
                    <q-chip v-for="atributo in atributos" :key="`atributo-${atributo.value.id}`"
                            class="col bg-white" :icon="`um-${atributo.value.icono}`"
                            outline>{{ atributo.label }}
                    </q-chip>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="photos" class="bg-white">
                  <q-carousel
                      swipeable
                      animated
                      v-model="slide"
                      thumbnails
                      infinite
                  >
                    <q-carousel-slide v-for="(img, imgIndex) in locacion.carpetaimagenes" :name="imgIndex"
                                      :img-src="img.MQ"/>
                  </q-carousel>
                </q-tab-panel>

                <q-tab-panel name="map" :id="`mapPanel-${locacion.id}`">
                  <div id="map" ref="mapRef" :style="{width: `${width*0.65}px`, height: '200px'}"></div>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="row">
          <q-btn class="col empresa-advance-btn" label="Propuesta de edición" @click="editLocacion"/>
        </q-card-actions>
      </q-card>
    </q-item-section>
  </q-item>
</template>

<script lang="ts" setup>
import Locacion from "layer/Entidades/Locacion";
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import videojs from "video.js";
import {Map, View,} from 'ol';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import TileJSON from 'ol/source/TileJSON';
import VectorSource from 'ol/source/Vector';
import {Icon, Style} from 'ol/style';
import {fromLonLat} from 'ol/proj';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {useRouter} from "vue-router";
import {useLocacionStore} from "stores/locacion-store";
import Atributo from "layer/Entidades/Atributo";

const props = defineProps<{
  locacion: Locacion,
  width: number
}>();

const videoPlayer = ref();
const player = ref();
const playerState = ref(false);

const currentTab = ref("info");
const slide = ref(0);

const mapRef = ref();

const router = useRouter();
const locacionStore = useLocacionStore();

const atributosOpciones: { label: string, value: Atributo }[] = props.locacion.atributos.map((atributo: Atributo) => {
  return {label: atributo.nombre, value: atributo};
});
const categorias = atributosOpciones.filter((atributo) => atributo.value.prioridad == 1);
const atributos = atributosOpciones.filter((atributo) => atributo.value.prioridad != 1);

const mapWatcher = watch(mapRef, () => {
  if (mapRef.value) {
    const point = new Feature({
      geometry: new Point(fromLonLat([props.locacion.longitud, props.locacion.latitud])),
    });
    point.setStyle(
        new Style({
          image: new Icon({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'icon2.png',
          }),
        })
    );
    const vectorSource = new VectorSource({
      features: [point],
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    const mapObj = new Map({
      view: new View({
        center: fromLonLat([props.locacion.longitud, props.locacion.latitud]),
        zoom: 14,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer
      ],
      target: mapRef.value,
    });
  }
});

onMounted(() => {
  player.value = videojs(videoPlayer.value, {
    sources: [
      {
        src: props.locacion.video.HLS,
        type: 'application/x-mpegURL'
      }
    ],
    fill: true,
    aspectRatio: "8:15",
    loop: true
  });
});

onBeforeUnmount(() => {
  mapWatcher();
});

const sizeRef = ref({
  height: 100,
  width: 100
});

const scale = (size: number) => sizeRef.value.width / guidelineBaseWidth * size;

const resizeEvent = (size: { height: number, width: number }) => {
  sizeRef.value = size;
  preTituloFont.value = scale(15);
  preTituloMarginBottom.value = scale(-5);
  preTituloMarginLeft.value = scale(3);
  if (props.locacion.titulo.length < 15) {
    tituloFont.value = scale(30);
  } else if (props.locacion.titulo.length < 18) {
    tituloFont.value = scale(25);
  } else if (props.locacion.titulo.length < 25) {
    tituloFont.value = scale(20);
  }
};

let preTituloFont = ref(1);
let preTituloMarginBottom = ref(1);
let preTituloMarginLeft = ref(1);

let tituloFont = ref(1);

const guidelineBaseWidth = 350;

const play = () => {
  playerState.value = true;
  player.value.play();
};

const pause = () => {
  playerState.value = false;
  player.value.pause();
};

const editLocacion = async() => {
  await locacionStore.editLocacion(props.locacion);
  await router.push({name: "EditarLocacion"});
}

</script>

<style lang="scss" scoped>

.div-container {
  display: flex;
}

.pre-title {
  font-weight: 400;
  text-shadow: 0 2px 2.62px black;
  elevation: 4deg;
  color: white;
}

.title {
  font-weight: 600;
  text-shadow: 0 2px 2.62px black;
  elevation: 4deg;
  color: white;
}

.vjs-tech {
  object-fit: cover;
}

.inner-container {
  position: relative;
  float: left;
}

.side-div {
  position: relative;
  left: 1vw;
  top: 0;
}

.video-overlay {
  z-index: 10;
  position: absolute;
  padding: 10px 15px;
  bottom: 0;
  left: 0;
}

.play-btn {
  z-index: 20;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.pause-btn {
  z-index: 20;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
}

.pause-btn:hover {
  z-index: 20;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 1;
}

.blur-effect {
  background-color: rgba(211, 201, 201, 0.5);
  border-radius: 5px;
}
</style>
