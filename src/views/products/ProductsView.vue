<template>
  <div>
    <div style="margin-bottom:16px; display:flex; gap:10px; align-items:center">
      <el-select v-model="query.categoryId" placeholder="全部分类" clearable @change="search" style="width:150px">
        <el-option v-for="c in categories" :key="c.id" :value="c.id" :label="c.name" />
      </el-select>
      <el-button type="primary" icon="Plus" @click="openForm()">新增商品</el-button>
    </div>

    <el-table :data="products" border stripe v-loading="loading">
      <el-table-column label="图片" width="100">
        <template #default="{ row }">
          <el-image v-if="row.imageUrl" :src="row.imageUrl" style="width:60px;height:60px" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名" />
      <el-table-column label="分类" width="100">
        <template #default="{ row }">{{ categories.find(c => c.id === row.categoryId)?.name }}</template>
      </el-table-column>
      <el-table-column prop="price" label="价格" width="80">
        <template #default="{ row }">¥{{ row.price }}</template>
      </el-table-column>
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-switch :model-value="row.status === 1" @change="v => toggleStatus(row, v)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130">
        <template #default="{ row }">
          <el-button size="small" @click="openForm(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination style="margin-top:16px" :current-page="query.page" :page-size="query.size" :total="total"
      layout="total, prev, pager, next" @current-change="p => { query.page = p; search() }" />

    <el-dialog v-model="formVisible" :title="form.id ? '编辑商品' : '新增商品'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="分类">
          <el-select v-model="form.categoryId">
            <el-option v-for="c in categories" :key="c.id" :value="c.id" :label="c.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            :action="uploadAction"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            accept="image/*">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <el-image v-if="form.imageUrl" :src="form.imageUrl" style="width:100px;height:100px;margin-top:10px" fit="cover" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="form.price" :precision="2" :min="0" style="width:100%" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-text="上架" inactive-text="下架" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { productApi, categoryApi } from '@/api/index.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const products = ref([])
const categories = ref([])
const total = ref(0)
const formVisible = ref(false)
const form = ref({})
const query = ref({ page: 1, size: 10, categoryId: null })

const uploadAction = '/api/b/upload'
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${localStorage.getItem('adminToken')}`
}))

const handleUploadSuccess = (res) => {
  form.value.imageUrl = res.data
  ElMessage.success('图片上传成功')
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isImage) ElMessage.error('只能上传图片文件')
  if (!isLt10M) ElMessage.error('图片大小不能超过 10MB')
  return isImage && isLt10M
}

const search = async () => {
  loading.value = true
  try {
    const params = { ...query.value }
    if (!params.categoryId) delete params.categoryId
    const res = await productApi.list(params)
    products.value = res.data.records
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

const openForm = (row = {}) => {
  form.value = { categoryId: null, name: '', imageUrl: '', price: 0, description: '', status: 1, ...row }
  formVisible.value = true
}

const save = async () => {
  const { id, ...data } = form.value
  if (id) await productApi.update(id, data)
  else await productApi.add(data)
  ElMessage.success('保存成功')
  formVisible.value = false
  search()
}

const toggleStatus = async (row, val) => {
  await productApi.updateStatus(row.id, val ? 1 : 0)
  row.status = val ? 1 : 0
}

const del = async (id) => {
  await ElMessageBox.confirm('确认删除？', '提示', { type: 'warning' })
  await productApi.delete(id)
  ElMessage.success('删除成功')
  search()
}

onMounted(async () => {
  const res = await categoryApi.list()
  categories.value = res.data
  search()
})
</script>
