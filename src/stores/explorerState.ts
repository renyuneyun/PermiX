import { defineStore } from 'pinia'

export const useExplorerStore = defineStore('explorer', {
    state: () => {
        return { 
            applicaionBaseUrl: window.location.href,
            baseUrl: "",  // The base URL for showing resource (relative name)
            currDir: "",
            permissionTarget: "",
         }
    },

    getters: {
        loginRedirectUrl: (state) => {
            return state.applicaionBaseUrl
        },
    }
})