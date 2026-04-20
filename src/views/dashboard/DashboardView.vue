<template>
  <div>
    <el-radio-group v-model="period" @change="fetchData" style="margin-bottom:20px">
      <el-radio-button value="today">今日</el-radio-button>
      <el-radio-button value="week">本周</el-radio-button>
      <el-radio-button value="month">本月</el-radio-button>
      <el-radio-button value="year">本年</el-radio-button>
    </el-radio-group>

    <el-row :gutter="20" style="margin-bottom:20px">
      <el-col :span="8">
        <el-card shadow="hover">
          <el-statistic title="总订单数" :value="stats.totalOrders" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <el-statistic title="总销量（份）" :value="stats.totalSales" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <el-statistic title="总金额（元）" :value="stats.totalAmount" :precision="2" />
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <div ref="chartRef" style="height:350px"></div>
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
  stats.value = res.data

  const ordersRes = await orderApi.todayList()
  const orders = ordersRes.data || []

  const hourMap = {}
  orders.forEach(o => {
    const h = new Date(o.createTime).getHours()
    hourMap[h] = (hourMap[h] || 0) + 1
  })
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  const counts = Array.from({ length: 24 }, (_, i) => hourMap[i] || 0)

  if (chart) {
    chart.setOption({
      title: { text: '今日订单趋势（按小时）' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: hours },
      yAxis: { type: 'value', minInterval: 1 },
      series: [{ name: '订单数', type: 'bar', data: counts, itemStyle: { color: '#409eff' } }]
    })
  }
}

onMounted(async () => {
  const echarts = await import('echarts')
  chart = echarts.init(chartRef.value)
  fetchData()
})
</script>
