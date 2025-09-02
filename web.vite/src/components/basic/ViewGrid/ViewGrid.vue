<template>
  <div
    class="layout-container"
    :class="{ 'layout-container-padding': $global.gridPadding || padding }"
  >
    <a :href="exportHref" ref="export"></a>
    <!--開啟懶加載2020.12.06 -->
    <vol-box
      :on-model-close="closeCustomModel"
      v-model="viewModel"
      :width="500"
      :padding="0"
      :lazy="true"
      title="設置"
    >
      <template #content>
        <custom-column :view-columns="viewColumns"></custom-column>
      </template>
      <template #footer>
        <div style="text-align: center">
          <el-button type="default" size="small" @click="closeCustomModel"
            ><i class="el-icon-close"></i>{{ $ts("取消") }}</el-button
          >
          <el-button type="success" size="small" @click="initViewColumns(true)"
            ><i class="el-icon-refresh"></i>{{ $ts("重置") }}</el-button
          >
          <el-button type="primary" size="small" @click="saveColumnConfig"
            ><i class="el-icon-check"></i>{{ $ts("確定") }}</el-button
          >
        </div>
      </template>
    </vol-box>
    <ViewGridAudit
      @auditClick="saveAudit"
      @flowLoadAfter="flowLoadAfter"
      @signAfter="signAfter"
      :option="table"
      ref="audit"
    >
    </ViewGridAudit>

    <!--導入excel功能-->
    <!--2020.10.31添加導入前的方法-->
    <!--開啟懶加載2020.12.06 -->
    <!-- 2022.01.08增加明细表導入判斷 -->
    <vol-box
      v-if="upload.url"
      v-model="upload.excel"
      :width="600"
      :lazy="true"
      :title="(boxModel ? detailOptions.cnName : table.cnName) + '-導入'"
    >
      <UploadExcel
        ref="upload_excel"
        @importExcelAfter="importExcelAfter"
        :importExcelBefore="importExcelBefore"
        :url="upload.url"
        :template="upload.template"
        :desc="importDesc"
      ></UploadExcel>
    </vol-box>
    <!--頭部自定義组件-->
    <component
      :is="dynamicComponent.gridHeader"
      ref="gridHeader"
      @parentCall="parentCall"
    ></component>
    <!--主界面查詢與table表單布局-->
    <div class="view-container">
      <!-- 2020.09.11增加固定查詢表單 -->
      <!--查詢條件-->
      <div class="grid-search">
        <div ref="customSearchRef">
          <vol-custom-search
            @customFilterClick="customFilterClick"
            @customFilterChange="customFilterChange"
            v-if="showCustom"
            show-filter
            :cache-key="table.name"
            ref="customSearch"
          :options="columns"
        >
       </vol-custom-search>
        </div>
        <div
          ref="fiexdSearchBox"
          :class="[fiexdSearchForm ? 'fiexd-search-box' : 'search-box']"
          v-show="searchBoxShow"
        >
          <!-- 2020.09.13增加formFileds拼寫错误兼容處理 -->
          <vol-form
            v-if="searchFormOptions.length"
            ref="searchForm"
            :load-key="false"
            :label-width="labelWidth"
            :formRules="searchFormOptions"
            :formFields="searchFormFields"
            :label-position="labelPosition"
            :select2Count="select2Count"
          >
            <template #footer>
              <div v-if="!fiexdSearchForm" class="form-closex">
                <el-button size="small" type="primary" plain @click="search">
                  <i class="el-icon-search" />{{ $ts("查詢") }}
                </el-button>

                <el-button size="small" type="success" plain @click="resetSearch">
                  <i class="el-icon-refresh-right" />{{ $ts("重置") }}
                </el-button>
                <el-button size="small" plain @click="searchBoxShow = !searchBoxShow">
                  <i class="el-icon-switch-button" />{{ $ts("關閉") }}
                </el-button>
              </div>
            </template>
          </vol-form>
          <div v-if="fiexdSearchForm" class="fs-line"></div>
        </div>
        <div class="view-header">
          <div class="desc-text">
            <i class="el-icon-s-grid" />
            <span>{{ $ts(table.cnName) }}</span>
          </div>
          <!-- <view-grid-expand
                          :render="btn.render"
                          :item="btn"
                          v-if="btn.render"
                        ></view-grid-expand> -->
          <view-grid-expand
            :render="gridRender.h"
            :item="gridRender.data"
          ></view-grid-expand>
          <div class="notice">
            <div v-if="text" v-html="text"></div>
            <a class="text" :title="extend.text">{{ extend.text }}</a>
          </div>
          <!--快速查詢字段-->
          <div class="search-line" v-if="!fiexdSearchForm && !searchBoxShow">
            <QuickSearch
              ref="quickSearch"
              v-if="singleSearch"
              :searchFormOptions="searchFormOptions"
              :searchFormFields="searchFormFields"
              :select2Count="select2Count"
              :label-width="labelWidth"
              :queryFields="queryFields"
              @tiggerPress="quickSearchKeyPress"
            ></QuickSearch>
          </div>
          <!--操作按鈕组-->
          <!-- 2020.11.29增加查詢界面hidden屬性 -->

          <div class="btn-group">
            <template
              :key="bIndex"
              v-for="(btn, bIndex) in buttons.slice(0, maxBtnLength)"
            >
              <template v-if="btn.data">
                <el-dropdown size="small" :split-button="false">
                  <el-button
                    :color="btn.color"
                    :dark="false"
                    :type="btn.type"
                    :plain="btn.plain"
                  >
                    {{ $ts(btn.name) }}
                    <i class="el-icon-arrow-down el-icon--right"></i
                  ></el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item v-for="(item, index) in btn.data" :key="index">
                        <div @click="onClick(item.onClick)">
                          <i :class="item.icon"></i>
                          {{ $ts(item.name) }}
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>

              <view-grid-expand
                :render="btn.render"
                :item="btn"
                v-else-if="btn.render"
              ></view-grid-expand>
              <el-button
                v-else
                :type="btn.type"
                size="small"
                :color="btn.color"
                :dark="false"
                :class="btn.class"
                :plain="btn.plain"
                v-show="!btn.hidden"
                :disabled="btn.readonly || btn.disabled"
                @click="onClick(btn.onClick)"
              >
                <i :class="btn.icon"></i> {{ $ts(btn.name) }}
              </el-button>
            </template>

            <el-dropdown
              size="small"
              @click="changeDropdown"
              v-if="buttons.length > maxBtnLength"
            >
              <el-button type="primary" plain size="small" class="more-btn">
                {{ $ts("更多") }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <template
                    v-for="(item, dIndex) in buttons.slice(maxBtnLength, buttons.length)"
                    :key="dIndex"
                  >
                    <el-dropdown-item
                      @click="changeDropdown(item.name)"
                      :name="item.name"
                    >
                      <div v-show="!item.hidden">
                        <i :class="item.icon"></i>
                        {{ $ts(item.name) }}
                      </div>
                    </el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <!-- <el-button
              class="setting-btn"
              type="default"
              style="padding: 0px 10px;font-wei"
              size="small"
              :plain="true"
              v-if="showCustom"
              @click="showCustomModel"
            >
              <i class="bi-filter-left"></i>
            </el-button> -->
            <el-button
              class="setting-btn"
              type="default"
              style="padding-left: 9px !important; padding-right: 10px !important"
              size="small"
              :plain="true"
              v-if="showCustom"
              @click="$refs.customSearch.show()"
            >
              <img style="height: 15px" src="./filter.svg" alt="filter" />
            </el-button>

            <!-- <el-button
              class="setting-btn"
              type="default"
              style="padding: 0px 10px;font-wei"
              size="small"
              :plain="true"
              v-if="showCustom"
              @click="$refs.customSearch.show()"
            >
              <i class="bi-filter-left"></i>
            </el-button> -->
          </div>
        </div>

        <!-- 分割位置 -->
        <vol-box
          v-if="boxInit"
          v-model="boxModel"
          :title="boxOptions.title"
          :width="boxOptions.width"
          :height="boxOptions.height"
          :modal="boxOptions.modal"
          :draggable="boxOptions.draggable"
          :padding="0"
          :on-model-close="onGridModelClose"
          @fullscreen="fullscreen"
        >
          <!--明细頭部自定義组件-->
          <template #content>
            <div class="vol-edit-box">
              <div class="vol-edit-content">
                <component
                  :is="dynamicComponent.modelHeader"
                  ref="modelHeader"
                  @parentCall="parentCall"
                ></component>
                <!-- <div v-show="isBoxAudit" class="flow-step">
                <div v-for="(item, index) in workFlowSteps" :key="index">
                  {{ item.stepName }}
                </div>
              </div> -->
                <div class="item form-item" style="padding-top: 10px">
                  <vol-form
                    ref="form"
                    :editor="editor"
                    :load-key="false"
                    :label-width="boxOptions.labelWidth"
                    :formRules="editFormOptions"
                    :formFields="editFormFields"
                    :select2Count="select2Count"
                    :label-position="labelPosition"
                    @tabClick="editFormTabClick"
                  ></vol-form>
                </div>
                <!--明细body自定義组件-->
                <component
                  :is="dynamicComponent.modelBody"
                  ref="modelBody"
                  @parentCall="parentCall"
                ></component>
                <div
                  v-show="hasDetail"
                  v-if="detail.columns && detail.columns.length > 0"
                  class="grid-detail table-item item"
                >
                  <div class="toolbar">
                    <div class="title form-text">
                      <span>
                        <i class="el-icon-menu" />
                        {{ $ts(detail.cnName) }}
                      </span>
                    </div>
                    <!--明细表格按鈕-->
                    <div class="btns detail-btns" v-show="!isBoxAudit">
                      <template
                        v-for="(btn, bIndex) in detailOptions.buttons"
                        :key="bIndex"
                      >
                        <view-grid-expand
                          :render="btn.render"
                          :item="btn"
                          v-if="btn.render"
                        ></view-grid-expand>
                        <el-button
                          v-else
                          :plain="btn.plain"
                          v-show="!(typeof btn.hidden == 'boolean' && btn.hidden)"
                          @click="onClick(btn.onClick)"
                          size="small"
                          ><span :style="{ color: btn.color }"
                            ><i :class="btn.icon"></i>{{ $ts(btn.name) }}</span
                          ></el-button
                        >
                      </template>
                    </div>
                  </div>
                  <vol-table
                    ref="detail"
                    @loadBefore="loadInternalDetailTableBefore"
                    @loadAfter="loadDetailTableAfter"
                    @rowChange="detailRowOnChange"
                    @rowClick="detailRowOnClick"
                    :url="detailOptions.url"
                    :load-key="true"
                    :index="true"
                    :tableData="detailOptions.data"
                    :columns="detailOptions.columns"
                    :pagination="detailOptions.pagination"
                    :height="detailOptions.height"
                    :single="detailOptions.single"
                    :pagination-hide="detailOptions.paginationHide"
                    :defaultLoadPage="detailOptions.load"
                    :beginEdit="detailOptions.beginEdit"
                    :endEditBefore="detailOptions.endEditBefore"
                    :endEditAfter="detailOptions.endEditAfter"
                    :column-index="detailOptions.columnIndex"
                    :ck="detailOptions.ck"
                    :text-inline="detailOptions.textInline"
                    :select2Count="select2Count"
                    :selectable="detailSelectable"
                    :spanMethod="detailSpanMethod"
                    :sortable="detailOptions.sortable"
                    @onSortEnd="detailOnSortEnd"
                  ></vol-table>
                </div>

                <div
                  class="details"
                  :class="{ 'details-horizontal': multiple.horizontal }"
                >
                  <!-- 多表明细2023.07.02 -->
                  <detail-table
                    ref="details"
                    :class="{ 'detail-item-horizontal': multiple.horizontal }"
                    :style="{
                      width: multiple.horizontal ? multiple.leftWidth + 'px' : null,
                      flex: multiple.leftWidth ? '' : 1,
                    }"
                    @loadBefore="loadInternalDetailTableBefore"
                    @loadAfter="loadDetailTableAfter"
                    @rowChange="detailRowOnChange"
                    @rowClick="detailRowOnClick"
                    @tabsClick="tabsClick"
                    v-if="details.length"
                    :main-table="table.url"
                    :height="detailHeight"
                    :data="details"
                    @onSortEnd="detailOnSortEnd"
                    :selectable="detailSelectable"
                    :showTabs="showTabs"
                  >
                  </detail-table>

                  <!-- 三级明细2023.09.17 -->
                  <detail-table
                    :class="{ 'detail-item-horizontal': multiple.horizontal }"
                    :style="{
                      width: multiple.horizontal ? multiple.rightWidth + 'px' : null,
                      flex: multiple.rightWidth ? '' : 1,
                    }"
                    ref="subDetails"
                    v-if="subDetails.length"
                    @loadBefore="loadSubInternalDetailTableBefore"
                    @loadAfter="loadSubDetailTableAfter"
                    @rowClick="detailRowOnClick"
                    :main-table="table.url"
                    :height="multiple.horizontal ? detailHeight : 200"
                    @tabsClick="tabsClick"
                    :data="subDetails"
                    @rowChange="detailRowOnChange"
                    @onSortEnd="detailOnSortEnd"
                    :selectable="detailSelectable"
                  >
                  </detail-table>
                </div>

                <!--明细footer自定義组件-->
                <component
                  :is="dynamicComponent.modelFooter"
                  ref="modelFooter"
                  @parentCall="parentCall"
                ></component>
              </div>
              <div class="vol-edit-box-right">
                <component
                  :is="dynamicComponent.modelRight"
                  ref="modelRight"
                  @parentCall="parentCall"
                ></component>
              </div>
            </div>
          </template>
          <template #footer>
            <div style="text-align: center" v-show="isBoxAudit">
              <el-button
                size="small"
                type="primary"
                plain
                @click="onGridModelClose(false)"
              >
                <i class="el-icon-close">{{ $ts("關閉") }}</i>
              </el-button>
              <el-button
                size="small"
                type="primary"
                v-show="auditParam.showViewButton"
                @click="auditParam.model = true"
              >
                <i class="el-icon-view">{{ $ts("審批") }}</i>
              </el-button>
            </div>
            <div v-show="!isBoxAudit">
              <el-button
                v-for="(btn, bIndex) in boxButtons"
                :key="bIndex"
                :type="btn.type"
                size="small"
                :plain="btn.plain"
                v-show="!(typeof btn.hidden == 'boolean' && btn.hidden)"
                :disabled="btn.hasOwnProperty('disabled') && !!btn.disabled"
                @click="onClick(btn.onClick)"
              >
                <i :class="btn.icon"></i>{{ $ts(btn.name) }}
              </el-button>
              <el-button
                size="small"
                type="primary"
                plain
                @click="onGridModelClose(false)"
              >
                <i class="el-icon-close">{{ $ts("關閉") }}</i>
              </el-button>
            </div>
          </template>
        </vol-box>
      </div>
      <!--body自定義组件-->
      <div class="grid-body">
        <component
          :is="dynamicComponent.gridBody"
          ref="gridBody"
          @parentCall="parentCall"
        ></component>
      </div>

      <!--table表格-->
      <div class="grid-container">
        <!-- 2021.05.02增加樹形结構 rowKey -->
        <vol-table
          ref="table"
          :single="single"
          :rowKey="rowKey"
          :loadTreeChildren="loadTreeTableChildren"
          @loadBefore="loadTableBefore"
          @loadAfter="loadTableAfter"
          @rowChange="rowOnChange"
          @rowClick="rowOnClick"
          @rowDbClick="rowOnDbClick"
          @selectionChange="selectionOnChange"
          :tableData="[]"
          :linkView="linkData"
          :columns="columns"
          :pagination="pagination"
          :height="height"
          :max-height="tableMaxHeight"
          :pagination-hide="paginationHide"
          :url="url"
          :load-key="false"
          :defaultLoadPage="load"
          :double-edit="doubleEdit"
          :index="true"
          :beginEdit="tableBeginEdit"
          :endEditBefore="tableEndEditBefore"
          :column-index="columnIndex"
          :text-inline="textInline"
          :ck="ck"
          :select2Count="select2Count"
          :selectable="selectable"
          :lazy="lazy"
          :defaultExpandAll="defaultExpandAll"
          :rowParentField="rowParentField"
          :expandRowKeys="expandRowKeys"
          :dragPosition="dragPosition"
          :spanMethod="spanMethod"
          :reserveSelection="reserveSelection"
          :sortable="sortable"
          @onSortEnd="onSortEnd"
          :extraHeight="extraHeight"
        ></vol-table>
      </div>
    </div>

    <!--footer自定義组件-->
    <component
      :is="dynamicComponent.gridFooter"
      ref="gridFooter"
      @parentCall="parentCall"
    ></component>
  </div>

  <ViewGridPrint ref="print"></ViewGridPrint>
