<template>
  <div class="menu-container">
    <!-- <el-input/> -->
    <vol-box :width="940" :mask="true" :height="500" title="圖標列表" v-model="model">
      <Icons :onSelect="onSelect"></Icons>
      <template #footer>
        <el-button type="primary" @click="model = false">確 認</el-button>
      </template>
    </vol-box>
    <vol-box :width="600" :mask="true" :height="270" title="其他權限" v-model="actionModel">
      <vol-form ref="actionForm" :formRules="actionOptions" :formFields="actionFields">
        <template #header>
          <div>
            <el-alert show-icon type="success">
              配置的其他權限
              <br />1、添加新的權限後請在vue項目中config文件夾下buttns.js添加此權限的按鈕。
              <br />2、如果權限只在某少數幾個功能中使用,在vue的對應頁面擴展extension文件找到對應js,添加到el-buttons對象中,格式同config文件夾下buttns.js一樣。
            </el-alert>
          </div>
        </template>
      </vol-form>
      <template #footer>
        <el-button type="primary" @click="otherAction">確 認</el-button>
      </template>
    </vol-box>

    <!-- v-if="tree.length" -->
    <div class="menu-left">
      <div class="m-title"><i class="el-icon-warning-outline"></i>菜單列表</div>
      <el-scrollbar style="height: 100%; width: 200px">
        <VolMenu :onSelect="getTreeItem" :list="tree" :isCollapse="false"></VolMenu>
      </el-scrollbar>
    </div>
    <div class="menu-right">
      <el-scrollbar style="height: 100%">
        <el-alert title="菜單配置說明" type="warning" :closable="false" show-icon>
          <div>
            1、如果是用代碼生器生成的Vue頁面,Url為Vue項目中src->router->viewGrid.js對應表名的path屬性
          </div>
          <div style="padding-top: 5px">
            2、 如果只是建一级菜單或空菜單url不用填寫,【視圖/表名】填寫.或者/
          </div>
        </el-alert>
        <div style="padding: 0px 30px 0 20px; margin-top: 15px" class="form-content">
          <vol-form ref="form" :formRules="options" :formFields="fields"> </vol-form>
          <div style="padding: 5px 21px">
            <div style="padding-bottom: 10px; color: #737272; font-size: 14px">
              <label style="width: 100px">權限按鈕</label>
            </div>
            <div class="auth-group">
              <div class="ck">
                <el-checkbox-group v-model="actions">
                  <el-checkbox v-for="(item, index) in action" :key="index" :label="item.value"
                    ><span style="top: -2px; position: relative">{{
                      item.text + '(' + item.value + ')'
                    }}</span></el-checkbox
                  >
                </el-checkbox-group>
              </div>
            </div>
          </div>
          <div style="padding-left: 100px">
            <el-button @click="handleCheckAll" type="success" plain
              ><i class="el-icon-check"></i>全 選</el-button
            >
            <el-button @click="actionModel = true" type="primary" plain
              ><i class="el-icon-plus"></i>其他權限</el-button
            >
          </div>
          <div class="m-btn">
            <el-button type="primary" @click="save"><i class="el-icon-check"></i>保存</el-button>
            <el-button type="success" @click="add"><i class="el-icon-plus"></i>新建</el-button>
            <el-button type="warning" @click="addChild"
              ><i class="el-icon-plus"></i>添加子级</el-button
            >
            <el-button type="primary" plain @click="addBrother"
              ><i class="el-icon-circle-plus"></i> 添加同级</el-button
            >
            <el-button type="warning" plain @click="delMenu"
              ><i class="el-icon-delete"></i> 删除菜單</el-button
            >
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script lang="jsx">
import VolForm from '@/components/basic/VolForm.vue'
import VolBox from '@/components/basic/VolBox.vue'
import Icons from '@/components/basic/Icons.vue'
import VolMenu from '@/components/basic/VolElementMenu.vue'
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  onMounted,
  h,
  getCurrentInstance,
  resolveComponent
} from 'vue'

