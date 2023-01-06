<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    type: string,
    mode: boolean,
}>();

enum PermissionType {
    Read = 'read',
    Write = 'write',
    Append = 'append',
    ControlRead = 'controlread',
    ControlWrite = 'controlwrite',
}

const permissionText = {
    'read': 'R',
    'write': 'W',
    'append': 'A',
    'controlread': 'CR',
    'controlwrite': 'CW',
}

const permissionTypeMap = new Map<string,PermissionType>(Object.values(PermissionType).map((v) => [v,v]))

function parseColor(volumeData: string): PermissionType | undefined {
    return permissionTypeMap.get(volumeData)
}

const color = computed(() => props.mode ? 'primary' : 'grey');
const icon = computed(() => props.mode ? 'mdi-checkbox-marked-circle' : 'mdi-cancel');
const text = computed(() => permissionText[props.type.toLowerCase() as keyof {}])
</script>

<template>
    <v-chip :color="color">{{ text }}<v-icon end :icon="icon"></v-icon></v-chip>
</template>