<template>
    <div class="table-item">
        <div class="table-item-header">
            <div class="table-item-border"></div> <span class="table-item-text">樹形结構</span>
            <div class="table-item-buttons">
                <div>
                    <el-input style="width: 140px;margin-right: 10px;" v-model="OrderNo" placeholder="訂單編號"></el-input>
                    <el-button type="primary" @click="reload" color="#95d475" plain>查詢</el-button>
                </div>
            </div>
        </div>
        <el-alert type="success" title="" style="line-height: 12px;">
            功能：樹形table
        </el-alert>
        <vol-table :rowKey="rowKey" :rowParentField="rowParentField" @loadBefore="loadBefore" @loadAfter="loadAfter"
            ref="table" :url="url" index :tableData="tableData" :columns="columns" :max-height="500" :lazy="lazy"
            :pagination-hide="paginationHide" :load-key="true" :ck="false" :column-index="true" :defaultExpandAll="defaultExpandAll"></vol-table>
    </div>
</template>
<script lang="jsx">
import VolTable from "@/components/basic/VolTable.vue";
export default {
    components: {
        'vol-table': VolTable,
    },
    data() {
        return {
            //隐藏分頁
            paginationHide: true,
            //延遲加載
            lazy: false,
            //樹形结點的id字段
            rowKey: 'DepartmentId',
            //父级id字段
            rowParentField:"ParentId",
            defaultExpandAll:true,// //樹形表格是否展開所有
            OrderNo: "",//查詢字段
            //接口返回數據，可以框架生成的接口getPageData
            //如果是自定義的接口，需要返回的數據格式：{total:100,rows:[]}
            url: "api/Sys_Department/getPageData",
            columns: [{ field: 'DepartmentId', title: 'DepartmentId', type: 'guid', width: 110, hidden: true },
            { field: 'DepartmentName', title: '名稱', type: 'string', width: 150 },
            { field: 'ParentId', title: '上级组織', type: 'guid', bind: { key: '部門级聯', data: [] }, width: 110, hidden: true },
            { field: 'DepartmentCode', title: '編號', type: 'string', width: 90 },
            { field: 'DepartmentType', title: '類型', type: 'string', bind: { key: '组織類型', data: [] }, width: 80 },
            { field: 'Enable', title: '是否可用', type: 'int', bind: { key: 'enable', data: [] }, width: 80 },
            { field: 'Remark', title: '備註', type: 'string', width: 100 },
            { field: 'Creator', title: '創建人', type: 'string', width: 100 },
            { field: 'CreateDate', title: '創建時間', type: 'datetime', width: 150 },
            { field: 'Modifier', title: '修改人', type: 'string', width: 100 },
            { field: 'ModifyDate', title: '修改時間', type: 'datetime', width: 150 }]
        }
    },
    methods: {
        editClick(row, column, index) {
            this.$refs.table.edit.rowIndex = index;
        },
        loadBefore(params, callBack) {//調用後台接口前處理
            //設置查詢條件
            params.wheres.push({
                name: "OrderNo",
                value: this.OrderNo,
                displayType: "like"//模糊查詢
            })

            //也可以给value設置值，後台自己解析
            // params.value=this.OrderNo

            callBack(true)//false不會調用後台接口
        },
        //查詢後方法
        loadAfter(rows, callBack, result) {
            callBack(true)
        },
        reload() {
            this.$refs.table.load(null, true);
            this.$message.success('查詢成功')
        }
    }
}
</script>
<style lang="less" scoped>
.table-item-header {
    display: flex;
    align-items: center;
    padding: 6px;

    .table-item-border {
        height: 15px;
        background: rgb(33, 150, 243);
        width: 5px;
        border-radius: 10px;
        position: relative;
        margin-right: 5px;
    }

    .table-item-text {
        font-weight: bolder;
    }

    .table-item-buttons {
        flex: 1;
        text-align: right;
    }

    .small-text {
        font-size: 12px;
        color: #2196F3;
        margin-left: 10px;
        position: relative;
        top: 2px;
    }
}
</style >