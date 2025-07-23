<template>
  <el-dialog
    :visible="dialogBool"
    :title="'菜单排序'"
    :before-close="dialogClose"
    width="600px"
    
  >
    <div class="el-dialog-div" v-if="dialogBool">
      <table-draggable-sort
        :defaultSortProps="defaultSortProps"
        :tableConfig="tableConfig"
        :dataInfoList="sortDataList"
      ></table-draggable-sort>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill()">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import tableDraggableSort from "@/components/tableDraggableSort";
export default {
  components: {
    tableDraggableSort,
  },
  props: {
    dialogBool: Boolean,
    sortDataList: [Array],
  },
  mounted() {},
  data() {
    return {
      tableConfig: {
        tableItems: [
          {
            label: "菜单名称",
            prop: "label",
            width: "360",
            align: "left",
          },
          {
            label: "上下拖拽调整排序",
            prop: "sort",
            width: "190",
            align: "center",
          },
        ],
      },
      defaultSortProps: {
        value: "id",
        label: "name",
        sort: "sort",
        type: "type",
        parent_id: "parent_id",
      },
      newTableData: [],
      showSortDataList:[],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 监听更新排序函数
    updateSortInfo(tableData) {
      // console.log(tableData);
      // this.newTableData= JSON.parse(JSON.stringify(tableData))
      this.newTableData = [...tableData];
    },
    // 保存排序
    updatePlaybill() {
      let list = [];
      this.newTableData.forEach((item) => {
        let obj = {
          id: item.value,
          sort: item.sort,
        };
        list.push(obj);
      });
      this.$emit('save-sort-menu', list)
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div{
  height: 400px;
  overflow hidden;
}
</style>

