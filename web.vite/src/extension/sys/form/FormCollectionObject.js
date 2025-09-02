//author:jxx
//此處是對表單的方法，组件，權限操作按鈕等進行任意擴展(方法擴展可參照SellOrder.js)
let extension = {
    components: {//動態擴充组件或组件路徑
        //表單header、content、footer對應位置擴充的组件
        gridHeader: '',//{ template: "<div>擴展组xx件</div>" },
        gridBody: '',
        gridFooter: '',
        //彈出框(修改、編輯、查看)header、content、footer對應位置擴充的组件
        modelHeader: '',
        modelBody: '',
        modelFooter: ''
    },
    text: "點擊左側表單名名字即可加載收集的數據",
    tableAction: "formCollectionResultTree",
    buttons: { view: [], box: [], detail: [] },//擴展的按鈕
    methods: {//事件擴展
        onInit() {
            this.textInline = false;
            // this.ck = false;
            this.load = false;
            this.setFiexdSearchForm(true);
            
        },
        onInited() {
            this.height = this.height - 74;
        },
        loadById(item) {
            let columns = [
                {
                    title: "提交人",
                    field: "Creator"
                },
                {
                    title: "提交時間",
                    field: "CreateDate"
                }];
            JSON.parse(item.formOptions).formOptions.forEach(x => {
                columns.push(...x.map(m => {
                    return {
                        title: m.title,
                        field: m.field,
                        type: m.type
                    }
                }))
            })
            this.formId = item.formId;
            this.columns.splice(0);
            this.columns.push(...columns);
            this.search();
        },
        exportBefore(formData) {
            formData.Value = this.formId;
            return true;
        },
        searchBefore(formData) {
          //  formData.Value = this.formId;
            formData.wheres.push({name:'FormId',value:this.formId})
            return true;
        },
        searchAfter(rows) {
            rows.forEach(row => {
                if (row.FormData) {
                    let data = JSON.parse(row.FormData);
                    for (const key in data) {
                        row[key] = Array.isArray(data[key]) ? data[key].filter(x => { return x != null && x != undefined }).join(',') : data[key];
                    }
                }
            })
            return true;
        }
    }
};
export default extension;