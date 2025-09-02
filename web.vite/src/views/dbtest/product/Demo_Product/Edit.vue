<template>
  <vol-edit
    ref="edit"
    :keyField="key"
    :tableName="tableName"
    :tableCNName="tableCNName"
    :labelWidth="labelWidth"
    :formFields="editFormFields"
    :formOptions="editFormOptions"
    :detail-height="detailHeight"
    :detail="detail"
    @initButtons="initButtons"
    @detailButtons="detailButtons"
    @initDetailColumns="initDetailColumns"
    @initSubDetailColumns="initSubDetailColumns"
    :details="details"
  >
    <template #header>
      <!-- 自定義數據槽顯示 -->
    </template>
    <template #content>
      <!-- 自定義數據槽顯示 -->
    </template>
    <template #foooter>
      <!-- 自定義數據槽顯示 -->
    </template>
  </vol-edit>
</template>
<script lang="jsx">
export default { name: 'Demo_Product_edit' }
</script>
<script setup lang="jsx">
//新窗口編輯默認使用的純vue3語法,文檔參考：http://doc.volcore.xyz/edit/guid.html
import editOptions from './options.js'
import {
  ref,
  reactive,
  getCurrentInstance,
  defineEmits,
  defineExpose,
  defineProps,
  nextTick
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
const emit = defineEmits([])
const props = defineProps({})

//發起請求proxy.http.get/post
//消息提示proxy.$message.success()
const { proxy } = getCurrentInstance()

//這裡表單與明细表參數，具體信息看options.js裡面
const { key, tableName, tableCNName, editFormFields, editFormOptions, detail, details } = reactive(
  editOptions()
)

//獲取路由參數
const route = useRoute()
//是否新建操作
let isAdd = !!route.query.id

//vol-edit组件對象
const edit = ref(null)

//表單標籤文字顯示寬度
const labelWidth = 90

//明细表高度
const detailHeight = 150

//初始化表單按鈕
const initButtons = (buttons) => {
  //可以通過this.buttons判斷有没有某些按鈕權限，如果有再添加自定義按鈕
  // if (buttons.some((x) => {return x.value === 'Add'})) {
  //splice在第三個按鈕後面添加一個按鈕,也可以使用buttons.push({})添加按鈕
  buttons.splice(
    3,
    0,
    ...[
      {
        name: '測試按鈕', //按鈕名稱
        icon: 'el-icon-edit-outline', //按鈕圖標http://doc.volcore.xyz/icon/
        type: 'success', //type類型見:https://element-plus.org/zh-CN/component/button.html
        plain: true,
        onClick: () => {
          proxy.$message.success('點擊了按鈕')
        }
      },
      {
        name: '獲取表單', //按鈕名稱
        icon: 'el-icon-edit-outline', //按鈕圖標http://doc.volcore.xyz/icon/
        plain: true,
        color: '#626aef',
        onClick: () => {
          proxy.$message.success(JSON.stringify(editFormFields))
        }
      },
      {
        name: '獲取明细表數據', //按鈕名稱
        icon: 'el-icon-check',
        type: 'primary',
        plain: true,
        onClick: () => {
          const rowData = edit.value.getTable('Demo_ProductColor').rowData
          proxy.$message.success(`共[${rowData.length}]行數據`)
        }
      },
      {
        name: '獲取明细表選中行',
        icon: 'el-icon-edit-outline',
        type: 'success',
        plain: true,
        onClick: () => {
          const rowData = edit.value.getTable('Demo_ProductColor').getSelected()
          proxy.$message.success(`選中了[${rowData.length}]行數據`)
        }
      }
    ]
  )
}

//初始化主從表按鈕(注意不是一對多，只是主從表，一對多的看下面)
const detailButtons = (detailButtons) => {
  // 配置同上,detailButtons.splice()
}

//初始化一對多二级表格與按鈕
const initDetailColumns = (detailColumns) => {
  detailColumns[0].buttons.push({
    name: '按鈕', //按鈕名稱
    icon: 'el-icon-edit-outline', //按鈕圖標http://doc.volcore.xyz/icon/
    type: 'primary',
    plain: true,
    onClick: () => {
      proxy.$message.success('點擊了二级明细按鈕')
    }
  })

  //初始化表格按鈕
  detailColumns[0].columns.forEach((col) => {
    if (col.field == 'Remark') {
      col.edit = null
      col.render = (h, { row, column, index }) => {
        return (
          <div>
            <el-button
              link
              onClick={($e) => {
                proxy.$message.success('點擊了圖標1')
              }}
              class="el-icon-search"
              style="color: #2196F3;cursor: pointer;"
            ></el-button>
            <el-button
              link
              onClick={($e) => {
                proxy.$message.success('點擊了圖標2')
              }}
              class="el-icon-date"
              style="margin-left:1px;color: #2196F3;cursor: pointer;"
            ></el-button>
            <span style="margin-left:5px">{row.Remark}</span>
          </div>
        )
      }
    }
  })

  //明细表單獨添加一列按鈕,將示例：http://doc.volcore.xyz/web/%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8C%89%E9%92%AE.html

  detailColumns[0].columns.push({
    title: '操作',
    field: '操作',
    width: 80,
    align: 'center', // 'center',
    render: (h, { row, column, index }) => {
      return (
        <div>
          <el-button
            onClick={($e) => {
              proxy.$message.success('點擊了表格按鈕')
            }}
            type="primary"
            plain
            style="height:26px; padding: 10px !important;"
          >
            查看
          </el-button>
        </div>
      )
    }
  })
}

//初始化一對多三级表格與按鈕
const initSubDetailColumns = (subDetailColumns) => {
  //操作同上initDetailColumns
}

defineExpose({edit})
</script>
