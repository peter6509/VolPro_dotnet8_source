//對vue參數進行擴展
var extend = function ($vueParam) {
  $vueParam.methods.volBoxFrom = function () {
    this.$Message.info('擴展js,增加彈出消息')
    this.$refs.volBoxFrom.show()
  }
  //修改data屬性:
  let data = $vueParam.data()
  data.formFileds['extend'] = '動態擴展字段'
  data.formOptions.splice(0, 0, {
    filed: 'extend',
    title: '動態增加字段',
    type: 'text',
    required: true
  })
  $vueParam.data = function () {
    return data
  }
}
export { extend }
