<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useSessionStore } from "../stores/session";
import { getPodUrlAll } from "@inrupt/solid-client";

defineEmits(["podClicked"]);

const pods = ref([] as string[]);

const sessionStore = useSessionStore();

async function getPods(webid: string) {
  const mypods = await getPodUrlAll(webid, { fetch: fetch });
  pods.value = mypods;
}

watchEffect(() => {
  if (sessionStore.isLoggedIn) {
    getPods(sessionStore.webid);
  } else {
    pods.value = [];
  }
});
</script>

<template>
  <template v-if="!sessionStore.isLoggedIn"> </template>
  <template v-else>
    <v-list lines="one">
      <v-list-item
        v-for="(pod, index) in pods"
        :key="pod"
        prependIcon="mdi-home"
        @click="$emit('podClicked', pod)"
        ><v-list-item-title
          >{{ index }} - {{ pod }}</v-list-item-title
        ></v-list-item
      >
    </v-list>
  </template>
</template>
