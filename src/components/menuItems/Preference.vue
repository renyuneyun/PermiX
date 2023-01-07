<script setup lang="ts">
import { ref } from 'vue';
import SidePanel from '../containers/SidePanel.vue';
import PreferenceFragment from '../PreferenceFragment.vue';

const fragment = ref<InstanceType<typeof PreferenceFragment> | null>(null);

const dialog = ref(false);

function close() {
    dialog.value = false;
}

function saveAndClose() {
    if (fragment.value?.saveIfValid()) {
        close();
    }
}

</script>

<template>
    <v-btn variant="text" class="text-center">
        <v-tooltip text="Preference">
        <template v-slot:activator="{ props }">
            <v-icon v-bind="props" icon="mdi-cog" content-class="d-block text-center mx-auto"> </v-icon>
        </template>
        </v-tooltip>
        <!-- <v-dialog v-model="dialog" activator="parent"> -->
        <SidePanel v-model="dialog" activator="parent">
            <v-card>
                <v-card-text>
                    Preference
                </v-card-text>
                <v-list>
                    <v-list-item>
                        <PreferenceFragment ref="fragment" />
                    </v-list-item>
                </v-list>
                <v-card-actions>
                    <v-btn color="primary" @click="saveAndClose">Save & Close</v-btn>
                    <v-btn @click="close">Close</v-btn>
                </v-card-actions>
            </v-card>
        </SidePanel>
        <!-- </v-dialog> -->

    </v-btn>

</template>