<script setup lang="ts">
import type { AccessModes } from "@inrupt/solid-client";
import { computed } from "vue";
import PermissionBadgeVue from "./Badge.vue";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps<{
  modelValue: AccessModes;
  editable?: boolean;
}>();

const editable = computed(() => props.editable || false);

function maybeUpdatePermissionItem(type: string, mode: boolean) {
  if (editable.value) {
    props.modelValue[type as keyof AccessModes] = mode;
    emit("update:modelValue", props.modelValue);
  }
}
</script>

<template>
  <template v-if="modelValue != null">
    <v-row no-gutters>
      <template v-for="[type, mode] in Object.entries(modelValue)">
        <v-col>
          <PermissionBadgeVue
            :type="type"
            :mode="mode"
            @click="() => maybeUpdatePermissionItem(type, !mode)"
          />
        </v-col>
      </template>
    </v-row>
  </template>
</template>
