<template>
  <div ref="organizationTree" class="organization-tree">
    <el-input :placeholder="placeholder" v-model="filterText" style="margin-bottom: 20px;" size="mini">
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
      :expand-on-click-node="isNodeExpanded"
      :highlight-current="true"
      :default-expand-all="true"
      :filter-node-method="filterNode"
      v-loading="loading"
      @node-click="handleNodeClick"
      @check-change="handleNodeClick"
    >
      <span class="custom-tree-node" slot-scope="{ node }">
        <span>{{ node.label }}
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
    isNodeExpanded:{
      type: Boolean,
      default:false,
    },
    placeholder: [String],
  },
  data() {
    return {
      filterText: "",
      defaultKeys:[],
      loading: false,
      data: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      currentKey: null,
      isFirstLoad: true,
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      // console.log(data, "选中");
      let node
      if(!data.children) {
        node = this.$refs.elTree.getNode(data.id);
      }
      console.log(data, node, '选中');
      //   this.currentKey = data.id
      this.$emit("on-tree", data);
    },
    // 获取数据
    loadData() {
      this.loading = true;
      let params = {
        context:{
          type: 2,
          page_index: 1,
          page_size: 999
        }
      }
      this.$client.GetByPageOaKqz(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    setSelecedCheckedKeys(ids) {
      // alert(JSON.stringify(ids))
      setTimeout(() => {
        this.defaultKeys = ids;
        this.$refs.elTree.setCurrentKey(ids[0]);
      },50)
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
