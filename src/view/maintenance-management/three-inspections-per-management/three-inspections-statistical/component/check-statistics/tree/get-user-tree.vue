<template>
  <div class="get-user-tree">
    <el-input
      ref="inputSearch"
      size="mini"
      :placeholder="`请输入人员名称`"
      prefix-icon="el-icon-search"
      v-model="valSelect"
    >
    </el-input>
    <!-- check-strictly 子父节点不相关 -->
    <el-tree
      :show-checkbox="true"
      :highlight-current="true"
      :check-on-click-node="true"
      :check-strictly="isCheckStrictly"
      :expand-on-click-node="false"
      :data="data"
      node-key="i_id"
      :props="defaultProps"
      :default-expanded-keys="defaultKeys"
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
export default {
  name: "all-dept-user-tree",
  props:{
    // 多选时子父是否关联
    isCheckStrictly: {
      type:Boolean,
      default: false
    },
    value: {},
    data: [Array]
  },
  data() {
    return {
      loading: false,
      valSelect: "",
      // data: [],
      defaultProps: {
        children: "children",
        label: "c_name",
      },
      userSelect: [],
      defaultKeys:[],
      id: '',
      isFirstSelect: true
    };
  },
  created() {
    this.id = this.value
  },
  watch: {
    valSelect(val) {
      this.$refs.tree.filter(val);
    },
    value(val) {
      if (val.length > 0) {
        if(this.isFirstSelect) {
          this.setCheckedkeys(this.value)
        }
        // this.isFirstSelect = true;
      }
    },
  },
  methods: {
    // 聚焦搜索框
    inputFocus() {
      this.$nextTick(function () {
        this.$refs.inputSearch.focus();
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.c_name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      console.log('节点点击',data)
      // if(!this.isShowCheckbox) {
      //   let id = this.isContainEmp ? 'index' : 'i_id'
      //   // 获取当前节点父级节点
      //   let parentNode = this.outGroupTreeNode(this.data, data, id);
      //   this.isFirstSelect = false
      //   // console.log(parentNode)
      //   this.$emit("on-check", [data], parentNode);
      //   this.$emit('input', data.i_id)

      // }
    },
    // 节点多选事件
    onCheck(data, nodes) {
      console.log(data)
      // this.userSelect = this.$refs.tree.getCheckedNodes();
      // this.$emit('input', nodes.checkedKeys)
      // this.$emit("on-check", nodes.checkedNodes);
      // 子父关联
      if(!this.isCheckStrictly) {
        let checkedNodes = this.$refs.tree.getCheckedNodes() || [];
        let checkedKeys = this.$refs.tree.getCheckedKeys() || [];
        this.$emit('input', checkedKeys)
        this.$emit("on-check", checkedNodes);
      }
    },
    //设置选中节点
    setCheckedNodes(data) {
      // console.log("设置选中节点", data);
      setTimeout(() => {
          this.$refs.tree.setCheckedNodes(data);
        },100)
      // this.$refs.tree.setCheckedNodes(data);
    },
    //设置选中节点
    setCheckedkeys(data) {
      // console.log("设置选中节点----------------------", data);
      this.$nextTick(() => {
        if(this.data.length > 0) {
          this.$refs.tree.setCheckedKeys(data);
          setTimeout(() => {
            let checkedNodes = this.$refs.tree.getCheckedNodes() || [];
            this.isFirstSelect = false;
            this.sendOnCheck(checkedNodes)
          },300)
        }
      })
    },
    sendOnCheck(checkedNodes) {
      this.$emit("on-check", checkedNodes);
    },
    //清空选中
    resetChecked() {
      this.$refs.tree.setCheckedNodes([]);
      // console.log("当前选中节点", this.$refs.tree.getCheckedNodes());
      this.userSelect = [];
      if(this.data.length > 0) {
        this.defaultKeys = [this.data[0].i_id];
      }
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
