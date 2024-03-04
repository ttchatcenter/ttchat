import axios from 'axios'
import configs from '@/configs'

const http = axios.create({ baseURL: `${configs.apiDomain}/api` })

http.interceptors.request.use(async (config) => {
  try {
    const session = JSON.parse(window.localStorage.getItem(configs.userSessionKey))
    config.headers.Authorization = `Bearer ${session.access_token}`
    return config 
  } catch (error) {
    return config
  }
})

http.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 403) {
      window.localStorage.removeItem(configs.userSessionKey)
      window.location.href = '/login'
    }
  });

const api = {
  async request(...params) {
    return http.request(...params)
  },
  async get(...params) {
    return http.get(...params)
  },
  async post(...params) {
    return http.post(...params)
  },
  async put(...params) {
    return http.put(...params)
  },
  async patch(...params) {
    return http.patch(...params)
  },
  async delete(...params) {
    return http.delete(...params)
  },
}

export default api