import { boot } from 'quasar/wrappers';
import AmplifyVue from '@aws-amplify/ui-vue';

// declare module '@vue/runtime-core' {
//   interface ComponentCustomProperties {
//     $axios: AxiosInstance;
//   }
// }

export default boot(({ app }) => {
  app.use(AmplifyVue);
});
