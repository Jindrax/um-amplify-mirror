<template>
  <div class="column q-pa-sm vertical-list-component">
    <q-item>
      <q-item-section>
        <q-item-label class="vertical-list-title">{{ title }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-list class="vertical-list-container rounded-borders" separator>
      <q-item v-for="item in list" :key="item.id !== undefined? item.id : item.name" :to="item.link">
        <q-item-section>
          <q-item-label class="vertical-list-item">{{ item.name }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-separator/>
    <q-item class="vertical-list-container">
      <q-item-section>
        <a href="">Ver mas</a>
      </q-item-section>
      <q-item-section avatar>
        <q-btn class="vertical-middle" v-if="actionUrl!==undefined" color="green" icon="add" @click="actionClick" round/>
      </q-item-section>
    </q-item>
  </div>
</template>

<script lang="ts" setup>
import {VerticalListItem} from "src/interfaces/VerticalListInterfaces";
import {useRouter} from "vue-router";

const router = useRouter();

const props = defineProps<{
  title: string,
  list: VerticalListItem[],
  actionUrl?: string
}>();

function actionClick() {
  router.push(props.actionUrl!);
}
</script>

<style lang="scss" scoped>
.vertical-list-title {
  font-size: 2vh;
  font-weight: bold;
}

.vertical-list-item {
  font-size: 2vh;
}

.vertical-list-container {
  background: white;
}

.vertical-list-component {
  width: 20vw;
}

.floating-button{
  position: absolute;
  right: -10px;
  bottom: -10px;
}
</style>
