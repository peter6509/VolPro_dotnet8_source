/*
 * @Description:
 * @Author: CcSimple
 * @Github: https://github.com/CcSimple
 * @Date: 2023-02-09 13:32:39
 * @LastEditors: CcSimple
 * @LastEditTime: 2023-02-10 16:00:54
 */
import { reactive, toRefs } from "vue";
import { getHiprintPrintTemplate } from "./template-helper";

/**
 * vue3 组合式函數
 * 把一些邏輯抽離出來，方便複用
 * 返回 使用方 可用的方法和數據
 */
export function useZoom(key) {
  // 數據
  const state = reactive({
    scaleValue: 1,
    scaleMax: 5,
    scaleMin: 0.5,
  });
  // 獲取 template
  const tp = () => {
    return getHiprintPrintTemplate(key);
  };
  // 方法
  const changeScale = (big) => {
    let scaleValue = state.scaleValue;
    if (big) {
      scaleValue += 0.1;
      if (scaleValue > state.scaleMax) scaleValue = 5;
    } else {
      scaleValue -= 0.1;
      if (scaleValue < state.scaleMin) scaleValue = 0.5;
    }
    if (tp()) {
      // scaleValue: 放大缩小值, false: 不保存(不傳也一樣), 如果傳 true, 打印時也會放大
      tp().zoom(scaleValue);
      state.scaleValue = scaleValue;
    }
  };
  // 暴露给使用方
  return {
    ...toRefs(state),
    changeScale,
  };
}