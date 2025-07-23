<template>
  <div ref="organizationTree" class="get-user-group-tree">
    <el-input size="mini" :placeholder="placeholder" v-model="filterText" style="margin-bottom: 20px;">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-tree
      class="filter-tree"
      :check-strictly="true"
      ref="elTree"
      :data="data"
      node-key="dept_id"
      :default-expanded-keys="defaultKeys"
      :default-checked-keys="defaultKeys"
      :props="defaultProps"
      :show-checkbox="showCheckbox"
      :expand-on-click-node="isNodeExpanded"
      :highlight-current="true"
      :filter-node-method="filterNode"
      v-loading="loading"
      @node-click="handleNodeClick"
      @check-change="setSelecedCheckedKeys"
    >
    </el-tree>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from '@/utils/index'
  export default {
    data() {
      return {
        debounceFilter: null,
      }
    },
    watch: {
      filterText(val) {
        this.debounceFilter(val);
      },
    },
    props: {
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
    },
    data() {
      return {
        filterText: "",
        defaultKeys:[],
        data: [],
        defaultProps: {
          children: "children",
          label: "dept_name",
        },
        currentKey: null,
      };
    },
    created() {
      this.lodData();
      this.debounceFilter = debounce((val) => {
        this.$refs.tree.filter(val);
        if(!val) {
          this.allExpanded(false)
        }
      }, 300);
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
      filterNode(value, data) {
        if (!value) return true;
        return data.dept_name.indexOf(value) !== -1;
      },
      handleNodeClick(data) {
        this.$emit("on-tree", data);
      },
      // 获取数据
      lodData() {
        this.$client.getOrganizationTree().then(req => {
          this.loading = false;
          if (req.head.result === "200") {
            this.data = req.context;
          } else {
            this.data = [];
          }
          if (this.defaultKeys.length) {
            this.setSelectCheckedKeys(this.defaultKeys)
          }
        })
      },
      setSelecedCheckedKeys() {
        let nodes = this.$refs.elTree.getCheckedNodes()
        let keys = this.$refs.elTree.getCheckedKeys()
        this.$emit('on-check-change', nodes, keys)
      },
      setSelectCheckedKeys(keys) {
        this.defaultKeys = keys
        this.$refs.elTree.setCheckedKeys(keys);
        setTimeout(() => {
          this.setSelecedCheckedKeys()
        }, 60)
      }
    },
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .get-user-group-tree {
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
