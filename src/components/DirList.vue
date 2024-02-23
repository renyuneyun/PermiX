<script setup lang="ts">
import { ref, watchEffect } from "vue";
import {
  getDirResources,
  ResourceType,
  DirResource,
} from "../common/resourceUtils";
import type { Ref } from "vue";
import HighlightSegment from "./containers/HighlightSegment.vue";
import ResourceItemVue from "./ResourceItem.vue";
import { isEmpty } from "@/common/utils";

defineEmits(["resourceClicked", "switchContainer"]);
const props = defineProps(["currDir"]);

const loading = ref(false);

const dirResources: Ref<DirResource[]> = ref([]);

async function showDirContent(dirUrl?: string) {
  console.log(`showDirContent called with ${dirUrl}`);
  if (isEmpty(dirUrl)) return;
  loading.value = true;
  try {
    dirResources.value = await getDirResources(dirUrl);
  } finally {
    loading.value = false;
  }
}

watchEffect(() => {
  showDirContent(props.currDir);
});

function dirListItemClass(dirRes: DirResource): string {
  switch (dirRes.type) {
    case ResourceType.Dir:
      return "dir";
      break;
    case ResourceType.File:
      return "file";
      break;
    default:
      return "file";
  }
}
</script>

<template>
  <HighlightSegment>
    <p class="dir" v-if="currDir">{{ currDir }}</p>
    <v-progress-circular
      color="primary"
      indeterminate
      v-show="loading"
    ></v-progress-circular>
    <v-list lines="one" density="compact">
      <template v-for="dirRes in dirResources" :key="dirRes.url">
        <v-list-item :class="dirListItemClass(dirRes)">
          <v-row no-gutters>
            <v-col lg="11">
              <template v-if="dirRes.type == ResourceType.Dir">
                <v-row no-gutters>
                  <v-col lg="11">
                    <ResourceItemVue
                      @resource-clicked="(url) => $emit('resourceClicked', url)"
                      :url="dirRes.url"
                    />
                  </v-col>
                  <v-col lg="1">
                    <v-tooltip text="Go to" location="top center" origin="auto">
                      <template v-slot:activator="{ props }">
                        <v-icon
                          v-bind="props"
                          class="green"
                          size="small"
                          @click.prevent="$emit('switchContainer', dirRes.url)"
                          >mdi-arrow-right</v-icon
                        >
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </template>
              <template v-else>
                <ResourceItemVue
                  @resource-clicked="(url) => $emit('resourceClicked', url)"
                  :url="dirRes.url"
                />
              </template>
            </v-col>
            <v-col lg="1">
              <v-tooltip
                text="Show permission"
                location="top center"
                origin="auto"
              >
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    class="green"
                    size="small"
                    @click.prevent="$emit('resourceClicked', dirRes.url)"
                    >mdi-magnify</v-icon
                  >
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-list-item>
      </template>
    </v-list>
  </HighlightSegment>
</template>
