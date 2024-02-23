<script setup lang="ts">
import { ref } from "vue";
import { SOLID_IDENTITY_PROVIDERS } from "@/common/consts";

defineEmits(["login"]);

const identityProvider = ref("");
</script>

<template>
  <v-form>
    <v-row>
      <v-col lg="8">
        <v-text-field
          v-model="identityProvider"
          label="Solid identity provider"
        ></v-text-field>
      </v-col>
      <v-col lg="4">
        <v-btn @click="$emit('login', identityProvider)">Log in</v-btn>
      </v-col>
    </v-row>
    <v-list lines="two">
      <template
        v-for="([idp, label], index) in SOLID_IDENTITY_PROVIDERS"
        :key="index"
      >
        <v-list-item
          :title="label"
          :subtitle="idp"
          @click="
            identityProvider = idp;
            $emit('login', idp);
          "
        ></v-list-item>
      </template>
    </v-list>
  </v-form>
</template>
