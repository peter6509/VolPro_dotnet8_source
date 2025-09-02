//2024.11.16重寫组件
import base from '@/uitils/common.js'
const initUpload = (item, init) => {
    if (!init) return
    if (['img', 'excel', 'file'].indexOf(item.type) != -1 || item.columnType == 'img') {
        // 只是没設置是否自動上傳的，默認都是選擇文件後自動上傳
        if (!item.hasOwnProperty('autoUpload')) {
            item.autoUpload = true
        }
        if (!item.hasOwnProperty('fileList')) {
            item.fileList = true
        }
        if (!item.hasOwnProperty('downLoad')) {
            item.downLoad = true
        }
        if (!item.removeBefore) {
            item.removeBefore = (index, file, files) => {
                return true
            }
        }
        if (!item.fileClick) {
            item.fileClick = (index, file, files) => {
                return true
            }
        }
        if (!item.onChange) {
            item.onChange = (files) => {
                return true
            }
        }
        if (!item.uploadAfter) {
            item.uploadAfter = (result, files) => {
                return true
            }
        }
        if (!item.uploadBefore) {
            item.uploadBefore = (files) => {
                return true
            }
        }
    }
}

export const initDefaultParams = function (formRules, formFields, tabsGroup, numberFields, rangeFields, init = true) {
    formRules.forEach((rules) => {
        rules.forEach((option) => {
            if (option.type == 'treeSelect' && option.multiple === undefined) {
                option.multiple = true
            }
        })
    })

    let span = 1;
    formRules.forEach((options) => {
        if (options.length > span) span = options.length
        let _count = 0,
            _size = 0
        options.forEach((x) => {
            if (x.colSize > 0) {
                _size = _size + x.colSize
                _count++
            }
        })
        if (_count > 0 && options.length - _count > 0) {
            let _cellSize = (12 - _size) / (options.length - _count)
            options.forEach((x) => {
                if (!x.colSize) {
                    x.colSize = _cellSize
                }
            })
        }
        options.forEach((item, index) => {

            if (item.type == 'treeSelect' && item.multiple === undefined) {
                item.multiple = true
            }

            if (item.group && tabsGroup.indexOf(item.group) == -1) {
                tabsGroup.push(item.group)
            }
            if (item.type == 'number' || item.type == 'decimal') {
                if (formFields[item.field] === '') {
                    formFields[item.field] = null
                }
                numberFields.push(item.field)
            }
            // 目前只支持select單選远程搜索，remote远程從後台字典數據源進行搜索，url從指定的url搜索
            if (item.remote || item.url) {
                // item.remoteData = [];
                item.loading = false
                //  item.point = { x: xIndex, y: yIndex }
            }
            // 初始化上傳文件信息
            initUpload(item, init)
            // 初始化數據源空對象
            if (item.dataKey) {
                // 下拉框都强制設置為字符串類型
                item.columnType = 'string'
                if (!item.data) {
                    item.data = []
                }
            }

            if (item.range || item.type == 'range') {
                if (
                    !(formFields[item.field] instanceof Array) ||
                    formFields[item.field].length != 2
                ) {
                    formFields[item.field] = ['', '']
                }
                rangeFields.push(item.field)
            }
        })
    })
}

//初始化字典數據源
export const initDataSource = (formRules, http, $ts, select2Count, resetData, dicInitedCallback) => {
    resetData = resetData && typeof resetData == 'boolean'
    let dicKeys = []
    // 初始化字典數據源
    formRules.forEach((item) => {
        item.forEach((x) => {
            if (x.dataKey) {
                if (!x.data) {
                    x.data = []
                }
                if (!x.data.length || resetData) {
                    dicKeys.push(x.dataKey)
                }
            }
        })
    })
    if (dicKeys.length == 0) {
        return;
    }
    http.post('api/Sys_Dictionary/GetVueDictionary', dicKeys, false).then((dicData) => {
        dicInitedCallback(dicData)
        bindData(formRules, $ts, dicData, resetData, select2Count)
    })
}

