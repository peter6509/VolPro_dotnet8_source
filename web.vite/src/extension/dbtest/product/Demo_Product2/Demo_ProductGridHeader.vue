<template>
    <!-- 彈出框一 -->
    <vol-box :lazy="true" v-model="model1" title="彈出框1" :width="700" :padding="5" :onModelClose="onModelClose">
        <div style="height:400px;">彈出1框内容, 選中傳入的行數據
            <p>
                {{ JSON.stringify(model1Rows) }}
            </p>
        </div>
        <template #footer>
            <div>
                <el-button type="primary" plain size="small" @click="callParent">調用生成(父)頁面對象</el-button>
                <el-button type="primary" size="small" @click="closeModel1">確認</el-button>
                <el-button type="default" size="small" @click="model1 = false">關閉</el-button>
            </div>
        </template>
    </vol-box>

    <!-- 彈出框二 -->
    <vol-box :lazy="true" v-model="model2" title="彈出框1" :width="700" :padding="5" :onModelClose="onModelClose">
        <div style="height:400px;">彈出2框内容, 當前點擊的行數據
            <p>
                {{ JSON.stringify(model2Row) }}
            </p>
        </div>
        <template #footer>
            <div>
                <el-button type="primary" plain size="small" @click="callParent">調用生成(父)頁面對象</el-button>
                <el-button type="primary" size="small" @click="closeModel2">確認</el-button>
                <el-button type="default" size="small" @click="model2 = false">關閉</el-button>
            </div>
        </template>
    </vol-box>
</template>
<script>
import VolBox from '@/components/basic/VolBox.vue';
//這裡使用的vue2語法，也可以寫成vue3語法
export default {
    components: { 'vol-box': VolBox },
    methods: {},
    data() {
        return {
            model1: false,
            model1Rows: [], //彈出框1傳入的選中行
            model2: false,
            model2Row: {},//彈出框2點擊的當前行數據
        };
    },
    methods: {
        openModel1(rows) { //彈出框1
            this.model1Rows = rows;
            this.model1 = true;
        },
        openModel2(row, column, index) {//彈出框2
            this.model2Row = row;
            this.model2 = true;
        },
        closeModel1() {
            this.model1 = false;
        },
        closeModel2() {
            this.model2 = false;
        },
        callParent() {
            this.$emit('parentCall', $parent => {
                //$parent就是生成頁面的對象，比如可以調用頁面刷新，可獲取的屬性與方法見【生成頁面文檔】,$parent.xxx直接調用
                //調用刷新
                $parent.search();
                //獲取所有選中的行數據
                // $parent.getSelectRows();
                this.$message.success('調用了刷新')
            })
        },
        onModelClose() {
            this.$message.success('彈出框右上角點擊x關閉事件')
        }
    }
};
</script>
  