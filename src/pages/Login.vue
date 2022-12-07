<template>
  <q-page class="row" v-if="$q.platform.is.desktop">
    <q-img src="/icon.png" class="icon" height="4vh" width="4vh"/>
    <div class="col-7 column q-gutter-y-sm items-center justify-center">
      <div class="col-1" style="width: 50%">
        <q-input outlined placeholder="Correo Electronico" square v-model="username">
          <template v-slot:prepend>
            <q-avatar>
              <img src="/person-icon.svg">
            </q-avatar>
          </template>
        </q-input>
      </div>
      <div class="col-1" style="width: 50%">
        <q-input outlined placeholder="Contraseña" square v-model="password" type="password" @keydown.enter="login">
          <template v-slot:prepend>
            <q-avatar>
              <img src="/pass-icon.svg">
            </q-avatar>
          </template>
        </q-input>
      </div>
      <div class="col-1" style="width: 50%">
        <div class="row">
          <a href="" @click.prevent="forgotPassword">¿Olvidó su contraseña?</a>
          <q-space/>
          <q-btn label="Iniciar Sesión" class="advance-btn" @click="login"/>
        </div>
      </div>
      <div class="col-1 footer">
        <div class="row q-mx-none q-px-none">
          <q-item class="q-mx-none q-px-none">
            <q-item-section>
              unminuto.co@2022
            </q-item-section>
          </q-item>
          <q-space/>
          <q-avatar>
            <img src="/icon-facebook.svg">
          </q-avatar>
          <q-avatar>
            <img src="/icon-instagram.svg">
          </q-avatar>
        </div>
      </div>
    </div>
    <div class="col-5">
      <div class="relative-position">
        <q-img :height="`${wHeight}px`" alt="login-art" src="/login-art.png"/>
        <q-img src="/banner.svg" class="banner absolute-center"/>
      </div>
    </div>
    <q-dialog v-model="modalFlag" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 50%">
        <q-card-section style="background-color: black; color: white">
          <span>Codigo de validación</span>
        </q-card-section>
        <q-card-section class="column q-gutter-y-md">
          <q-input class="col" v-model="validationCode" label="Código de validación"/>
          <q-btn class="col full-width advance-btn" label="Validar código" @click="validateEmail"/>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="modalChangePass" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 50%">
        <q-card-section style="background-color: black; color: white">
          <span>Cambio de contraseña</span>
        </q-card-section>
        <q-card-section class="column q-gutter-y-md">
          <q-input class="col" v-if="challengeName!=='NEW_PASSWORD_REQUIRED'" v-model="validationCode"
                   label="Código de validación"/>
          <q-input class="col" v-model="changePass" label="Nueva contraseña" type="password"/>
          <q-input class="col" v-model="changePassValidation" label="Confirmar contraseña" type="password"/>
          <q-btn class="advance-btn" label="Cambiar Contraseña" @click="changePassword"/>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-inner-loading :showing="loginState">
      <q-spinner-facebook size="100px" color="primary"/>
    </q-inner-loading>
  </q-page>
  <q-page class="row" v-else>
    <div class="col column items-center justify-center" style="background-image: url('/login-art.png')">
      <q-card>
        <q-card-section class="column q-gutter-sm">
          <div class="col row items-center justify-center">
            <q-img src="/icon.png" class="mobile-icon col-auto" height="4vh" width="4vh"/>
            <q-img src="/banner.svg" class="mobile-banner col-auto text-center"/>
          </div>
          <div class="col">
            <q-input outlined placeholder="Correo Electronico" square v-model="username">
              <template v-slot:prepend>
                <q-avatar>
                  <img src="/person-icon.svg">
                </q-avatar>
              </template>
            </q-input>
          </div>
          <div class="col">
            <q-input outlined placeholder="Contraseña" square v-model="password" type="password">
              <template v-slot:prepend>
                <q-avatar>
                  <img src="/pass-icon.svg">
                </q-avatar>
              </template>
            </q-input>
          </div>
          <div class="col">
            <div class="row">
              <a class="col" href="">¿Olvidó su contraseña?</a>
              <q-btn label="Iniciar Sesión" class="advance-btn col" @click="login"/>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <div class="col-1 footer">
        <div class="row q-mx-none q-px-none">
          <q-item class="q-mx-none q-px-none">
            <q-item-section>
              unminuto.co@2022
            </q-item-section>
          </q-item>
          <q-space/>
          <q-avatar>
            <img src="/icon-facebook.svg">
          </q-avatar>
          <q-avatar>
            <img src="/icon-instagram.svg">
          </q-avatar>
        </div>
      </div>
    </div>
    <q-dialog v-model="modalFlag">
      <q-card>
        <q-card-section style="min-width: 50%;">
          <q-input v-model="validationCode" label="Código de validación"/>
          <q-btn label="Enviar código" @click="validateEmail"/>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="modalChangePass">
      <q-card>
        <q-card-section style="min-width: 50%;">
          <q-input v-model="changePass" label="Nueva contraseña" type="password"/>
          <q-input v-model="changePassValidation" label="Confirmar contraseña" type="password"/>
          <q-btn label="Cambiar Contraseña" @click="changePassword"/>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {Auth} from 'aws-amplify';