const bindData = (formRules, $ts, dicData, resetData, select2Count) => {

    formRules.forEach((item) => {
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
const colPow = Math.pow(10, 3)
//動態計算表單寬度
export const getColWidth = (formRules, item) => {
    if (item.itemStyle) {
        return item.itemStyle
    }
    if (item.width) {
        if (typeof item.width == 'string') {
            return { width: item.width }
        }
        if (item.width > 100) {
            return { width: item.width + 'px' }
        }
        if (item.width <= 100) {
            return { width: item.width + '%' }
        }
    }
    //2021.08.30 增加動態計算表單寬度
    let _span = 0
    formRules.forEach((row, xIndex) => {
        //2022.05.06 追加表單中隐藏的元素不參與動態計算表單寬度
        let rowLength = row.filter((item) => {
            return !item.hidden
        }).length
        if (rowLength > _span) _span = rowLength
    })
    let rate = Math.round(((item.colSize || 12 / _span) / 0.12) * colPow, 10.0) / colPow
    return { width: rate.toFixed(3) + '%' }
}

export const isReadonlyImgFile = (item, formFields) => {
    if ((item.disabled || item.readonly) && isFile(item, formFields)) {
        return true
    }
    return false
}
export const isFile = (item, formFields) => {
    if (
        item.type == 'img' ||
        item.columnType == 'img' ||
        item.type == 'excel' ||
        item.type == 'file'
    ) {
        convertFileToArray(item, formFields)
        return true
    }
    return false
}

export const previewImg = (url, access_token, http) => {
    base.previewImg(url + access_token, http.ipAddress)
}
export const getSrc = (path, http) => {
    if (!path) return
    if (!base.isUrl(path) && path.indexOf('.') != -1) {
        return http.ipAddress + path
    }
    return path
}
const convertFileToArray = (item, formFields) => {
    if (!item.maxFile) {
        item.maxFile = 1 // 默認只能上傳一個文件，可以在onInit中設置
    }

    let fileInfo = formFields[item.field]
    if (Array.isArray(fileInfo)) {
        return
    }
    if (fileInfo === null || fileInfo === undefined) {
        formFields[item.field] = []
        return
    }
    // 將以逗號隔開的文件分割成數组127.0.0.1/aa/1.jpg,將127.0.0.1/aa/2.jpg
    if (typeof fileInfo === 'string') {
        if (fileInfo.trim() === '') {
            formFields[item.field] = []
            return
        }
        // 如果文件路徑是字符串，則使用，拆分
        let files = fileInfo.replace(/\\/g, '/').split(',')
        formFields[item.field] = files.map(x => {
            return {
                name: x.split('/').pop(),
                path: x
            }
        })
    }
}
export const dowloadFile = (file,$store,http) => {
    base.dowloadFile(
        file.path,
        file.name,
        {
            Authorization: $store.getters.getToken()
        },
        http.ipAddress
    )
}
export const getText = (formFields, item, $ts) => {
    // 2019.10.24修複表單select组件為只讀的屬性時没有绑定數據源
    let text = formFields[item.field]
    if (typeof text === 'function') return text(formFields)
    if (text === 'null' || text === '' || text === null || text === undefined) return '--'
    //2021.03.02增加只讀時日期處理
    if (item.type == 'date') {
        return text.replace('T', ' ').split(' ')[0]
    }
    //2021.03.31修複表單switch只讀時没有轉換值的問題
    if (item.type == 'switch') {
        return $ts(text ? '是' : '否')
    }
    if (!item.data) return text
    if (item.type == 'selectList' || item.type == 'checkbox') {
        return convertArrayValue(item.data, text)
    }
    var _item = item.data.find((x) => {
        return x.key == text
    })
    return _item ? _item.value : text
}

export const convertArrayValue = (data, val) => {
    // 2020.12.13增加表單多選只轉換字典
    // 編輯多選table顯示
    //2023.04.20修複只讀為label時原數據被字典替換了的問題
    let valArr = Array.isArray(val)
        ? val.map((x) => {
            return x
        })
        : val.split(',')
    for (let index = 0; index < valArr.length; index++) {
        var _item = data.find((x) => {
            return x.key && x.key != '0' && x.key + '' == valArr[index] + ''
        })
        if (_item) {
            valArr[index] = _item.value
        }
    }
    return valArr.join(',')
}
