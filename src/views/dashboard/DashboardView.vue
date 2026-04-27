<template>
  <div>
    <el-radio-group v-model="period" @change="fetchData" style="margin-bottom:24px">
      <el-radio-button value="today">今日</el-radio-button>
      <el-radio-button value="week">本周</el-radio-button>
      <el-radio-button value="month">本月</el-radio-button>
      <el-radio-button value="year">本年</el-radio-button>
    </el-radio-group>

    <el-row :gutter="24" style="margin-bottom:24px">
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="总订单数" :value="stats.totalOrders">
            <template #prefix>
              <el-icon style="color:#409eff"><Document /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="总销量（份）" :value="stats.totalSales">
            <template #prefix>
              <el-icon style="color:#67c23a"><ShoppingCart /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="总金额（元）" :value="stats.totalAmount" :precision="2">
            <template #prefix>
              <el-icon style="color:#f56c6c"><Money /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <template #header>
        <span style="font-weight:600">今日订单趋势</span>
      </template>
      <div ref="chartRef" style="height:380px"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { dashboardApi, orderApi } from '@/api/index.js'

const period = ref('today')
const stats = ref({ totalOrders: 0, totalSales: 0, totalAmount: 0 })
const chartRef = ref()
let chart = null

const fetchData = async () => {
  const res = await dashboardApi[period.value]()
  const d = res.data
  stats.value = {
    totalOrders: d.totalOrders || 0,
    totalSales: d.totalSales || 0,
    totalAmount: parseFloat(d.totalAmount) || 0
  }
  const ordersRes = await orderApi.todayList()
  const orders = ordersRes.data || []

  const hourMap = {}
  orders.forEach(o => {
    const h = new Date(o.createTime.replace('T', ' ')).getHours()
    hourMap[h] = (hourMap[h] || 0) + 1
  })
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  const counts = Array.from({ length: 24 }, (_, i) => hourMap[i] || 0)

  if (chart) {
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: hours, boundaryGap: false },
      yAxis: { type: 'value', minInterval: 1 },
      series: [{
        name: '订单数',
        type: 'line',
        smooth: true,
        data: counts,
        itemStyle: { color: '#409eff' },
        areaStyle: { color: 'rgba(64,158,255,0.2)' }
      }]
    })
  }
}

onMounted(async () => {
  const echarts = await import('echarts')
  chart = echarts.init(chartRef.value)
  fetchData()
})
</script>

<style scoped>
.stat-card {
  border-radius: 8px;
  transition: transform 0.3s;
}
.stat-card:hover {
  transform: translateY(-4px);
}
</style>
