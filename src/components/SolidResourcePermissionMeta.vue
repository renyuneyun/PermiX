<script setup>
import { reactive, ref, inject, watch, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import ResourcePermissionVue from './permissionViews/ResourcePermission.vue';
import HighlightSegment from './containers/HighlightSegment.vue';
import DirListVue from './DirList.vue';
import { useExplorerStore } from '@/stores/explorerState';
import UserPods from './UserPods.vue';
import { useSessionStore } from '@/stores/session';

const explorerStore = useExplorerStore();
const sesisonStore = useSessionStore();

const resourceUrl = ref("");

const { currDir } = storeToRefs(explorerStore);

const debugText = inject('debugText');

async function setDir(dirUrl) {
    console.log(`setDir(${dirUrl})`)
    currDir.value = dirUrl;
    explorerStore.baseUrl = dirUrl;
}

async function getPermission(target) {
    explorerStore.permissionTarget = target
}

watchEffect(() => {
    resourceUrl.value = currDir.value;
    if ((explorerStore.baseUrl?.length || 0) == 0) {
        explorerStore.baseUrl = currDir.value;
    }
    getPermission(currDir.value);
})
</script>

<template>
    <HighlightSegment>
        <v-container v-if="sesisonStore.isLoggedIn">
            <p>Pick one of your pods:</p>
            <UserPods @pod-clicked="(podUrl) => currDir = podUrl" />
            <p>Or enter a Resource URL:</p>
        </v-container>
        <v-container>
        <v-row no-gutters>
        <v-col sm="8">
            <v-row>
                <v-col lg="10">
                    <v-text-field label="Resource URL" v-model="resourceUrl"></v-text-field>
                </v-col>
                <v-col lg="2">
                    <v-btn color="primary" @click.prevent="setDir(resourceUrl)">Get It</v-btn>
                </v-col>
            </v-row>
        </v-col>
        </v-row>
        </v-container>
    </HighlightSegment>
    <v-row no-gutters>
        <v-col cols="12" lg="6">
            <DirListVue :curr-dir="currDir"
            @resource-clicked="(resUrl) => {getPermission(resUrl)}"
            @switch-container="(dirUrl) => {setDir(dirUrl)}"
            />
        </v-col>
        <v-col cols="12" lg="6">
            <ResourcePermissionVue :url="explorerStore.permissionTarget" >
                <div>Permission for resource {{explorerStore.permissionTarget}}</div>
            </ResourcePermissionVue>
        </v-col>
    </v-row>

</template>
