<template>
  <router-view/>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {Amplify} from 'aws-amplify';
import awsExports from './aws-exports';
import {useQuasar} from "quasar";

Amplify.configure(awsExports);

export default defineComponent({
  name: 'App',
  created() {
    useQuasar().iconMapFn = (iconName) => {
      if (iconName.startsWith('um-')) {
        return {
          cls: 'material-community-icons ' + iconName
        }
      }
    };
  }
})
</script>
