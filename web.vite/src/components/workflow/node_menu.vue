<template>
    <div class="flow-menu" ref="tool">
        <div v-for="menu in menuList" :key="menu.id">
            <div class="ef-node-pmenu-item"><i class="el-icon-notebook-2"></i>節點配置</div>
            <ul v-show="menu.open" class="ef-node-menu-ul">
                <draggable @end="end" @start="move" v-model="menu.children" :options="draggableOptions">
                    <li v-for="subMenu in menu.children" class="ef-node-menu-li" :key="subMenu.id" :type="subMenu.type">
                        <i :class="subMenu.ico"></i> {{ subMenu.name }}
                    </li>
                </draggable>
            </ul>
        </div>
    </div>
</template>
<script>
import { VueDraggableNext as draggable } from "vue-draggable-next";

var mousePosition = {
    left: -1,
    top: -1
}

export default {
    data() {
        return {
            activeNames: '1',
            // draggable配置參數參考 https://www.cnblogs.com/weixin186/p/10108679.html
            draggableOptions: {
                preventOnFilter: false,
                sort: false,
                disabled: false,
                ghostClass: 'tt',
                // 不使用H5原生的配置
                forceFallback: true,
                // 拖拽的時候樣式
                // fallbackClass: 'flow-node-draggable'
            },
            // 默認打開的左側菜單的id
            defaultOpeneds: ['1', '2'],
            originNodes: [],
            menuList: [
                {
                    id: '1',
                    type: 'group',
                    name: '開始節點',
                    ico: 'el-icon-video-play',
                    open: true,
                    children: [
                        {
                            id: '0',
                            type: 'start',
                            name: '流程開始',
                            ico: 'el-icon-time',
                            // 自定義覆蓋樣式
                            style: {}
                        },
                        {
                            id: '1',
                            type: 'end',
                            name: '流程结束',
                            ico: 'el-icon-switch-button',
                            // 自定義覆蓋樣式
                            style: {}
                        }, {
                            id: '2',
                            type: 'node',
                            name: '流程節點',
                            ico: 'el-icon-news',
                            // 自定義覆蓋樣式
                            style: {}
                        }
                    ]
                }],

            nodeMenu: {}
        }
    },
    components: {
        draggable
    },
    created() {
        this.originNodes = [...this.menuList[0].children]
        /**
         * 以下是為了解决在火狐瀏覽器上推拽時彈出tab頁到搜索問題
         * @param event
         */
        if (this.isFirefox()) {
            document.body.ondrop = function (event) {
                // 解决火狐瀏覽器無法獲取鼠標拖拽结束的坐標問題
                mousePosition.left = event.layerX
                mousePosition.top = event.clientY - 50
                event.preventDefault();
                event.stopPropagation();
            }
        }
    },
    methods: {
        // 根據類型獲取左側菜單對象
        getMenuByType(type) {
            for (let i = 0; i < this.menuList.length; i++) {
                let children = this.menuList[i].children;
                for (let j = 0; j < children.length; j++) {
                    if (children[j].type === type) {
                        return children[j]
                    }
                }
            }
        },
        // 拖拽開始時觸發
        move(evt, a, b, c) {
            var type = evt.item.attributes.type.nodeValue
            this.nodeMenu = this.getMenuByType(type)
        },
        // 拖拽结束時觸發
        end(evt, e) {

            this.$emit('addNode', evt, this.nodeMenu, mousePosition)
            this.menuList[0].children = [...this.originNodes]
        },
        // 是否是火狐瀏覽器
        isFirefox() {
            var userAgent = navigator.userAgent
            if (userAgent.indexOf("Firefox") > -1) {
                return true
            }
            return false
        }
    }
}
</script>
<style scoped lang="less">
@import "./index.css";
</style>