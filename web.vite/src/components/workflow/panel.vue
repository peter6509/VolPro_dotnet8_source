<!-- 審核流程插件基於https://gitee.com/xiaoka2017/easy-flow修改-->
<!--感谢萌级小菜鸟 / easy-flow -->
<template>
  <div v-if="easyFlowVisible" class="flow-panel">
    <div style="display: flex; height: 100%; position: relative">
      <el-scrollbar style="height: 100%; border-right: 1px solid rgb(220, 227, 232)">
        <div style="width: 220px">
          <div class="ef-node-pmenu-item"><i class="el-icon-warning-outline"></i>基礎信息</div>
          <div :style="{'padding-left':$global.labelPosition=='top'?'0':'10px'}">
            <VolForm
              ref="form"
              labelPosition="top"
              style="padding: 10px 0"
              :label-width="180"
              :loadKey="true"
              :formFields="formFields"
              :formRules="formRules"
            ></VolForm>
          </div>

          <node-menu @addNode="addNode" ref="nodeMenu"></node-menu>
        </div>
      </el-scrollbar>
      <div class="tools">
        <el-button circle @click="zoomAdd"><i class="el-icon-zoom-in"></i></el-button>
        <el-button circle @click="zoomSub"><i class="el-icon-zoom-out"></i></el-button>
      </div>
      <div
        style="flex: 1"
        id="efContainer"
        ref="efContainer"
        class="container efContainer"
        v-flowDrag
      >
        <template :key="node.id" v-for="node in data.nodeList">
          <flow-node
            :id="node.id"
            @delNode="deleteNode(node.id)"
            :node="node"
            :activeElement="activeElement"
            @changeNodeSite="changeNodeSite"
            @nodeRightMenu="nodeRightMenu"
            @clickNode="clickNode"
          >
          </flow-node>
        </template>
        <!-- 给畫布一個默認的寬度和高度 -->
        <div style="position: absolute; top: 3000px; left: 4000px">&nbsp;</div>
      </div>
      <!-- 右側表單 -->
      <div style="width: 400px; border-left: 1px solid #dce3e8; background-color: #fbfbfb">
        <el-scrollbar style="height: 100%; padding-bottom: 10px">
          <flow-node-form
            @delNode="deleteNode"
            ref="nodeForm"
            @setLineLabel="setLineLabel"
            @repaintEverything="repaintEverything"
          ></flow-node-form>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { VueDraggableNext as draggable } from 'vue-draggable-next'
