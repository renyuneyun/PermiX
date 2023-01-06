/*
This component accepts `permission` as a prop, which is a `PermissionByAgent` object.
If not provided, it will use pinia store's `permissionByAgent`.
*/

<script setup lang="ts">
import { computed, reactive, watchEffect, ref } from 'vue';
import { getPermissionByAgent, retrievePermissionByAgent, type PermissionByAgent } from '@/common/permissionUtils';
import { useExplorerStore } from '@/stores/explorerState';
import HighlightSegment from '../containers/HighlightSegment.vue';
import AgentBadgeForPermissionVue from '../agentBadges/AgentBadgeForPermission.vue';
import Card from './commons/Card.vue';
import ResourceItemVue from '../ResourceItem.vue';
import { isEmpty } from '@/common/utils';
import { usePermissionByAgentStore } from '@/stores/permissionByAgent';

const props = defineProps<{
    url?: string,
}>()

const store = usePermissionByAgentStore();

// const store = reactive<{
//     loading: boolean,
//     progress: number,
//     permission?: PermissionByAgent

// }>({ 
//         loading: false,
//         progress: 0,
//         permission: undefined,
//      })

const explorerStore = useExplorerStore();

const url = computed(() => {
    if (props.url)
        return props.url;
    else
        return explorerStore.currDir;
})

async function load() {
    if (isEmpty(url.value))
        return;
    store.loading = true;
    try {
        // const permission = await getPermissionByAgent(url.value);
        // store.permission = permission;
        store.permission = {};
        await retrievePermissionByAgent(url.value, store.permission, store.progress)
        // await retrievePermissionByAgent(url.value);
    } finally {
        store.loading = false;
    }
    // debugText.value = JSON.stringify(permission, null, 2);
}

watchEffect(() => {
    load()
})
</script>

<template>
    <HighlightSegment>
        <slot></slot>
        <!-- <v-progress-circular color="primary" indeterminate v-show="store.loading"></v-progress-circular> -->
        <v-progress-linear color="primary" stream height="20" :model-value="store.progressPercent" v-show="store.loading">
            <template v-slot:default="{ value }">
                {{ store.progress.current }} / {{ store.progress.total}}
            </template>
        </v-progress-linear>
        <template v-if="store.permission">
            <template v-for="([agent, resourceOfPermissionList]) in Object.entries(store.permission)">
                <HighlightSegment>
                    <AgentBadgeForPermissionVue :agent="agent" />
                    <template v-for="resourceOfPermission, index in resourceOfPermissionList" :key="index">
                        <v-container>
                            <Card :permission="resourceOfPermission.permission" />
                            <v-container>
                                <template v-for="res, index in resourceOfPermission.resources" :key="index">
                                    <ResourceItemVue :url="res" />
                                </template>
                            </v-container>
                            <v-divider v-if="index < resourceOfPermissionList.length - 1"></v-divider>
                        </v-container>
                    </template>
                </HighlightSegment>
            </template>
        </template>
    </HighlightSegment>
</template>