import http from '@/api/http'
export default defineComponent({
  components: {
    VolForm: VolForm,
    VolBox: VolBox,
    Icons: Icons,
    VolMenu
  },
  methods: {
    otherAction() {
      this.$refs.actionForm.validate(() => {
        let exist = this.action.some((x) => {
          return x.text == this.actionFields.name || x.value == this.actionFields.value
        })
        if (exist) {
          return this.$message.error('權限名稱或權限值已存在')
        }
        this.actionModel = false
        this.action.push({
          text: this.actionFields.name,
          value: this.actionFields.value
        })
      })
    },
    handleCheckAll() {
      if (this.actions == this.action.length) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      if (this.checkAll) {
        this.actions = this.action.map((x) => {
          return x.value
        })
      } else {
        this.actions = []
      }
    },
    checkAllGroupChange(data) {
      if (data.length === this.action.length) {
        this.checkAll = true
      } else if (data.length > 0) {
        this.checkAll = false
      } else {
        this.checkAll = false
      }
    },
    add(obj) {
      this.$refs.form.reset(Object.assign({ enable: 1 }, obj || { parentId: 0 }))
      this.icon = ''
      // this.actions = [];
      //2020.08.07新建菜單時，默認選中查詢按鈕權限
      this.actions = ['Search']
    },
    addChild() {
      if (!this.isSelect()) return
      this.add({ parentId: this.fields.menu_Id })
    },
    addBrother() {
      if (!this.isSelect()) return
      this.add({ parentId: this.fields.parentId })
    },
    delMenu() {
      //2020.08.07增加菜單删除功能
      if (this.fields.menu_Id == 0) {
        return this.$Message.error('請選擇菜單')
      }

      let tigger = false
      this.$confirm('確認要删除【' + this.fields.menuName + '】菜單吗？', '警告', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        if (tigger) return
        tigger = true
        let menuId = this.fields.menu_Id
        this.http.post('/api/menu/delMenu?menuId=' + menuId, {}, '正在删除數據....').then((x) => {
          if (!x.status) return this.$Message.error(x.message)
          this.$refs.form.reset()
          this.$Message.info(x.message)
          this.initTree()
        })
      })
    },
    save() {
      this.$refs.form.validate(() => {
        this.fields.auth = ''
        if (this.actions) {
          this.fields.auth = this.action.filter((x) => {
            return this.actions.indexOf(x.value) != -1
          })
        }
        if (this.fields.auth && this.fields.auth instanceof Array && this.fields.auth.length > 0) {
          this.fields.auth = JSON.stringify(this.fields.auth)
        } else {
          this.fields.auth = ''
        }

        const fields= Object.assign({},this.fields);
        if (Array.isArray(fields.icon)) {
          fields.icon=fields.icon.map(x=>{return x.path}).join(',')
        }

        this.http.post('/api/menu/save', fields, true).then((x) => {
          if (!x.status) {
            this.$Message.error(x.message)
            return
          }

          this.$Message.info(x.message)
          if (this.fields.menu_Id) {
            this.tree.forEach((t) => {
              if (t.id == this.fields.menu_Id) {
                t.name = this.fields.menuName
                t.orderNo = this.fields.orderNo
                t.parentId = this.fields.parentId
              }
            })
            return
          }
          this.fields.menu_Id = x.data.menu_Id
          this.fields.createDate = x.data.createDate
          this.tree.push({
            id: x.data.menu_Id,
            name: this.fields.menuName,
            orderNo: this.fields.orderNo,
            parentId: this.fields.parentId
          })
        })
      })
    },
    isSelect() {
      let id = this.fields.menu_Id
      if (!id) {
        this.$message.error('請選擇節點')
        return false
      }
      return true
    },
    onSelect(icon) {
      this.fields.icon = icon
      this.$message.info(icon)
    },
    onOpenChange(node) {
      if (node.length == 0) return
      this.getTreeItem(node[node.length > 1 ? node.length - 1 : 0])
    }
  },
  setup() {
    const { proxy } = getCurrentInstance()
    const tree = ref([])
    const actionValues = ref([])
    const action = ref([
      { text: '查詢', value: 'Search' },
      { text: '新建', value: 'Add' },
      { text: '删除', value: 'Delete' },
      { text: '編輯', value: 'Update' },
      { text: '複製', value: 'CopyData' },
      { text: '導入', value: 'Import' },
      { text: '導出', value: 'Export' },
      { text: '上傳', value: 'Upload' },
      { text: '審核', value: 'Audit' },
      { text: '反審', value: 'AntiAudit' },
      { text: '打印', value: 'Print' }
    ])
    const len = action.value.length
    const actions = ref([])
    actionValues.value = action.value.map((x) => {
      return x.value
    })
    const initTree = () => {
      http.post('/api/menu/getMenu', {}, true).then((x) => {
        x.forEach((item) => {
          item.icon = item.icon || 'el-icon-menu'
          if (item.menuType == 1 && !item.parentId) {
            item.name = '(app)' + item.name
          }
        })
        tree.value = x
      })
    }
    onMounted(() => {
      initTree()
    })
    const actionModel = ref(false)
    const checkAll = ref(false)
    const model = ref(false)

    const fields = ref({
      menu_Id: 0,
      parentId: 0,
      menuName: '',
      tableName: '',
      url: '',
      auth: '',
      icon: '',
      orderNo: 0,
      enable: 1,
      menuType: null,
      createDate: '',
      creator: '',
      modifyDate: '',
      authData: null,
      linkType: 0
    })

    const actionFields = ref({
      name: '',
      value: ''
    })
    const actionOptions = ref([
      [
        {
          title: '權限名稱',
          field: 'name',
          placeholder: '權限名稱,如：新增',
          required: true
        }
      ],
      [
        {
          title: '權 限 值',
          field: 'value',
          placeholder: '權限值,如：Add',
          required: true
        }
      ]
    ])


    const options = ref([
      [
        {
          title: '菜 單 ID',
          field: 'menu_Id',
          placeholder: '菜單ID',
          min: 0,
          disabled: true
        },
        {
          title: '父 级 ID',
          required: true,
          type: 'number',
          min: 0,
          field: 'parentId'
          // min: 0, max: 50
        },
        {
          title: '菜單名稱',
          field: 'menuName',
          required: true
        }
      ],
      [
        {
          title: '視圖/表名',
          field: 'tableName',
          placeholder: '與代碼生成器使用的名稱相同',
          required: true
        },
        {
          title: '(路由)Url',
          field: 'url',
          placeholder: '見:上面菜單配置說明'
        },
        {
          title: '排序號',
          field: 'orderNo',
          type: 'number',
          min: 0,
          placeholder: '值越大顯示越靠前',
          required: true
        }
      ],
      [
        {
          title: '是否啟用',
          field: 'enable',
          required: true,
          type: 'select',
          colSize: 4,
          data: [
            { key: 1, value: '啟用' },
            { key: 2, value: '啟用不顯示' },
            { key: 0, value: '禁用' }
          ]
        },
        {
          // 2022.03.26增移動端加菜單類型
          title: '菜單類型',
          field: 'menuType',
          required: true,
          type: 'select',
          colSize: 4,
          data: [
            { key: 0, value: 'PC菜單' },
            { key: 1, value: '移動端菜單' }
          ],
          onChange: (value) => {
            iconChange(value)
          }
        },
        {
          // 2022.03.26增移動端加菜單類型
          title: '鏈接類型',
          field: 'linkType',
          required: false,
          type: 'select',
          colSize: 4,
          data: [],
          datKey: 'enable',
          data: [
            { key: 0, value: '請選擇' },
            { key: 2, value: '一级分類菜單(首頁導航菜單)' },
            { key: 1, value: '外部url鏈接' },
            { key: 3, value: '大屏設計(看板設計頁面)' },
            { key: 4, value: '大屏列表(實際大屏頁面)' }
          ]
        }
      ],
      [
        {
          title: '圖標Icon',
          field: 'icon',
          type: 'img',
          url:"api/sys_user/upload"
        }
      ]
    ])
    const refForm = ref()
    const getTreeItem = (node) => {
      http.post('api/menu/getTreeItem?menuId=' + node, {}, true).then((x) => {
        try {
          fields.value.icon = x.icon
          iconChange(x.menuType)
          if (x.auth) {
            x.auth = JSON.parse(x.auth)
            action.value.splice(len, 100)

            actions.value = x.auth.map((element) => {
              if (actionValues.value.indexOf(element.value) == -1) {
                action.value.push(element)
              }
              return element.value
            })
          } else {
            action.value.splice(20, action.value.length)
            x.auth = []
            fields.value.icon = ''
            actions.value = []
          }
        } catch (error) {
          console.log('菜單功能權限轉換成JSON失敗:' + x.auth)
          x.auth = []
          //   this.icon = "";
          actions.value = []
        }
        refForm.value.reset(x)
      })
    }

    
    const iconChange = (value) => {
      if (value === 0) {
        options.value[options.value.length - 1][0].render = (h) => {
          return (
            <div>
              <el-button
                type="primary"
                plain
                onClick={() => {
                  model.value = true
                }}
              >
                選擇圖標
              </el-button>
              <i
                style="font-size:25px;margin-left:10px;position:relative;top:4px"
                class={fields.value.icon}
              ></i>
            </div>
          )
        }
        fields.value.icon=[];
      } else {
        fields.value.icon='';
        options.value[options.value.length - 1][0].render = null
      }
    }
    iconChange(0)
    return {
      tree,
      initTree,
      action,
      actions,
      actionValues,
      actionModel,
      checkAll,
      model,
      fields,
      actionFields,
      actionOptions,
      options,
      form: refForm,
      getTreeItem
    }
  },
  data() {
    return {}
  }
})
</script>