</template>

<script lang="jsx">
const _const = {
  EDIT: "update",
  ADD: "Add",
  VIEW: "view",
  PAGE: "getPageData",
  AUDIT: "audit",
  DEL: "del",
  EXPORT: "Export", //導出操作返回加密後的路徑
  DOWNLOAD: "DownLoadFile", //導出文件
  DOWNLOADTEMPLATE: "DownLoadTemplate", //下載導入模板
  IMPORT: "Import", //導入(導入表的Excel功能)
  UPLOAD: "Upload", //上傳文件
};
import ViewGridExpand from "./ViewGridExpand";
import Empty from "@/components/basic/Empty.vue";
import VolTable from "@/components/basic/VolTable.vue";
import VolForm from "@/components/basic/VolForm.vue";
import { defineAsyncComponent, defineComponent, ref, shallowRef, toRaw } from "vue";
import VolCustomSearch from "@/components/basic/VolCustomSearch/VolCustomSearch.vue";
import ViewGridDetails from "./ViewGridDetails.vue";
var vueParam = {
  components: {
    ViewGridExpand,
    "vol-form": VolForm,
    "vol-table": VolTable,
    VolBox: defineAsyncComponent(() => import("@/components/basic/VolBox.vue")),
    QuickSearch: defineAsyncComponent(() => import("@/components/basic/QuickSearch.vue")),
    Audit: defineAsyncComponent(() => import("@/components/basic/Audit.vue")),
    UploadExcel: defineAsyncComponent(() => import("@/components/basic/UploadExcel.vue")),
    "custom-column": defineAsyncComponent(() => import("./ViewGridCustomColumn.vue")),
    "vol-header": defineAsyncComponent(() => import("./../VolHeader.vue")),
    ViewGridAudit: defineAsyncComponent(() => import("./ViewGridAudit.vue")),
    ViewGridPrint: defineAsyncComponent(() => import("./ViewGridPrint.vue")),
    "detail-table": ViewGridDetails,
    "vol-custom-search": VolCustomSearch,
    //  defineAsyncComponent(() =>
    //   import('@/components/basic/VolCustomSearch/VolCustomSearch.vue'))
  },
  emits: ["parentCall"],
  props: {},
  setup(props) {
    //2021.07.17調整擴展组件组件
    const dynamicCom = {
      gridHeader: Empty,
      gridBody: Empty,
      gridFooter: Empty,
      modelHeader: Empty,
      modelBody: Empty,
      modelRight: Empty,
      modelFooter: Empty,
    };
    //合並擴展组件
    if (props.extend.components) {
      for (const key in props.extend.components) {
        if (props.extend.components[key]) {
          dynamicCom[key] = toRaw(props.extend.components[key]);
        }
      }
    }
    const dynamicComponent = shallowRef(dynamicCom);
    return { dynamicComponent };
  },
  data() {
    return {
      isBoxAudit: false,
      formFieldsType: [],
      workFlowSteps: [],
      //樹形结構的主鍵字段，如果設置值默認會開啟樹形table；注意rowKey字段的值必須是唯一（2021.05.02）
      rowKey: undefined,
      fiexdSearchForm: false, //2020.09.011是否固定查詢表單，true查詢表單將固定顯示在表單的最上面
      _inited: false,
      doubleEdit: false, //2021.03.19是否開啟查詢界面表格双擊編輯
      single: false, //表是否單選
      const: _const, //增删改查導入導出等對應的action
      boxInit: false, //新建或編輯的彈出框初化狀態，默認不做初始化，點擊新建或編輯才初始化彈出框
      searchBoxShow: false, //高级查詢(界面查詢後的下拉框點擊觸發)
      singleSearch: {}, //快速查詢字段
      exportHref: "",
      currentAction: _const.ADD, //當新建或編輯時，記錄當前的狀態:如當前操作是新建
      currentRow: {}, //當前編輯或查看數據的行
      closable: false,
      boxModel: false, //彈出新建、編輯框
      width: 700, //彈出框查看表數據结構
      labelWidth: 90, //高级查詢的標籤寬度
      viewModel: false, //查看表结構的彈出框
      viewColumns: [], //查看表结構的列數據
      viewColumnsClone: [],
      showCustom: true, //是否顯示自定義配置列按鈕2022.05.27
      // viewData: [], //查看表结構信息
      maxBtnLength: 8, //界面按鈕最多顯示的個數，超過的數量都顯示在更多中
      buttons: [], //查詢界面按鈕  如需要其他操作按鈕，可在表對應的.js中添加(如:Sys_User.js中buttons添加其他按鈕)
      splitButtons: [],
      uploadfiled: [], //上傳文件圖片的字段
      boxButtons: [], //彈出框按鈕 如需要其他操作按鈕，可在表對應的.js中添加
      dicKeys: [], //當前界面所有的下拉框字典編號及數據源
      hasKeyField: [], //有字典數據源的字段
      keyValueType: { _dinit: false },
      url: "", //界面表查詢的數據源的url
      hasDetail: false, //是否有從表(明细)表格數據
      initActivated: false,
      load: true, //是否默認加載表數據
      activatedLoad: false, //頁面觸發actived時是否刷新頁面數據
      summary: false, //查詢界面table是否顯示合計
      //需要從远程绑定數據源的字典編號,如果字典數據源的查詢结果较多，請在onInit中將字典編號添加進來
      //只對自定sql有效
      remoteKeys: [],
      columnIndex: false, //2020.11.01是否顯示行號
      ck: true, //2020.11.01是否顯示checkbox
      continueAdd: false, //2021.04.11新建時是否可以連续新建操作
      continueAddName: "保存後继续添加", //2021.04.11按鈕名稱
      // detailUrl: "",
      detailOptions: {
        paginationHide: false, //明细表隐藏分頁
        dragPosition: "", //明细表格可拖動位置，頂部拖動top,底部bottom
        //彈出框從表(明细)對象
        //從表配置
        buttons: [], //彈出框從表表格操作按鈕,目前有删除行，添加行，刷新操作，如需要其他操作按鈕，可在表對應的.js中添加
        cnName: "", //從表名稱
        key: "", //從表主鍵名
        data: [], //數據源
        columns: [], //從表列信息
        edit: true, //明细是否可以編輯
        single: false, //明细表是否單選
        load: false, //
        delKeys: [], //當編輯時删除當前明细的行主鍵值
        url: "", //從表加載數據的url
        pagination: { total: 0, size: 100, sortName: "" }, //從表分頁配置數據
        height: 0, //默認從表高度
        textInline: true, //明细表行内容顯示在一行上，如果需要換行顯示，請設置為false
        doubleEdit: true, //使用双擊編輯
        clickEdit: false, //是否開啟點擊單元格編輯，點擊其他行時结束編輯
        currentReadonly: false, //當前用户没有編輯或新建權限時，表單只讀(可用於判斷用户是否有編輯或新建權限)
        //開啟編輯時
        beginEdit: (row, column, index) => {
          return true;
        },
        //结束編輯前
        endEditBefore: (row, column, index) => {
          return true;
        },
        //结束編輯後
        endEditAfter: (row, column, index) => {
          return true;
        },
        columnIndex: false, //2020.11.01明细是否顯示行號
        ck: true, //2020.11.01明细是否顯示checkbox
        sortable: false, //表格是否可以拖拽排序2024.10.06
      },
      auditParam: {
        //審核對象
        rows: 0, //當前選中審核的行數
        model: false, //審核彈出框
        value: -1, //審核结果
        status: -1,
        reason: "", //審核原因
        height: 500,
        showViewButton: true,
        auditHis: [],
        showAction: false, //是否顯示審批操作(當前節點為用户審批時顯示)
        //審核選項(可自行再添加)
        data: [
          { text: "通過", value: 1 },
          { text: "拒绝", value: 2 },
          { text: "駁回", value: 3 },
        ],
      },
      upload: {
        //導入上傳excel對象
        excel: false, //導入的彈出框是否顯示
        url: "", //導入的路徑,如果没有值，則不渲染導入功能
        template: {
          //下載模板對象
          url: "", //下載模板路徑
          fileName: "", //模板下載的中文名
        },
        init: false, //是否有導入權限，有才渲染導入组件
      },
      height: 0, //表高度
      tableHeight: 0, //查詢頁面table的高度
      tableMaxHeight: 0, //查詢頁面table的最大高度
      textInline: true, //table内容超出後是否不換行2020.01.16
      pagination: { total: 0, size: 30, sortName: "" }, //從分頁配置數據
      boxOptions: {
        title: "", //彈出框顯示的標題2022.08.01
        saveClose: true,
        labelWidth: 100,
        height: 0,
        width: 0,
        summary: false, //彈出框明细table是否顯示合計
        draggable: false, //2022.09.12彈出框拖動功能
        modal: true, //2022.09.12彈出框背景遮罩层
      }, //saveClose新建或編輯成功後是否關閉彈出框//彈出框的標籤寬度labelWidth
      editor: {
        uploadImgUrl: "", //上傳路徑
        upload: null, //上傳方法
      },
      numberFields: [],
      //2022.09.26增加自定義導出文件名
      downloadFileName: null,
      select2Count: 1500, //超出500數量顯示select2组件
      newTabEdit: false, //新窗口編輯
      isMultiple: false, //是否多明细表
      detailHeight: 300, //明细表的高度
      hiddenFields: [],
      text: "",
      subDetails: [], //三级明细表
      lazy: true, //樹形表格是否默認延遲加載
      defaultExpandAll: false, //樹形表格是否展開所有
      expandRowKeys: [], //默認展開的節點
      paginationHide: false, //是否隐藏分頁
      rowParentField: "", //樹形表格父级id
      importDesc: "", //導入excel彈出框的描述
      multiple: {
        horizontal: false, //一對多水平顯示(二级表與三级表是否左右结構顯示)
        leftWidth: 0, //左邊二级表寬度(默認不用設置)
        rightWidth: 0, //右邊三级表寬度(默認不用設置)
      },
      dragPosition: "", //表格可拖動位置，頂部拖動top,底部bottom
      labelPosition: "", //編輯表單標籤文字顯示位置:left / top（默認是top，或者在main.js全局配置）
      queryFields: [], //快捷查詢字段2024.01.18增加多個快捷查詢字段
      isCopyClick: false, //當前是否點擊的複製行操作
      padding: false, //是否使用padding間距
      gridRender: {
        h: (h, {}) => {
          return "";
        },
        data: {},
      },
      submitChangeRows: true, //只提交變更的明细表數據2024.08.30
      reserveSelection: false, //分頁或者刷新表格數據後是否保留複選框選擇狀態，2024.09.10
      sortable: false, //表格是否可以拖拽排序2024.10.06
      extraHeight: 0,
      showTabs:true//二级表是否以為tabs顯示，為false時會從上住下順序顯示
    };
  },
  methods: {
    initGridExtension() {
      if (!this.$grid) {
        return;
      }

      Object.keys(this.$grid).forEach((key) => {
        const fn = this.$grid[key];
        if (typeof fn == "function") {
          fn.call(this);
        }
      });
    },
  },
  activated() {
    this.initFlowQuery();
    //2020.06.25增加activated方法
    this.onActivated && this.onActivated();
    if (!this._inited) {
      this._inited = true;
      return;
    }
    if (this.activatedLoad) {
      this.refresh();
    }
  },
  mounted() {
    this.mounted();
    // this.$refs.searchForm.forEach()
  },
  unmounted() {
    this.destroyed();
  },
  created: function () {
    if (this.$global.fixedSearch) {
      this.maxBtnLength = 12;
      // this.fixedSearchForm=true;
      this.setFixedSearchForm(true);
    }
    //合並自定義業務擴展方法
    Object.assign(this, this.extend.methods);
    //如果没有指定排序字段，則用主鍵作為默認排序字段
    this.pagination.sortName = this.table.sortName || this.table.key;
    this.newTabEdit = this.table.newTabEdit;

    this.initBoxButtons(); //初始化彈出框與明细表格按鈕
    this.initAuditColumn();
    this.initEditTable();
    this.onInit(); //初始化前，如果需要做其他處理在擴展方法中覆蓋此方法
    this.getButtons();
    //初始化自定義表格列
    this.initViewColumns();
    //初始編輯框等數據
    this.initBoxHeightWidth();
    this.initDicKeys(); //初始下框數據源
    this.onInited(); //初始化後，如果需要做其他處理在擴展方法中覆蓋此方法

    this.initGridExtension();
  },
  beforeUpdate: function () {},
  updated: function () {},
};

