import {defineStore} from 'pinia';
import {Loading, QSpinnerFacebook} from 'quasar'

export const useStateStore = defineStore('state', {
    state: () => ({
        uploading: false,
        uploadingProgress: 0,
        awaiting: false
    }),

    actions: {
        awaitResponse(message: string) {
            // this.awaiting = true;
            Loading.show({
                spinner: QSpinnerFacebook,
                message,
                boxClass: "empresa-advance-btn",
                spinnerSize: 150
            });
        },
        stopWaiting() {
            // this.awaiting = false;
            Loading.hide();
        },
        startUploading() {
            this.awaiting = true;
            this.uploading = true;
        },
        stopUploading() {
            this.awaiting = false;
            this.uploading = false;
        },
        setUploadProgress(progress: number) {
            this.uploadingProgress = progress;
        }
    },
    persist: true
});
