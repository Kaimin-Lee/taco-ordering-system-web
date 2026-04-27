<template>
  <div>
    <el-card style="margin-bottom:24px">
      <template #header>
        <span style="font-weight:600">今日订单看板</span>
      </template>
      <el-row :gutter="24">
        <el-col :span="8" v-for="(list, status) in ordersByStatus" :key="status">
          <el-card shadow="hover" class="status-card">
            <template #header>
              <div class="status-header">
                <span>{{ statusMap[status] }}</span>
                <el-badge :value="list.length" class="badge" />
              </div>
            </template>
            <div v-for="order in list" :key="order.id" class="order-item">
              <div class="order-no"><strong>{{ order.orderNo }}</strong></div>
              <div class="order-info">桌号: {{ order.tableNo }}</div>
              <div class="order-info">金额: <span class="amount">¥{{ order.totalAmount }}</span></div>
              <div class="order-actions">
                <el-button v-if="status==0" size="small" type="primary" @click="updateStatus(order.id, 1)">接单</el-button>
                <el-button v-if="status==1" size="small" type="success" @click="updateStatus(order.id, 2)">完成</el-button>
                <el-button v-if="status!=3" size="small" type="danger" @click="updateStatus(order.id, 3)">取消</el-button>
              </div>
            </div>
            <div v-if="list.length === 0" class="empty-status">暂无订单</div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { orderApi } from '@/api/index.js'
import { ElMessage } from 'element-plus'

const orders = ref([])
const statusMap = { 0: '待处理', 1: '制作中', 2: '已完成', 3: '已取消' }

const ordersByStatus = computed(() => {
  return {
    0: orders.value.filter(o => o.status === 0),
    1: orders.value.filter(o => o.status === 1),
    2: orders.value.filter(o => o.status === 2)
  }
})

const fetchOrders = async () => {
  const res = await orderApi.todayList()
  orders.value = res.data || []
}

const updateStatus = async (id, status) => {
  await orderApi.updateStatus(id, status)
  ElMessage.success('状态更新成功')
  fetchOrders()
}

onMounted(fetchOrders)
</script>

<style scoped>
.status-card {
  border-radius: 8px;
  min-height: 400px;
}
.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}
.order-item {
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  background: #fafafa;
  transition: all 0.3s;
}
.order-item:hover {
  background: #f5f7fa;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.order-no {
  margin-bottom: 8px;
  color: #303133;
}
.order-info {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}
.amount {
  color: #f56c6c;
  font-weight: 600;
}
.order-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}
.empty-status {
  text-align: center;
  padding: 60px 0;
  color: #909399;
  font-size: 14px;
}
</style>
