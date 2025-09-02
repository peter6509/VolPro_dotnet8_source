<template>
  <div class="list-container">
    <el-scrollbar style="height: 100%">
      <div class="search-content">
        <label>開始日期：</label>
        <el-date-picker
          style="width: 150px"
          v-model="searchValue.beginDate"
          placeholder="開始日期"
          value-format="YYYY-MM-DD"
        ></el-date-picker>
        <label class="mg-item">结束日期：</label>
        <el-date-picker
          style="width: 150px"
          v-model="searchValue.endDate"
          value-format="YYYY-MM-DD"
          placeholder="结束日期"
        ></el-date-picker>
        <el-button type="primary" plain icon="Search" @click="getData(true)">搜索</el-button>
      </div>
      <div class="list-content">
        <div
          class="list-item"
          @click="itemClick(item, index)"
          v-for="(item, index) in list"
          :key="index"
        >
          <div class="production-name">
            {{ item.工序名稱 }}
          </div>
          <div class="content">
            <div class="content-left">
              <div class="data">
                {{ item.生產任務數 || 0 }}
                <div class="data-name">生產任務數</div>
              </div>
            </div>
            <div class="content-right">
              <div class="content-right-item">
                <div class="txt">計劃數</div>
                <span class="content-right-value">{{ item.計劃數 }}</span>
              </div>
              <div class="content-right-item">
                <div class="txt">良品數</div>
                <span class="content-right-value">{{ item.良品數 }}</span>
              </div>
              <div class="content-right-item">
                <div class="txt">不良品數</div>
                <span class="content-right-value">{{ item.不良品數 }}</span>
              </div>
            </div>
          </div>
          <div class="content-bottom">
            <div class="num-01">進度:</div>
            <div class="progress" :class="{ success: item.完成進度 >= 100 }">
              <el-progress :stroke-width="5" :percentage="item.完成進度" />
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  getCurrentInstance,
  onMounted,
  onUnmounted
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
const { proxy } = getCurrentInstance()

const searchValue = reactive({
  beginDate: null,
  endDate: null
})

//日期操作文檔：http://doc.volcore.xyz/web/%E6%97%A5%E6%9C%9F%E6%93%8D%E4%BD%9C.html
const dateNow = proxy.base.getDate()
searchValue.beginDate = proxy.base.addDays(dateNow, -90)
searchValue.endDate = dateNow

const list = reactive([])

list.push(
  ...[
    { 工序名稱: '装配', 生產任務數: 100, 計劃數: 90, 良品數: 85, 不良品數: 5, 完成進度: 100 },
    { 工序名稱: '加工', 生產任務數: 120, 計劃數: 110, 良品數: 105, 不良品數: 5, 完成進度: 60 },
    { 工序名稱: '包装', 生產任務數: 80, 計劃數: 70, 良品數: 65, 不良品數: 5, 完成進度: 92.86 },
    { 工序名稱: '清洗', 生產任務數: 90, 計劃數: 80, 良品數: 75, 不良品數: 5, 完成進度: 33.75 },
    { 工序名稱: '焊接', 生產任務數: 110, 計劃數: 100, 良品數: 95, 不良品數: 5, 完成進度: 50 },
    { 工序名稱: '涂装', 生產任務數: 85, 計劃數: 75, 良品數: 70, 不良品數: 5, 完成進度: 82.35 },
    { 工序名稱: '質檢', 生產任務數: 130, 計劃數: 120, 良品數: 115, 不良品數: 5, 完成進度: 100 },
    { 工序名稱: '打磨', 生產任務數: 95, 計劃數: 85, 良品數: 80, 不良品數: 5, 完成進度: 84.21 },
    { 工序名稱: '分揀', 生產任務數: 105, 計劃數: 95, 良品數: 90, 不良品數: 5, 完成進度: 55.71 },
    { 工序名稱: '噴漆', 生產任務數: 120, 計劃數: 110, 良品數: 105, 不良品數: 5, 完成進度: 77.5 },
    { 工序名稱: '组装', 生產任務數: 100, 計劃數: 90, 良品數: 85, 不良品數: 5, 完成進度: 25 },
    { 工序名稱: '清洗', 生產任務數: 105, 計劃數: 95, 良品數: 90, 不良品數: 5, 完成進度: 15.71 },
    { 工序名稱: '去油', 生產任務數: 125, 計劃數: 115, 良品數: 110, 不良品數: 5, 完成進度: 100 },
    { 工序名稱: '酸洗', 生產任務數: 130, 計劃數: 120, 良品數: 115, 不良品數: 5, 完成進度: 78.46 },
    { 工序名稱: '繞線', 生產任務數: 140, 計劃數: 130, 良品數: 125, 不良品數: 5, 完成進度: 89.29 }
  ]
)

