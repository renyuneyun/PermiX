<script setup lang="ts">
import { computed } from 'vue';
import HighlightSegment from '../containers/HighlightSegment.vue';
import PermissionView from './commons/Card.vue';
import type { PermissionInfo } from '../../common/permissionUtils';
import AgentBadgeForPermissionVue from '../agentBadges/AgentBadgeForPermission.vue';

interface PermissionInfoObject {
    error: Error | null,
    info: PermissionInfo,
}

const props = defineProps<{
    loading?: boolean,
    permissionInfo: PermissionInfoObject,
}>();
</script>

<template>
    <HighlightSegment>
    <slot></slot>

    <v-progress-circular color="primary" indeterminate v-show="loading"></v-progress-circular>

    <template v-if="props.permissionInfo && !props.permissionInfo.error">
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