<template>
  <!-- 2021.11.18移除voltable方法@cell-mouse-leave="rowEndEdit" -->
  <div
    class="vol-table"
    ref="refTable"
    :class="[
      textInline ? 'text-inline' : '',
      fxRight ? 'fx-right' : '',
      isChrome ? 'chrome' : '',
      smallCell ? 'small-table' : ''
    ]"
  >
    <template v-if="dragPosition">
      <div v-show="showDragMask" class="drag-mask"></div>
    </template>
    <div class="el-drag" ref="drag" v-if="dragPosition == 'top'"></div>
    <!-- loading -->
    <div class="mask" v-show="loading"></div>
    <div class="message" v-show="loading">
      <div>{{ $ts('加載中') }}.....</div>
    </div>
    <el-table
      :show-summary="summary"
      :summary-method="getSummaryData"
      :row-key="rowKey"
      :key="randomTableKey"
      :lazy="lazy"
      :defaultExpandAll="defaultExpandAll"
      :expand-row-keys="rowKey ? expandRowKeys : undefined"
      stripe
      :load="loadTreeChildren"
      @select="userSelect"
      @select-all="userSelect"
      @selection-change="selectionChange"
      @row-dblclick="rowDbClick"
      @row-click="rowClick"
      @header-click="headerClick"
      :highlight-current-row="highlightCurrentRow"
      ref="table"
      class="v-table"
      @sort-change="sortChange"
      tooltip-effect="dark"
      :height="realHeight - extraHeight || null"
      :max-height="realMaxHeight"
      :data="url ? rowData : tableData"
      :border="true"
      :row-class-name="initIndex"
      :cell-style="getCellStyle"
      :cell-class-name="getCellClass"
      style="width: 100%"
      :scrollbar-always-on="true"
      @expand-change="expandChange"
      :span-method="cellSpanMethod"
    >
      <el-table-column v-if="columnIndex" type="index" :fixed="fixed" width="55"></el-table-column>
      <el-table-column
        v-if="ck"
        type="selection"
        :fixed="fixed"
        :selectable="selectable"
        width="55"
      ></el-table-column>

      <!-- 2020.10.10移除table第一行强制排序 -->
      <el-table-column
        v-for="(column, cindex) in filterColumns"
        :prop="column.field"
        :label="column.title"
        :min-width="column.width"
        :formatter="formatter"
        :fixed="column.fixed"
        :key="column.field + cindex"
        :align="column.align"
        :sortable="column.sort ? 'custom' : false"
        :show-overflow-tooltip="column.showOverflowTooltip"
        :class-name="column.class"
        :filters="column.filterData ? getFilters(column) : undefined"
        :filter-method="column.filterData ? filterHandler : undefined"
      >
        <template #header>
          <span v-if="(column.require || column.required) && column.edit" class="column-required"
            >*</span
          >{{ $ts(column.title) }}
          <el-tooltip placement="top" v-if="column.tip">
            <template #content><div v-html="column.tip.text"></div></template>
            <i
              style="color: #7d7979"
              @click="column.tip.click"
              :class="column.tip.icon || 'el-icon-warning-outline'"
            ></i>
          </el-tooltip>
        </template>

        <template #default="scope">
          <!-- 2022.01.08增加多表頭，現在只支持常用功能渲染，不支持編輯功能(涉及到组件重寫) -->
          <el-table-column
            style="border: none"
            v-for="columnChildren in filterChildrenColumn(column.children)"
            :key="columnChildren.field"
            :min-width="columnChildren.width"
            :class-name="columnChildren.class"
            :prop="columnChildren.field"
            :align="columnChildren.align"
            :label="$ts(columnChildren.title)"
          >
            <template #default="scopeChildren">
              <a
                v-if="columnChildren.link"
                href="javascript:void(0)"
                style="text-decoration: none"
                @click="link(scopeChildren.row, columnChildren, $event)"
                v-text="scopeChildren.row[columnChildren.field]"
              ></a>
              <div
                v-else-if="columnChildren.formatter"
                @click="
                  columnChildren.click &&
                    columnChildren.click(scopeChildren.row, columnChildren, scopeChildren.$index)
                "
                v-html="
                  columnChildren.formatter(scopeChildren.row, columnChildren, scopeChildren.$index)
                "
              ></div>
              <div v-else-if="columnChildren.bind">
                {{ formatter(scopeChildren.row, columnChildren, true) }}
              </div>
              <span v-else-if="columnChildren.type == 'date'">{{
                formatterDate(scopeChildren.row, columnChildren)
              }}</span>
              <template v-else>
                {{ scopeChildren.row[columnChildren.field] }}
              </template>
            </template>
          </el-table-column>
          <!-- 2020.06.18增加render渲染自定義内容 -->
          <table-render
            v-if="column.render && typeof column.render == 'function'"
            :row="scope.row"
            key="rd-01"
            :index="scope.$index"
            :column="column"
            :render="column.render"
          ></table-render>
          <!-- 啟用双擊編輯功能，带編輯功能的不會渲染下拉框文本背景顏色 -->
          <!-- @click="rowBeginEdit(scope.$index,cindex)" -->

          <template
            v-else-if="
              column.edit &&
              !column.readonly &&
              ['file', 'img', 'excel'].indexOf(column.edit.type) != -1
            "
          >
            <div style="display: flex; align-items: center" @click.stop>
              <i
                style="padding: 3px; margin-right: 10px; color: #8f9293; cursor: pointer"
                @click="showUpload(scope.row, column)"
                class="el-icon-upload"
              ></i>
              <template v-if="column.edit.type == 'img'">
                <img
                  v-for="(file, imgIndex) in getFilePath(scope.row[column.field], column)"
                  :key="imgIndex"
                  @error="handleImageError"
                  @click="viewImg(scope.row, column, file.path, $event, imgIndex)"
                  class="table-img"
                  :src="file.path + access_token"
                />
              </template>
              <a
                style="margin-right: 8px"
                v-else
                class="t-file"
                v-for="(file, fIndex) in getFilePath(scope.row[column.field], column)"
                :key="fIndex"
                @click="dowloadFile(file)"
                >{{ file.name }}</a
              >
            </div>
          </template>
          <!-- 2021.09.21增加編輯時對readonly屬性判斷 -->
          <div
            v-else-if="
              column.edit && !column.readonly && (column.edit.keep || edit.rowIndex == scope.$index)
            "
            class="edit-el"
          >
            <div @click.stop class="e-item">
              <div>
                <!-- 2020.07.24增加日期onChange事件 -->
                <el-date-picker
                  clearable
                  size="default"
                  style="width: 100%"
                  :ref="column.field + scope.$index"
                  v-if="['date', 'datetime', 'month'].indexOf(column.edit.type) != -1"
                  v-model="scope.row[column.field]"
                  @click.navigator
                  @change="
                    (val) => {
                      dateChange(scope.row, column, val)
                    }
                  "
                  :type="column.edit.type"
                  :placeholder="$ts(column.placeholder || column.title)"
                  :disabledDate="(val) => getDateOptions(val, column)"
                  :value-format="getDateFormat(column)"
                  :disabled="initColumnDisabled(scope.row, column)"
                  @visible-change="dateVisibleChang"
                >
                </el-date-picker>
                <el-time-picker
                  clearable
                  size="default"
                  style="width: 100%"
                  v-else-if="column.edit.type == 'time'"
                  v-model="scope.row[column.field]"
                  @change="
                    (val) => {
                      column.onChange && column.onChange(scope.row, column, val)
                    }
                  "
                  :placeholder="$ts(column.placeholder || column.title)"
                  :value-format="column.format || 'HH:mm:ss'"
                  :disabled="initColumnDisabled(scope.row, column)"
                >
                </el-time-picker>
                <template v-else-if="column.edit.type == 'color'">
                  {{ scope.row[column.field] }}
                  <el-color-picker
                    @show="isDateChange = true"
                    @hide="isDateChange = false"
                    show-alpha
                    :teleported="true"
                    :predefine="[
                      '#ff4500',
                      '#ff8c00',
                      '#ffd700',
                      '#90ee90',
                      '#00ced1',
                      '#1e90ff',
                      '#c71585'
                    ]"
                    v-model="scope.row[column.field]"
                  />
                </template>
                <el-switch
                  v-else-if="column.edit.type == 'switch'"
                  v-model="scope.row[column.field]"
                  active-color="#0f84ff"
                  inactive-color="rgb(194 194 194)"
                  :active-text="$ts(column.activeText)"
                  :inactive-text="$ts(column.inactiveText)"
                  @change="
                    (val) => {
                      switchChange(val, scope.row, column)
                    }
                  "
                  :active-value="
                    typeof scope.row[column.field] == 'boolean'
                      ? true
                      : typeof scope.row[column.field] == 'string'
                      ? '1'
                      : 1
                  "
                  :inactive-value="
                    typeof scope.row[column.field] == 'boolean'
                      ? false
                      : typeof scope.row[column.field] == 'string'
                      ? '0'
                      : 0
                  "
                  :disabled="initColumnDisabled(scope.row, column)"
                >
                </el-switch>

                <vol-select-table
                  v-else-if="column.edit.type == 'selectTable'"
                  v-model="scope.row[column.field]"
                  :field="column.field"
                  :ref="column.field + scope.$index"
                  :onSelect="
                    (rows) => {
                      column.onSelect && column.onSelect(scope.row, rows)
                    }
                  "
                  :textInline="column.textInline"
                  :paginationHide="column.paginationHide"
                  :pagination="column.pagination"
                  :loadBefore="
                    (params, callBack) => {
                      column.loadBefore && column.loadBefore(scope.row, params, callBack)
                    }
                  "
                  :loadAfter="
                    (rows, callBack, result) => {
                      column.loadAfter && column.loadAfter(scope.row, rows, callBack, result)
                    }
                  "
                  @onKeyPress="
                    (value, $event) => {
                      column.onKeyPress && column.onKeyPress(value, $event, scope.row)
                    }
                  "
                  :url="column.url"
                  :columns="column.columns"
                  :defaultLoadPage="column.load"
                  :single="column.single"
                  :height="column.height"
                  :input-readonly="column.inputReadonly"
                  :width="column.selectWidth"
                >
                </vol-select-table>

                <template v-else-if="['select', 'selectList'].indexOf(column.edit.type) != -1">
                  <el-select-v2
                    :ref="column.field + scope.$index"
                    style="width: 100%"
                    size="default"
                    v-if="column.bind.data.length >= select2Count"
                    v-model="scope.row[column.field]"
                    :filterable="column.filter === undefined ? true : column.filter"
                    :multiple="column.edit.type == 'select' ? false : true"
                    :placeholder="$ts(column.placeholder || column.title)"
                    :allow-create="column.autocomplete"
                    :options="column.bind.data"
                    @change="column.onChange && column.onChange(scope.row, column)"
                    clearable
                    :disabled="initColumnDisabled(scope.row, column)"
                  >
                    <template #default="{ item }">
                      {{ item.label }}
                    </template>
                  </el-select-v2>

                  <el-select
                    :ref="column.field + scope.$index"
                    size="default"
                    style="width: 100%"
                    v-else
                    v-model="scope.row[column.field]"
                    :filterable="column.filter === undefined ? true : column.filter"
                    :multiple="column.edit.type == 'select' ? false : true"
                    :placeholder="$ts(column.placeholder || column.title)"
                    :allow-create="column.autocomplete"
                    @change="column.onChange && column.onChange(scope.row, column)"
                    clearable
                    :disabled="initColumnDisabled(scope.row, column)"
                  >
                    <el-option
                      v-for="item in column.bind.data"
                      :key="item.key"
                      v-show="!item.hidden"
                      :disabled="item.disabled"
                      :label="item.value"
                      :value="item.key"
                      >{{ item.value }}
                    </el-option>
                  </el-select>
                </template>
                <el-tree-select
                  :ref="column.field + scope.$index"
                  style="width: 100%"
                  v-else-if="column.edit.type == 'treeSelect' || column.edit.type == 'cascader'"
                  v-model="scope.row[column.field]"
                  :data="column.bind.data"
                  :multiple="column.multiple === undefined ? true : column.multiple"
                  :render-after-expand="false"
                  :show-checkbox="true"
                  :check-strictly="true"
                  check-on-click-node
                  node-key="key"
                  @change="column.onChange && column.onChange(scope.row, column)"
                  :props="{ label: 'label' }"
                >
                  <template #default="{ data, node }"> {{ $ts(data.label) }}</template>
                </el-tree-select>
                <!-- <div     v-else-if="column.edit.type == 'cascader'">4444444</div> -->
                <!-- <el-cascader
                  clearable
                  style="width: 100%;"
                  v-model="scope.row[column.field]"
                  v-else-if="column.edit.type == 'cascader'"
                  :data="column.bind.data"
                  :props="{
                    checkStrictly: column.changeOnSelect || column.checkStrictly,
                  }"
                  @change="column.onChange && column.onChange(scope.row, column)"
                >
                </el-cascader> -->
                <el-input
                  :ref="column.field + scope.$index"
                  v-else-if="column.edit.type == 'textarea'"
                  type="textarea"
                  :placeholder="$ts(column.placeholder || column.title)"
                  v-model="scope.row[column.field]"
                  :disabled="initColumnDisabled(scope.row, column)"
                  :autosize="{
                    minRows: column.minRows || 2,
                    maxRows: column.maxRows || 10
                  }"
                >
                </el-input>
                <el-input-number
                  :ref="column.field + scope.$index"
                  style="width: 100%"
                  v-else-if="column.edit.type == 'number' || column.edit.type == 'decimal'"
                  v-model="scope.row[column.field]"
                  :precision="column.edit.type == 'number' ? 0 : column.precision"
                  :min="column.min"
                  :disabled="column.readonly || column.disabled"
                  :max="column.max"
                  controls-position="right"
                  @focus="onFocus(scope.row, column, $event)"
                  @blur="onBlur(scope.row, column, $event)"
                  @change="inputKeyPress(scope.row, column, $event)"
                />
                <input
                  :ref="column.field + scope.$index"
                  class="table-input"
                  v-else-if="!column.summary && !column.onKeyPress"
                  v-model.lazy="scope.row[column.field]"
                  :placeholder="$ts(column.placeholder || column.title)"
                  :disabled="initColumnDisabled(scope.row, column)"
                  @input="inputKeyPress(scope.row, column, $event)"
                  @focus="onFocus(scope.row, column, $event)"
                  @blur="onBlur(scope.row, column, $event)"
                />
                <el-input
                  v-else
                  :ref="column.field + scope.$index"
                  @change="inputKeyPress(scope.row, column, $event)"
                  @input="inputKeyPress(scope.row, column, $event)"
                  @keyup.enter="inputKeyPress(scope.row, column, $event)"
                  size="default"
                  v-model="scope.row[column.field]"
                  :placeholder="$ts(column.placeholder || column.title)"
                  :disabled="initColumnDisabled(scope.row, column)"
                  @blur="onBlur(scope.row, column, $event)"
                ></el-input>
              </div>
              <div class="extra" v-if="column.extra && edit.rowIndex == scope.$index">
                <a
                  :style="column.extra.style"
                  style="text-decoration: none"
                  @click="extraClick(scope.row, column)"
                >
                  <i v-if="column.extra.icon" :class="[column.extra.icon]" />
                  {{ column.extra.text }}
                </a>
              </div>
            </div>
          </div>
          <!--没有編輯功能的直接渲染標籤-->
          <!-- v-text="scope.row[column.field]" -->
          <template v-else>
            <a
              v-if="column.link"
              href="javascript:void(0)"
              style="text-decoration: none"
              @click="link(scope.row, column, $event)"
              v-text="formatter(scope.row, column, true)"
            ></a>
            <img
              v-else-if="column.type == 'img'"
              v-for="(file, imgIndex) in getFilePath(scope.row[column.field], column)"
              :key="imgIndex"
              @error="handleImageError"
              @click="viewImg(scope.row, column, file.path, $event, imgIndex)"
              class="table-img"
              :style="{
                height: (column.imgHeight || 40) + 'px',
                width: (column.imgWidth || 40) + 'px'
              }"
              :src="file.path + access_token"
            />
            <a
              style="margin-right: 8px"
              v-else-if="column.type == 'file' || column.type == 'excel'"
              class="t-file"
              v-for="(file, fIndex) in getFilePath(scope.row[column.field], column)"
              :key="fIndex"
              @click="dowloadFile(file)"
              >{{ file.name }}</a
            >
            <template v-else-if="column.type == 'date'">{{
              formatterDate(scope.row, column)
            }}</template>
            <template v-else-if="column.type == 'month'">{{
              (scope.row[column.field] || '').substr(0, 7)
            }}</template>
            <div
              v-else-if="column.formatter"
              @click.stop="formatterClick(scope.row, column, $event)"
              v-html="column.formatter(scope.row, column)"
            ></div>
            <!-- 2021.11.18修複table數據源設置為normal後點擊行$event缺失的問題 -->
            <div
              v-else-if="column.bind && (column.normal || column.edit)"
              @click.stop="formatterClick(scope.row, column, $event)"
              :style="column.getStyle && column.getStyle(scope.row, column)"
            >
              {{ formatter(scope.row, column, true) }}
            </div>
            <div
              v-else-if="column.click && !column.bind"
              @click="formatterClick(scope.row, column)"
            >
              {{ scope.row[column.field] }}
            </div>
            <div
              @click="
                () => {
                  column.click && formatterClick(scope.row, column)
                }
              "
              v-else-if="column.bind"
            >
              <el-tag
                v-if="useTag && column.type != 'cascader'"
                class="cell-tag"
                :class="[isEmptyTag(scope.row, column)]"
                :type="getColor(scope.row, column)"
                :effect="column.effect"
                >{{ formatter(scope.row, column, true) }}</el-tag
              >
              <template v-else>{{ formatter(scope.row, column, true) }}</template>
            </div>

            <template v-else>{{ formatter(scope.row, column, true) }}</template>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <template v-if="!paginationHide">
      <div class="block pagination" key="pagination-01" style="display: flex">
        <div style="flex: 1"></div>
        <el-pagination
          key="pagination-02"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="paginations.page"
          :page-sizes="paginations.sizes"
          :page-size="paginations.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="paginations.total"
        ></el-pagination>
      </div>
    </template>
    <div class="el-drag" ref="drag" v-if="dragPosition == 'bottom'"></div>

    <VolBox v-model="uploadModel" title="上傳" :height="228" :width="500" :padding="15" lazy>
      <!-- 上傳圖片、excel或其他文件、文件數量、大小限制都可以，參照volupload组件api -->
      <div class="vol-table-upload">
        <VolUpload
          style="text-align: center"
          :autoUpload="currentColumn.edit.autoUpload"
          :multiple="currentColumn.edit.multiple"
          :url="uploadUrl"
          :max-file="currentColumn.edit.maxFile"
          :max-size="currentColumn.edit.maxSize"
          :img="currentColumn.edit.type == 'img'"
          :excel="currentColumn.edit.type == 'excel'"
          :fileTypes="currentColumn.edit.fileTypes ? currentColumn.edit.fileTypes : []"
          :fileInfo="fileInfo"
          :upload-before="uploadBefore"
          :upload-after="uploadAfter"
          :onChange="uploadOnChange"
        >
          <div>{{ currentColumn.message }}</div>
        </VolUpload>
      </div>
      <template #footer>
        <div style="text-align: center">
          <el-button type="default" size="small" @click="uploadModel = false">關閉</el-button>
          <el-button type="primary" size="small" @click="saveUpload">保存</el-button>
        </div>
      </template>
    </VolBox>
    <vol-image-viewer ref="viewer"></vol-image-viewer>
  </div>
