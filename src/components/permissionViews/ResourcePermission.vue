<script setup lang="ts">
import { computed, ref, reactive, watchEffect } from 'vue';
import HighlightSegment from '../containers/HighlightSegment.vue';
import PermissionView from './commons/Card.vue';
import { getAllPermissionForResource, type PermissionInfo } from '../../common/permissionUtils';
import AgentBadgeForPermissionVue from '../agentBadges/AgentBadgeForPermission.vue';

interface PermissionInfoObject {
    error: Error | string | null,
    info: PermissionInfo,
}

const props = defineProps<{
    url?: string,
    loading?: boolean,
    permissionInfo?: PermissionInfoObject,
}>();


const _loading = ref(false);
const _permissionInfo = reactive<PermissionInfoObject>({
    error: null,
    info: {},
});

async function getPermission(url: string) {
    console.log(`getPermission(${url})`);
    _loading.value = true;
    getAllPermissionForResource(url)
        .then((returnedAccess) => {
            if (returnedAccess === null) {
                _permissionInfo.error = "Could not load access details for this Resource.";
            } else {
                _permissionInfo.error = null;
                _permissionInfo.info = returnedAccess;
            }
        }).catch((err) => {
            _permissionInfo.error = err;
        }).finally(() => {
            _loading.value = false;
        });
}

watchEffect(() => {
    if (props.url) {
        getPermission(props.url)
    }
})

const loading = computed(() => props.url ? _loading.value : props.loading);
const permissionInfo = computed(() => props.url ? _permissionInfo : props.permissionInfo);
</script>

<template>
    <HighlightSegment>
    <slot></slot>

    <v-progress-circular color="primary" indeterminate v-if="loading"></v-progress-circular>

    <template v-if="permissionInfo && !permissionInfo.error">
    <template v-for="[agent, permission], index in Object.entries(permissionInfo.info)">
        <v-container>
            <AgentBadgeForPermissionVue :agent="agent" />
            <v-container>
                <PermissionView :permission="permission" />
            </v-container>
            <v-divider></v-divider>
        </v-container>
    </template>
    </template>
    </HighlightSegment>
</template>