<template>
  <div ref="organizationTree" class="organization-tree">
    <el-input size="mini" :placeholder="placeholder" v-model="filterText" style="margin-bottom: 20px;">
       <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>

    <el-tree
      class="filter-tree"
      :check-strictly="true"
      ref="elTree"
      :data="data"
      node-key="id"
      :default-expanded-keys="defaultKeys"
      :props="defaultProps"
      :expand-on-click-node="true"
      :highlight-current="true"
      :filter-node-method="filterNode"
      v-loading="loading"
      @node-click="handleNodeClick"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <i style="margin-right: 5px; color:#409EFF" class="el-icon-folder"></i>
          <span style="margin-right: 25px">{{ node.label }}</span>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  watch: {
    filterText(val) {
      this.$refs.elTree.filter(val);
    },
  },
  props: {
    placeholder: [String],
    organizationTreeList: [Array],
    is_show: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      filterText: "",
      defaultKeys:[],
      loading: false,
      data: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      currentKey: null,
      isFirstLoad: true,
    };
  },
  created() {
    this.lodData();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      console.log(data, "选中");
      //   this.currentKey = data.id
      this.$emit("on-tree", data);
    },
    // 获取数据
    lodData() {
      this.loading = true;
      this.$client.GetGroupTree({is_show: this.is_show})
      .then(res => {
        this.loading = false;
        if (res.head.result == "200") {
          // this.data = res.context
          this.data = this.bulidLabelData(res.context);
          console.log('this.data',this.data);
          this.isFirstLoad = false;
          this.loading = false; 
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
          if (this.defaultKeys.length) {
            this.setSelectCheckedKeys(this.defaultKeys)
          }
      }).catch(err => {

      })
    },
    // 封装label
    bulidLabelData(nodes) {
      nodes.forEach(item => {
        if(!item.form_type) {
          item.label = item.name + '(' + item.form_count + ')'
          this.bulidLabelData(item.children)
        }else{
          item.label =  item.name
        }
      });
      return nodes
    },
    // SelecedCheckedKeys() {
    //   let nodes = this.$refs.elTree.getCheckedNodes()
    //   let keys = this.$refs.elTree.getCheckedKeys()
    //   this.$emit('on-check-change', nodes, keys)
    // },
    setSelectCheckedKeys(keys) {
      this.defaultKeys = keys
      this.$refs.elTree.setCheckedKeys(keys);
      setTimeout(() => {
        this.SelecedCheckedKeys()
      }, 60)
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.organization-tree {
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    width: calc(100% - 24px);
    overflow: hidden;

    .el-button--mini.is-circle {
      padding: 5px;
    }
  }
}
</style>
