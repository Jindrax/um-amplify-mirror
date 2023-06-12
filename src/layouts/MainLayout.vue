<template>
  <q-layout view="lHh LpR fFf">
    <q-header class="bg-white text-black" elevated>
      <q-toolbar>
        <q-toolbar-title class="item-text-title">
          {{ pageLocation }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer
        v-model="drawer"
        behavior="desktop"
        bordered
    >
      <div class="column full-height bg-black">
        <div class="col-auto bg-black full-width q-py-sm">
          <div class="column items-center q-gutter-y-sm">
            <div class="col">
              <q-img class="logo" src="/icon.png" height="25px" width="25px" @click="test"/>
            </div>
            <div class="col">
              <q-img class="banner" src="/banner.svg" height="20px" width="160px" fit="contain"/>
            </div>
          </div>
        </div>
        <div class="col-auto column full-width bg-grey-8 items-center justify-evenly q-py-sm">
          <div class="col-auto">
            <div class="column items-center">
              <q-item class="text-white item-text-title">
                <q-item-section avatar>
                  <q-avatar icon="um-account" square class="bg-black" size="xl"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ session.firstName }} {{ session.lastName }}</q-item-label>
                  <q-item-label caption class="text-white item-text-caption" lines="1">Agente Bogotá</q-item-label>
                </q-item-section>
                <q-menu touch-position>
                  <q-list style="min-width: 100px">
                    <q-item clickable v-close-popup @click="logout">
                      <q-item-section>Cerrar Sesion</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
            </div>
          </div>
        </div>
        <div class="col-auto bg-black full-width">
          <q-list class="links">
            <q-item v-for="link in availableLinks" active-class="activeLink" clickable :to="link.meta.to">
              <q-item-section>
                <q-item-label>{{ link.meta.itemLink }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-drawer>
    <q-page-container class="bg-grey-4">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
import {useRouter} from "vue-router";
import {Auth} from "aws-amplify";
import {useSessionStore} from "stores/session-store";
import {useAgenteStore} from "stores/agente-store";
import {useLocacionStore} from "stores/locacion-store";
import {storeToRefs} from "pinia";
import {agenteDashboardDynamicRoute} from "../router/dynamicRoutes";

const router = useRouter();

const drawer = ref(true);

const session = useSessionStore();
const {isAdmin, userInfo} = storeToRefs(session);
const user = session.user;
const availableLinks = session.routes.children;

const pageLocation = computed(() => {
  return router.currentRoute.value.path.split("/").pop()!.replace("_", " ");
});

const logout = async () => {
  try {
    session.logout();
    useLocacionStore().reset();
    useAgenteStore().$reset();
    await Auth.signOut();
    await router.push('/');
  } catch (e) {
    console.log(e);
  }
};

const test = async () => {
  console.log(session.user);
  console.log(session.userInfo);
};

</script>

<style lang="scss" scoped>

.banner {
  filter: invert(100%);
}

.item-text-title {
  font-size: 3vh;
}

.item-text-caption {
  font-size: 2vh;
}

.logo {
  filter: invert(100%);
}

.links {
  font-size: 2.5vh;
  color: white;
}

.activeLink {
  font-size: 2.6vh;
  color: black;
  background: white;
}
</style>
