# solid-permission-viewer

This Solid App aims to help you understand better the permission settings in your Pods (or any other compatible resources).

This template should help get you started developing with Vue 3 in Vite.

## Run

```sh
npm install
npm run dev
```

## Features (aimed)

This App aims to help explore the permission settings of different resources in your Pod. It will not simply show the content on a single ACL file of a resource.

Currently, it can show the permission grouped by agents: permissions that an agent (and thus all agents) has for what resource. Grouping that like:

```
{
    agent: {
        permission: [ 
            resources
         ]
    }
}
```

## What works

- Log in/out and get pods
- Get folder
- Show folder permission
- Show permission by agent
- Show user avatar

## TODO

- [x] Dynamic showing of permission while loading
- [x] Fix some components won't reload after hot-patch
- [x] Recursively query permission by agent
- [ ] Log-in using other pod providers
- [ ] Better folder view with resource type
- [ ] Determine whether `currDir` should be in store or as a provide
- [x] Fix permission by agent progress incorrect
- [ ] Show error messages
- [ ] Other views
- [ ] Misc UI/UX:
    - [ ] Add hamburger icon to show nav drawer for small screen
    - [ ] Better badges for other types of agents
    - [ ] More icons than text (where appropriate)
    - [ ] Real folder view with drop-down-like browser
    - [ ] Better!

## Dev information

This App is built using Vue.js (3) with Vite. It is mainly written in TS. It also uses:

- Pinia for global store
- Vuetify for UI
- Inrupt's Solid Client for Solid-related operations (auth, retrieving)
- Comunica for SPARQL
