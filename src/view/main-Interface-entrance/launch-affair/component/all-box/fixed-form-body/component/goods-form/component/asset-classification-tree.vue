<template>
  <div ref="organizationTree" class="organization-tree">
    <div class="show-flex-box-r" style="margin-bottom: 20px; align-items:center;">
      <el-input :placeholder="placeholder" v-model="filterText" size="mini">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <i class="el-icon-refresh-left" style="margin-left:15px; font-size:21px; cursor: pointer;" @click="refreshTreeList"></i>
    </div>
    <el-tree
      class="filter-tree"
      :check-strictly="true"
      ref="elTree"
      :data="organizationTreeList"
      node-key="id"
      :default-expanded-keys="defaultKeys"
      :props="defaultProps"
      :show-checkbox="showCheckbox"
      :expand-on-click-node="isNodeExpanded"
      :highlight-current="true"
      :filter-node-method="filterNode"
      v-loading="loading"
      @node-click="handleNodeClick"
    >
      <span class="custom-tree-node" slot-scope="{ node }">
        <span>
          <i style="margin-right: 5px; color:#409EFF; font-weight: 800;" class="el-icon-folder" ></i>
          {{ node.data.name + ' (' + (node.data.code ? node.data.code : '00') + ')' }}
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
    organizationTreeListLength() {
      if(this.organizationTreeList.length > 0) {
        this.setSelecedCheckedKeys([this.organizationTreeList[0].id]);
      }
    }
  },
  props: {
    // defaultKeys: {
    //   type: Array,
    //   default: () => [1],
    // },
    isNodeExpanded:{
      type: Boolean,
      default:false,
    },
    showCheckbox:{
      type: Boolean,
      default:false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    placeholder: [String],
    organizationTreeList: [Array],
    organizationTreeListLength:[Number]
  },
  data() {
    return {
      filterText: "",
      defaultKeys:[],
      defaultProps: {
        children: "children",
        label: "name",
      },
      currentKey: null,
    };
  },
  mounted() {
    // this.$nextTick(()=> {
    //   this.lodData();
    // })
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      console.log(data, "选中");
      //   this.currentKey = data.id
      this.$emit("on-tree", data);
    },
    // 获取数据
    // lodData() {
    //   this.currentKey = this.organizationTreeList[0];
    //   this.$refs.elTree.setCurrentKey(this.currentKey);
    // },
    setSelecedCheckedKeys(ids) {
      // alert(JSON.stringify(this.organizationTreeList))
      console.log(ids,this.organizationTreeList)
      this.defaultKeys = ids;
      setTimeout(() => {
        this.$refs.elTree.setCurrentKey(ids[0]);
        this.outNode(this.organizationTreeList[0])
      }, 60)

    },
    outNode(node) {
      if (node.id == this.defaultKeys[0]) {
        this.handleNodeClick(node)
        return false
      }
      if (!!node.children && node.children.length > 0) {
        node.children.forEach(item => {
          this.outNode(item)
        })
      }
    },
    // 刷新树结构
    refreshTreeList() {
      this.$emit("refresh-tree")
    }
  }
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
