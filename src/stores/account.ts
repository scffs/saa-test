import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export interface AccountTag {
  text: string
}

export interface Account {
  id: string
  tags: AccountTag[]
  type: 'Локальная' | 'LDAP'
  login: string
  password: string | null
}

export const useAccountStore = defineStore('accountStore', {
  state: () => ({
    accounts: [] as Account[],
  }),

  actions: {
    addAccount() {
      this.accounts.push({
        id: uuidv4(),
        tags: [],
        type: 'Локальная',
        login: '',
        password: '',
      })
    },

    /**
     * Updates an existing account identified by its ID.
     */
    updateAccount(updatedAccount: Account) {
      const index = this.accounts.findIndex((acc) => acc.id === updatedAccount.id)
      if (index !== -1) {
        this.accounts[index] = updatedAccount
      }
    },

    /**
     * Deletes an account from the list by its ID.
     */
    deleteAccount(accountId: string) {
      this.accounts = this.accounts.filter((acc) => acc.id !== accountId)
    },
  },

  persist: true,
})
