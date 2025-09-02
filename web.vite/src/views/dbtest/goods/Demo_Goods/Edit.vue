<template>
    <vol-edit ref="edit" :keyField="options.key" :tableName="options.tableName" :tableCNName="options.tableCNName"
        :labelWidth="100" :formFields="options.editFormFields" :formOptions="options.editFormOptions"
        :detail="options.detail" @initButtons="initButtons" @initDetailButtons="initDetailButtons"
        :loadFormAfter="loadFormAfter"
        >
        <template #header>
            <el-alert title="header位置,生成的新頁面編輯同樣支持自定義组件與業務處理" type="success" />
        </template>
        <!-- 
    <template #content>
      <el-alert title="slot數據槽content位置" type="warning" />
    </template>

    <template #footer>
      <el-alert title="slot數據槽footer位置" type="error" />
    </template> -->
    </vol-edit>
</template>
<script>
import { defineComponent, ref, reactive, getCurrentInstance } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import store from '@/store/index';
import http from '@/api/http.js';
import editOptions from './options.js';
//參數傳遞與方法實現，看VolEdit.vue文件
export default defineComponent({
    setup(props, context) {
        //vol-edit组件
        const edit = ref(null);

        const options = reactive({
            //表單字段
            editFormFields: {},
            //表單配置
            editFormOptions: [],
            //明细表信息
            detail: {
                cnName: '',
                table: '',
                url: '',
                columns: [],
                sortName: '',
                key: ''
            },
            details: []
        });
        Object.assign(options, editOptions());

        //表單按鈕
        const formButtons=reactive([]);
        //初始化主表按鈕
        const initButtons = (buttons) => {
            //設置表單按鈕隐藏
           //buttons[0].hidden=true;
           //記錄表單按鈕
            formButtons.push(...buttons)
         };
        //初始化明细表按鈕
        const initDetailButtons = (buttons) => { };

        //表單數據添加載方法
        const loadFormAfter=(result)=>{
            //顯示表單按鈕(判斷表單的值)
            // if (options.formFields.字段==='xxx') {
            //   // formButtons[0].hidden=false;
            // }
          
        }

        return { edit, options, initButtons, initDetailButtons,loadFormAfter };
    },
    /****************************************/
    //這裡是vue2語法,不想寫vue3語法就在這裡寫vue2
    data() {
        return {};
    },
    methods: {},
    created() {
        //this.options
    }
});
</script>
