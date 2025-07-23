<template>
  <div class="get-user-tree">
    <el-input
      ref="inputSearch"
      size="mini"
      :placeholder="`请输入${isContainEmp? '人员':'部门'}名称`"
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
      :check-strictly="isCheckStrictly"
      :expand-on-click-node="false"
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
          <i style="margin-right: 5px; color:#409EFF" :class="data.type ? 'el-icon-office-building' : 'el-icon-user'"></i>
          <span style="margin-right: 25px">{{ node.label }}</span>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "department-tree",
  props:{
    // 是否包含人员(默认不包含)
    isContainEmp:{
      type:Boolean,
      default: false
    },
    isShowCheckbox: {
      type:Boolean,
      default: true
    },
    // 多选时子父是否关联
    isCheckStrictly: {
      type:Boolean,
      default: true
    },
    show_all: {
      type:Boolean,
      default: false
    },
    // 功能类别(1:营运单元 2:维修单元 3:仓储单元, 默认营运单元)
    funcType:[Number,String],
    value: {},
    isParentOrganization: {
      type: Boolean,
      default: false
    },
    ownId: {}
  },
  data() {
    return {
      loading: false,
      valSelect: "",
      data: [],
      defaultProps: {
        children: "children",
        label: "c_name",
      },
      userSelect: [],
      defaultKeys:[],
      id: '',
      isFirstSelect: true
    };
  },
  created() {
    this.loadData();
    this.id = this.value
  },
  watch: {
    valSelect(val) {
      this.$refs.tree.filter(val);
      if(!val) {
        this.allExpanded(false)
      }
    },
    value(val) {
      if (val) {

        if(!this.isShowCheckbox && (this.isFirstSelect || !this.isContainEmp) && this.data.length > 0) {
          this.setSelectCheckedKeys(val)
        }
        // 影响审批单人员 存在副部门的时候  的选择了   如果影响了 别的地方 用其他方法  这个别用了
        // if (!this.isShowCheckbox && this.isContainEmp  && this.data.length > 0) {
        //   this.setSelectCheckedKeys(val)
        // }
        if(this.isShowCheckbox && this.isFirstSelect) {
          if(this.value && this.value.length > 0) {
            this.setCheckedkeys(this.value)
          }
        }
        // this.isFirstSelect = true;
      }
    },
    funcType() {
      this.loadData();
    },
    // isContainEmp() {
    //   this.loadData();
    // }
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
    loadData() {
      this.loading = true;
      let params = {
        is_contain_emp: this.isContainEmp,
        show_all: this.show_all
      };
      if(!!this.funcType) {
        params.func_type = this.funcType
      }
      this.$client
        .getUserEmps(params)
        .then((res) => {
          this.loading = false;
          // console.log(res);
          if (res.head.result === "200") {
            this.data = this.setDisabled(res.context);
            if (this.isParentOrganization) {
              this.weedingSubsets(this.data,this.ownId)
            }
            console.log('data',this.data);
            if(this.data.length > 0) {
              this.defaultKeys.push(this.data[0].i_id)
            }
            if (this.value !== '') {
              if(!this.isShowCheckbox){
                this.setSelectCheckedKeys(this.value)
              }
              if(this.value.length > 0) {
                if(this.isShowCheckbox && this.isFirstSelect) {
                  this.setCheckedkeys(this.value)
                  // console.log(this.value)
                }
              }
              this.isFirstSelect = true;

            }
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    setDisabled(val) {
      let txt = ['公交一分公司','公交二分公司','公交三分公司','公交四分公司','五分公司']
      val.forEach(item => {
        if(!txt.includes(item.c_name)) {
          item.disabled = true
        }
        if(item.children && item.children.length > 0) {
          this.setDisabled(item.children)
        }
      })
      return val
    },
    // 组织架构选择中  剔除子集
    weedingSubsets(data,value) {
      data.forEach((item,index) =>{
        if (item.i_id == value || item.parent_id == value) {
          data.splice(index,1)
        } else if (item.children && item.children.length !== 0) {
          return this.weedingSubsets(item.children,value)
        }
      })
    },
    // 聚焦搜索框
    inputFocus() {
      this.$nextTick(function () {
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
        let id = this.isContainEmp ? 'index' : 'i_id'
        // 获取当前节点父级节点
        let parentNode = this.outGroupTreeNode(this.data, data, id);
        this.isFirstSelect = false
        // console.log(parentNode)
        this.$emit("on-check", [data], parentNode);
        this.$emit('input', data.i_id)

      }
    },
    // 节点多选事件
    onCheck(data, nodes) {
      console.log(data)
      if(this.isShowCheckbox) {
        this.userSelect = this.$refs.tree.getCheckedNodes();
        this.$emit('input', nodes.checkedKeys)
        this.$emit("on-check", nodes.checkedNodes);
      }
      // 子父关联
      if(!this.isCheckStrictly && this.isShowCheckbox) {
        let checkedNodes = this.$refs.tree.getCheckedNodes() || [];
        let checkedKeys = this.$refs.tree.getCheckedKeys() || [];
        this.$emit('input', checkedKeys)
        this.$emit("on-check", checkedNodes);
      }
    },
    //设置选中节点
    setCheckedNodes(data) {
      console.log("设置选中节点", data);
      setTimeout(() => {
          this.$refs.tree.setCheckedNodes(data);
        },100)
      // this.$refs.tree.setCheckedNodes(data);
    },
    //设置选中节点
    setCheckedkeys(data) {
      console.log("设置选中节点----------------------", data);
      this.$nextTick(() => {
        if(this.data.length > 0) {
          this.$refs.tree.setCheckedKeys(data);
          setTimeout(() => {
            let checkedNodes = this.$refs.tree.getCheckedNodes() || [];
            console.log(checkedNodes)
            this.isFirstSelect = false;
            this.sendOnCheck(checkedNodes)
          },300)
        }
      })


    },
    sendOnCheck(checkedNodes) {
      if(this.isShowCheckbox) {
        this.$emit("on-check", checkedNodes);
      }
    },
    // 单选Id回显
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
      // this.defaultKeys = currentKey;
      // alert(JSON.stringify(this.defaultKeys))
      setTimeout(() => {
          this.$refs.tree.setCurrentKey(currentKey[0]);
        },100)
      // this.$refs.tree.setCurrentKey(currentKey[0]);
    },

    findSelectedNode() {

    },

    // 找对应的ID 节点数据
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
    },
    // 获取当前节点的父级节点
    outGroupTreeNode(nodes,node, key = 'i_id') {
      let groupNode  = null
      const out = (as, a) => {
        for(let i =0;i<as.length;i++) {
          if (as[i][key] === node[key]) {
            groupNode = a
            break
          } else {
            if (as[i].children) {
              out(as[i].children, as[i])
            }
          }
        }
      }
      out(nodes,node)
      return groupNode
    },

    //清空选中
    resetChecked() {
      this.$refs.tree.setCheckedNodes([]);
      // console.log("当前选中节点", this.$refs.tree.getCheckedNodes());
      this.userSelect = [];
      if(this.data.length > 0) {
        this.defaultKeys = [this.data[0].i_id];
      }
      this.isFirstSelect = true
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.get-user-tree {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
