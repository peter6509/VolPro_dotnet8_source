//2024.11.16重寫组件
import base from '@/uitils/common.js'

//初始化字典數據源
export const initDataSource = (columns, http, $ts, select2Count, resetData, dicInitedCallback) => {

    // this.columns.forEach((x, _index) => {
    //   if (x.children && Array.isArray(x.children)) {
    //     x.children.forEach((cl) => {
    //       if (cl.bind && cl.bind.key && (!cl.bind.data || cl.bind.data.length == 0)) {
    //         keys.push(cl.bind.key)
    //         cl.bind.valueType = cl.type
    //         columnBind.push(cl.bind)
    //       }
    //     })
    //   } else if (x.bind && x.bind.key && (!x.bind.data || x.bind.data.length == 0)) {
    //     // 寫入远程
    //     if (!x.bind.data) x.bind.data = []
    //     if (x.bind.remote) {
    //       this.remoteColumns.push(x)
    //     } else if (this.loadKey) {
    //       keys.push(x.bind.key)
    //       x.bind.valueType = x.type
    //       if (x.edit && x.edit.type) {
    //         x.bind.editType = x.edit.type
    //       }
    //       columnBind.push(x.bind)
    //     }
    //   }
    // })
    let dicKeys = []
    // 初始化字典數據源
    columns.forEach((x) => {


    })
    if (dicKeys.length == 0) {
        return;
    }
    http.post('api/Sys_Dictionary/GetVueDictionary', dicKeys, false).then((dicData) => {
        dicInitedCallback(dicData)
        bindData(columns, $ts, dicData, resetData, select2Count)
    })
}

const bindData = (columns, $ts, dicData, resetData, select2Count) => {

    columns.forEach((item) => {
        item.forEach((x) => {
            if (!x.dataKey) { return }
            let data = dicData.find(dic => { return dic.dicNo == x.dataKey });
            if (!data) { return; }

            if (x.type == 'cascader' || x.type == 'treeSelect') {
                let _data = data.data;
                x.data = base.convertTree(_data, (node, treeData, isRoot) => {
                    if (!node.inited) {
                        node.inited = true
                        node.label = $ts(node.value)
                        node.value = node.key
                    }
                })
            } else {
                //轉換高性能下拉框
                if (data.data.length > select2Count && !data.data[0].hasOwnProperty('label')) {
                    data.data.forEach((item) => {
                        item.label = item.value
                        item.value = item.key
                    })
                }
                x.data = data.data
            }
        })
    })
}