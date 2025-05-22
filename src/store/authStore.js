import { defineStore } from 'pinia'
import { login, profileAdd, profileEdit, profileList } from '@/api/auth'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    token: localStorage.getItem('auth_token') || null,
    profile: [],
    message: null,
    loading: false,
  }),

  actions: {
    async loginUser(credentials) {
      this.loading = true
      this.message = null
      try {
        const { result } = await login(credentials)
        this.token = result.token
        localStorage.setItem('auth_token', result.token)
      } catch (err) {
        this.message = err.response?.data?.message || 'Failed to log in'
      } finally {
        this.loading = false
      }
    },

    async logoutUser() {
      this.loading = true
      try {
        this.token = null
        localStorage.removeItem('auth_token')
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },

    async profileListData(credentials) {
      this.loading = true
      this.message = null
      try {
        const { result } = await profileList(credentials)
        this.profile = result.data
      } catch (err) {
        this.message = err.response?.data?.message || 'Failed to get list profile data'
      } finally {
        this.loading = false
      }
    },

    async profileAddData(credentials) {
      this.loading = true
      this.message = null
      try {
        await profileAdd(credentials)
        this.message = 'Success add profile data'
      } catch (err) {
        this.message = err.response?.data?.message || 'Failed to add profile data'
      } finally {
        this.loading = false
      }
    },

    async profileEditData(credentials) {
      this.loading = true
      this.message = null
      try {
        await profileEdit(credentials)
        this.message = 'Success edit profile data'
      } catch (err) {
        this.message = err.response?.data?.message || 'Failed to edit profile data'
      } finally {
        this.loading = false
      }
    },
  },
})
