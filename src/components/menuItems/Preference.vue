<script setup lang="ts">
import { ref } from 'vue';
import SidePanel from '../containers/SidePanel.vue';
import PreferenceFragment from '../PreferenceFragment.vue';

const dialog = ref(false);
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
                        <PreferenceFragment />
                    </v-list-item>
                </v-list>
                <v-card-actions>
                    <v-btn color="primary" block @click="dialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </SidePanel>
        <!-- </v-dialog> -->

    </v-btn>

</template>