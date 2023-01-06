<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { getDirResources, ResourceType, DirResource } from '../common/resourceUtils';
import type { Ref } from 'vue';
import HighlightSegment from './containers/HighlightSegment.vue';
import ResourceItemVue from './ResourceItem.vue';

defineEmits(['resourceClicked', 'switchContainer'])
const props = defineProps(['currDir'])

const loading = ref(false);

const dirResources: Ref<DirResource[]> = ref([]);

async function showDirContent(dirUrl: string) {
    console.log(`showDirContent called with ${dirUrl}`);
    loading.value = true;
    (async () => {
        try {
            dirResources.value = await getDirResources(dirUrl);
        } finally {
            loading.value = false;
        }
    })();
}

watchEffect(() => {
    showDirContent(props.currDir);
});
</script>

<template>
    <HighlightSegment>
    <p class="dir" v-if="currDir">{{ currDir }}</p>
    <v-progress-circular color="primary" indeterminate v-show="loading"></v-progress-circular>
    <v-list lines="one" density="compact">
        <template 
            v-for="dirRes in dirResources" :key="dirRes.url" >
            <v-list-item  v-if="dirRes.type == ResourceType.Dir" class="dir">
            <v-row>
                <v-col lg="10">
                <ResourceItemVue @resource-clicked="(url) => $emit('resourceClicked', url)" :url="dirRes.url"/>
                </v-col>
                <v-col lg="2">
                    <v-icon class="green" size="small" @click.prevent="$emit('switchContainer', dirRes.url)">mdi-arrow-right</v-icon>
                </v-col>
            </v-row></v-list-item>
            <v-list-item v-else class="file"><ResourceItemVue @resource-clicked="(url) => $emit('resourceClicked', url)" :url="dirRes.url"/></v-list-item>
        </template>
    </v-list>
    </HighlightSegment>
</template>