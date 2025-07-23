<template>
  <div ref="organizationTree" class="organization-tree">
    <el-input :placeholder="placeholder" v-model="filterText" style="margin-bottom: 20px;">
       <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-tree
      class="filter-tree"
      :check-strictly="true"
      ref="elTree"
      :data="organizationTreeList"
      node-key="node_id"
      :default-expanded-keys="defaultKeys"
      :props="defaultProps"
      :show-checkbox="showCheckbox"
      :expand-on-click-node="isNodeExpanded"
      :highlight-current="true"
      :filter-node-method="filterNode"
      v-loading="loading"
      @node-click="handleNodeClick"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
           <i style="margin-right: 5px; color:#409EFF" :class="data.is_house == 0 ? 'el-icon-office-building' : data.is_house == 1 ? 'el-icon-discount':'el-icon-discount'"></i>
          {{ node.data.node_name }}
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
        this.defaultKeys = [this.organizationTreeList[0].node_id];
        // this.setSelecedCheckedKeys([this.organizationTreeList[0].node_id]);
        // this.handleNodeClick(this.organizationTreeList[0])
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
        label: "node_name",
        // disabled: function(data, node) {
        //   console.log(data)
        //   // 禁用回收站选项
        //   if (!data.can_edit) {
        //     return true
        //   }
        // }
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
      return data.node_name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      console.log(data, "选中");
      // this.currentKey = data.node_id
      this.$emit("on-tree", data);
    },
    setSelecedCheckedKeys(ids) {
      console.log(ids,this.organizationTreeList)
      this.defaultKeys = ids;
      this.outNode(this.organizationTreeList[0])
      setTimeout(() => {
        this.$refs.elTree.setCurrentKey(ids[0]);
      }, 60)

    },
    outNode(node) {
      if (node.node_id == this.defaultKeys[0]) {
        this.handleNodeClick(node)
        return false
      }
      if (!!node.children && node.children.length > 0) {
        node.children.forEach(item => {
          this.outNode(item)
        })
      }
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
