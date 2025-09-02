<template>
  <vol-box :lazy="false" v-model="model" :title="isAdd ? '新建流程' : '編輯流程'" :width="width" :padding="0">
    <div :style="{ height: height + 'px' }">
      <flow-panel ref="flow"></flow-panel>
    </div>
    <template #footer>
      <div style="text-align: center">
        <el-button type="default" size="mini" @click="model = false">取消</el-button>
        <el-button type="primary" size="mini" @click="save">保存</el-button>
      </div>
    </template>
  </vol-box>
</template>

<script>
import FlowPanel from "@/components/workflow/panel";
import VolBox from "@/components/basic/VolBox.vue";
export default {
  name: "App",
  components: {
    FlowPanel,
    VolBox,
  },
  data() {
    return {
      nodeList: [],
      lineList: [],
      model: false,
      height: 500,
      width: 1200,
      row: null,
      isAdd: false,
    };
  },
  created() {
    this.height = document.body.clientHeight - 140;
    let width = document.body.clientWidth * 0.9;
    this.width = width > 1800 ? 1800 : width;
  },
  methods: {
    open(row) {
      this.row = row;
      this.model = true;
      this.isAdd = Object.keys(this.row).length == 0;

      if (row.NodeConfig) {
        this.nodeList = JSON.parse(row.NodeConfig);
      } else {
        this.nodeList = [
          // {
          //   id: '1659276275052',
          //   name: '流程C-節點A',
          //   type: 'task',
          //   left: '230px',
          //   top: '15px',
          //   ico: 'el-icon-user-solid'
          // },
          // {
          //   id: '1659276282115',
          //   name: '流程C-節點B',
          //   type: 'task',
          //   left: '225px',
          //   top: '165px',
          //   ico: 'el-icon-goods'
          // }
        ];
      }
      if (row.LineConfig) {
        this.lineList = JSON.parse(row.LineConfig);
      } else {
        this.lineList = [
          // {
          //   from: '1659276275052',
          //   to: '1659276282115'
          // }
        ];
      }

      this.$nextTick(() => {
        this.$refs.flow.dataReload(
          {
            lineList: this.lineList,
            nodeList: this.nodeList,
          },
          this.isAdd
        );
        Object.assign(this.$refs.flow.formFields, row);
        if (this.isAdd) {
          this.$refs.flow.formFields.WorkName = "";
          this.$refs.flow.formFields.WorkTable = "";
          this.$refs.flow.formFields.WorkTableName = "";
          this.$refs.flow.formFields.Remark = "";
          this.$refs.flow.formFields.Weight = 1;
        }
        if (this.$refs.flow) {
          this.$refs.flow.$refs.nodeForm.$refs.filter.getOptions(row.WorkTable);
        } else {
          this.$refs.flow.$refs.form.reset(
            Object.keys(row).length
              ? row
              : { WorkName: "", WorkTable: "", WorkTableName: "", Remark: "", Weight: 1 }
          );
        }
      });
    },
    save() {
      let mainData = JSON.parse(JSON.stringify(this.$refs.flow.formFields));

      if (!mainData.WorkName) {
        this.$message.error("請填寫左側表單【流程名稱】");
        return;
      }

      if (!mainData.WorkTable) {
        this.$message.error("請選擇左側表單【流程實例】");
        return;
      }

      let nodeList = this.$refs.flow.data.nodeList;

      let nodeListOptions = JSON.parse(JSON.stringify(nodeList));

      nodeListOptions.forEach((item) => {
        if (item.filters && item.filters.data) {
          item.filters.data = undefined;
        }
      });
      mainData.NodeConfig = JSON.stringify(nodeListOptions);
      let lineList = this.$refs.flow.data.lineList;
      lineList = JSON.parse(JSON.stringify(lineList));
      lineList.forEach((item) => {
        if (item.filters) {
          item.filters.forEach((x) => {
            if (x.data) {
              x.data = [];
            }
          });
        }
      });
      mainData.LineConfig = JSON.stringify(lineList);

      let rootNode = nodeList
        .filter((c) => {
          return c.type == "start";
        })
        .map((c) => {
          return {
            StepId: c.id,
            StepName: c.name,
            StepAttrType: c.type,
            StepAuditType: null,
            ParentId: [""],
            Filters: c.filters,
          };
        });
      if (!rootNode.length) {
        return this.$message.error("請添加流程開始節點");
      }

      if (rootNode.length > 1) {
        return this.$message.error("只能選擇一個流程開始節點");
      }
      let endNodeCount = nodeList.filter((c) => {
        return c.type == "end";
      }).length;
      if (!endNodeCount) {
        return this.$message.error("請選擇左側【流程结束】節點");
      }

      if (endNodeCount > 1) {
        return this.$message.error("只能選擇一個【流程结束】節點");
      }

      if (
        lineList.some((c) => {
          return c.to == rootNode[0].id;
        })
      ) {
        return this.$message.error("不開始结點回連");
      }

      for (let index = 0; index < rootNode.length; index++) {
        const node = rootNode[index];
        node.OrderId = index;
        //這裡有一節點有多個上级節點的時候數據重複了，比如線束節點

        lineList
          .filter((c) => {
            return c.from == node.StepId;
          })
          .forEach((c) => {
            let item = nodeList.find((x) => {
              return x.id == c.to;
            });
            let _obj = rootNode.find((x) => {
              return x.StepId === item.id;
            });
            if (_obj) {
              _obj.ParentId.push(node.StepId);
            } else {
              rootNode.push({
                ParentId: [node.StepId], //父级id
                StepId: item.id,
                StepName: item.name,
                StepAttrType: item.type, //節點類型.start開始，end结束
                StepType: item.auditType, //審核類型,角色，用户，部門(這裡後面考慮同時支持多個角色、用户、部門)
                //審核選擇的值角色，用户，部門(這裡後面考慮同時支持多個角色、用户、部門)
                StepValue: (
                  (item.auditType == 1
                    ? item.userId
                    : item.auditType == 2
                      ? item.roleId
                      : item.deptId) || []
                ).join(","),
                AuditRefuse: item.auditRefuse, //審核未通過(返回上一節點,流程重新開始,流程结束)
                AuditBack: item.auditBack, //駁回(返回上一節點,流程重新開始,流程结束)
                AuditMethod: item.auditMethod, //審批方式(啟用會簽)
                SendMail: item.sendMail, //審核後發送郵件通知：
                Filters: item.filters,
              });
            }
          });
        // rootNode.push(...data);
      }

      rootNode.forEach((item) => {
        item.ParentId = item.ParentId.filter((x) => {
          return x;
        }).join(",");
        if (item.Filters && item.Filters.length) {
          item.Filters = item.Filters.map((m) => {
            return {
              field: m.field,
              filterType: m.filterType,
              value: Array.isArray(m.value) ? m.value.join(",") : m.value,
            };
          });
          item.Filters = JSON.stringify(item.Filters);
        } else {
          item.Filters = null;
        }
      });

      for (let index = 0; index < rootNode.length; index++) {
        const step = rootNode[index];
        if (Array.isArray(step.StepValue)) {
          step.StepValue = step.StepValue.join(",");
        }
        if (!step.StepName) {
          return this.$message.error(`請輸入節點名稱`);
        }
        if ((step.StepType != 4 && step.StepType != 5) && step.StepAttrType == "node" && !step.StepValue) {
          return this.$message.error(`請選擇【${step.StepName}】的審批類型`);
        }
      }

      let params = {
        mainData: mainData,
        detailData: rootNode,
        delKeys: [],
      };

      let url = "api/Sys_WorkFlow/" + (!this.isAdd ? "update" : "add");
      this.http.post(url, params, true).then((result) => {
        if (!result.status) {
          return this.$message.error(result.message);
        }
        this.$message.success("保存成功");
        this.model = false;
        this.$emit("parentCall", ($parent) => {
          $parent.search();
        });
      });
    },
  },
};
</script>
