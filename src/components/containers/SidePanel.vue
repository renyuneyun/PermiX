<template>
  <v-overlay
    location-strategy="connected"
    location="end center"
    origin="start center"
    content-class="info-pane"
  >
    <slot></slot>
  </v-overlay>
</template>

<style scoped>
.v-overlay :deep() .info-pane {
  width: 50%;
  min-width: 30em;
}
</style>
