<template>
  <div class="filter-list" :class="{ 'custom-fx-filter': showBorder && filters.length }">
    <div
      :class="{ 'current-filter-btn': index == currnetIndex }"
      class="filter-item"
      v-for="(name, index) in filters"
      :key="index"
    >
      <el-button @click="btnClick(name, index)" link
        ><i class="bi-filter-left"></i> {{ name }}</el-button
      >
      <el-popconfirm @confirm="del(index, name)" title="確定要删除配置?">
        <template #reference>
          <i class="bi-three-dots-vertical filter-item-more"></i>
        </template>
      </el-popconfirm>
      <!-- <i class="bi-three-dots-vertical filter-item-more"></i> -->
    </div>
    <div style="display: flex" v-if="showBorder && filters.length">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="jsx">
import cache from './cache'
import { ref, reactive, defineEmits, getCurrentInstance, defineProps } from 'vue'
const props = defineProps({
  cacheKey: {
    type: String,
    default: ''
  },
  showBorder: {
    type: Boolean,
    default: false
  }
})



const emit = defineEmits(['delFilter', 'clickFilter', 'filterInit'])

const { proxy } = getCurrentInstance()

const filters = ref([])
filters.value = cache.getName(props.cacheKey)
// if (!filters.value.length) {
//   filters.value.push(...['默認查詢', '車間看板', '加急訂單', '逾期訂單'])
// }

emit('filterInit', filters.value)

const currnetIndex = ref(-1)
const btnClick = (name, index) => {
  currnetIndex.value = index
  emit('clickFilter', name)
}
const del = (index, name) => {
  filters.value.splice(index, 1)
  currnetIndex.value = -1
  cache.removeData(props.cacheKey, name)

  emit('delFilter', name, filters.value)

  proxy.$message.success(proxy.$ts('删除成功'))
}
</script>
<style lang="less" scoped>
@import './filter.less';
</style>
