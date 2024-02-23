<script setup lang="ts">
import { useExplorerStore } from "@/stores/explorerState";
import { ref, reactive } from "vue";

const explorerStore = useExplorerStore();

const _myConfig = {
  baseUrl: explorerStore.baseUrl,
  recursiveRetrival: { ...explorerStore.recursiveRetrival },
};
const myConfig = reactive(_myConfig);

const valid = ref(true);

function saveIfValid(): boolean {
  if (valid.value) {
    explorerStore.$patch(_myConfig);
    return true;
  } else {
    return false;
  }
}

defineExpose({
  saveIfValid,
});
</script>

<template>
  <v-form ref="preferenceForm" v-model="valid">
    <v-text-field label="Base URL" v-model="myConfig.baseUrl"></v-text-field>
    <v-checkbox
      label="Recursive"
      v-model="myConfig.recursiveRetrival.enabled"
    ></v-checkbox>
    <v-text-field
      label="Recursive depth (0 means infinity)"
      :disabled="!myConfig.recursiveRetrival.enabled"
      type="number"
      :rules="[(v) => parseInt(v) >= 0 || 'Needs to be a non-negative integer']"
      v-model="myConfig.recursiveRetrival.depth"
    ></v-text-field>
  </v-form>
</template>
