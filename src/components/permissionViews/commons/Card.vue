<script setup lang="ts">
import type { AccessModes } from '@inrupt/solid-client/dist/acp/type/AccessModes';
import PermissionBadgeVue from './Badge.vue';

defineProps<{
    permission: AccessModes | null,
}>()

</script>

<template>
    <template v-if="permission != null">
        <v-row no-gutters>
            <template v-for="([type, mode]) in Object.entries(permission)">
            <v-col>
                <PermissionBadgeVue :type="type" :mode="mode" />
            </v-col>
            </template>
        </v-row>
    </template>
</template>