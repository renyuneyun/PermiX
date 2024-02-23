import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import { aliases, mdi } from "vuetify/iconsets/mdi";

import "./assets/main.css";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(vuetify);
app.mount("#app");

// createApp(App)
//     .use(pinia)
//     .use(vuetify)
//     .mount('#app')
