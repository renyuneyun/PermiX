# solid-permission-explorer

This Solid App aims to help you understand better the permission settings in your Pods (or any other compatible resources), and also provide easy manipulation of them.

This template should help get you started developing with Vue 3 in Vite.

## Run

```sh
npm install
npm run dev
```

## Features (aimed)

This App aims to help explore the permission settings of different resources in your Pod. It aims at not only a single resource, but also a container and even the Pod.

Currently, it can show (and edit) the permission grouped by agents: permissions that an agent (and thus all agents) has for what resource. Grouping that like:

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
- Show permission by agent (and recursively)
- Show user avatar
- Edit permission

## TODO

- [x] Dynamic showing of permission while loading
- [x] Fix some components won't reload after hot-patch
- [x] Recursively query permission by agent
- [x] Log-in using other pod providers
- [ ] Better folder view with resource type
- [ ] Show error messages
- [x] Edit access control
- [x] Keep log-in state
- [ ] Write new access control
- [ ] A view about ACL file content
- [ ] Fix bugs
    - [x] Permission by agent progress incorrect
    - [ ] After enabling recursive read, the form won't be submittable until changed the text field of recursion depth
- [ ] Misc UI/UX:
    - [ ] Add hamburger icon to show nav drawer for small screen
    - [ ] Center nav drawer icons
    - [ ] Better badges for other types of agents
    - [ ] More icons than text (where appropriate)
    - [ ] I18n
    - [ ] Better!

### To determine

- [ ] Should `currDir` be in store or as a provide?
- [ ] Should permission by agent be a store?
- [ ] Real folder view with drop-down-like browser?
- [ ] Move folder view as an expandable hanging line, and each permission view as a separate tab / page?
- [ ] Show parent's permission if current file does not have special permission?


## Dev information

This App is built using Vue.js (3) with Vite. It is mainly written in TS. It also uses:

- Pinia for global store
- Vuetify for UI
- Inrupt's Solid Client for Solid-related operations (auth, retrieving)
- Comunica for SPARQL
