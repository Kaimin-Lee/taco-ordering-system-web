import request from '@/utils/request'

export const authApi = {
  login: (data) => request.post('/b/auth/login', data)
}

export const dashboardApi = {
  today: () => request.get('/b/dashboard/today'),
  week: () => request.get('/b/dashboard/week'),
  month: () => request.get('/b/dashboard/month'),
  year: () => request.get('/b/dashboard/year')
}

export const orderApi = {
  todayList: () => request.get('/b/order/today'),
  updateStatus: (id, status) => request.put(`/b/order/status/${id}`, null, { params: { status } }),
  search: (params) => request.get('/b/order/search', { params }),
  detail: (id) => request.get(`/b/order/detail/${id}`)
}

export const categoryApi = {
  list: () => request.get('/b/category/list'),
  add: (data) => request.post('/b/category/add', data),
  update: (id, data) => request.put(`/b/category/update/${id}`, data),
  delete: (id) => request.delete(`/b/category/delete/${id}`)
}

export const productApi = {
  list: (params) => request.get('/b/product/list', { params }),
  add: (data) => request.post('/b/product/add', data),
  update: (id, data) => request.put(`/b/product/update/${id}`, data),
  delete: (id) => request.delete(`/b/product/delete/${id}`),
  updateStatus: (id, status) => request.put(`/b/product/status/${id}`, null, { params: { status } })
}
