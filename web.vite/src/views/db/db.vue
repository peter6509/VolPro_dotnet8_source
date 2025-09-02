<template>
    <div style="padding:20px;">
        <div style="margin-top:10px">
            <el-input v-model="text" type="textarea" :autosize="{ minRows: 20, maxRows: 20 }" placeholder="輸入脚本..." />

        </div>
        <div style="text-align: center; padding: 10px;"> <el-button @click="btnClick" type="primary"
                plain="">執行脚本</el-button>
        </div>

        <el-dialog v-model="centerDialogVisible" title="執行结果" width="30%" center>
            <div style="text-align: center;">
                {{ message }}
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">確定</el-button>

                </span>
            </template>
        </el-dialog>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            centerDialogVisible: false,
            text: "",
            message: ""
        }
    },
    methods: {
        btnClick() {
            if (!this.text) {
                return;
            }
            this.http.post("api/db/exectue", { text: this.text }, true).then(x => {
                this.message = x;
                this.centerDialogVisible = true;
            });
        }
    }
}
</script>
  
<style></style>