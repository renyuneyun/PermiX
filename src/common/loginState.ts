import { ref } from "vue";
import { Session } from "@inrupt/solid-client-authn-browser";

export const session = new Session();

export const isLoggedIn = ref(session.info.isLoggedIn);
