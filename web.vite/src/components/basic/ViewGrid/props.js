let props = function() {
  return {
    columns: {
      //當前表的配置信息
      type: Array,
      default: () => {
        return [];
      }
    },
    detail: {
      //從表明细配置
      type: Object,
      default: () => {
        return {
          columns: [], //從表列
          sortName: '' //從表排序字段
        };
      }
    },
    details: {
      //從表明细配置
      type: Array,
      default: () => {
        return [];
      }
    },
    editFormFields: {
      //新建、編輯字段(key/value)
      type: Object,
      default: () => {
        return {};
      }
    },
    editFormOptions: {
      //新建、編輯配置信息
      type: Array,
      default: () => {
        return [];
      }
    },
    searchFormFields: {
      //查詢字段(key/value)
      type: Object,
      default: () => {
        return {};
      }
    },
    searchFormOptions: {
      //查詢配置信息(key/value)
      type: Array,
      default: () => {
        return [];
      }
    },
    table: {
      //表的配置信息：主鍵、排序等
      type: Object,
      default: () => {
        return {};
      }
    },
    extend: {
      //表的擴展方法與组件都合並到此屬性中
      type: Object,
      default: () => {
        return {};
      }
    }
  };
};

export default props;
