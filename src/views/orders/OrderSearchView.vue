<template>
  <div>
    <el-card style="margin-bottom:20px">
      <el-form inline :model="query" @submit.prevent="search">
        <el-form-item label="订单号">
          <el-input v-model="query.orderNo" placeholder="模糊搜索" clearable style="width:200px" />
        </el-form-item>
        <el-form-item label="桌号">
          <el-input v-model="query.tableNo" placeholder="模糊搜索" clearable style="width:150px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" icon="Search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="orders" border stripe v-loading="loading" style="width:100%">
        <el-table-column prop="orderNo" label="订单号" min-width="180" />
        <el-table-column prop="tableNo" label="桌号" width="100" align="center" />
        <el-table-column prop="totalAmount" label="金额" width="120" align="right">
          <template #default="{ row }">
            <span style="color:#f56c6c;font-weight:600">¥{{ row.totalAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="statusTagMap[row.status]">{{ statusMap[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="180" />
        <el-table-column label="操作" width="100" align="center">
          <template #default="{ row }">
            <el-button size="small" @click="viewDetail(row.id)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="margin-top:20px;justify-content:flex-end"
        :current-page="query.page"
        :page-size="query.size"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="p => { query.page = p; search() }" />
    </el-card>

    <el-dialog v-model="detailVisible" title="订单详情" width="600px">
      <div v-if="detail" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ detail.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="桌号">{{ detail.tableNo }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ detail.remark || '无' }}</el-descriptions-item>
          <el-descriptions-item label="总金额" :span="2">
            <span style="color:#f56c6c;font-weight:600;font-size:18px">¥{{ detail.totalAmount }}</span>
          </el-descriptions-item>
        </el-descriptions>
        <div style="margin-top:20px">
          <div style="font-weight:600;margin-bottom:12px">订单明细</div>
          <el-table :data="detail.items" border size="small">
            <el-table-column prop="productName" label="菜品" />
            <el-table-column prop="price" label="单价" width="100" align="right">
              <template #default="{ row }">¥{{ row.price }}</template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="80" align="center" />
            <el-table-column label="小计" width="100" align="right">
              <template #default="{ row }">¥{{ (row.price * row.quantity).toFixed(2) }}</template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { orderApi } from '@/api/index.js'

const loading = ref(false)
const orders = ref([])
const total = ref(0)
const detailVisible = ref(false)
const detail = ref(null)
const query = ref({ page: 1, size: 10, orderNo: '', tableNo: '' })
const statusMap = { 0: '待处理', 1: '制作中', 2: '已完成', 3: '已取消' }
const statusTagMap = { 0: 'warning', 1: 'primary', 2: 'success', 3: 'info' }

const search = async () => {
  loading.value = true
  try {
    const res = await orderApi.search(query.value)
    orders.value = res.data.records
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

const viewDetail = async (id) => {
  const res = await orderApi.detail(id)
  detail.value = res.data
  detailVisible.value = true
}

onMounted(search)
</script>

<style scoped>
.detail-content {
  padding: 8px 0;
}
</style>
