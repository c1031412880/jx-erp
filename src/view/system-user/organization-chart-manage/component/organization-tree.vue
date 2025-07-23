<template>
  <div ref="organizationTree" class="organization-tree">
    <el-input :placeholder="placeholder" v-model="filterText" style="margin-bottom: 20px;" size="mini">
       <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>


    <el-tree
      class="filter-tree"
      :check-strictly="true"
      ref="elTree"
      :data="organizationTreeList"
      node-key="dept_id"
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
          {{ node.data.dept_name }} ({{data.count? data.count : '0'}})
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
        this.setSelecedCheckedKeys([this.organizationTreeList[0].dept_id]);
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
      data: [
        {
          id: 1,
          label: "嘉兴公交",
          num: 1999,
          children: [
            {
              id: 2,
              label: "二级 1-1",
              children: [
                {
                  id: 3,
                  label: "三级 1-1-1",
                },
                {
                  id: 4,
                  label: "三级 1-1-2",
                },
              ],
            },
            {
              id: 5,
              label: "二级 1-1",
              children: [
                {
                  id: 6,
                  label: "三级 1-1-1",
                },
                {
                  id: 7,
                  label: "三级 1-1-2",
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "dept_name",
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
      return data.dept_name.indexOf(value) !== -1;
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
      if (node.dept_id == this.defaultKeys[0]) {
        this.handleNodeClick(node)
        return false
      }
      if (!!node.children.length) {
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
