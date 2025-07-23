<template>
  <div ref="organizationTree" class="organization-tree">
    <!-- <el-input size="mini" :placeholder="placeholder" v-model="filterText" style="margin-bottom: 20px;">
       <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input> -->

    <el-tree
      class="filter-tree"
      :check-strictly="true"
      ref="elTree"
      :data="data"
      node-key="i_id"
      :default-expanded-keys="defaultKeys"
      :default-checked-keys="defaultKeys"
      :props="defaultProps"
      :show-checkbox="showCheckbox"
      :expand-on-click-node="isNodeExpanded"
      :highlight-current="true"
      :filter-node-method="filterNode"
      v-loading="loading"
      @node-click="handleNodeClick"
      @check-change="SelecedCheckedKeys"
      @check="onCheck"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <i style="margin-right: 5px; color:#409EFF" :class="!data.type ? 'el-icon-s-promotion' : 'el-icon-s-custom'"></i
          >{{ node.label }}
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from '@/utils/index'
export default {
  watch: {
    filterText(val) {
      this.debounceFilter(val);
    },
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
    // loading: {
    //   type: Boolean,
    //   default: false,
    // },
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
        label: "c_name",
      },
      currentKey: null,
      isFirstLoad: true,
      debounceFilter: null,
    };
  },
  created() {
    this.lodData();
    this.debounceFilter = debounce((val) => {
      this.$refs.tree && this.$refs.tree.filter(val);
      if(!val) {
        this.allExpanded && this.allExpanded(false)
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
      return data.c_name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      if(this.showCheckbox) {
        return
      }
      console.log(data, "选中");
      //   this.currentKey = data.id
      this.$emit("on-tree", data);
    },
    // 获取数据
    lodData() {
      this.loading = true;
      this.$client.getRoleTree({is_show: this.is_show})
      .then(res => {
        this.loading = false;
        // console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          // this.data = res.context;
          this.data = this.bulidRoleData(res.context)
          this.bulidRoleGroupOptions(res.context);
          // this.currentKey = this.data[0].id;
          // this.$refs.elTree.setCurrentKey(this.currentKey);
          if(this.isFirstLoad) {
            // this.handleNodeClick(this.data[0])
            // this.setSelecedCheckedKeys([this.data[0].i_id])
          }
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
    bulidRoleData(nodes) {
      if(!!nodes && nodes.length > 0) {
        nodes.forEach((node,index) => {
            node.disabled = true;
          if(!!node.children && node.children.length>0) {
           this.bulidRoleData(node.children)
          }
          
        });
      }else{

      }
      return nodes
    },
     // 节点多选事件
    onCheck(data, nodes) {
      // this.orgSelect = this.$refs.elTree.getCheckedNodes();

      // console.log(this.orgSelect)
      console.log(nodes)
      this.$emit("on-check", nodes.checkedNodes, nodes.checkedKeys);
    },
    SelecedCheckedKeys() {
      let nodes = this.$refs.elTree.getCheckedNodes()
      let keys = this.$refs.elTree.getCheckedKeys()
      this.$emit('on-check-change', nodes, keys)
    },
    setSelecedCheckedKeys(ids) {
      // alert(JSON.stringify(ids))
      setTimeout(() => {
        this.defaultKeys = ids;
        this.$refs.elTree.setCurrentKey(ids[0]);
      },50)
    },
    setSelectCheckedKeys(keys) {
      this.defaultKeys = keys
      this.$refs.elTree.setCheckedKeys(keys);
      setTimeout(() => {
        this.SelecedCheckedKeys()
      }, 60)
    },
    // 构建角色组选项
    bulidRoleGroupOptions(roleGroupList) {
      let roleGroupOptions = [];
      roleGroupList.forEach((item,index) => {
        let obj = {
          value: item.i_id,
          label: item.c_name
        };
        roleGroupOptions.push(obj)
      });

      this.$emit('bulid-rolegroup-options', roleGroupOptions)
    }
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
