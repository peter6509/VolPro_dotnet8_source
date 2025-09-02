import { h } from 'vue';
export default {
  name: "TableExpand",
  functional: true,
  props: {
    render: Function,
    row: {},//當前行的數據
    column: {},//當前行的配置信息
    index: { type: Number, default: 0 }//當前所在行
  },
  render: ({ render,row ,column,index }) => {
    return render(h, {row ,column,index}); //h();
  }
};