import {useSessionStore} from "stores/session-store";
import {useRouter} from "vue-router";
import {useQuasar} from "quasar";
import {CognitoUser} from "@aws-amplify/auth";

const router = useRouter();
const sessionStore = useSessionStore();
let userHolder: undefined | CognitoUser = undefined;

const wHeight = computed(() => {
  return window.innerHeight;
});

const username = ref("");
const password = ref("");
const modalFlag = ref(false);
const modalChangePass = ref(false);
const validationCode = ref("");
const changePass = ref("");
const changePassValidation = ref("");
const loginState = ref(false);
const {notify} = useQuasar();
const challengeName = ref("");

const login = async () => {
  try {
    loginState.value = true;
    const user = await Auth.signIn(username.value, password.value);
    console.log(user);
    if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
      challengeName.value = user.challengeName;
      userHolder = user;
      modalChangePass.value = true;
    } else {
      await sessionStore.login(user);
      await router.push('/dashboard/Inicio');
    }
    loginState.value = false;
  } catch (e: any) {
    console.log(JSON.stringify(e));
    switch (e.code) {
      case "UserNotConfirmedException":
        modalFlag.value = true;
        break;
      case "PasswordResetRequiredException":
        modalChangePass.value = true;
        break;
      case "NotAuthorizedException":
        notify("Credenciales invalidas");
        break;
    }
    loginState.value = false;
  }
}

const validateEmail = async () => {
  try {
    await Auth.confirmSignUp(username.value, validationCode.value);
    await login();
  } catch (e) {
    console.log(e);
  }
};

const changePassword = async () => {
  try {
    if (changePassValidation.value === changePass.value) {
      switch (challengeName.value) {
        case "NEW_PASSWORD_REQUIRED":
          await Auth.completeNewPassword(userHolder, changePassValidation.value);
          break;
        default:
          await Auth.forgotPasswordSubmit(username.value, validationCode.value, changePassValidation.value);
          break;
      }
      modalChangePass.value = false;
      password.value = changePassValidation.value;
      await login();
    } else {
      notify("Las contraseñas no coinciden");
    }
  } catch (e) {
    console.log(e);
  }
}

const forgotPassword = async () => {
  if (username.value !== "") {
    loginState.value = true;
    await Auth.forgotPassword(username.value);
    loginState.value = false;
    notify("El código de validación se ha enviado al correo asociado a la cuenta");
    modalChangePass.value = true;
  } else {
    notify("No existe el correo que desea recuperar");
  }
}

</script>

<style scoped lang="scss">
.footer {
  position: absolute;
  bottom: 0;
  width: 29%;
}

.icon {
  position: absolute;
  left: 0;
  top: 0;
  margin-left: 10px;
  margin-top: 10px;
  filter: contrast(1);
}

.mobile-icon {
  filter: contrast(1);
}

.vertical {
  vertical-align: center;
}

.banner {
  width: 35vw;
  filter: invert(100%);
}

.mobile-banner {
  width: 50vw;
  filter: invert(100%);
}

</style>
