<template>
  <div
    id="vol-container"
    :class="['vol-theme-' + theme, layoutIsLeft() ? 'vol-layout-left' : '']"
  >
    <div class="vol-menu-side-left" v-if="layoutIsLeft()">
      <div @click="toggleLeft"><i class="el-icon-s-fold collapse-menu" /></div>
      <el-scrollbar style="height: 0; flex: 1">
        <div
          @click="menuDataClick(item, index)"
          :class="[navCurrentMenuId === item.id ? 'vol-menu-side-left-item-acitve' : '']"
          v-for="(item, index) in navMenuList"
          :key="index"
          class="vol-menu-side-left-item"
        >
          <i :class="item.icon"></i>
          <p>{{ $ts(item.name) }}</p>
        </div>
      </el-scrollbar>
    </div>
    <div class="vol-aside" :style="{ width: (isCollapse ? 63 : 200) + 'px' }">
      <div class="header">
        <div v-if="layoutIsLeft()">
          <span v-show="!isCollapse"> Vol.Pro開發框架</span>
        </div>
        <img v-show="!isCollapse" src="@/assets/imgs/logo.png" />
        <i @click="toggleLeft" class="el-icon-s-fold collapse-menu" />
      </div>
      <div class="vol-menu">
        <el-scrollbar style="height: 100%; flex: 1">
          <VolMenu
            :currentMenuId="currentMenuId"
            :on-select="onSelect"
            :enable="true"
            :open-select="false"
            :isCollapse="isCollapse"
            :list="menuData"
          ></VolMenu>
        </el-scrollbar>
      </div>
    </div>
    <div class="vol-container">
      <div class="vol-header">
        <!-- <div class="project-name">Vol.Pro開發框架企業版本(1.0)</div> -->
        <div class="header-text">
          <div
            class="h-link"
            v-if="layout == 'top'"
            style="flex-direction: row; justify-content: flex-start"
          >
            <a
              href="javascript:void(0)"
              :class="[navCurrentMenuId === item.id ? 'h-link-a-acitve' : '']"
              @click="menuDataClick(item, index)"
              v-for="(item, index) in navMenuList"
              :key="index"
            >
              <i :class="item.icon"></i> <span> {{ $ts(item.name) }}</span>
            </a>
          </div>

          <div class="h-link" style="flex-direction: row; justify-content: flex-start">
            <a
              href="javascript:void(0)"
              @click="to(item)"
              v-for="(item, index) in links"
              :key="index"
            >
              <i :class="item.icon"></i> <span> {{ item.text }}</span>
            </a>
          </div>
        </div>
        <div class="header-info">
          <div>
            <vol-menu-filter :on-select="onSelect"></vol-menu-filter>
          </div>
          <div class="h-link" style="margin-right: 5px" v-if="permissionInited">
            <service-select :color="color" v-if="$global.db"></service-select>
          </div>
          <div class="h-link" style="margin-right: 10px" v-if="permissionInited">
            <dept-select :color="color"></dept-select>
          </div>
          <div class="h-link" style="margin-right: 10px" v-if="permissionInited">
            <lang :color="color"></lang>
          </div>
          <!--消息管理-->
          <div class="h-link" @click="messageModel = true">
            <a><i class="el-icon-message-solid"></i></a>
          </div>
          <div class="user-header-info">
            <el-dropdown trigger="hover">
              <div class="user-header-content">
                <img
                  class="user-header-img"
                  :src="userImg"
                  @error="
                    ($e) => {
                      $e.target.src = errorImg;
                    }
                  "
                />
                <div class="user-header-content-right">
                  <div class="user-name">
                    {{ userName }}<i class="el-icon-arrow-down"></i>
                  </div>
                  <div id="index-date" class="index-date"></div>
                </div>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="(item, index) in userDropItems" :key="index">
                    <div @click="to(item)">
                      <i :class="item.icon"></i> {{ $ts(item.text) }}
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="vol-path">
        <el-tabs
          @tab-click="selectNav"
          @tab-remove="removeNav"
          @contextmenu.prevent="bindRightClickMenu(false)"
          type="border-card"
          class="header-navigation"
          v-model="selectId"
          :strtch="false"
        >
          <el-tab-pane
            v-for="(item, navIndex) in navigation"
            type="card"
            :name="navIndex + ''"
            :closable="navIndex > 0"
            :key="navIndex"
            :label="$ts(item.name)"
          >
            <span style="display: none">{{ navIndex }}</span>
          </el-tab-pane>
        </el-tabs>
        <!-- 右鍵菜單 -->
        <div v-show="contextMenuVisible">
          <ul :style="{ left: menuLeft + 'px', top: menuTop + 'px' }" class="contextMenu">
            <li v-show="visibleItem.all">
              <el-button link @click="closeTabs()">
                <i class="el-icon-close"></i>
                {{ $ts(navigation.length == 2 ? "關閉菜單" : "關閉所有") }}</el-button
              >
            </li>
            <li v-show="visibleItem.left">
              <el-button link @click="closeTabs('left')"
                ><i class="el-icon-back"></i>{{ $ts("關閉左邊") }}</el-button
              >
            </li>
            <li v-show="visibleItem.right">
              <el-button link @click="closeTabs('right')">
                <i class="el-icon-right"></i>{{ $ts("關閉右邊") }}</el-button
              >
            </li>
            <li v-show="visibleItem.other">
              <el-button link @click="closeTabs('other')"
                ><i class="el-icon-right"></i>{{ $ts("關閉其他") }}
              </el-button>
            </li>
            <li>
              <el-button link @click="refreshPage"
                ><i class="el-icon-refresh"></i>{{ $ts("刷新頁面") }}
              </el-button>
            </li>
          </ul>
        </div>
      </div>
      <div class="vol-main" id="vol-main">
        <el-scrollbar style="height: 100%" v-if="permissionInited">
          <loading v-show="$store.getters.isLoading()"></loading>
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component
                :is="Component"
                :key="$route.name + componentKey"
                v-if="
                  !$route.meta ||
                  ($route.meta && !$route.meta.hasOwnProperty('keepAlive'))
                "
              />
            </keep-alive>
            <component
              :is="Component"
              :key="$route.name"
              v-if="$route.meta && $route.meta.hasOwnProperty('keepAlive')"
            />
          </router-view>
        </el-scrollbar>
      </div>
    </div>
    <el-drawer
      :title="$ts('基礎設置')"
      size="360px"
      v-model="drawer_model"
      direction="rtl"
      destroy-on-close
    >
      <home-setting @layoutChange="layoutChange"></home-setting>
    </el-drawer>

    <el-drawer
      :title="$ts('消息列表')"
      v-model="messageModel"
      direction="rtl"
      destroy-on-close
    >
      <Message :list="messageList"></Message>
    </el-drawer>
  </div>
