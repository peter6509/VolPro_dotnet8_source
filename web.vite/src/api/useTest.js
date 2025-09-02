const tipxx = {
  install: function (vue) {
    alert(1)
    vue.prototype.$tip = function () {
      alert('測試use')
    }
  }
}
export default { tipxx }
