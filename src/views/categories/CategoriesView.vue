<template>
  <div>
    <el-button type="primary" icon="Plus" style="margin-bottom:16px" @click="openForm()">新增分类</el-button>

    <el-table :data="categories" border stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="分类名" />
      <el-table-column prop="sortOrder" label="排序" width="80" />
      <el-table-column label="操作" width="130">
        <template #default="{ row }">
          <el-button size="small" @click="openForm(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="formVisible" :title="form.id ? '编辑分类' : '新增分类'" width="400px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="分类名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" />
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
import { ref, onMounted } from 'vue'
import { categoryApi } from '@/api/index.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const categories = ref([])
const formVisible = ref(false)
const form = ref({ name: '', sortOrder: 0 })

const fetch = async () => {
  const res = await categoryApi.list()
  categories.value = res.data
}

const openForm = (row = {}) => {
  form.value = { name: '', sortOrder: 0, ...row }
  formVisible.value = true
}

const save = async () => {
  const { id, ...data } = form.value
  if (id) await categoryApi.update(id, data)
  else await categoryApi.add(data)
  ElMessage.success('保存成功')
  formVisible.value = false
  fetch()
}

const del = async (id) => {
  await ElMessageBox.confirm('确认删除？', '提示', { type: 'warning' })
  await categoryApi.delete(id)
  ElMessage.success('删除成功')
  fetch()
}

onMounted(fetch)
</script>
