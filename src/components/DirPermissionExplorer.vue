<script setup lang="ts">
import { provide, ref, watch } from 'vue';
import SolidResourcePermissionMeta from './SolidResourcePermissionMeta.vue';
import PermissionByAgentVue from './permissionViews/PermissionByAgent.vue';
import { useExplorerStore } from '@/stores/explorerState';

const debugText = ref("");
const currDir = ref("");
provide('debugText', debugText);
provide('currentDir', currDir);

const explorerStore = useExplorerStore();

watch(currDir, (newDir, oldDir) => {
    explorerStore.currDir = newDir;
})
</script>

<template>
    <v-row>
        <v-col lg="8" sm="12">
            <SolidResourcePermissionMeta />
        </v-col>
        <v-col lg="4" sm="4">
            <PermissionByAgentVue>
                <div>Permission by agent</div>
            </PermissionByAgentVue>
        </v-col>
    </v-row>
</template>