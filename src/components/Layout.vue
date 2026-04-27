<template>
  <el-container class="layout">
    <el-aside width="220px">
      <div class="logo">
        <span class="logo-icon">🌮</span>
        <span class="logo-text">塔可点餐</span>
      </div>
      <el-menu :default-active="$route.path" router background-color="#304156" text-color="#bfcbd9" active-text-color="#409eff">
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
        <div class="header-left">
          <span class="page-title">{{ $route.meta.title }}</span>
        </div>
        <div class="header-right">
          <el-button @click="logout" link type="primary">退出登录</el-button>
        </div>
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
.el-aside { background: #304156; box-shadow: 2px 0 6px rgba(0,0,0,0.1); }
.logo {
  color: #fff;
  text-align: center;
  padding: 24px 20px;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.logo-icon { font-size: 28px; }
.logo-text { letter-spacing: 2px; }
.el-menu {
  border: none;
  background: #304156;
  padding: 10px 0;
}
.el-menu-item {
  margin: 4px 12px;
  border-radius: 6px;
  transition: all 0.3s;
}
.el-menu-item:hover {
  background: rgba(64, 158, 255, 0.1) !important;
}
.el-menu-item.is-active {
  background: #409eff !important;
  color: #fff !important;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e4e7ed;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  padding: 0 24px;
}
.header-left { display: flex; align-items: center; }
.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}
.header-right { display: flex; align-items: center; gap: 16px; }
.el-main {
  background: #f0f2f5;
  padding: 24px;
}
</style>
