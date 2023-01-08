import { defineStore } from 'pinia'
import { Session } from "@inrupt/solid-client-authn-browser";
import { useExplorerStore } from './explorerState';

export const useSessionStore = defineStore('session', {
  state: () => {
    return { 
      session: new Session(),
      isLoggedIn: false,
      webid: "",
     }
  },

  actions: {
    async login(solidIdentityProvider: string, redirectUrl?: string) {
      if (!(redirectUrl)) {
        redirectUrl = useExplorerStore().loginRedirectUrl;
      }
      await this.session.login({
          oidcIssuer: solidIdentityProvider,
          clientName: "Inrupt tutorial client app",
          redirectUrl: redirectUrl
      });
    },

    async handleRedirectAfterLogin(redirectUrl?: string) {
      if (!redirectUrl) {
        redirectUrl = useExplorerStore().loginRedirectUrl;
      }

      this.session.onLogin(() => {
        this.webid = this.session.info.webId!;
        this.isLoggedIn = true;
      });

      this.session.onLogout(() => {
        this.webid = "";
        this.isLoggedIn = false;
      });

      this.session.onSessionRestore(() => {
        this.webid = this.session.info.webId!;
        this.isLoggedIn = true;
      });

      this.session.onSessionExpiration(() => {
        this.webid = "";
        this.isLoggedIn = false;
      })

      await this.session.handleIncomingRedirect({
        url: redirectUrl,
        restorePreviousSession: true,
      });
    },

    async logout() {
      if (this.isLoggedIn) {
        this.session.logout();
      }
    }
  }
})