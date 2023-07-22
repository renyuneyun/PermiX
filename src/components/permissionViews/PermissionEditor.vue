<script setup lang="ts">
import { EMPTY_PERMISSION } from '@/common/consts';
import type { AccessModes } from "@inrupt/solid-client";
import { reactive } from 'vue';
import AgentBadgeForPermission from '../agentBadges/AgentBadgeForPermission.vue';
import Card from './commons/Card.vue';

defineEmits(['ok'])

const props = defineProps<{
    agent: string,
    permission?: AccessModes,
}>()

const permission = reactive({
    ...EMPTY_PERMISSION,
    ...props.permission,
})
</script>

<template>
    <v-card>
        <v-card-text>
        <AgentBadgeForPermission :agent="agent"></AgentBadgeForPermission>
        <Card :model-value="permission" :editable="true"></Card>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" block @click="$emit('ok', agent, permission)">OK</v-btn>
        </v-card-actions>
    </v-card>
</template>