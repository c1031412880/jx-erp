<template>
  <div class="get-user-tree">
    <el-input
      size="mini"
      placeholder="请输入查找人员名称"
      prefix-icon="el-icon-search"
      v-model="valSelect">
    </el-input>
    <div class="scap-radio">
      <el-radio-group v-model="scapshow" @change="scapChange">
        <el-radio :label="0">全部</el-radio>
        <el-radio :label="1">营运</el-radio>
        <el-radio :label="2">维修</el-radio>
        <el-radio :label="3">仓储</el-radio>
      </el-radio-group>
    </div>
    <el-tree
      v-loading="loading"
      show-checkbox
      :highlight-current="true"
      :check-on-click-node="checkNode"
      :data="data"
      node-key="i_id"
      :props="defaultProps"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
      @check="onCheck"
      style="margin-top: 20px"
      ref="tree"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <i style="margin-right: 5px; color:#409EFF" :class="data.type ? 'el-icon-office-building' : 'el-icon-user'"></i>
          <span style="margin-right: 25px">{{ node.label }}</span>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from '@/utils/index'
// import { get_driver_tree } from 'api/basicInfomation-api'
export default {
  name: "get-user-tree",
  props: {
    // funcType: [String, Number],
  },
  data() {
    return {
      loading: false,
      checkNode: true,
      valSelect: "",
      data: [],
      defaultProps: {
        children: "children",
        label: "c_name",
      },
      userSelect: [],
      scapshow: 0,
      debounceFilter: null,
    };
  },
  created() {
    this.loadData();
    this.debounceFilter = debounce((val) => {
      this.$refs.tree.filter(val);
      if(!val) {
        this.allExpanded(false)
      }
    }, 300);
  },
  watch: {
    valSelect(val) {
      this.debounceFilter(val);
    },
  },
  methods: {
    // 咱开或收起树节点
    allExpanded(isCanGo){
      // 展开还是收起
      var treeNodeList = this.$refs.tree.store._getAllNodes();
      
      for (var i = 0; i < treeNodeList.length; i++) {
        treeNodeList[i].expanded = isCanGo;
      }
    },
    loadData() {
      this.loading = true;
      let params = {
        is_contain_emp: true,
        show_all: false
      }
      if(!!this.scapshow) {
        params.func_type = this.scapshow
      }
      this.$client
        .getUserEmps(params)
        .then((res) => {
          this.loading = false;
          if (res.head.result === "200") {
            this.data = res.context;
          }
        })
        .catch((err) => {});
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.c_name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      console.log('节点点击',data)
    },
    // 节点多选事件
    onCheck(data, nodes) {
      this.userSelect = this.$refs.tree.getCheckedNodes();
      this.$emit("on-check", nodes.checkedNodes);
    },
    //设置选中节点
    setCheckedNodes(data) {
      console.log("设置选中节点", data);
      setTimeout(() => {
        this.$refs.tree.setCheckedNodes(data);
      }, 100);
    },
    //设置选中节点
    setCheckedkeys(data) {
      console.log("设置选中节点", data);
      this.$refs.tree.setCheckedKeys(data);
    },
    scapChange() {
      this.resetChecked()
      this.loadData();
    },
    //清空选中
    resetChecked() {
      this.$refs.tree.setCheckedNodes([]);
      console.log("当前选中节点", this.$refs.tree.getCheckedNodes());
      this.userSelect = [];
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.get-user-tree {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
