<script setup lang="ts">
import { K_PUBLIC } from '../../common/permissionUtils';
import WebidBadgeVue from './WebidBadge.vue';

defineProps<{
    agent: string,
}>()

const reWebid = /https?:\/\//

function isWebId(agent: string): boolean {
    return reWebid.test(agent)
}
</script>

<template>
    <p v-if="agent == K_PUBLIC">{{ agent }}</p>
    <WebidBadgeVue v-else-if="isWebId(agent)" :webid="agent" />
    <p v-else-if="agent.startsWith('mailto:')">{{ agent }}</p>
    <p v-else>{{ agent }}</p>
</template>