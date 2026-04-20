<template>
  <el-container class="layout">
    <el-aside width="200px">
      <div class="logo">塔可点餐系统</div>
      <el-menu :default-active="$route.path" router>
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据看板</span>
        </el-menu-item>
        <el-menu-item index="/orders">
          <el-icon><List /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="/order-search">
          <el-icon><Search /></el-icon>
          <span>订单查询</span>
        </el-menu-item>
        <el-menu-item index="/products">
          <el-icon><Goods /></el-icon>
          <span>商品管理</span>
        </el-menu-item>
        <el-menu-item index="/categories">
          <el-icon><Menu /></el-icon>
          <span>分类管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <span>{{ $route.meta.title }}</span>
        <el-button @click="logout" link>退出登录</el-button>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const logout = () => {
  localStorage.removeItem('adminToken')
  router.push('/login')
}
</script>

<style scoped>
.layout { height: 100vh; }
.el-aside { background: #304156; }
.logo { color: #fff; text-align: center; padding: 20px; font-size: 18px; font-weight: bold; }
.el-menu { border: none; background: #304156; }
.el-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e4e7ed; }
</style>
