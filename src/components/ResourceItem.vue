<script setup lang="ts">
import { reactive, computed, watchEffect } from 'vue';
import path from 'path';
import { QueryEngine } from '@comunica/query-sparql'
import { useSessionStore } from '@/stores/session';
import { useExplorerStore } from '@/stores/explorerState';
import { getSolidDataset, toRdfJsDataset } from '@inrupt/solid-client';
import N3 from 'n3';

defineEmits(['resourceClicked'])
const props = defineProps<{
    url: string,
}>()

const resInfo = reactive({
    loaded: false,
    title: "",
})

const explorerStore = useExplorerStore();
const sessionStore = useSessionStore();

const queryEngine = new QueryEngine();

const baseUrl = computed(() => {
    if ((explorerStore.baseUrl?.length || 0) == 0) {
        return path.dirname(props.url)
    } else {
        return explorerStore.baseUrl
    }
})

watchEffect(() => {
    getResourceInfo()
})
    
function getResourceInfo() {
    resInfo.loaded = false;
    resInfo.title = path.relative(baseUrl.value, props.url);
    resInfo.loaded = true;
    // getMetaDirect()
}

async function getMetaDirect() {
    const target = props.url + '.meta'

    queryEngine.queryBindings(`
        SELECT * {
            ?s ?p ?o.
        } LIMIT 100
    `, {
        sources: [target],
        '@comunica/actor-http-inrupt-solid-client-authn:session': sessionStore.session,
    }).then(function (bindingsStream) {
        bindingsStream.on('data', function (data) {
            console.log(data.get('s').value + ' ' + data.get('p').value + ' ' + data.get('o').value)
        });
    });

}

async function getMetaWithN3() {
    const target = props.url + '.meta'

    const dataset = await getSolidDataset(target, {
        fetch: sessionStore.session.fetch,
    });
    const rdfJsDataset = toRdfJsDataset(dataset);
    const store = new N3.Store();
    for (const quad of rdfJsDataset) {
        store.add(quad);
    }

    queryEngine.queryBindings(`
        SELECT * {
            ?s ?p ?o.
        } LIMIT 100
    `, {
        sources: [store]
    }).then(function (bindingsStream) {
        bindingsStream.on('data', function (data) {
            console.log(data.get('s').value + ' ' + data.get('p').value + ' ' + data.get('o').value)
        });
    });

}

</script>

<template>
    <v-chip class="green" @click="$emit('resourceClicked', url)">
        <a :href="url">
            <v-icon icon="mdi-link"></v-icon>
        </a>
        <template v-if="!resInfo.loaded">{{ url }}</template>
        <template v-else>{{ resInfo.title }}</template>
    </v-chip>
</template>