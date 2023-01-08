<script setup lang="ts">
import { reactive, computed, watchEffect } from 'vue';
import { getUserInfo } from '@/common/userInfoUtils';
// import { QueryEngine } from '@comunica/query-sparql'
// import { FOAF, VCARD } from '@inrupt/vocab-common-rdf'

const props = defineProps<{
    webid: string,
}>()

const userInfo = reactive({
    loaded: false,
    avatar: undefined,
    name: "",
})

const hasAvatar = computed(() => userInfo.loaded && userInfo.avatar )
const hasName = computed(() => userInfo.loaded && userInfo.name )

watchEffect(() => {
    getUserInfo(props.webid, userInfo)
})

// const queryEngine = new QueryEngine();

// watchEffect(() => {
//     getUserInfo()
// })

// async function getUserInfo() {
//     userInfo.loaded = false;
//     queryEngine.queryBindings(`
//         SELECT ?name ?photo {
//             ?s a <${FOAF.Person}>.
//             OPTIONAL {
//                 ?s <${VCARD.hasPhoto}> ?photo
//             }
//             OPTIONAL {
//                 ?s <${VCARD.fn}> ?name 
//             }
//         } LIMIT 1
//     `, {
//       sources: [props.webid],
//     }).then(function (bindingsStream) {
//         bindingsStream.on('data', function (data) {
//             userInfo.avatar = data.get('photo')?.id;
//             userInfo.name = data.get('name')?.value;
//             userInfo.loaded = true;
//         });
//     });
// }

// getUserInfo();
</script>

<template>
    <v-chip :href="webid" color="primary" label>
        <v-icon v-if="!hasAvatar" start icon="mdi-account-circle-outline"></v-icon>
        <v-avatar v-else start :image="userInfo.avatar"></v-avatar>
        <template v-if="!hasName">
            {{ webid }}
        </template>
        <template v-else>
            {{ userInfo.name }}
        </template>
    </v-chip>
</template>