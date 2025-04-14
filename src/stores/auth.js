import { defineStore } from 'pinia'
import { useToast } from 'vue-toast-notification'
import api from '@/lib/axios'
import router from '@/router'

const toast = useToast()

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    registerEmail: null,
  }),
  actions: {
    async register({ name, email }) {
      const res = await api.post('/register', { name, email })

      this.registerEmail = res.data.email
    },
    async login(email) {
      const res = await api.post('/login', { email })

      this.registerEmail = res.data.email
    },
    async verifyOtp(email, otp_code) {
      const res = await api.post('/verify-otp', { email, otp_code })
      this.token = res.data.access_token
      localStorage.setItem('token', this.token)
      await this.fetchUser()
    },
    async fetchUser() {
      const res = await api.get('/user')
      this.user = res.data.user
    },
    async logout() {
      try {
        const response = await api.get('/logout')

        toast.success(response.data.message, {
          position: 'top-right',
          duration: 5000,
        })
      } catch (error) {
        toast.error('Server Error - ' + error.response?.data?.message || error.message, {
          position: 'top-right',
          duration: 5000,
        })
      } finally {
        this.token = null
        this.user = null
        localStorage.removeItem('token')
        router.push('/login')
      }
    },
  },

  persist: {
    paths: ['registerEmail', 'token', 'user'],
  },
})
