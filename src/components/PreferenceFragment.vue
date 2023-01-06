<script setup lang="ts">
import { useExplorerStore } from '@/stores/explorerState';

const explorerStore = useExplorerStore()
</script>

<template>
    <v-text-field label="Base URL" v-model="explorerStore.baseUrl"></v-text-field>
</template>