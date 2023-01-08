<script setup lang="ts">
import { computed, watchEffect, reactive, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useSessionStore } from '@/stores/session';
import { getUserInfo } from '@/common/userInfoUtils';
import { SOLID_IDENTITY_PROVIDERS } from '@/common/consts';
import LoginFragment from '../LoginFragment.vue';
import SidePanel from '../containers/SidePanel.vue';
// import { VBtn } from 'vuetify/lib';

const sessionStore = useSessionStore();

// const userIcon = ref<InstanceType<typeof VBtn>>(null);
// const userIcon = ref<VBtn>(null);
const userIcon = ref(null);

const dialog = ref(false);

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

function login(idp: string) {
    sessionStore.login(idp)
}
</script>

<template>
    <template v-if="!isLoggedIn || !userInfo.loaded">
    <v-tooltip :text="`login`" >
        <template v-slot:activator="{ props: tooltipProps }">
            <v-btn ref="userIcon" icon>
                <v-avatar
                v-bind="tooltipProps"
                :color="`grey`"
                ></v-avatar>


            </v-btn>
        </template>
    </v-tooltip>
    <SidePanel v-model="dialog" :activator="userIcon">
        <v-card>
            <v-card-text>
                Log in
            </v-card-text>
            <v-list>
                <v-list-item>
                    <LoginFragment @login="(idp) => login(idp)" />
                </v-list-item>
            </v-list>
        </v-card>
    </SidePanel>
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