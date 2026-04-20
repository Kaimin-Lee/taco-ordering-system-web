<template>
  <div>
    <el-card style="margin-bottom:20px">
      <h3>今日订单看板</h3>
      <el-row :gutter="20">
        <el-col :span="8" v-for="(list, status) in ordersByStatus" :key="status">
          <el-card shadow="hover">
            <template #header>
              <span>{{ statusMap[status] }}</span>
              <el-badge :value="list.length" class="item" style="margin-left:10px" />
            </template>
            <div v-for="order in list" :key="order.id" class="order-item">
              <div><strong>{{ order.orderNo }}</strong></div>
              <div>桌号: {{ order.tableNo }}</div>
              <div>金额: ¥{{ order.totalAmount }}</div>
              <div style="margin-top:8px">
                <el-button v-if="status==0" size="small" type="primary" @click="updateStatus(order.id, 1)">接单</el-button>
                <el-button v-if="status==1" size="small" type="success" @click="updateStatus(order.id, 2)">完成</el-button>
                <el-button v-if="status!=3" size="small" type="danger" @click="updateStatus(order.id, 3)">取消</el-button>
              </div>
            </div>
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
.order-item {
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
</style>
