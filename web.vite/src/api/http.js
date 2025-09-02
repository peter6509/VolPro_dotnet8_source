import axios from 'axios'
import store from '../store/index'
import { useRouter, useRoute } from 'vue-router'
import { nextTick } from 'vue'
const router = useRouter()
axios.defaults.timeout = 5000000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

import { ElLoading as Loading, ElMessage as Message } from 'element-plus'

let loadingInstance
let loadingStatus = false
let dataViewUrl
if (process.env.NODE_ENV == 'development') {
  axios.defaults.baseURL = 'http://localhost:9100/'
  //大屏本地地址
  dataViewUrl = 'http://localhost:9200/'
} else if (process.env.NODE_ENV == 'debug') {
  axios.defaults.baseURL = 'http://localhost:9100/'
} else if (process.env.NODE_ENV == 'production') {
  //後台接口地址
  axios.defaults.baseURL = 'http://proapi.volcore.xyz/'
  //大屏發布的地址
  dataViewUrl = 'http://data.volcore.xyz/'
}
//axios.defaults.baseURL = 'http://proapi.volcore.xyz/'
if (!axios.defaults.baseURL.endsWith('/')) {
  axios.defaults.baseURL += '/'
}

let ipAddress = axios.defaults.baseURL;
if (!ipAddress || ipAddress == '/') {
  ipAddress = window.location.origin + '/';
}
window.ipAddress = ipAddress;
axios.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (res) => {
    closeLoading()

    checkResponse(res)

    return Promise.resolve(res)
  },
  (error) => {
    closeLoading()
    let httpMessage = ''
    if (error.response) {
      if (error.response.status == '401') {
        if (error.response.data && error.response.data.code == 401) {
          if (!localStorage.getItem('user')) {
            // Message.error({
            //     showClose: true,
            //     message: '登錄已過期',
            //     type: 'error'
            // });
          }
          toLogin()
          return
        }
      }
      if (error.response.status == '404') {
        httpMessage = '未找到請求地址'
      } else if (error.response.data && error.response.data.message) {
        httpMessage = error.response.data.message
      }
    } else {
      httpMessage = '服務器處理異常'
    }
    redirect(httpMessage)
    return Promise.reject(error.response || {}, httpMessage)
  }
)
function closeLoading() {
  if (loadingInstance) {
    loadingInstance.close()
  }
  if (loadingStatus) {
    loadingStatus = false
    if (loadingInstance) {
      loadingInstance.close()
    }
  }
}
function checkResponse(res) {
  //刷新token
  if (!res.headers) {
    if (res.getResponseHeader('vol_exp') == '1') {
      replaceToken()
    }
  } else if (res.headers.vol_exp == '1') {
    replaceToken()
  }
}

const _Authorization = 'Authorization'

function showLoading(loading) {
  // if (loading === undefined) {
  //   loading = true;
  // }
  if (!loading || loadingStatus) {
    return
  }
  nextTick(() => {
    loadingInstance = Loading.service({
      lock: true,
      body: true,
      text: typeof loading == 'string' ? loading : 'loading...',
      customClass: 'http-loading',
      background: 'rgba(58, 61, 63, 0.32)'
    })
  })
}
function setHeaderLang(_header) {
  let langType = localStorage.getItem(lang_storage_key)
  if (langType == 'zh-CN') {
    _header['lang'] = 'zh-CN'
    return
  }
  _header['lang'] = langType
}
function getToken() {
  axios.defaults.headers['serviceId'] = localStorage.getItem('serviceId')
  axios.defaults.headers['deptId'] = localStorage.getItem('deptId')
  return store.getters.getToken()
}

/*
  url
  params請求後台的參數,如：{name:123,values:['a','b','c']}
  loading是否顯示遮罩层,可以傳入true.false.及提示文本
  config配置信息,如{timeout:3000,headers:{token:123}}
*/
function post(url, params, loading, config) {
  showLoading(loading)
  setHeaderLang(axios.defaults.headers)
  axios.defaults.headers[_Authorization] = getToken()

  return new Promise((resolve, reject) => {
    axios
      .post(url, params, config)
      .then(
        (response) => {
          resolve(response.data)
        },
        (err) => {
          reject(err && err.data && err.data.message ? err.data.message : '服務器處理異常')
        }
      )
      .catch((error) => {
        reject(error)
      })
  })
}

//=true異步請求時會顯示遮罩层,=字符串，異步請求時遮罩层顯示當前字符串
function get(url, param, loading, config) {
  showLoading(loading)
  setHeaderLang(axios.defaults.headers)
  axios.defaults.headers[_Authorization] = getToken()
  return new Promise((resolve, reject) => {
    axios
      .get(url, config)
      .then(
        (response) => {
          resolve(response.data)
        },
        (err) => {
          reject(err)
        }
      )
      .catch((error) => {
        reject(error)
      })
  })
}

