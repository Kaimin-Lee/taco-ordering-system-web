<template>
  <div>
    <el-card style="margin-bottom:16px">
      <el-form inline :model="query" @submit.prevent="search">
        <el-form-item label="订单号">
          <el-input v-model="query.orderNo" placeholder="模糊搜索" clearable />
        </el-form-item>
        <el-form-item label="桌号">
          <el-input v-model="query.tableNo" placeholder="模糊搜索" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table :data="orders" border stripe v-loading="loading">
      <el-table-column prop="orderNo" label="订单号" />
      <el-table-column prop="tableNo" label="桌号" width="80" />
      <el-table-column prop="totalAmount" label="金额" width="100">
        <template #default="{ row }">¥{{ row.totalAmount }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="statusTagMap[row.status]">{{ statusMap[row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="下单时间" width="180" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button size="small" @click="viewDetail(row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination style="margin-top:16px" :current-page="query.page" :page-size="query.size" :total="total"
      layout="total, prev, pager, next" @current-change="p => { query.page = p; search() }" />

    <el-dialog v-model="detailVisible" title="订单详情" width="500px">
      <div v-if="detail">
        <p>订单号：{{ detail.orderNo }}</p>
        <p>桌号：{{ detail.tableNo }}</p>
        <p>备注：{{ detail.remark }}</p>
        <p>总金额：¥{{ detail.totalAmount }}</p>
        <el-table :data="detail.items" border size="small">
          <el-table-column prop="productName" label="菜品" />
          <el-table-column prop="price" label="单价" width="80">
            <template #default="{ row }">¥{{ row.price }}</template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="60" />
        </el-table>
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
