<script setup lang="ts">
import { computed, watchEffect, reactive, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useSessionStore } from '@/stores/session';
import { getUserInfo } from '@/common/userInfoUtils';
import { SOLID_IDENTITY_PROVIDERS } from '@/common/consts';

const sessionStore = useSessionStore();

const userInfo = reactive({
    loaded: false,
    avatar: "",
    name: "",
})

const { webid, isLoggedIn } = storeToRefs(sessionStore);

watchEffect(() => {
    if (webid.value) {
        getUserInfo(webid.value, userInfo);
    } else {
        userInfo.loaded = false;
    }
})

onMounted(() => {
    sessionStore.handleRedirectAfterLogin()
})
</script>

<template>
    <template v-if="!isLoggedIn || !userInfo.loaded">
    <v-tooltip :text="`login`" >
        <template v-slot:activator="{ props: tooltipProps }">
            <v-btn icon @click="sessionStore.login(SOLID_IDENTITY_PROVIDERS[0])">
                <v-avatar
                v-bind="tooltipProps"
                :color="`grey`"
                ></v-avatar>
            </v-btn>
        </template>
    </v-tooltip>
    </template>
    <template v-else>
        <v-menu min-width="200px" rounded>
            <template v-slot:activator="{ props }">
                <v-tooltip :text="`${userInfo.name}\n${webid}`">
                    <template v-slot:activator="{ props: tooltipProps }">
                        <v-btn icon v-bind="props">
                            <v-avatar v-bind="tooltipProps" :image="userInfo.avatar"></v-avatar>
                        </v-btn>
                    </template>
                </v-tooltip>
            </template>
            <v-card>
                <v-card-text>
                    <div class="mx-auto text-center">
                        <v-avatar color="brown" :image="userInfo.avatar">
                        </v-avatar>
                        <h3>{{ userInfo.name }}</h3>
                        <p class="text-caption mt-1">
                            {{ webid }}
                        </p>
                        <v-divider class="my-3"></v-divider>
                        <v-btn rounded variant="text" @click="sessionStore.session.logout()">
                            Disconnect
                        </v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-menu>


    </template>
</template>