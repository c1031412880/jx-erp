<template>
  <div class="get-charge-station-tree">
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
      :check-strictly="true"
      :expand-on-click-node="true"
      :data="data"
      node-key="id"
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
          <i style="margin-right: 5px; color:#409EFF ;font-weight: 800;"  :class="!data.type ? 'el-icon-location-information' : 'el-icon-odometer'"></i
          >{{ node.label }}
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "get-charge-station-tree",
  props:{
    isShowCheckbox: {
      type:Boolean,
      default: true
    },
    placeholder:{
      type:String,
      default: '请输入关键词'
    },
    value: {}
  },
  data() {
    return { 
      loading: false,
      valSelect: "",
      data: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      curSelectNode: [],
      defaultKeys:[],
    };
  },
  created() {
    this.loadData();
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
    loadData() {
      this.loading = true;
      this.$client
        .getChargeStationTreeDataBase()
        .then((res) => {
          console.log(JSON.stringify(res));
          if (res.head.result === "200") {
            this.data = res.context;
            if(this.data.length > 0) {
              this.defaultKeys.push(this.data[0].id)
            }
            if (this.value !== '') {
              this.setSelectCheckedKeys(this.value)
            }
          }
          this.loading = false;
        })
        .catch((err) => {});
    },
    // 聚焦搜索框
    inputFocus() {
      this.$nextTick(function () {
        this.$refs.inputSearch.focus();
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return !!data.name && data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      console.log('节点点击',data)
      if(!this.isShowCheckbox) {
        this.$emit("on-check", [data]);
        this.$emit('input', data.id)
      }
    },
    // 节点多选事件
    onCheck(data, nodes) {
      // console.log(nodes)
      if(this.isShowCheckbox) {
        this.curSelectNode = this.$refs.tree.getCheckedNodes();
        this.$emit("on-check", nodes.checkedNodes,nodes.checkedKeys);
      }
    },
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
          this.$refs.tree.setCurrentKey([]);
        },100)
      // this.$refs.tree.setCurrentKey(currentKey[0]);
    },
    setCheckedkeys(keys) {
      setTimeout(() => {
        this.$refs.tree.setCheckedKeys([]);
      }, 60);
    },
    
    resetChecked() {
      if(this.data.length > 0) {
        this.defaultKeys = [this.data[0].id];
      }
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.get-charge-station-tree {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
