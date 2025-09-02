//2024.11.16重寫组件
export default function () {
    return {
        labelPosition: {
            type: String,
            default: ''
        },
        loadKey: {
            // 是否加載formRules字段配置的數據源
            type: Boolean,
            default: true
        },
        width: {
            // 表單寬度
            type: Number,
            default: 0
        },
        labelWidth: {
            // 表單左邊label文字標籤的寬度
            type: Number,
            default: 90
        },
        formRules: {
            // 表單配置規則，如字段類型，是否必填
            type: Array,
            default: []
        },
        formFields: {
            type: Object,
            default: () => {
                return {}
            }
        },
        editor: {
            // 2021.01.16編輯器信息 {uploadImgUrl:"",upload:null//上傳方法}
            type: Object,
            default: () => {
                return {}
            }
        },
        size: {
            type: String, //large / default / small
            default: 'default'
        },
        select2Count: {
            //超出數量顯示select2组件
            type: Number,
            default: 1500
        }
    }
}