import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

request.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  res => {
    const { code, message, data } = res.data
    if (code === 200) return res.data
    ElMessage.error(message || '请求失败')
    return Promise.reject(new Error(message))
  },
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('adminToken')
      router.push('/login')
    }
    ElMessage.error(err.response?.data?.message || '网络错误')
    return Promise.reject(err)
  }
)

export default request
