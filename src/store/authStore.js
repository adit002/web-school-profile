import { defineStore } from 'pinia'
import {
  login,
  newseAdd,
  newsEdit,
  newsList,
  profileAdd,
  profileEdit,
  profileList,
  registereAdd,
  registerEdit,
  registerList,
} from '@/api/auth'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    token: localStorage.getItem('auth_token') || null,
    profile: [],
    register: [],
    news: [],
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
    async registerListData(credentials) {
      this.loading = true
      this.message = null
      try {
        const { result } = await registerList(credentials)
        this.register = result.data
      } catch (err) {
        this.message = err.response?.data?.message || 'Failed to get list register data'
      } finally {
        this.loading = false
      }
    },

    async registerAddData(credentials) {
      this.loading = true
      this.message = null
      try {
        await registereAdd(credentials)
        this.message = 'Success add register data'
      } catch (err) {
        this.message = err.response?.data?.message || 'Failed to add register data'
      } finally {
        this.loading = false
      }
    },

    async registerEditData(credentials) {
      this.loading = true
      this.message = null
      try {
        await registerEdit(credentials)
        this.message = 'Success edit register data'
      } catch (err) {
        this.message = err.response?.data?.message || 'Failed to edit register data'
      } finally {
        this.loading = false
      }
    },
    async newsListData(credentials) {
      this.loading = true
      this.message = null
      try {
        const { result } = await newsList(credentials)
        this.news = result.data
      } catch (err) {
        this.message = err.response?.data?.message || 'Failed to get list news data'
      } finally {
        this.loading = false
      }
    },

    async newsAddData(credentials) {
      this.loading = true
      this.message = null
      try {
        await newseAdd(credentials)
        this.message = 'Success add news data'
      } catch (err) {
        this.message = err.response?.data?.message || 'Failed to add news data'
      } finally {
        this.loading = false
      }
    },

    async newsEditData(credentials) {
      this.loading = true
      this.message = null
      try {
        await newsEdit(credentials)
        this.message = 'Success edit news data'
      } catch (err) {
        this.message = err.response?.data?.message || 'Failed to edit news data'
      } finally {
        this.loading = false
      }
    },
  },
})
