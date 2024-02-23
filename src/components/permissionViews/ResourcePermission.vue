<script setup lang="ts">
import { computed, ref, reactive, watchEffect } from "vue";
import HighlightSegment from "../containers/HighlightSegment.vue";
import PermissionView from "./commons/Card.vue";
import {
  getAllPermissionForResource,
  setPermission,
  type PermissionInfo,
} from "../../common/permissionUtils";
import AgentBadgeForPermissionVue from "../agentBadges/AgentBadgeForPermission.vue";
import PermissionEditor from "./PermissionEditor.vue";
import type { AccessModes } from "@inrupt/solid-client";

interface PermissionInfoObject {
  error: Error | string | null;
  info: PermissionInfo;
}

const props = defineProps<{
  url?: string;
  loading?: boolean;
  permissionInfo?: PermissionInfoObject;
}>();

const dialog = ref({} as { [key: number]: boolean });

const selfManaged = computed(() => props.url && true);

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
        _permissionInfo.error =
          "Could not load access details for this Resource.";
      } else {
        _permissionInfo.error = null;
        _permissionInfo.info = returnedAccess;
      }
    })
    .catch((err) => {
      _permissionInfo.error = err;
    })
    .finally(() => {
      _loading.value = false;
    });
}

watchEffect(() => {
  if (props.url) {
    getPermission(props.url);
  }
});

const loading = computed(() =>
  selfManaged.value ? _loading.value : props.loading,
);
const permissionInfo = computed(() =>
  selfManaged.value ? _permissionInfo : props.permissionInfo,
);

async function onReceiveNewPermission(agent: string, permission: AccessModes) {
  const newPermission = (await setPermission(
    props.url!,
    agent,
    permission,
  )) as AccessModes | null;
  if (selfManaged.value) {
    _permissionInfo.info[agent] = newPermission;
  }
}
</script>

<template>
  <HighlightSegment>
    <slot></slot>

    <v-progress-circular
      color="primary"
      indeterminate
      v-if="loading"
    ></v-progress-circular>

    <template v-if="permissionInfo && !permissionInfo.error">
      <template
        v-for="([agent, permission], index) in Object.entries(
          permissionInfo.info,
        )"
      >
        <template v-if="permission">
          <v-container key="index">
            <AgentBadgeForPermissionVue :agent="agent" />
            <v-container>
              <PermissionView :model-value="permission" />
            </v-container>
            <v-divider></v-divider>

            <v-dialog v-model="dialog[index]" activator="parent">
              <PermissionEditor
                :agent="agent"
                :permission="permission"
                @ok="
                  (agent, newPerm) => {
                    onReceiveNewPermission(agent, newPerm);
                    dialog[index] = false;
                  }
                "
              ></PermissionEditor>
            </v-dialog>
          </v-container>
        </template>
      </template>
    </template>
  </HighlightSegment>
</template>
