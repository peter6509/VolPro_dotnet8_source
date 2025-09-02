//從表方法
let detailMethods = {
  //查詢從表前先做内部處理
  loadInternalDetailTableBefore(param, callBack, table, item) {
    //加載明细表數據之前,需要設定查詢的主表的ID
    //每次只要加載明细表格數據就重置删除明细的值
    if (this.detailOptions.delKeys.length > 0) {
      this.detailOptions.delKeys = [];
    }
    let key = this.table.key;
    if (this.currentRow && this.currentRow.hasOwnProperty(key)) {
      param.value = this.currentRow[key];
    }
    if (this.isMultiple) {
      if (!param.tableName) {
        (param.value = this.currentRow[this.table.key]),
          (param.tableName = table);
      }
    }
    return this.loadDetailTableBefore(param, callBack, table, item);
  },
  loadDetailTableBefore(param, callBack, table, item) {
    //明细查詢前
    //新建時禁止加載明细
    if (this.currentAction == this.const.ADD) {
      callBack(false);
      return false;
    }
    let status = this.searchDetailBefore(param, table, item);
    callBack(status);
  },
  loadDetailTableAfter(data, callBack, table, item) {
    //明细查詢後
    let status = this.searchDetailAfter(data, table, item);
    //2024.05.23增加複製數據功能後清空明细表的主鍵值
    if (this.currentAction == 'Add') {
      data.forEach(row => {
        row[this.table.key] = undefined;
        if (!item) {
          row[this.detailOptions.key] = undefined;
        } else {
          row[item.key] = undefined;
        }
      })
    }
    callBack(status);
  },

  //三级明细查詢前2023.09.17
  loadSubInternalDetailTableBefore(param, callBack, table, item) {
    //獲取二级明细表配置
    if (item) {
      param.table = item.table;
      param.detailTable = item.secondTable;
      param.tableName = item.table;
      let detailRows = this.getTable(item.secondTable).getSelected();
      if (!detailRows || detailRows.length == 0) {
        callBack(false);
        return;
      }
      param.value = detailRows[0][item.secondKey];
    }
    let rows;
    if (!param.value) {
      //獲取三级表當前選中的明细行數據,並且設置二级明细表的id作為查詢條件
      let secondKey = item.secondKey;
      //獲取二级明细表選中的行
      // rows = this.getTableRef(item.secondTable).getSelected();
      rows = this.getCurrentDetailSelectRows(item.secondTable);
      if (!rows) {
        callBack(false);
        return;
      }
      param.value = rows[0][secondKey];
    }

    //三级明细查詢前
    //新建時禁止加載明细
    if (this.currentAction == this.const.ADD) {
      callBack(false);
      return false;
    }
    if (!this.searchSubDetailBefore) {
      callBack(true);
      return;
    }
    let status = this.searchSubDetailBefore(param, table, item);
    callBack(status);
  },
  getCurrentDetailSelectRows(table) {
    let rows = this.getTableRef(table).getSelected();
    if (!rows.length) {
      this.$message.error(
        this.$ts('請選中明细表數據') +
        ':【' +
        this.$ts(this.getTableName(table)) +
        '】'
      );
      return null;
    }
    return rows;
  },
  //獲取二级或者三级明细表ref對象
  getTableRef(table) {
    //獲取明细表
    if (this.details.length) {
      //獲取一對多的table表格
      let _obj =
        this.$refs.details.$refs[table] ||
        (this.$refs.subDetails && this.$refs.subDetails.$refs[table]);
      if (_obj) {
        return _obj[0];
      }
    } else {
      return this.$refs.detail;
    }
  },
  //獲取二级或者三级明细表中文名稱
  getTableName(table) {
    //獲取明细表
    if (!this.details.length) {
      return '未配置二级或三级明细表';
    }

    let ops = this.details.find((x) => {
      return x.table == table;
    });
    if (ops) {
      return ops.cnName;
    }

    return this.subDetails.find((x) => {
      return x.table == table;
    }).cnName;
  },
  //三级明细查詢後2023.09.17
  loadSubDetailTableAfter(rows, callBack, table, item) {
    item.keys = [];
    //给二级明细表設置值
    let row = this.getTableRef(item.secondTable).getSelected()[0];
    row[item.table] = rows;

    if (!this.searchSubDetailAfter) {
      callBack(true);
      return;
    }
    //三级明细查詢後
    let status = this.searchSubDetailAfter(rows, table, item);
    callBack(status);
  },
  // detailRowOnChange(row,table) {
  //   this.detailRowChange(row);
  // },
  detailRowChange(row, table) {
    // if (this.currentAction == 'Add') {
    //   return;
    // }
    // //二级明细表點擊選中行事件
    // if (
    //   this.subDetails.length &&
    //   this.subDetails.some((x) => {
    //     return x.secondTable == table;
    //   })
    // ) {
    //   if (row[table]) {
    //     return;
    //   }
    // }
    //checkbox選中行事件
  },
  detailRowOnClick({ row, column, event, item }) {
    //明细表點擊行事件2020.11.07
    this.detailRowClick({ row, column, event, item });
  },
  detailRowClick({ row, column, event, item }) { },
  resetDetailTable(row, isAdd) {
    //重置三级明细
    if (this.subDetails.length) {
      this.subDetails.forEach((x) => {
        x.delKeys = [];
        let tableRef = this.getTableRef(x.table);
        tableRef && tableRef.reset();
      });
    }
    //新建或編輯時重置明细表
    //一對多
    if (this.isMultiple) {
      this.$nextTick(() => {
        if (this.$refs.details) {
          this.details.forEach((item) => {
            if (item.columns) {
              let refTable = this.getTable(item.table);
              refTable && refTable.reset();
              if (refTable && !isAdd) {
                // refTable.load();
                this.detailTableLoad(row, refTable, item.table);
              }
            }
          });
        }
      });
      return;
    }

    //編輯和查看明细時重置從表數據
    if (!this.detailOptions.columns || this.detailOptions.columns.length == 0) {
      return;
    }
    //let key = this.table.key;
    // let query = { value: row ? row[key] : this.currentRow[key] };
    this.$nextTick(() => {
      if (this.$refs.detail) {
        this.$refs.detail.reset();
        //this.$refs.detail.load(query);
        this.detailTableLoad(row, this.$refs.detail);
      }
    });
  },
  detailTableLoad(row, refTable, table) {
    //一對多明细表加載數據
    if (refTable) {
      let query = {
        value: row ? row[this.table.key] : this.currentRow[this.table.key],
        tableName: table
      };
      refTable.load(query);
    }
  },
  //從後面加載從表數據
  refreshRow() {
    this.resetDetailTable();
  },
  //二级明细表添加行
  addSecondRow(table, item, index) {
    let _row = this.addDetailRow(table, item, index);
    if (item.detail && item.detail.table) {
      _row[item.detail.table] = [];
    }
    this.getTable(table).addRow(_row);
  },
  //獲取二级明细表默認數據
  addDetailRow(table, item, index) {
    return {};
  },
  //二级明细選中行事件
  detailRowOnChange(row, item) {
    //獲取三级明细子表
    if (!item || !item.detail) {
      return;
    }
    this.detailRowChange(row, item);
    let table = item.detail.table;
    //三级表對象
    let subRef = this.getTableRef(table);
    if (!subRef) {
      return;
    }

    //三级明细表數據
    let subRows = row[table];
    if (subRows) {
      subRef.rowData = subRows;
      return;
    }
    if (!subRows) {
      subRows = [];
      row[table] = subRows;
    }
    subRef.rowData = subRows;
    //處於編輯狀態時没有明细表數據，從後台加載數據
    if (this.currentAction != 'Add' && !subRows.length) {
      //從接口添加數據
      subRef.load(null, true);
    }
  },
  //三级明细表添加行
  addSubRow(table, item, index, newRows) {
    let rows = this.getCurrentDetailSelectRows(item.secondTable);
    if (!rows) {
      return;
    }
    if (newRows) {
      if (!Array.isArray(newRows)) {
        newRows = [newRows];
      }
    } else {
      //默認默認的添加行數據
      newRows = [this.addDetailRow(table, item, index)];
    }
    //给二级明细添加表數據
    if (!rows[0][table]) {
      rows[0][table] = newRows;
    } else {
      rows[0][table].push(...newRows);
    }
    //三级明细表數據指向二级明细表行數據
    this.getTableRef(item.table || table).rowData = rows[0][table];
  },
  addRow() {
    //單表明细表添加行
    this.$refs.detail.addRow({});
    this.$refs.detail.edit.rowIndex = -1;
    this.updateDetailTableSummaryTotal();
  },
  getTable(table) {
    // //獲取一對多的table表格
    // let _obj = this.$refs.details.$refs[table]; //[0];
    // if (_obj) {
    //   return _obj[0];
    // }
    return this.getTableRef(table);
  },
  delSubRow(table, item, index) {
    this.delRow(table, item, index, true);
  },
  delRowAfter(rows, table, item, index) {
    return true;
  },
  delRow(table, item, index, isSubDetail) {
    //一對多明细的添加行

    let rows;
    if (isSubDetail) {
      rows = this.getTable(table).getSelected();
    } else if (typeof table == 'string' && this.isMultiple) {
      rows = this.getTable(table).getSelected();
    } else {
      rows = this.$refs.detail.getSelected();
    }

    if (!rows || rows.length == 0) {
      return this.$message.error(this.$ts('請選擇要删除的行!'));
    }
    if (!this.delDetailRow(rows, table)) {
      return false;
    }
    if (this.delRowBefore && !this.delRowBefore(rows, table, item, index)) {
      return;
    }
    let tigger = false;
    this.$confirm(this.$ts('確認要删除選擇的數據吗?'), this.$ts('警告'), {
      confirmButtonText: this.$ts('確定'),
      cancelButtonText: this.$ts('取消'),
      type: 'warning',
      center: true
    }).then(() => {
      if (tigger) return;
      tigger = true;
      //二、三级删除行
      if (this.isMultiple || isSubDetail) {
        let refDetail = this.getTable(table);
        refDetail.delRow();
        //記錄删除的明细
        rows.forEach((x) => {
          if (x.hasOwnProperty(item.key) && x[item.key]) {
            item.delKeys.push(x[item.key]);
          }
        });
        if (!this.delRowAfter(rows, table, item, index)) {
          return;
        }
        return;
      }
      rows = this.$refs.detail.delRow();
      if (!this.delRowAfter(rows, table, item, index)) {
        return;
      }
      let key = this.detailOptions.key;
      //記錄删除的行數據
      rows.forEach((x) => {
        if (x.hasOwnProperty(key) && x[key]) {
          this.detailOptions.delKeys.push(x[key]);
        }
      });
      this.updateDetailTableSummaryTotal();
    });
  },
  updateDetailTableSummaryTotal(table) {
    //2021.09.25增加明细表删除、修改時重新計算行數與匯總
    //2021.12.12增加明细表判斷(强制刷新合計時會用到)
    if (this.isMultiple) {
      this.details.forEach((c) => {
        if (!table || c.table === table) {
          let tableRef = this.getTable(c.table);
          tableRef.paginations.total = tableRef.rowData.length;
          //重新設置合計
          if (tableRef.summary) {
            tableRef.columns.forEach((column) => {
              if (column.summary) {
                tableRef.getInputSummaries(null, null, null, column);
              }
            });
          }
        }
      });
      return;
    }
    if (!this.$refs.detail) {
      return;
    }
    //删除或新增行時重新設置顯示的總行數
    this.$refs.detail.paginations.total = this.$refs.detail.rowData.length;
    //重新設置合計
    if (this.$refs.detail.summary) {
      this.$refs.detail.columns.forEach((column) => {
        if (column.summary) {
          this.$refs.detail.getInputSummaries(null, null, null, column);
        }
      });
    }
  },
  detailSelectable(row, index) {
    //明细表CheckBox 是否可以勾選
    return true;
  },
  tabsClick(table) {
    let obj = this.details.find((x) => {
      return x.table == table;
    });
    this.detailTabsClick && this.detailTabsClick(table)
    //設置三级明细表選中
    if (obj) {
      if (this.$refs.subDetails) {
        if (obj.detail) {
          this.$refs.subDetails.setTable(obj.detail.table);
        } else {
          this.$refs.subDetails.setTable("");
        }
      }
      return;
    }

    obj = this.subDetails.find((x) => {
      return x.table == table;
    });
    //設置二级明细表選中
    if (obj) {
      this.$refs.details.setTable(obj.secondTable);
    }
  }
};

export default detailMethods;
