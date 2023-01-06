<script setup lang="ts">
import { reactive, watchEffect } from 'vue';
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
    <v-chip color="primary" label>
        <template v-if="!userInfo.loaded">
            <v-icon start icon="mdi-account-circle-outline"></v-icon>
            {{ webid }}
        </template>
        <template v-else>
            <v-avatar :image="userInfo.avatar"></v-avatar>
            <a :href="webid">{{ userInfo.name }}</a>
        </template>
    </v-chip>
</template>