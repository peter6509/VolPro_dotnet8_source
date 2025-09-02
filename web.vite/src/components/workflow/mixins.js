export const easyFlowMixin = {
    data() {
        return {
            jsplumbSetting: {
                // 動態锚點、位置自适應
                Anchors: ['Top', 'TopCenter', 'TopRight', 'TopLeft', 'Right', 'RightMiddle', 'Bottom', 'BottomCenter', 'BottomRight', 'BottomLeft', 'Left', 'LeftMiddle'],
                // 容器ID
                Container: 'efContainer',
                // 連線的樣式，直線或者曲線等，可選值:  StateMachine、Flowchart，Bezier、Straight
                //Connector: ['Bezier', {curviness: 100}],
                // Connector: ['Straight', {stub: 20, gap: 1}],
                 Connector: ['Flowchart', {stub: 30, gap: 1, alwaysRespectStubs: false, midpoint: 0.5, cornerRadius: 10}],
                // Connector: ['StateMachine', {margin: 5, curviness: 10, proximityLimit: 80}],
                // 鼠標不能拖動删除線
                ConnectionsDetachable: false,
                // 删除線的時候節點不删除
                DeleteEndpointsOnDetach: false,
                /**
                 * 連線的兩端端點類型：圆形
                 * radius: 圆的半徑，越大圆越大
                 */
                // Endpoint: ['Dot', {radius: 5, cssClass: 'ef-dot', hoverClass: 'ef-dot-hover'}],
                /**
                 * 連線的兩端端點類型：矩形
                 * height: 矩形的高
                 * width: 矩形的寬
                 */
                // Endpoint: ['Rectangle', {height: 20, width: 20, cssClass: 'ef-rectangle', hoverClass: 'ef-rectangle-hover'}],
                /**
                 * 圖像端點
                 */
                // Endpoint: ['Image', {src: 'https://www.easyicon.net/api/resizeApi.php?id=1181776&size=32', cssClass: 'ef-img', hoverClass: 'ef-img-hover'}],
                /**
                 * 空白端點
                 */
                Endpoint: ['Blank', {Overlays: ''}],
                // Endpoints: [['Dot', {radius: 5, cssClass: 'ef-dot', hoverClass: 'ef-dot-hover'}], ['Rectangle', {height: 20, width: 20, cssClass: 'ef-rectangle', hoverClass: 'ef-rectangle-hover'}]],
                /**
                 * 連線的兩端端點樣式
                 * fill: 顏色值，如：#12aabb，為空不顯示
                 * outlineWidth: 外邊線寬度
                 */
                EndpointStyle: {fill: '#1879ffa1', outlineWidth: 1},
                // 是否打開jsPlumb的内部日誌記錄
                LogEnabled: true,
                /**
                 * 連線的樣式
                 */
                PaintStyle: {
                    // 線的顏色
                    stroke: 'RGB(168,170,173)',
                    // 線的粗细，值越大線越粗
                    strokeWidth: 1,
                    // 設置外邊線的顏色，默認設置透明，這樣别人就看不見了，點擊線的時候可以不用精確點擊，參考 https://blog.csdn.net/roymno2/article/details/72717101
                    outlineStroke: 'transparent',
                    // 線外邊的寬，值越大，線的點擊範圍越大
                    outlineWidth: 10
                },
                DragOptions: {cursor: 'pointer', zIndex: 2000},
                /**
                 *  叠加 參考： https://www.jianshu.com/p/d9e9918fd928
                 */
                Overlays: [
                    // 箭頭叠加
                    ['Arrow', {
                        width: 10, // 箭頭尾部的寬度
                        length: 8, // 從箭頭的尾部到頭部的距離
                        location: 1, // 位置，建议使用0～1之間
                        direction: 1, // 方向，默認值為1（表示向前），可選-1（表示向後）
                        foldback: 0.623 // 折回，也就是尾翼的角度，默認0.623，當為1時，為正三角
                    }],
                    // ['Diamond', {
                    //     events: {
                    //         dblclick: function (diamondOverlay, originalEvent) {
                    //             console.log('double click on diamond overlay for : ' + diamondOverlay.component)
                    //         }
                    //     }
                    // }],
                    ['Label', {
                        label: '',
                        location: 0.1,
                        cssClass: 'aLabel'
                    }]
                ],
                // 繪制圖的模式 svg、canvas
                RenderMode: 'svg',
                // 鼠標滑過線的樣式
                HoverPaintStyle: {stroke: '#b0b2b5', strokeWidth: 1},
                // 滑過锚點效果
                // EndpointHoverStyle: {fill: 'red'}
                Scope: 'jsPlumb_DefaultScope' // 範圍，具有相同scope的點才可連接
            },
            /**
             * 連線參數
             */
            jsplumbConnectOptions: {
                isSource: true,
                isTarget: true,
                // 動態锚點、提供了4個方向 Continuous、AutoDefault
                anchor: 'Continuous',
                // 設置連線上面的label樣式
                labelStyle: {
                    cssClass: 'flowLabel'
                },
                // 修改了jsplumb 源碼，支持label 為空傳入自定義style
                emptyLabelStyle: {
                    cssClass: 'emptyFlowLabel'
                }
            },
            /**
             * 源點配置參數
             */
            jsplumbSourceOptions: {
                // 設置可以拖拽的類名，只要鼠標移動到该類名上的DOM，就可以拖拽連線
                filter: '.flow-node-drag',
                filterExclude: false,
                anchor: 'Continuous',
                // 是否允許自己連接自己
                allowLoopback: true,
                maxConnections: -1,
                onMaxConnections: function (info, e) {
                    console.log(`超過了最大值連線: ${info.maxConnections}`)
                }
            },
            // 參考 https://www.cnblogs.com/mq0036/p/7942139.html
            jsplumbSourceOptions2: {
                // 設置可以拖拽的類名，只要鼠標移動到该類名上的DOM，就可以拖拽連線
                filter: '.flow-node-drag',
                filterExclude: false,
                // anchor: 'Continuous',
                // 是否允許自己連接自己
                allowLoopback: true,
                connector: ['Flowchart', {curviness: 50}],
                connectorStyle: {
                    // 線的顏色
                    stroke: 'red',
                    // 線的粗细，值越大線越粗
                    strokeWidth: 1,
                    // 設置外邊線的顏色，默認設置透明，這樣别人就看不見了，點擊線的時候可以不用精確點擊，參考 https://blog.csdn.net/roymno2/article/details/72717101
                    outlineStroke: 'transparent',
                    // 線外邊的寬，值越大，線的點擊範圍越大
                    outlineWidth: 10
                },
                connectorHoverStyle: {stroke: 'red', strokeWidth: 2}
            },
            jsplumbTargetOptions: {
                // 設置可以拖拽的類名，只要鼠標移動到该類名上的DOM，就可以拖拽連線
                filter: '.flow-node-drag',
                filterExclude: false,
                // 是否允許自己連接自己
                anchor: 'Continuous',
                allowLoopback: true,
                dropOptions: {hoverClass: 'ef-drop-hover'}
            }
        }
    }
}
