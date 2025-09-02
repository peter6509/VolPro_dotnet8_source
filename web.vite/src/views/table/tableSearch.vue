<template>
    <div class="table-item">
        <div class="table-item-header">
            <div class="table-item-border"></div> <span class="table-item-text">多级表頭</span>
            <div class="table-item-buttons">
                <div>
                    <el-input style="width: 140px;margin-right: 10px;" v-model="OrderNo" placeholder="訂單編號"></el-input>
                    <el-button type="primary" @click="reload" color="#95d475" plain>查詢</el-button>
                    <el-button type="primary" @click="addRow" plain>添加行</el-button>
                    <el-button type="primary" @click="delRow" color="#f89898" plain>删除行</el-button>
                    <el-button type="primary" @click="getRow" plain>獲取選中行</el-button>

                </div>
            </div>
        </div>
        <el-alert type="success" title="" style="line-height: 12px;">
            功能：多级表頭、單元格合並
        </el-alert>
        <vol-table @loadBefore="loadBefore" @loadAfter="loadAfter" ref="table" :url="url" index :tableData="tableData"
            :columns="columns" :max-height="500" :pagination-hide="false" :load-key="true" :ck="false"
            :column-index="true"></vol-table>
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
            OrderNo: "",
            //接口返回數據，可以框架生成的接口getPageData
            //如果是自定義的接口，需要返回的數據格式：{total:100,rows:[]}
            url: "api/Demo_Order/getPageData",
            columns: [
                {
                    field: '基礎信息',
                    title: '基礎信息',
                    type: 'string',
                    align: 'center',
                    children: [
                        { field: 'OrderNo', title: '訂單編號', type: 'string', width: 130 },
                        { field: 'OrderType', title: '訂單類型', type: 'int', bind: { key: '訂單類型', data: [] }, width: 70 },
                        { field: 'TotalPrice', title: '總價', type: 'decimal', width: 60, align: 'center' },
                        { field: 'TotalQty', title: '總數量', type: 'int', width: 80, align: 'center' },
                        { field: 'OrderDate', title: '訂單日期', type: 'date', width: 95 },
                    ]
                },
                {
                    field: '狀態',
                    title: '狀態',
                    type: 'string',
                    align: 'center',
                    children: [
                        {
                            field: 'OrderType', title: '訂單類型', type: 'int', bind: { key: '訂單類型', data: [] }, width: 90
                        },
                        {
                            field: 'OrderStatus', title: '訂單狀態', type: 'int', bind: { key: '訂單狀態', data: [] }, width: 90
                        }
                    ]
                },
                {
                    field: '創建人信息',
                    title: '創建人信息',
                    type: 'string',
                    align: 'center',
                    children: [
                        { field: 'Creator', title: '創建人', type: 'string', width: 130 },
                        { field: 'CreateDate', title: '創建時間', type: 'datetime', width: 90 }
                    ]
                },
                {
                    field: '修改人信息',
                    title: '修改人信息',
                    type: 'string',
                    align: 'center',
                    children: [
                        { field: 'Modifier', title: '修改人', type: 'string', width: 130 },
                        { field: 'ModifyDate', title: '修改時間', type: 'datetime', width: 90 }
                    ]
                }
            ]
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
        getRow() {
            const rows = this.$refs.table.getSelected();
            if (!rows.length) {
                this.$message.error('請選中行')
                return;
            }
            this.$message.success(JSON.stringify(rows))
        },
        addRow() {
            this.$refs.table.addRow({ OrderNo: "D2022040600009" })
            //如果批量添加行。請使用：
            //this.$refs.table.rowData.push(...[{ OrderNo: "D2022040600009" },{ OrderNo: "D2022040600009" }])
        },
        delRow() {
            this.$refs.table.delRow();
            this.$message.success('删除成功')
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