<style lang="less" scoped>
.on-icon {
  line-height: 20px;
  position: relative;

  .remove {
    display: none;
    color: red;
    right: 7px;
    position: absolute;
    top: -14px;
    font-size: 13px;
  }
}

.on-icon:hover {
  cursor: pointer;

  .remove {
    display: block;
  }
}

.action {
  width: 100%;
  display: flex;

  margin-bottom: 15px;

  .ivu-checkbox-wrapper {
    margin-right: 20px;
  }

  .ck {
    line-height: 33px;
    display: inline-block;
    display: flex;

    label:first-child {
      min-width: 58px;
      float: left;
      margin-top: 1px;
    }

    > div {
      float: left;
    }
  }
}

.menu-container {
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 8px;
  background: #f7f7f7;

  .menu-left {
    height: 100%;
    width: 201px;
    border: 1px solid #eee;
    display: flex;
    background: white;
    flex-direction: column;

    .module-name {
      border-radius: 0px;
      /* height: 5%; */
      line-height: 21px;
      margin-bottom: 0;
    }
  }

  .menu-right {
    flex: 1;
    border-radius: 3px;
    border: 1px solid #eee;
    background: white;
    margin-left: 9px;
    margin-right: 3px;
  }
}

.m-btn {
  margin-top: 20px;
  text-align: center;
}

.m-title {
  line-height: 40px;
  font-size: 15px;
  background: #66b1ff0f;
  font-weight: bold;
  padding: 6px 16px;
  border-bottom: 1px solid #eee;

  i {
    padding-right: 5px;
  }
}

.form-content {
  margin-top: 30px;
}

.menu-left ::v-deep(.el-scrollbar__bar.is-vertical) {
  width: 2px;
}

.auth-group {
  display: flex;

  label {
    display: inline-block;
    width: 100px;
    // text-align: right;
    color: #797979;
    font-size: 14px;
  }

  .ck {
    flex: 1;
  }

  .el-checkbox {
    min-width: 105px;
    width: auto !important;
    margin-right: 5px;
    display: inline-block;
    padding-bottom: 10px;
  }
}

.auth-group ::v-deep(.el-checkbox__label) {
  padding-left: 4px;
}
</style>
