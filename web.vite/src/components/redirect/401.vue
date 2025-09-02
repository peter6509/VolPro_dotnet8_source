<template>
  <div style="height: 100%">
    <redirect-error :text="text" message="請求確認是否配置權限" :errorNumber="errorNumber"></redirect-error>
  </div>
</template>
  <script>
import RedirectError from "./RedirectError";
export default {
  components: {
    RedirectError,
  },
  data() {
    return {
      errorNumber: "401",
      text: "抱歉，您没有權限進行此操作~",
    };
  },
};
</script>
