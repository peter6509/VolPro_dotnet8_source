<template>
    <div class="table-item">
        <div class="table-item-header">
            <div class="table-item-border"></div> <span class="table-item-text">可編輯的表格二</span>
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
            功能：表尾合計、文件上傳、編輯、api加載數據、自動分頁、自定義按鈕、行點擊事件、加載loadBefore自定義等。。。
        </el-alert>
        <vol-table @loadBefore="loadBefore" @loadAfter="loadAfter" ref="table" :url="url" index :tableData="tableData"
            :columns="columns" :max-height="500" :pagination-hide="false" :load-key="true" :column-index="true"></vol-table>
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
            columns: [{ field: 'Order_Id', title: 'Order_Id', type: 'guid', width: 110, hidden: true },
            {
                field: 'OrderNo', title: '自定義圖標、事件', type: 'string', width: 130, sort: true,
                render: (h, { row, column, index }) => {
                    return (
                        <div>
                            <i onClick={() => { this.$message.success('點擊了第1個圖標') }} class="el-icon-search" style="color: #2196F3;"></i>
                            <i onClick={() => { this.$message.success('點擊了第2個圖標') }} class="el-icon-date" style="margin-left:10px;color: #2196F3;"></i>
                            <span style="margin-left:15px">{row.OrderNo}</span>
                        </div>)
                }

            },
            { field: 'OrderType', title: '訂單類型', type: 'int', sort: true, bind: { key: '訂單狀態', data: [] }, width: 70 },
            //summary,後台也要加返回summary數據，可參照api/Demo_Order/getPageData返回的格式及Demo_OrderService.cs中的合計處理
            { field: 'TotalPrice', title: '總價', type: 'decimal', width: 60, sort: true, align: 'center', summary: true },
            { field: 'TotalQty', title: '總數量', type: 'int', width: 80, sort: true, align: 'center', summary: true },
            { field: 'OrderDate', title: '訂單日期', type: 'date', width: 95 },
            {
                field: 'Customer', title: '圖片上傳', type: 'string', width: 80,
                edit: {
                    type: "img",
                    maxFile: 1,//圖片上傳數量
                    multiple: false//多圖上傳
                },
                url: "api/Demo_Order/getPageData"//上傳的url
            },//type可選類型:'file'/excel
            { field: 'PhoneNo', title: '始终開啟編輯', type: 'string', width: 100, edit: { type: "input", keep: true } },
            {
                title: '操作',
                field: '操作',
                width: 150,
                align: 'center',// 'center',
                render: (h, { row, column, index }) => {
                    return (
                        <div>
                            <el-button
                                onClick={($e) => {
                                    $e.stopPropagation();
                                    this.editClick(row, column, index);
                                }}
                                type="primary"
                                plain
                                style="height:26px; padding: 10px !important;"
                            >
                                測試
                            </el-button>

                            {/* 通過條件判斷,要顯示的按鈕 */}
                            {
                                /*  {
                                      index % 2 === 1 
                                      ?<el-button>修改</el-button>
                                      : <el-button>設置</el-button>
                                  } */
                            }


                            {/* 通過v-show控制按鈕隐藏與顯示
                  下面的index % 2 === 1換成：row.字段==值 */
                            }
                            <el-button
                                onClick={($e) => {
                                    this.btn2Click(row, $e);
                                }}
                                v-show={index % 2 === 1}
                                type="success"
                                plain
                                style="height:26px;padding: 10px !important;"
                            >
                                修改
                            </el-button>

                            <el-button
                                onClick={($e) => {
                                    this.btn2Click(row, $e);
                                }}
                                v-show={index % 2 === 0}
                                type="warning"
                                plain
                                style="height:26px;padding: 10px !important;"
                            >
                                設置
                            </el-button>

                            <el-dropdown
                                onClick={(value) => {
                                    this.dropdownClick(value);
                                }}
                                trigger="click"
                                v-slots={{
                                    dropdown: () => (
                                        <el-dropdown-menu>
                                            <el-dropdown-item>
                                                <div
                                                    onClick={() => {
                                                        this.dropdownClick('京醬肉絲', row, column);
                                                    }}
                                                >
                                                    京醬肉絲
                                                </div>
                                            </el-dropdown-item>
                                            <el-dropdown-item>
                                                <div
                                                    onClick={() => {
                                                        this.dropdownClick('驢肉火燒', row, column);
                                                    }}
                                                >
                                                    驢肉火燒
                                                </div>
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    )
                                }}
                            >
                                <span
                                    style="font-size: 13px;color: #409eff;margin: 5px 0 0 10px;"
                                    class="el-dropdown-link"
                                >
                                    更多<i class="el-icon-arrow-right"></i>
                                </span>
                            </el-dropdown>
                        </div>
                    );
                }
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