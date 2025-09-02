<template>
  <el-drawer
    v-model="model"
    :title="currentNodeName"
    size="490px"
    direction="rtl"
    :before-close="handleClose"
  >
    <div class="audit-sign-content">
      <div class="audit-sign-item-header">
        <i class="el-icon-edit-outline" style="margin-right: 3px"></i> {{ $ts('加簽') }}
      </div>
      <div class="audit-sign-item audit-sign-item-fx" style="padding: 0 18px">
        <div class="audit-sign-item-title">{{ $ts('加簽方式') }}：</div>
        <div>
          <el-radio-group
            style="padding-left: 15px"
            @change="signTypeChange"
            v-model="sign.signType"
          >
            <el-radio label="current" size="large">{{ $ts('當前加簽') }}</el-radio>
            <el-radio label="before" size="large">{{ $ts('前置加簽') }}</el-radio>
            <el-radio label="after" size="large">{{ $ts('後置加簽') }}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="audit-sign-item audit-sign-item-fx" style="padding: 0 18px">
        <div class="audit-sign-item-title">{{ $ts('審批方式') }}：</div>
        <div>
          <el-radio-group style="padding-left: 15px" v-model="sign.auditMethod">
            <el-radio :label="0" size="large">{{ $ts('或簽') }}</el-radio>
            <el-radio :label="1" size="large">{{ $ts('並簽(同時審批)') }}</el-radio>
            <el-radio :label="2" size="large">{{ $ts('順序簽') }}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="audit-sign-item audit-sign-item-fx" style="padding: 0 18px">
        <div class="audit-sign-item-title">{{ $ts('審批類型') }}：</div>
        <div>
          <el-radio-group
            :disabled="sign.signType == 'current'"
            style="padding-left: 15px"
            v-model="sign.auditType"
            @change="auditTypeChange"
          >
            <el-radio :label="1" size="large">{{ $ts('用户審批') }}</el-radio>
            <el-radio :label="2" size="large">{{ $ts('角色審批') }}</el-radio>
            <el-radio :label="3" size="large">{{ $ts('部門審批') }}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="audit-sign-item-table" v-show="sign.signType != 'current'">
        <div class="audit-sign-item-header">
          <i class="bi-share" style="margin-right: 3px"></i>{{ $ts('加簽節點名稱') }}
          <div class="audit-sign-item-header-add" style="margin-left: 10px">
            <!-- <i class="el-icon-plus"></i>{{$ts('添加')}} -->
            <el-input v-model="sign.stepName"></el-input>
          </div>
        </div>
      </div>
      <div class="audit-sign-item-table">
        <div class="audit-sign-item-header">
          <i class="el-icon-user" style="margin-right: 3px"></i>{{ $ts('審批人信息') }}
          <div class="audit-sign-item-header-add">
            <!-- <i class="el-icon-plus"></i>{{$ts('添加')}} -->
            <el-button link @click="addRow"
              ><i class="el-icon-plus"></i>{{ $ts('添加') }}</el-button
            >
          </div>
        </div>
        <table class="step-table anti-table">
          <thead>
            <tr>
              <td class="step-table-index">{{ $ts('序號') }}</td>
              <!-- <td class="step-table-user">{{ $ts('審批類型') }}</td> -->
              <td class="step-table-status">{{ $ts('審批人') }}</td>
              <td class="step-table-btn">{{ $ts('操作') }}</td>
            </tr>
          </thead>
          <tbody>
            <tr class="table-" v-for="(row, index) in sign.rows" :key="index">
              <td class="step-table-index">{{ index + 1 }}</td>
              <!-- <td>
              <div v-if="signType == 'current'">{{ getTypeName(row) }}</div>
              <div v-else>{{ row.stepType }}</div>
            </td> -->
              <!-- <td>{{ row.stepValue }}</td> -->
              <td style="padding: 3px">
                <el-select
                  size="default"
                  style="width: 100%"
                  v-model="row.stepValue"
                  filterable
                  :multiple="false"
                  :placeholder="$ts('請選擇')"
                >
                  <el-option
                    v-for="item in selectList"
                    :key="item.key + ''"
                    :label="item.value"
                    :value="item.key + ''"
                    >{{ item.value }}
                  </el-option>
                </el-select>
                <!-- {{ row.auditor }} -->
              </td>
              <td class="step-table-btn">
                <el-button link @click="delRow(index)"
                  ><i class="el-icon-delete"></i>{{ $ts('删除') }}</el-button
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="audit-sign-btns">
        <el-button type="primary" icon="Plus" @click="saveClick">{{ $ts('加簽') }}</el-button>
        <el-button type="default" icon="Close" @click="model = false">{{ $ts('關閉') }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script lang="jsx" setup>
import {
  defineComponent,
  ref,
  reactive,
  getCurrentInstance,
  computed,
  defineEmits,
  defineExpose,
  defineProps
} from 'vue'

const emit = defineEmits(['signAfter'])

const { proxy } = getCurrentInstance()

const sign = reactive({
  signType: null, //加簽方式
  auditMethod: null, //審批方式
  auditType: null, //審批類型
  stepName: null, //前後加簽的節點名字
  rows: [] //審批人數據
})

const currentNodeName = ref('')

const model = ref(false)

const handleClose = () => {
  model.value = false
}
//當前節點審批類型(按用户、角色、部門審批方式)
let currentStep = null
//當前流程節點
//表缺少auditMethod審批字段
let workFlowSteps = []
//審批的表數據
let tableRow = {}
const open = (steps, row) => {
  sign.rows.length = 0
  sign.signType = null
  sign.auditType = null
  sign.auditMethod = null
  sign.stepName = null
  workFlowSteps = steps
  tableRow = row
  currentStep = steps.find((c) => {
    return c.isCurrent
  })
  currentNodeName.value = currentStep.stepName
  //   currentNodeName.value = (
  //     steps.find((c) => {
  //       return c.isCurrent
  //     }) || { stepName: proxy.$ts('審批加簽') }
  //   ).stepName
  model.value = true
  if (!dic.length) {
    getAuditUser()
  }
}
let dic = []
//獲取審批類型的數據源
const getAuditUser = () => {
  proxy.http.get('api/Sys_WorkFlow/getNodeDic', {}, false).then((res) => {
    dic = res
  })
}

//table審批人下拉框數據源
const selectList = computed(() => {
  //按用户審批
  if (sign.auditType == 1) {
    return dic.users.slice(0, 3000)
  }
  //按角色審批
  if (sign.auditType == 2) {
    return dic.roles
  }
  //按部門審批
  if (sign.auditType == 3) {
    return dic.dept
  }
  return []
})
const addRow = () => {
  if (!sign.auditType) {
    return proxy.$message.error(proxy.$ts('請先選擇審批類型'))
  }
  sign.rows.push({ stepValue: null })
}
const delRow = (index) => {
  sign.rows.splice(index, 1)
}
//加簽方式選擇事件，選擇當前加簽時[審批類型]不能選擇，只能使用當前節點的類型
const signTypeChange = () => {
  sign.rows.length = 0
  if (sign.signType == 'current') {
    let auditList =
      workFlowSteps.find((c) => {
        return c.isCurrent
      }).auditList || []
    //單人審批時後台没有返回數據
    if (!auditList.length) {
      auditList = [
        {
          stepValue: currentStep.stepValue,
          auditor: currentStep.auditor,
          id: currentStep.sys_WorkFlowTableStep_Id
        }
      ]
    }
    sign.rows.push(
      ...auditList.map((c) => {
        return Object.assign({}, c)
      })
    )
    //設置審批類型為當前節點的審批類型
    sign.auditType = currentStep.stepType
    return
  }
  sign.auditType = null
}
//審批類型選中事件
const auditTypeChange = (value) => {
  sign.rows.length = 0
}

// const auditTypeArr=[{key:}]
// 用户審批 = 1,
// 角色審批 = 2,
//         部門審批 = 3,
//         提交人上级部門審批 = 4,
//         提交人上级角色審批 = 5

// const getTypeName = (row) => {
//   if (signType.value == 'current') {
//     if (!row.stepType) {
//       row.stepType = currentStep.stepType
//     }
//   }
//   if (row.stepType == 1 || row.stepType == 4) {
//     return proxy.$ts('用户審批')
//   }
//   if (row.stepType == 2 || row.stepType == 5) {
//     return proxy.$ts('角色審批')
//   }
//   if (row.stepType == 3) {
//     return proxy.$ts('部門審批')
//   }
// }

const saveClick = () => {
  if (!sign.signType) {
    return proxy.$message.error(proxy.$ts('請選擇加簽方式'))
  }
  if (!sign.auditMethod && sign.auditMethod !== 0) {
    return proxy.$message.error(proxy.$ts('請選擇審批方式'))
  }
  if (!sign.auditType) {
    return proxy.$message.error(proxy.$ts('請選擇審批類型'))
  }
  if (!sign.rows.length) {
    return proxy.$message.error(proxy.$ts('請添加審批人信息'))
  }

  const params = Object.assign({}, sign, {
    workFlowTable_Id: workFlowSteps[0].workFlowTable_Id
  })

  //前後加簽生成setpid
  const stepId = sign.signType != 'current' ? Math.random().toString(36).substr(3, 10) : null
  params.rows = params.rows.map((row, index) => {
    return {
      sys_WorkFlowTableStep_Id: row.id,
      workFlowTable_Id: currentStep.workFlowTable_Id,
      stepId: currentStep.stepId,
      stepName: currentStep.stepName,
      orderId: currentStep.orderId,
      stepType: row.stepType,
      stepValue: row.stepValue,
      weight: index,
      //前後加簽，生成一個nodeid
      stepId: stepId
    }
  })

  //當前審批Sys_WorkFlowTableStep的表主鍵id
  params.CurrentWorkFlowTableStep_Id = currentStep.sys_WorkFlowTableStep_Id

  params.CurrentStepId = currentStep.stepId
  params.workFlowTable_Id = currentStep.workFlowTable_Id
  proxy.http.post('api/Sys_WorkFlow/sign', params, true).then((c) => {
    model.value = false
    emit('signAfter')
  })
}

defineExpose({
  open
})
</script>
<style scoped lang="less">
.audit-sign-item-header {
  font-size: 14px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  padding-bottom: 6px;
  margin-bottom: 10px;
}

.audit-sign-content {
  //   width: 460px;
}

.audit-sign-item-fx {
  display: flex;
  align-items: center;

  .audit-sign-item-title {
    font-size: 14px;
    color: #000;
    // font-weight: bolder;
  }
}

.audit-sign-btns {
  text-align: center;
  margin-top: 30px;
}

.audit-sign-item-table {
  margin-top: 18px;
}

.step-table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  margin-top: 12px;

  td {
    padding: 8px 8px;
    // color: #757171;
    font-size: 13px;
    border-style: solid;
    border-width: 1px;
    border-color: #ebeef5;
  }

  tr:first-child {
    background: #f5f7fa;

    td {
      color: #000;
      font-weight: bold;
      font-size: 13px;
    }
  }

  .step-table-index {
    width: 80px;
    text-align: center;
  }

  tr:last-child {
    border-bottom: none;
  }

  .step-table-btn {
    text-align: center;
    width: 90px;
  }
}

.audit-sign-item-header {
  display: flex;
  align-items: center;

  .audit-sign-item-header-add {
    font-weight: 500;
    margin-left: auto;
  }
}
</style>