</template>
<style lang="less" scoped>
@import "./index/index.less";
@import "./index/aside.less";
</style>
<script>
import loading from "@/components/basic/RouterLoading.vue";
import VolMenu from "@/components/basic/VolElementMenu.vue";
import VolMenuFilter from "@/components/basic/VolMenuFilter.vue";
import Message from "./index/Message.vue";
import MessageConfig from "./index/MessageConfig.js";
import setting from "./index/Setting.vue";
import lang from "@/components/lang/lang.vue";
// var imgUrl =new URL('@/assets/imgs/default_header.png', import.meta.url).href;
var $interval;
import {
  defineComponent,
  reactive,
  ref,
  watch,
  onMounted,
  computed,
  getCurrentInstance,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import store from "../store/index";
import http from "@/../src/api/http.js";
import { color } from "echarts";
export default defineComponent({
  components: {
    VolMenu,
    VolMenuFilter,
    loading,
    Message,
    lang,
    "home-setting": setting,
  },

  data() {
    return {
      allTabs: true,
      leftTabs: true,
      rightTabs: true,
      otherTabs: true,
      menuLeft: 0,
      menuTop: 0,
      //  contextMenuVisible: false, // 右鍵關閉顯/隐
    };
  },
  setup(props, context) {
    // 獲取全局屬性和方法
    const { proxy } = getCurrentInstance();

    // 菜單導航默認寬度
    const menuWidth = ref(200);
    const contextMenuVisible = ref(false);
    const isCollapse = ref(false);
    const drawer_model = ref(false);
    const messageModel = ref(false);
    const layoutValue = ref("");

    const links = ref([
      //{ text: "框架文檔", path: "", id: -1, icon: "el-icon-document", left: true },
      {
        text: "App移動端",
        path: "http://v2.volcore.xyz/app/home",
        id: -1,
        icon: "el-icon-mobile",
        left: true,
      },
      // { text: "數據大屏", path: "#", id: -1, icon: "el-icon-monitor", left: true }
    ]);

    const userDropItems = reactive([
      {
        text: "個人中心",
        path: "/userInfo",
        id: -4,
        icon: "el-icon-user",
      },
      {
        text: "基礎設置",
        path: "#",
        id: -4,
        icon: "el-icon-mobile",
        click: () => {
          drawer_model.value = true;
        },
      },
      {
        text: "消息管理",
        path: "#",
        id: -4,
        icon: "el-icon-bell",
      },
      {
        text: "安全退出",
        path: "/login",
        id: -4,
        icon: "el-icon-switch-button",
      },
    ]);

    const color = ref("");
    const getColor = () => {
      console.log("1");
      color.value = layoutIsLeft() || theme.value == "dark" ? "#373636" : "#ffff";
    };
    const errorImg = ref(
      new URL("@/assets/imgs/default_header.png", import.meta.url).href
    );
    const selectId = ref("1");
    // 【首頁】標籤序號(當前右鍵選中的菜單)
    const selectMenuIndex = ref("0");
    //2022.05.29增加tab選項與菜單聯動功能
    const currentMenuId = ref(0);
    const userName = ref("--");
    const userInfo = ref({});
    const visibleItem = reactive({
      left: false,
      right: false,
      all: false,
      other: false,
    });
    const userImg = ref("@/assets/imgs/default_header.png");
    const navigation = reactive([{ orderNo: "0", id: "1", name: "首頁", path: "/home" }]);
    const theme = ref();
    theme.value = proxy.$global.theme || "";

    const menuOptions = ref([]);
    const permissionInited = ref(false);
    const messageList = reactive([]);
    let _config = getCurrentInstance().appContext.config.globalProperties;
    //appContext.config.globalProperties.$ts
    let $ts = proxy.$ts;
    const router = useRouter();
    const $route = useRoute();
    const toggleLeft = () => {
      isCollapse.value = !isCollapse.value;
      menuWidth.value = isCollapse.value ? 63 : 200;
    };
    //2021.08.28開放手動折叠菜單方法
    _config.menu = {
      show() {
        toggleLeft();
      },
      hide() {
        toggleLeft();
      },
    };
    const componentKey = ref("");
    const refreshPage = (routeName, _callback) => {
      // if ((routeName && typeof (routeName) == 'string')) {
      routeName = $route.name;
      //}
      componentKey.value = routeName + Date.now();

      router.replace({ ...$route });
      if (_callback && typeof _callback == "function") {
        setTimeout(() => {
          _callback();
        }, 300);
      }
    };
    const to = (item) => {
      if (item.text == "框架文檔") {
        proxy.$Message.success("企業版本框架文檔見群公告");
        return;
      }
      if (item.click) {
        item.click();
        return;
      }
      /* 2020.07.31增加手動打開tabs*/
      if (item.path.indexOf("http") != -1) {
        window.open(item.path);
        return;
      }
      if (typeof item == "string" || item.path == "/login") {
        if (item == "/login" || item.path == "/login") {
          store.commit("clearUserInfo", "");
          window.location.reload();
          return;
        }
        router.push({ path: item });
        return;
      }
      if (item.path == "#") return;
      open(item);
    };
    const isDynamicPage = (item) => {
      return router.getRoutes().some((x) => {
        return x.path == item.path && x.meta && x.meta.dynamic;
      });
    };
    const open = (item, useRoute) => {
      const dynamicPage = isDynamicPage(item);
      let _index = navigation.findIndex((x) => {
        if (dynamicPage) {
          return x.path == item.path && x.name == item.name;
        }
        return x.path == item.path;
      });
      let b = false;
      if (navigation[selectId * 1] && navigation[selectId * 1].path == item.path) {
        b = true;
        //同一個頁面不再跳轉
        if (navigation[_index].name == item.name) {
          return;
        }
      }
      //如果打開的是表單編輯設置tabs的標題
      setTabsName(item, _index);
      if (_index == -1) {
        navigation.push({
          //  orderNo: String(navigation.length),// 序號
          id: item.id + "",
          name: item.name || item.text || "無標題",
          path: item.path,
          query: item.query, //2021.03.20修複自定義二次打開$tabs時參數丢失的問題
        });
        //新打開的tab移至最後一個選項
        selectId.value = navigation.length - 1 + "";
      } else {
        navigation[_index].query = item.query;
        selectId.value = _index + "";
      }
      if (useRoute === undefined) {
        //非標准菜單，記錄最後一次跳轉的頁面，用於刷新
        setItem(item);
        router.push(item);
        // this.$router.push(item);
      }
      if (dynamicPage) {
        setTimeout(() => {
          refreshPage();
        }, 50);
        // return;
      }
      currentMenuId.value = item.id * 1;
      // tab菜單绑定右鍵事件
      proxy.$nextTick(function (e) {
        proxy.bindRightClickMenu(true);
      });
    };
    const close = (path) => {
      /* 2020.07.31增加手動打開tabs*/
      let index = navigation.findIndex((x) => {
        return x.path == path;
      });
      if (index == -1) {
        return _config.$Message.error("未找到菜單");
      }
      removeNav(index);
    };
    const setItem = (item) => {
      /* 2020.07.31增加手動打開tabs*/
      localStorage.setItem(window.location.origin + "_tabs", JSON.stringify(item));
    };

    const setTabsName = (item, _index) => {
      let routeOption = router.options.routes[0].children.find((x) => {
        return x.path == item.path;
      });
      if (!routeOption) {
        return;
      }
      if (routeOption.meta && routeOption.meta.name && routeOption.meta.edit) {
        if (!item.query) {
          item.query = {};
        }
        let _item = navigation.find((c) => {
          return c.path == item.path;
        });
        if (_item) {
          _item.query = item.query;
        }
        let id = _index == -1 ? router.currentRoute.value.query.id : item.query.id;
        if (!id) {
          id = item.query.id;
        }
        item.text = routeOption.meta.name; //+ (id ? '(' + $ts('編輯') + ')' : '(' + $ts('新建') + ')');
      }
      if (_index != -1) {
        navigation[_index].name = item.text || item.name;
      }
    };

    const getItem = () => {
      // /* 2020.07.31增加手動打開tabs*/
      // let nav = localStorage.getItem(window.location.origin + '_tabs');
      // return nav ? JSON.parse(nav) : null;
      /* 2020.07.31增加手動打開tabs*/
      // let nav = localStorage.getItem(window.location.origin + '_tabs');
      // return nav ? JSON.parse(nav) : null;
      let item =
        router.options.routes[0].children.find((x) => {
          return x.path == router.currentRoute.value.path;
        }) || {};
      //生成的編輯頁面tabs名稱
      if (item.meta && item.meta.name) {
        let name = item.meta.name;
        if (item.meta.edit) {
          name =
            proxy.$ts(name) +
            (router.currentRoute.value.query.id
              ? "(" + proxy.$ts("編輯") + ")"
              : "(" + proxy.$ts("新建") + ")");
        }
        item = {
          name: name,
          path: router.currentRoute.value.path,
          query: router.currentRoute.value.query,
        };
        return open(item, false);
      } else {
        let nav = localStorage.getItem(window.location.origin + "_tabs");
        return nav ? JSON.parse(nav) : null;
      }
      //  return null;
    };
    const selectNav = (item) => {
      //升级element正式版修改
      selectId.value = item.props.name;
      let _path = navigation[item.index].path;
      currentMenuId.value = (
        menuOptions.value.find((c) => {
          return c.path == _path;
        }) || { id: 0 }
      ).id;

      router.push({
        path: navigation[item.index].path,
        query: navigation[item.index].query,
      });
      if (isDynamicPage(navigation[item.index])) {
        setTimeout(() => {
          refreshPage(navigation[item.index]);
        }, 50);
      }
    };

    const removeNav = (_index) => {
      return new Promise(() => {
        //關閉的當前項,跳轉到前一個頁面
        if (selectId.value == _index + "") {
          console.log(navigation[_index - 1]);
          setItem(navigation[_index - 1]);
          router.push({
            path: navigation[_index - 1].path,
            //2022.06.27修複tabs二次切換後參數丢失的問題
            query: navigation[_index - 1].query,
          });
          navigation.splice(_index, 1);
          selectId.value = selectId.value - 1 + "";
          return;
        }
        if (_index < selectId.value) {
          selectId.value = selectId.value - 1 + "";
        }
        navigation.splice(_index, 1);
        currentMenuId.value = (
          menuOptions.value.find((c) => {
            return c.path == navigation[selectId.value * 1].path;
          }) || { id: 0 }
        ).id;
      });
    };

    const getSelectMenuName = (id) => {
      return menuOptions.value.find(function (x) {
        return x.id == id;
      });
    };
    const onSelect = (treeId) => {
      /* 2020.07.31增加手動打開tabs*/
      var item = getSelectMenuName(treeId);
      open(item, false);
    };

    /**
     * 顯示右鍵菜單
     * @param {*} e 事件對象
     */
    const openTabsMenu = function (e) {
      e.preventDefault(); // 防止默認菜單彈出
      let tabId = e.target.id.split("-")[1] * 1;

      //記錄當前選中的菜單index
      selectMenuIndex.value =
        document.getElementById("pane-" + tabId).children[0].textContent * 1;
      //只有首頁時不顯示
      if (navigation.length == 1) {
        return;
      }

      //首頁設置顯示關閉右邊菜單
      if (!selectMenuIndex.value) {
        visibleItem.all = false;
        visibleItem.right = true;
        visibleItem.left = false;
        visibleItem.other = false;
      } else {
        visibleItem.all = true;
        //不是最後一個顯示關閉右邊菜單
        visibleItem.right = selectMenuIndex.value != navigation.length - 1;
        //只有兩個菜單時不顯示關閉左邊
        visibleItem.left = navigation.length != 2;
        //只有兩個菜單時不顯示關閉其他
        visibleItem.other = navigation.length != 2;
      }
      contextMenuVisible.value = true;
      // 設置右鍵菜單顯示的位置
      proxy.menuLeft = e.target.getBoundingClientRect().left + 1; //- (isCollapse.value ? 63 : 198); //-e.target.clientWidth
      proxy.menuTop = e.target.getBoundingClientRect().top + e.target.clientHeight + 4;
    };

    /**
     * 關閉右鍵菜單
     */
    const closeTabsMenu = () => {
      contextMenuVisible.value = false;
    };
    const toHome = () => {
      open({
        text: navigation[0].name,
        path: navigation[0].path,
      });
    };
    /**
     * 關閉其它標籤頁
     * @param {*} par 關閉類型(left,right,other)
     */
    const closeTabs = (value) => {
      let _menuId = navigation[selectId.value * 1].id;
      let currnetIndex = selectId.value * 1; // navigation.findIndex(c => { return c.id == selectId.value });
      switch (value) {
        case "left": {
          // 删除左側tab標籤
          navigation.splice(1, currnetIndex - 1); // 删除左側tab標籤
          break;
        }
        case "right": {
          // 删除右側tab標籤
          if (selectMenuIndex.value == 0) {
            navigation.splice(currnetIndex); // 删除右側tab標籤
            toHome();
          } else {
            navigation.splice(currnetIndex + 1); // 删除右側tab標籤
            if (selectMenuIndex.value < currnetIndex) {
              navigation.splice(
                selectMenuIndex.value,
                currnetIndex - selectMenuIndex.value
              );
            }
          }
          break;
        }
        case "other": {
          // 删除其他所有tab標籤
          navigation.splice(currnetIndex + 1); // 删除右側tab標籤(這裡必須按照右→左順序删除)
          navigation.splice(1, currnetIndex - 1); // 删除左側tab標籤
          break;
        }
        default: {
          //關閉所有
          navigation.splice(1, navigation.length);
          toHome();
          break;
        }
      }
      selectId.value =
        navigation.findIndex((c) => {
          return c.id == _menuId;
        }) + "";
      closeTabsMenu();
    };

    watch(
      () => contextMenuVisible.value,
      (newVal, oldVal) => {
        // 监視
        if (newVal) {
          document.body.addEventListener("click", closeTabsMenu);
        } else {
          document.body.removeEventListener("click", closeTabsMenu);
        }
      }
    );
    const navMenuList = reactive([]);
    const menuData = reactive([]);

    const navKey = "nav:id";
    const navCurrentMenuId = ref(localStorage.getItem(navKey) * 1 || -1);
    const menuDataClick = (mItem, index) => {
      if (navCurrentMenuId.value === navMenuList[index].id) {
        return;
      }

      navCurrentMenuId.value = navMenuList[index].id;
      localStorage.setItem(navKey, navCurrentMenuId.value);
      menuData.splice(0);
      menuData.push(...navMenuList[index].children);
    };

    const layout = ref(null);
    layout.value = localStorage.getItem("vol-layout");
    if (!layout.value) {
      layout.value = proxy.$global.layout || "top";
    }
    const layoutChange = (layoutValue, themeValue) => {
      layout.value = layoutValue;
      theme.value = themeValue;
      getColor();
    };

    const layoutIsLeft = () => {
      return layout.value == "left";
    };

    // if (layoutIsLeft()) {
    //   theme.value = '';
    // }
    theme.value = localStorage.getItem("vol-theme");
    if (!theme.value) {
      if (layoutIsLeft()) {
        theme.value = proxy.$global.theme + "-aside";
      } else {
        theme.value = proxy.$global.theme;
      }
    }
    //  }
    /**
     * 系统創建開始
     */

    getColor();
    const created = () => {
      let _userInfo = store.getters.getUserInfo();
      if (_userInfo) {
        userName.value = _userInfo.userName;
        if (_userInfo.img) {
          userImg.value = _config.base.getImgSrc(_userInfo.img, http.ipAddress);
        }
      }
      Object.assign(_config.$tabs, { open: open, close: close, reload: refreshPage });

      http.get("api/menu/getTreeMenu", {}, true).then((result) => {
        let data = result.menu;
        //检測是否有權限顯示大屏跳轉鏈接(2023.11.05)
        //linkType=3大屏管理
        // if (data.some(x => { return x.linkType == 2 })) {
        //   data.forEach(x => {
        //     if (!x.parentId) {
        //       x.linkType = 2;
        //     }
        //   })
        // }
        let dataItem = data.find((x) => {
          return x.linkType == 3 && (!x.enable || x.enable == 1);
        });
        // console.log(dataItem)
        if (dataItem) {
          links.value.unshift({
            text: "大屏數據",
            icon: "el-icon-monitor",
            left: true,
            click: () => {
              proxy.http.getDataViewAccessToken({ view: 1 });
            },
          });
        }
        if (layout.value != "classics") {
          navMenuList.push(
            ...data.filter((c) => {
              return !c.parentId;
            })
          );
        }

        data.push({ id: "1", name: "首頁", url: "/home" }); // 為了獲取選中id使用
        data.forEach((d) => {
          if (d.url && d.url.indexOf("?") != -1) {
            let _arr = d.url.split("?");
            d.path = _arr[0];
            _arr = _arr[1].split("&");
            let queryObj = {};
            for (let i = 0; i < _arr.length; i++) {
              // 遍歷參數
              if (_arr[i].indexOf("=") != -1) {
                // 如果參數中有值
                let str = _arr[i].split("=");
                queryObj[str[0]] = str[1];
              }
            }
            d.query = queryObj;
          } else {
            d.path = d.url;
          }
          d.to = d.url;
          if (!d.icon) {
            //|| d.icon.substring(0, 3) != 'el-'
            d.icon = "el-icon-menu";
          }
        });
        store.dispatch("setPermission", data);

        store.commit("setServiceList", result.service);

        store.getters.data().deptList = result.deptList || [];

        //2023.08.03增加字段權限缓存
        store.getters.data().authFields = result.fields || [];

        if (navMenuList.length) {
          navMenuList.forEach((m) => {
            m.children = data.filter((c) => {
              return c.parentId == m.id;
            });
            m.children.forEach((c) => {
              c.parentId = 0;
            });
            for (let index = 0; index < m.children.length; index++) {
              const mItem = m.children[index];
              let mChildrenItems = data.filter((c) => {
                return c.parentId == mItem.id;
              });
              m.children.push(...mChildrenItems);
            }
          });
          let navMenuIndex = navMenuList.findIndex((c) => {
            return c.id === navCurrentMenuId.value;
          });
          if (navMenuIndex == -1) {
            navCurrentMenuId.value = navMenuList[0].id;
            menuData.push(...navMenuList[0].children);
          } else {
            menuData.push(...navMenuList[navMenuIndex].children);
          }
        } else {
          menuData.push(...data);
        }

        menuOptions.value = data;

        permissionInited.value = true;

        //開啟消息推送（main.js中設置是否開啟signalR）2022.05.05
        if (_config.$global.signalR) {
          MessageConfig(http, (result) => {
            messageList.unshift(result);
            //    console.log(result)
          });
        }

        //當前刷新是不是首頁
        if (router.currentRoute.value.path != navigation[0].path) {
          //查找系统菜單

          let item = menuOptions.value.find((x) => {
            return x.url && x.url == router.currentRoute.value.fullPath;
            // return x.path == router.currentRoute.value.path; //this.$route.path;
          });
          if (!item) {
            item = menuOptions.value.find((x) => {
              return x.path == router.currentRoute.value.path; //this.$route.path;
            });
          }
          if (item) return onSelect(item.id);
          //查找頂部快捷連接
          item = links.value.find((x) => {
            return x.path == router.currentRoute.value.path; //this.$route.path;
          });
          //查找最後一次跳轉的頁面
          if (!item) {
            item = getItem();
          }
          if (item) {
            return open(item, false);
          }
        }
        selectId.value = "1";
      });
    };

    created();

    return {
      componentKey,
      refreshPage,
      menuWidth,
      isCollapse,
      drawer_model,
      // theme_color,
      errorImg,
      userInfo,
      userName,
      userImg,
      selectId,
      selectMenuIndex,
      navigation,
      links,
      onSelect,
      openTabsMenu,
      selectNav,
      getSelectMenuName,
      removeNav,
      theme,
      menuOptions,
      permissionInited,
      to,
      toggleLeft,
      messageModel,
      messageList,
      contextMenuVisible,
      visibleItem,
      closeTabsMenu,
      closeTabs,
      currentMenuId,
      color,
      getColor,
      navMenuList,
      menuData,
      menuDataClick,
      navCurrentMenuId,
      userDropItems,
      layoutChange,
      layout,
      layoutIsLeft,
    };
  },
  /**
   * 挂載钩子函數
   */
  mounted() {
    week = new Array(
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
      "星期日"
    ).map((x) => {
      return this.$ts(x);
    });
    let _date = this.base.getDate(true);
    const $date = document.getElementById("index-date");
    $date.innerText = _date;
    $interval = setInterval(() => {
      $date.innerText = this.base.getDate(true);
    }, 1000);

    this.bindRightClickMenu(true);
  },

  methods: {
    /**
     * 绑定右鍵事件
     * @param {*} enable 是否啟用右鍵事件[true:啟用;false:禁用;]
     * @param {*} $event 事件
     */
    bindRightClickMenu(enable) {
      if (!enable) return;
      let that = this;
      // 使用原生js 為單個dom绑定鼠標右擊事件
      that.$nextTick(() => {
        let tab_top_dom = Object.assign(
          [],
          document.getElementsByClassName("el-tabs__item is-top")
        );
        tab_top_dom.forEach((item, index) => {
          item.oncontextmenu = that.openTabsMenu;
        });
      });
    },
  },

  /**
   * 銷毁钩子函數
   */
  destroyed() {
    clearInterval($interval);
  },
});
var week = [];
</script>

<style lang="less" scoped>
.vol-container .vol-path ::v-deep(.el-tabs__content) {
  padding: 0;
}

.project-name {
  // font-weight: bold;
  font-size: 1em;
  letter-spacing: 1px;
}

.contextMenu {
  width: 120px;
  margin: 0;
  border: 1px solid #eaeaea;
  background: #fff;
  z-index: 30000;
  position: fixed;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgb(182 182 182 / 20%);

  i,
  button {
    font-size: 14px !important;
  }
}

.contextMenu li {
  margin: 0;
  padding: 5px 10px;
}

.contextMenu li:hover {
  background: #fafafa;
  cursor: pointer;
}

.contextMenu li button {
  color: #626060;
  font-size: 14px;
  letter-spacing: 1px;
}

.el-tabs.el-tabs--top.el-tabs--border-card.header-navigation
  > .el-tabs__header
  .el-tabs__item:last-child,
.el-tabs--top.el-tabs--border-card.header-navigation
  > .el-tabs__header
  .el-tabs__item:nth-child(2) {
  padding: 0;
}

.header-navigation ::v-deep(.el-tabs__item.is-top) {
  padding: 0 15px;
}
</style>
<style>
.horizontal-collapse-transition {
  transition: 0s width ease-in-out, 0s padding-left ease-in-out,
    0s padding-right ease-in-out;
}
</style>
