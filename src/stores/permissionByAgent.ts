import { defineStore } from 'pinia'
import type { PermissionByAgent } from '@/common/permissionUtils'

export const usePermissionByAgentStore = defineStore('permissionByAgent', {
  state: () => {
    return { 
        loading: false,
        progress: {
          current: 0,
          total: 0,
        },
        permission: {} as PermissionByAgent,
     }
  },

  getters: {
    progressPercent: (state) => state.progress.total > 0 ? state.progress.current / state.progress.total * 100 : 0,
  },
})