const getData = (showMsg) => {
  ////從後台獲取數據
  const url = `api/表名/getData?beginDate=${searchValue.beginDate}&endDate=${searchValue.endDate}`
  // proxy.http.get(url,{},true).then((result) => {
     if(showMsg){
        proxy.$message.success('查詢成功')
     }
       
  //   list.splice(0)//清空數據    
  //   list.push(
  //     ...result.map((c) => {
  //       return { name: c.value, table: c.key, type: '審批' }
  //     })
  //   )
  // })
}
getData()

onMounted(() => {})
</script>
<style lang="less" scoped>
.list-container {
  position: absolute;
  height: 100%;
  width: 100%;
  background: #f3f7fb;
}
.list-content {
  height: 100%;
  padding: 15px 15px 0 15px;
  display: grid;
  -moz-column-gap: 12px;
  column-gap: 12px;
  //上面匯總顯示的數量
  grid-template-columns: repeat(5, auto);
}

.list-item {
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
  border-radius: 5px;
  height: 120px;
  overflow: hidden;
  border: 1px solid #eee;
  box-shadow: 4px 5px 10px 1px #f7f7f7;
  margin-bottom: 12px;
  .content {
    position: relative;

    display: flex;
    align-items: center;
    .content-left {
      flex: 1;
      color: #1d252f;
      padding: 0 20px;

      .el-icon-warning-outline {
        margin-right: 5px;
      }
    }
    .content-right {
      font-size: 13px;
      padding-right: 20px;
      .content-right-item {
        display: flex;
        align-items: center;
        line-height: 20px;
        .txt {
          width: 70px;
          text-align: right;
          color: #7d7d7d;
          padding-right: 8px;
        }
      }
    }
    .name {
      color: #7d7b7b;
      font-size: 14px;
      font-weight: 400;
      padding-bottom: 5px;
    }

    .data {
      font-size: 19px;
      font-family: Source Han Sans CN, sans-serif;
      color: #505050;
      font-weight: bold;
      letter-spacing: 1px;
      padding-top: 15px;
      .data-name {
        color: #272626;
        font-weight: 500;
        font-size: 14px;
      }
    }
  }
}
.content-bottom {
  align-items: center;
  display: flex;
  margin-top: 6px;
  padding: 10px 4px 0 20px;
  border-top: 1px solid #eee;
  ::v-deep(.el-progress-bar__inner) {
    background-image: linear-gradient(to right, #0fc8fe, #4768ff);
  }
  .success ::v-deep(.el-progress-bar__inner) {
    background-image: linear-gradient(to right, #64b804, #00b707);
  }

  .num-01 {
    margin-right: 5px;
    font-size: 13px;
    color: #837e7e;
  }
  .progress {
    flex: 1;
  }
}
.production-name {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 12px;
    padding: 2px 11px 3px;
    background: #cee9ff69;
    border-bottom-right-radius: 9px;
    color: #028fff;
    border-top-right-radius: 5px;
}

.search-content {
  margin: 15px 15px 0 15px;
  background: #fff;
  padding: 13px;
  label {
    font-size: 14px;
    color: #6a6565;
  }
  .mg-item,
  button {
    margin-left: 20px;
  }
}
</style>
