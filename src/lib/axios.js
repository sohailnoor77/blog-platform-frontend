import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: false,
})

// request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// response interceptor
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    const auth = useAuthStore()

    const isAuthEndpoint = originalRequest.url.includes('/logout') || originalRequest._retry

    if (error.response?.status === 401 && !isAuthEndpoint) {
      originalRequest._retry = true
      await auth.logout()
    }

    return Promise.reject(error)
  },
)

export default api
