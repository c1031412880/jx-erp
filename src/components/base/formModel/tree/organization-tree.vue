<template>
  <div ref="organizationTree" class="organization-tree">
    <el-input  :placeholder="placeholder" v-model="filterText" style="margin-bottom: 20px;" size="mini">
       <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>


    <el-tree
      class="filter-tree"
      :check-strictly="false"
      ref="elTree"
      :data="organizationTreeList"
      node-key="dept_id"
      :default-expanded-keys="expandedDefaultKeys"
      :default-checked-keys="defaultKeys"
      :props="defaultProps"
      :show-checkbox="showCheckbox"
      :expand-on-click-node="isNodeExpanded"
      :highlight-current="true"
      :filter-node-method="filterNode"
      v-loading="organizationloading"
      @check="onCheck"
    >
          <!-- @check-change="handleNodeClick" -->
    <!-- @node-click="handleNodeClick" -->
       <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          {{ node.data.dept_name }}
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
    // organizationTreeList: [Array],
  },
  data() {
    return {
      filterText: "",
      defaultKeys:[], //选中的项
      expandedDefaultKeys:[], //展开的项 
      organizationTreeList: [
        {
          id: 1,
          label: "一级 1",
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
      organizationloading: false,
      orgSelect:[],
      data:[],
      newData:[],
      debounceFilter: null,
    };

  },
  created() {
    this.debounceFilter = debounce((val) => {
      this.$refs.tree && this.$refs.tree.filter(val);
      if(!val) {
        this.allExpanded && this.allExpanded(false)
      }
    }, 300);
  },
  mounted() {
    this.lodData();
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
      console.log(data, "选中");
      //   this.currentKey = data.id
      this.$emit("on-tree", data);
    },
      // 节点多选事件
    onCheck(data, nodes) {
      // this.orgSelect = this.$refs.elTree.getCheckedNodes();

      // console.log(this.orgSelect)
      console.log(nodes)
      this.$emit("on-check", nodes.checkedNodes, nodes.checkedKeys);
    },
    // 获取数据
    lodData() {
      // 获取组织tree信息
      this.organizationloading = true;
      this.$client.getOrganizationTree()
      .then(res => {
        // console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.organizationTreeList = res.context;
          this.data = res.context;
          // 设置回显状态
          // this.setSelecedCheckedKeys([1000017,1000016,1000018])
          // if(this.organizationTreeList.length > 0) {
          //   this.expandedDefaultKeys.push(this.organizationTreeList[0].dept_id)
          // }

          this.organizationloading = false;
          } else {
            this.organizationloading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {

      })
      // this.setSelecedCheckedKeys([this.organizationTreeList[0].dept_id])
      // this.currentKey = this.data[0].id;
      // this.$refs.elTree.setCurrentKey(this.currentKey);
    },
    setSelecedCheckedKeys(ids) {
      // alert(JSON.stringify(ids))
      this.defaultKeys = ids;
      this.expandedDefaultKeys = ids;
      this.organizationTreeList = this.data;
      this.$refs.elTree.setCheckedKeys(ids);
      // this.$refs.elTree.setCurrentKey(ids[0]);
      console.log(this.organizationTreeList);
    },
    setSelectData(ids) {
      this.newData = JSON.parse(JSON.stringify(this.data))
      this.handle(this.newData, ids)
      this.organizationTreeList = this.newData
    },
    handle(data, ids) {
      data.forEach(item => {
        item.disabled = ids.indexOf(item.dept_id) == -1 ? true : false
        if(item.children && item.children.length) this.handle(item.children, ids)
      })
    },
    // 清除选中
    resetChecked() {
      this.defaultKeys = [];
      this.$refs.elTree.setCheckedKeys([]);
      // alert(111)
      if(this.organizationTreeList.length > 0) {
        this.expandedDefaultKeys = [this.organizationTreeList[0].dept_id];
      }else{
        this.expandedDefaultKeys = [];
      }
      
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