</template>
<script lang="jsx" setup>
import {
  ref,
  reactive,
  getCurrentInstance,
  toRaw,
  toRefs,
  defineAsyncComponent,
  defineExpose,
  defineEmits,
  defineProps,
  computed
} from 'vue'
import formProps from './VolForm/VolFormProps.js'
import VolTableRender from './VolTable/VolTableRender'
const VolUpload = defineAsyncComponent(() => import('@/components/basic/VolUpload.vue'))
const VolBox = defineAsyncComponent(() => import('@/components/basic/VolBox.vue'))

const props = defineProps(formProps())
const { proxy } = getCurrentInstance()

const table = ref(null)

const fixed = ref(false) //是固定行號與checkbox
const clickEdit = ref(true) //2021.07.17設置為點擊行结束編輯
const randomTableKey = ref(1)
const visiblyColumns = ref([])
const key = ref('')
const realHeight = ref(0)
const realMaxHeight = ref(0)
const enableEdit = ref(false) // 是否啟表格用編輯功能

const defaultImg = new URL('@/assets/imgs/error-img.png', import.meta.url).href

const loading = ref(false)
const footer = ref({})
const total = ref(0)
const formatConfig = ref({})
// 2020.09.06調整table列數據源的背景顏色
const colors = [null, 'success', 'success', 'danger', 'info']
const rule = {
  phone: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
  decimal: /(^[\-0-9][0-9]*(.[0-9]+)?)$/,
  number: /(^[\-0-9][0-9]*([0-9]+)?)$/
}
const columnNames = ref([])
const rowData = ref([])
const paginations = ref({
  sort: '',
  order: 'desc',
  Foots: '',
  total: 0,
  // 2020.08.29增加自定義分頁條大小
  sizes: [30, 60, 100, 120],
  size: 30, // 默認分頁大小
  Wheres: [],
  page: 1,
  rows: 30
})

