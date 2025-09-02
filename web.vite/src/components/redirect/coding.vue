<template>
  <div style="height:100%;">
    <redirect-error :text="text" :errorNumber="errorNumber">
      <div>
        <router-link to="SellOrder">
          <Button>點擊查看[測試完整示例]</Button>
        </router-link>
      </div>
    </redirect-error>
  </div>
</template>
  <script>
import RedirectError from "./RedirectError";
export default {
  components: {
    RedirectError
  },
  data() {
    return {
      errorNumber: "用例正在整理中",
      text: "詳细用例在正准備中,目前可參考[測試完整示例]的使用方法"
    };
  }
};
</script>
