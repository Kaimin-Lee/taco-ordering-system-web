import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/login', component: () => import('@/views/login/LoginView.vue') },
  {
    path: '/',
    component: () => import('@/components/Layout.vue'),
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', component: () => import('@/views/dashboard/DashboardView.vue'), meta: { title: '数据看板' } },
      { path: 'orders', component: () => import('@/views/orders/OrdersView.vue'), meta: { title: '订单管理' } },
      { path: 'order-search', component: () => import('@/views/orders/OrderSearchView.vue'), meta: { title: '订单查询' } },
      { path: 'products', component: () => import('@/views/products/ProductsView.vue'), meta: { title: '商品管理' } },
      { path: 'categories', component: () => import('@/views/categories/CategoriesView.vue'), meta: { title: '分类管理' } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const token = localStorage.getItem('adminToken')
  if (to.path !== '/login' && !token) return '/login'
})

export default router