import props from "./props.js";
import methods from "./methods.jsx";

//合並屬性
vueParam.props = Object.assign(vueParam.props, props());
//合並方法
vueParam.methods = Object.assign(vueParam.methods, methods, props().extend.methods);
export default defineComponent(vueParam);
</script>
<style lang="less" scoped>
@import "./ViewGrid.less";
</style>
<style lang="less" scoped>
.btn-group ::v-deep(.el-dropdown .el-button:focus-visible) {
  outline: 0px !important;
  outline-offset: 1px;
}
.vertical-center-modal ::v-deep(.srcoll-content) {
  padding: 0;
}

.view-model-content {
  background: #eee;
}
</style>
<style lang="less" scoped>
// .grid-search {
//   position: relative;

//   .search-box {
//     background: #fefefe;
//     margin-top: 33px;
//     border: 1px solid #eae8e8;
//     position: absolute;
//     z-index: 999;
//     left: 15px;
//     right: 15px;
//     padding: 25px 20px;
//     padding-bottom: 0;
//     border-top: 0;
//     box-shadow: 0 7px 18px -12px #bdc0bb;
//   }
// }
.form-item ::v-deep(.form-tabs) {
  margin-top: -10px;
}
.search-line ::v-deep(.vol-form-item) {
  margin-top: 4px !important;
}
</style>
