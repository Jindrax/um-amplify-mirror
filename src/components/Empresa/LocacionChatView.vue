<template>
  <q-card>
    <q-card-section>

    </q-card-section>
    <q-card-section>
      <q-chat-message
          name="me"
          avatar="https://cdn.quasar.dev/img/avatar1.jpg"
          :text="['hey, how are you?']"
          stamp="7 minutes ago"
          sent
          bg-color="amber-7"
      />
      <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar5.jpg"
          :text="['doing fine, how r you?']"
          stamp="4 minutes ago"
          text-color="white"
          bg-color="primary"
      />
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import Locacion from "layer/Entidades/Locacion";
import {onBeforeUnmount, onMounted, ref, watch} from "vue";

const props = defineProps<{
  agenteId: string,
  locacionId: Locacion
}>();

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
