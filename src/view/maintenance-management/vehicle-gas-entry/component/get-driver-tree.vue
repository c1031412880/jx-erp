<template>
  <div class="get-driver-tree">
    <el-input
      ref="inputSearch"
      size="mini"
      :placeholder="placeholder"
      prefix-icon="el-icon-search"
      v-model="valSelect"
    >
    </el-input>
    <!-- check-strictly 子父节点不相关 -->
    <el-tree
      v-loading="loading"
      :show-checkbox="isShowCheckbox"
      :highlight-current="true"
      :check-on-click-node="isShowCheckbox"
      :check-strictly="false"
      :expand-on-click-node="true"
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
          <i style="margin-right: 5px; color:#409EFF" :class="data.type == 1 ? 'el-icon-office-building' : 'el-icon-user'"></i>
          <span style="margin-right: 25px">{{ node.label }}</span>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "get-driver-tree",
  props:{
    value: {},
    isContainEmp:{
      type:Boolean,
      default: false
    },
    isShowCheckbox: {
      type:Boolean,
      default: true
    },
    placeholder:{
      type:String,
      default: '请输入关键词'
    },
    data:{
      type:Array,
      default: []
    }
  },
  data() {
    return {
      loading: false,
      valSelect: "",
      defaultProps: {
        children: "children",
        label: "c_name",
      },
      curSelectNode: [],
      defaultKeys:[],
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
      if (val) {
        this.setSelectCheckedKeys(val)
      }
    }
  },
  methods: {
    initData(){
      this.loading = true;
        if(this.data.length > 0) {
          this.defaultKeys.push(this.data[0].i_id)
        }
        if(this.curSelectNode.length > 0) {
          this.setCheckedNodes(this.curSelectNode);
        }
        if (this.value !== '') {
          if (this.isShowCheckbox) {
            this.$refs.tree.setCheckedKeys(this.value);
            setTimeout(() => {
              let checkedNodes = this.$refs.tree.getCheckedNodes() || [];
              this.$emit("on-check", checkedNodes);
            },60)
          } else {
            this.setSelectCheckedKeys(this.value)
          }
        }

      this.loading = false;
    },
    // 聚焦搜索框
    inputFocus() {
      this.$nextTick(function () {
        this.valSelect = '';
        this.$refs.inputSearch.focus();
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.c_name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      console.log('节点点击',data)
      if(!this.isShowCheckbox) {
        this.$emit("on-check", [data]);
        this.$emit('input', data.i_id)
      }
    },
    // 节点多选事件
    onCheck(data, nodes) {
      // console.log(nodes)
      if(this.isShowCheckbox) {
        this.curSelectNode = this.$refs.tree.getCheckedNodes();
        this.$emit('input', nodes.checkedKeys)
        this.$emit("on-check", nodes.checkedNodes);
      }
    },
    //设置选中节点
    setCheckedNodes(data) {
      // console.log("设置选中节点", data);
      this.curSelectNode = data;
      setTimeout(() => {
          this.$refs.tree.setCheckedNodes(data);
        },100)
      // this.$refs.tree.setCheckedNodes(data);
    },
    //设置选中节点
    setCheckedkeys(data) {
      console.log("设置选中节点", data);
      this.$refs.tree.setCheckedKeys(data);
    },
    // Id回显
    setSelectCheckedKeys(id) {
      setTimeout(() => {
        this.$refs.tree.setCurrentKey(id)
        let node = this.$refs.tree.getCurrentNode(id)
        if (node) {
          this.handleNodeClick(node)
        }
      }, 60)
    },
    // 设置当前的key
    setCurrentKey(currentKey) {
      this.defaultKeys = currentKey;
      // alert(JSON.stringify(this.defaultKeys))
      setTimeout(() => {
          this.$refs.tree.setCurrentKey(currentKey[0]);
        },100)
      // this.$refs.tree.setCurrentKey(currentKey[0]);
    },

    //清空选中
    resetChecked() {
      this.$refs.tree.setCheckedNodes([]);
      // console.log("当前选中节点", this.$refs.tree.getCheckedNodes());
      this.curSelectNode = [];
      if(this.data.length > 0) {
        this.defaultKeys = [this.data[0].i_id];
      }else{
        this.defaultKeys = []
      }
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.get-driver-tree {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
