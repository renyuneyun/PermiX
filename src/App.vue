<script setup lang="ts">
import DirPermissionExplorer from './components/DirPermissionExplorer.vue'
import Preference from './components/menuItems/Preference.vue';
import Test from './components/menuItems/Test.vue';
import UserInfo from './components/menuItems/UserInfo.vue';
</script>

<template>
  <v-app id="inspire">
    <v-navigation-drawer
      model-value
      class="pt-4"
      color="grey-lighten-3"
      rail
    >
      <UserInfo />
      <Preference />
    </v-navigation-drawer>

    <v-main>
      <DirPermissionExplorer />
    </v-main>
  </v-app>


</template>