const errorFiled = ref('')
const edit = ref({ columnIndex: -1, rowIndex: -1 }) // 當前双擊編輯的行與列坐標
const editStatus = ref({})
const summary = ref(false) // 是否顯示合計
// 目前只支持從後台返回的summaryData數據
const summaryData = ref([])
const summaryIndex = ref({})
const remoteColumns = ref([]) // 需要每次刷新或分頁後從後台加載字典數據源的列配置
const cellStyleColumns = ref({}) // 有背景顏色的配置
const fxRight = ref(false) //是否有右邊固定表頭
const selectRows = ref([]) //當前選中的行
//-table带數據源的單元格是否啟用tag標籤(下拉框等單元格以tag標籤顯示)
//2023.04.02更新voltable與main.js
const useTag = ref(true)
const currentRow = ref({})
const currentColumn = ref([])
const fileInfo = ref([])
const uploadUrl = ref('')
const uploadModel = ref(false)
const smallCell = ref(true)
const showDragMask = ref(false)
const access_token = ref('')

try {
  useTag.value = proxy.$global.table && proxy.$global.table.useTag
  smallCell.value = proxy.$global.table && proxy.$global.table.smallCell
} catch (error) {
  console.log(error.message)
}
const tk = (proxy.$store.getters.getUserInfo() || { accessToken: '' }).accessToken
if (tk) {
  access_token = '?access_token=' + tk
}

const getHeight = () => {
  // 没有定義高度與最大高度，使用table默認值
  if (!props.height && !props.maxHeight) {
    return null
  }
  // 定義了最大高度則不使用高度
  if (props.maxHeight) {
    return null
  }
  // 使用當前定義的高度
  return props.height
}
const getMaxHeight = () => {
  // 没有定義高度與最大高度，使用table默認值
  if (!props.height && !props.maxHeight) {
    return null
  }
  // 定義了最大高度使用最大高度
  if (props.maxHeight) {
    return props.maxHeight
  }
  // 不使用最大高度
  return null
}

realHeight.value = getHeight()
realMaxHeight.value = getMaxHeight()

fxRight.value = proxy.columns.some((x) => {
  return x.fixed == 'right'
})
//2021.09.21移除强制固定行號與checkbox列
if (
  props.columns.some((x) => {
    return x.fixed && x.fixed != 'right'
  })
) {
  fixed.value = true
}

defineExpose({
  table
})
</script>