function getDataViewAccessToken(params, callback) {
  if (!dataViewUrl) {
    alert('http.js未配置大屏url地址')
    return
  }
  if (dataViewUrl.endsWith('/')) {
    dataViewUrl = dataViewUrl.substring(0, dataViewUrl.length - 1)
  }
  let arr = []
  post('api/auth/getDataViewAccessToken', {}).then((result) => {
    arr.push('token=' + result)
    arr = Object.keys(params).map((key) => {
      return key + '=' + params[key]
    })
    let urlParams = arr.join('&') || ''
    if (urlParams) {
      urlParams = '&' + urlParams
    }
    urlParams += '&tid=' + localStorage.getItem('serviceId')

    window.open(dataViewUrl + '/#/home?key=' + result + urlParams, '_blank')
  })
}

//url:url地址
//params:請求參數
//fileName:下載的文件名
//loading:是否顯示加載狀態
function download(url, params, fileName, loading, callback) {
  fileName = fileName.replace('>', '＞').replace('<', '＜')
  setHeaderLang(axios.defaults.headers)
  post(url, params, loading, { responseType: 'blob' }).then((content) => {
    const blob = new Blob([content])
    if ('download' in document.createElement('a')) {
      // 非IE下載
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 對象
      document.body.removeChild(elink)
    } else {
      // IE10+下載
      navigator.msSaveBlob(blob, fileName)
    }
    callback && callback()
  })
}

function createXHR() {
  if (XMLHttpRequest) {
    return new XMLHttpRequest()
  }
  if (ActiveXObject) {
    if (typeof arguments.callee.activeXString != 'string') {
      var versions = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp', 'MSXML2.XMLHttp.3.0']
      for (var i = 0; i < versions.length; i++) {
        try {
          new ActiveXObject(versions[i])
          arguments.callee.activeXString = versions[i]
          break
        } catch (e) {
          console.log(e)
        }
      }
    }
    return new ActiveXObject(arguments.callee.activeXString)
  }
}

function redirect(responseText, message) {
  try {
    let responseData = typeof responseText == 'string' ? JSON.parse(responseText) : responseText
    if (
      (responseData.hasOwnProperty('code') && responseData.code == 401) ||
      (responseData.data && responseData.data.code == 401)
    ) {
      closeLoading()
      toLogin()
    } else {
      if (message) {
        Message.error({
          showClose: true,
          message: message,
          type: 'error'
        })
      }
    }
  } catch (error) {
    console.log(error)
    Message.error({
      showClose: true,
      message: responseText,
      type: 'error'
    })
  }
}

function toLogin() {
  //  const vueinstance=  getCurrentInstance();
  if (window.location.hash) {
    window.location.href = window.location.origin + '/#/login'
    return
  }
  window.location.href = window.location.origin + '/login'
  //  router.push({ path: '/login', params: { r: Math.random() } });
}
//動態刷新token
function replaceToken() {
  setHeaderLang(axios.defaults.headers)
  ajax({
    url: '/api/User/replaceToken',
    param: {},
    json: true,
    success: function (x) {
      if (x.status) {
        let userInfo = store.getters.getUserInfo()
        if (x.data && x.data.accessToken) {
          userInfo.token = x.data.token
          userInfo.accessToken = x.data.accessToken
        } else {
          userInfo.token = x.data
        }

        store.commit('setUserInfo', userInfo)
      } else {
        console.log(x.message)
        toLogin()
      }
    },
    errror: function (ex) {
      console.log(ex)
      toLogin()
    },
    type: 'post',
    async: false
  })
}

function ajax(param) {
  let httpParam = Object.assign(
    {
      url: '',
      headers: {},
      param: {},
      json: true,
      success: function () { },
      errror: function () { },
      type: 'post',
      async: true
    },
    param
  )

  httpParam.url = axios.defaults.baseURL + httpParam.url.replace(/\/?/, '')
  httpParam.headers[_Authorization] = getToken()
  httpParam.headers['serviceId'] = localStorage.getItem('serviceId')
  httpParam.headers['deptId'] = localStorage.getItem('deptId')
  var xhr = createXHR()
  xhr.onreadystatechange = function () {
    if (xhr.status == 403 || xhr.status == 401) {
      redirect(xhr.responseText)
      return
    }
    checkResponse(xhr)
    if (xhr.readyState == 4 && xhr.status == 200) {
      httpParam.success(httpParam.json ? JSON.parse(xhr.responseText) : xhr.responseText)
      return
    }
    if (xhr.status != 0 && xhr.readyState != 1) {
      httpParam.errror(xhr)
    }
  }
  //初始化請求
  xhr.open(httpParam.type, httpParam.url, httpParam.async)
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  for (const key in httpParam.headers) {
    xhr.setRequestHeader(key, httpParam.headers[key])
  }
  let dataStr = ''
  for (const key in httpParam.param) {
    dataStr += key + '=' + httpParam.param[key]
  }
  try {
    xhr.send(dataStr)
  } catch (error) {
    toLogin()
  }
}

ajax.post = function (url, param, success, errror) {
  ajax({
    url: url,
    param: param,
    success: success,
    error: errror,
    type: 'post'
  })
}
ajax.get = function (url, param, success, errror) {
  ajax({
    url: url,
    param: param,
    success: success,
    error: errror,
    type: 'get'
  })
}
export default { post, get, download, getDataViewAccessToken, ajax, ipAddress }