// import { jsPlumb } from 'jsplumb'
// 使用修改後的jsplumb
import './jsplumb'
import { easyFlowMixin } from './mixins'
import flowNode from './node'
import nodeMenu from './node_menu'
import FlowNodeForm from './node_form'
import lodash from 'lodash'
// import { getDataA } from './data_A'
import VolForm from '@/components/basic/VolForm.vue'
export default {
  data() {
    return {
      formFields: {
        WorkName: '',
        WorkTable: '',
        WorkTableName: '',
        Weight: 1,
        AuditingEdit: 0,
        Remark: ''
      },
      formRules: [
        [
          {
            dataKey: '流程名稱',
            title: '流程名稱',
            field: 'WorkName',
            required: true
          }
        ],
        [
          {
            dataKey: '',
            title: '流程實例',
            required: true,
            field: 'WorkTable',
            data: [],
            readonly: false,
            type: 'select',
            onChange: (value, item) => {
              this.formRules.forEach((options) => {
                options.forEach((option) => {
                  if (option.field == 'WorkTable') {
                    this.formFields.WorkTableName = option.data.find((x) => {
                      return x.key == value
                    }).value
                  }
                })
              })
            }
          }
        ],
        [
          {
            title: '權重(相同條件權重大優先)',
            field: 'Weight',
            type: 'number'
          }
        ],

        [
          {
            title: '同步更新審批業務數據',
            field: 'AuditingEdit',
            type: 'switch',
            data: [
              { key: 0, value: '否' },
              { key: 1, value: '是' }
            ]
          }
        ],
        [
          {
            title: '備註',
            field: 'Remark'
          }
        ]
      ],
      // jsPlumb 實例
      jsPlumb: null,
      // 控制畫布銷毁
      easyFlowVisible: true,
      // 是否加載完毕標志位
      loadEasyFlowFinish: false,
      // 數據
      data: {},
      // 激活的元素、可能是節點、可能是連線
      activeElement: {
        // 可選值 node 、line
        type: undefined,
        // 節點ID
        nodeId: undefined,
        // 連線ID
        sourceId: undefined,
        targetId: undefined
      },
      zoom: 1
    }
  },
  // 一些基礎配置移動该文件中
  mixins: [easyFlowMixin],
  components: {
    draggable,
    flowNode,
    nodeMenu,
    FlowNodeForm,
    VolForm
  },
  directives: {
    flowDrag: {
      mounted(el, binding, vnode, oldNode) {
        if (!binding) {
          return
        }
        el.onmousedown = (e) => {
          if (e.button == 2) {
            // 右鍵不管
            return
          }
          //  鼠標按下，計算當前原始距離可視區的高度
          let disX = e.clientX
          let disY = e.clientY
          el.style.cursor = 'move'

          document.onmousemove = function (e) {
            // 移動時禁止默認事件
            e.preventDefault()
            const left = e.clientX - disX
            disX = e.clientX
            el.scrollLeft += -left

            const top = e.clientY - disY
            disY = e.clientY
            el.scrollTop += -top
          }

          document.onmouseup = function (e) {
            el.style.cursor = 'auto'
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  },
  mounted() {
    this.jsPlumb = jsPlumb.getInstance()
    // this.$nextTick(() => {
    //     // 默認加載流程A的數據、在這裡可以根據具體的業務返回符合流程數據格式的數據即可
    //     this.dataReload(getDataA())
    // })
  },
  created() {
    this.http.get('api/Sys_WorkFlow/getTableInfo').then((result) => {
      this.formRules.forEach((options) => {
        options.forEach((option) => {
          if (option.field == 'WorkTable') {
            option.data = result
          }
        })
      })
    })
    this.$store.getters.data().flowTable = this.formFields
  },
  methods: {
    // 返回唯一標識
    getUUID() {
      return Math.random().toString(36).substr(3, 10)
    },
    jsPlumbInit() {
      this.jsPlumb.ready(() => {
        // 導入默認配置
        this.jsPlumb.importDefaults(this.jsplumbSetting)
        // 會使整個jsPlumb立即重繪。
        this.jsPlumb.setSuspendDrawing(false, true)
        // 初始化節點
        this.loadEasyFlow()
        // 單點擊了連接線, https://www.cnblogs.com/ysx215/p/7615677.html
        this.jsPlumb.bind('click', (conn, originalEvent) => {
          this.activeElement.type = 'line'
          this.activeElement.sourceId = conn.sourceId
          this.activeElement.targetId = conn.targetId
          this.$refs.nodeForm.lineInit({
            from: conn.sourceId,
            to: conn.targetId,
            label: conn.getLabel()
          })
          this.deleteElement()
        })
        // 連線
        this.jsPlumb.bind('connection', (evt) => {
          let from = evt.source.id
          let to = evt.target.id
          if (this.loadEasyFlowFinish) {
            this.data.lineList.push({ from: from, to: to })
          }
        })

        // 删除連線回調
        this.jsPlumb.bind('connectionDetached', (evt) => {
          this.deleteLine(evt.sourceId, evt.targetId)
        })

        // 改變線的連接節點
        this.jsPlumb.bind('connectionMoved', (evt) => {
          this.changeLine(evt.originalSourceId, evt.originalTargetId)
        })

        // 連線右擊
        this.jsPlumb.bind('contextmenu', (evt) => {
          console.log('contextmenu', evt)
        })

        // 連線
        this.jsPlumb.bind('beforeDrop', (evt) => {
          let from = evt.sourceId
          let to = evt.targetId
          if (from === to) {
            this.$message.error('節點不支持連接自己')
            return false
          }
          if (this.hasLine(from, to)) {
            this.$message.error('该關系已存在,不允許重複創建')
            return false
          }
          if (this.hashOppositeLine(from, to)) {
            this.$message.error('不支持兩個節點之間連線回環')
            return false
          }
          this.$message.success('連接成功')
          setTimeout(() => {
            this.setLineLabel(from, to, 'x')
          }, 50)
          return true
        })

        // beforeDetach
        this.jsPlumb.bind('beforeDetach', (evt) => {
          console.log('beforeDetach', evt)
        })
        this.jsPlumb.setContainer(this.$refs.efContainer)
      })
    },
    // 加載流程圖
    loadEasyFlow() {
      // 初始化節點
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i]
        // 設置源點，可以拖出線連接其他節點
        this.jsPlumb.makeSource(node.id, lodash.merge(this.jsplumbSourceOptions, {}))
        // // 設置目標點，其他源點拖出的線可以連接该節點
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
        if (!node.viewOnly) {
          this.jsPlumb.draggable(node.id, {
            containment: 'parent',
            stop: function (el) {
              // 拖拽節點结束後的對調
              console.log('拖拽结束: ', el)
            }
          })
        }
      }
      // 初始化連線
      for (var i = 0; i < this.data.lineList.length; i++) {
        let line = this.data.lineList[i]
        var connParam = {
          source: line.from,
          target: line.to,
          label: line.label ? line.label : 'x',
          connector: line.connector ? line.connector : '',
          anchors: line.anchors ? line.anchors : undefined,

          paintStyle: line.paintStyle ? line.paintStyle : undefined
        }
        this.jsPlumb.connect(connParam, this.jsplumbConnectOptions)
      }
      this.$nextTick(function () {
        this.loadEasyFlowFinish = true
      })
    },
    // 設置連線條件
    setLineLabel(from, to, label) {
      var conn = this.jsPlumb.getConnections({
        source: from,
        target: to
      })[0]
      if (!label || label === '') {
        conn.removeClass('flowLabel ')
        conn.addClass('emptyFlowLabel')
      } else {
        conn.addClass('flowLabel')
      }
      conn.setLabel({
        label: 'x' //label,
      })
      this.data.lineList.forEach(function (line) {
        if (line.from == from && line.to == to) {
          line.label = 'x' // label
        }
      })
    },
    // 删除激活的元素
    deleteElement() {
      if (this.activeElement.type === 'node') {
        this.deleteNode(this.activeElement.nodeId)
      } else if (this.activeElement.type === 'line') {
        this.$confirm('確定删除所點擊的線吗?', '提示', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            var conn = this.jsPlumb.getConnections({
              source: this.activeElement.sourceId,
              target: this.activeElement.targetId
            })[0]
            this.jsPlumb.deleteConnection(conn)
          })
          .catch(() => {})
      }
    },
    // 删除線
    deleteLine(from, to) {
      this.data.lineList = this.data.lineList.filter(function (line) {
        if (line.from == from && line.to == to) {
          return false
        }
        return true
      })
    },
    // 改變連線
    changeLine(oldFrom, oldTo) {
      this.deleteLine(oldFrom, oldTo)
    },
    // 改變節點的位置
    changeNodeSite(data) {
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i]
        if (node.id === data.nodeId) {
          node.left = data.left
          node.top = data.top
        }
      }
    },
    /**
     * 拖拽结束後添加新的節點
     * @param evt
     * @param nodeMenu 被添加的節點對象
     * @param mousePosition 鼠標拖拽结束的坐標
     */
    addNode(evt, nodeMenu, mousePosition) {
      if (
        nodeMenu.type == 'start' &&
        this.data.nodeList.some((x) => {
          return x.type == 'start'
        })
      ) {
        this.$message.error('【流程结束】節點已存在,只有選擇一個流程開始節點')
        return
      }
      if (
        nodeMenu.type == 'end' &&
        this.data.nodeList.some((x) => {
          return x.type == 'end'
        })
      ) {
        this.$message.error('【流程结束】節點已存在,只有選擇一個流程開始節點')
        return
      }
      var screenX = evt.originalEvent.clientX,
        screenY = evt.originalEvent.clientY
      let efContainer = this.$refs.efContainer
      var containerRect = efContainer.getBoundingClientRect()
      var left = screenX,
        top = screenY
      // 計算是否拖入到容器中
      if (
        left < containerRect.x ||
        left > containerRect.width + containerRect.x ||
        top < containerRect.y ||
        containerRect.y > containerRect.y + containerRect.height
      ) {
        this.$message.error('請把節點拖入到畫布中')
        return
      }
      left = left - containerRect.x + efContainer.scrollLeft
      top = top - containerRect.y + efContainer.scrollTop
      // 居中
      left -= 85
      top -= 16
      var nodeId = this.getUUID()
      // 動態生成名字
      var origName = nodeMenu.name
      var nodeName = origName
      var index = 1
      while (index < 10000) {
        var repeat = false
        for (var i = 0; i < this.data.nodeList.length; i++) {
          let node = this.data.nodeList[i]
          if (node.name === nodeName) {
            nodeName = origName + index
            repeat = true
          }
        }
        if (repeat) {
          index++
          continue
        }
        break
      }
      var node = {
        id: nodeId,
        name: nodeName,
        type: nodeMenu.type,
        left: left + 'px',
        top: top + 'px',
        ico: nodeMenu.ico,
        state: 'success'
      }
      /**
       * 這裡可以進行業務判斷、是否能够添加该節點
       */
      this.data.nodeList.push(node)
      this.$nextTick(function () {
        this.jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions)
        this.jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions)
        this.jsPlumb.draggable(nodeId, {
          containment: 'parent',
          stop: function (el) {
            // 拖拽節點结束後的對調
            console.log('拖拽结束: ', el)
          }
        })
      })
    },
    /**
     * 删除節點
     * @param nodeId 被删除節點的ID
     */
    deleteNode(nodeId) {
      this.$confirm('確定要删除節點' + nodeId + '?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          /**
           * 這裡需要進行業務判斷，是否可以删除
           */
          this.data.nodeList = this.data.nodeList.filter(function (node) {
            if (node.id === nodeId) {
              // 伪删除，將節點隐藏，否則會導致位置错位
              // node.show = false
              return false
            }
            return true
          })
          this.$nextTick(function () {
            this.jsPlumb.removeAllEndpoints(nodeId)
          })
        })
        .catch(() => {})
      return true
    },
    clickNode(nodeId) {
      this.activeElement.type = 'node'
      this.activeElement.nodeId = nodeId
      this.$refs.nodeForm.nodeInit(this.data, nodeId, this.formFields.WorkTable)
    },
    // 是否具有该線
    hasLine(from, to) {
      for (var i = 0; i < this.data.lineList.length; i++) {
        var line = this.data.lineList[i]
        if (line.from === from && line.to === to) {
          return true
        }
      }
      return false
    },
    // 是否含有相反的線
    hashOppositeLine(from, to) {
      return this.hasLine(to, from)
    },
    nodeRightMenu(nodeId, evt) {
      this.menu.show = true
      this.menu.curNodeId = nodeId
      this.menu.left = evt.x + 'px'
      this.menu.top = evt.y + 'px'
    },
    repaintEverything(node) {
      let _node = this.data.nodeList.find((x) => {
        return x.id == node.id
      })
      Object.assign(_node, node)
      console.log(_node)
      this.jsPlumb.repaint()
    },
    // 加載流程圖
    dataReload(data, isAdd) {
      this.easyFlowVisible = false
      this.data.nodeList = []
      this.data.lineList = []
      this.$nextTick(() => {
        data = lodash.cloneDeep(data)
        this.easyFlowVisible = true
        this.data = data
        this.$nextTick(() => {
          this.jsPlumb = jsPlumb.getInstance()
          this.$nextTick(() => {
            this.jsPlumbInit()
          })
        })
      })
      this.formRules.forEach((options) => {
        options.forEach((option) => {
          if (option.field == 'WorkTable') {
            option.readonly = !isAdd
          }
        })
      })
    },
    zoomAdd() {
      if (this.zoom >= 1) {
        return
      }
      this.zoom = this.zoom + 0.1
      this.$refs.efContainer.style.zoom = this.zoom
      // this.jsPlumb.setZoom(this.zoom)
    },
    zoomSub() {
      if (this.zoom <= 0) {
        return
      }
      this.zoom = this.zoom - 0.1
      if (this.zoom < 0.3) {
        this.zoom = 0.3
      }
      this.$refs.efContainer.style.zoom = this.zoom
      // this.jsPlumb.setZoom(this.zoom)
    }
  }
}
</script>
<style scoped lang="less">
@import './index.css';
.ef-node-pmenu-item {
  padding: 10px;
  background: #f8f8f8;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  border-right: 1px solid #eee;
}

.flow-panel {
  position: absolute;
  height: 100%;
  width: 100%;
}

.flow-panel ::v-deep(.el-form-item__label) {
  margin-bottom: -2px !important;
  text-align: left;
  padding: 0 !important;
  justify-content: flex-start;
}

.flow-panel ::v-deep(.el-form-item) {
  display: flex;
  flex-direction: column;
  margin-bottom: 7px !important;
}

.ef-node-menu-form {
  padding: 0px;
}

::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

::-webkit-scrollbar-thumb {
  border-radius: 0px;
  background: #e0e3e7;
  height: 20px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
