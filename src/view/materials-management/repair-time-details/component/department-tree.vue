<template>
  <div class="get-user-tree">
    <el-input
      ref="inputSearch"
      size="mini"
      :placeholder="`请输入${isContainEmp ? '人员' : '部门'}名称`"
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
          <i
            style="margin-right: 5px; color: #409eff"
            :class="data.type ? 'el-icon-office-building' : 'el-icon-user'"
          ></i
          >{{ node.label }}
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "department-tree",
  props: {
    // 是否包含人员(默认不包含)
    isContainEmp: {
      type: Boolean,
      default: false,
    },
    isShowCheckbox: {
      type: Boolean,
      default: true,
    },
    // 多选时子父是否关联
    isCheckStrictly: {
      type: Boolean,
      default: true,
    },
    // 功能类别(1:营运单元 2:维修单元 3:仓储单元, 默认营运单元)
    funcType: [Number, String],
    value: {},
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
      defaultKeys: [],
      id: "",
      isFirstSelect: true,
    };
  },
  created() {
    this.loadData();
    this.id = this.value;
  },
  watch: {
    valSelect(val) {
      this.$refs.tree.filter(val);
    },
    value(val) {
      if (val) {
        if (!this.isShowCheckbox) {
          this.setSelectCheckedKeys(val);
        }

        if (this.isShowCheckbox && this.isFirstSelect) {
          if (this.value && this.value.length > 0) {
            this.setCheckedkeys(this.value);
          }
        }
        this.isFirstSelect = true;
      }
    },
    funcType() {
      this.loadData();
    },
  },
  methods: {
    loadData() {
      this.loading = true;
      let params = {
        is_contain_emp: this.isContainEmp,
        show_all: false,
      };
      if (!!this.funcType) {
        params.func_type = this.funcType;
      }
      this.$client
        .getMaintainTree()
        .then((res) => {
          this.loading = false;
          // console.log(res);
          if (res.head.result === "200") {
            this.data = res.context;
            if (this.data.length > 0) {
              this.defaultKeys.push(this.data[0].i_id);
            }
            if (this.value !== "") {
              if (!this.isShowCheckbox) {
                this.setSelectCheckedKeys(this.value);
              }
              if (this.value.length > 0) {
                if (this.isShowCheckbox && this.isFirstSelect) {
                  this.setCheckedkeys(this.value);
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

      // this.$client.getMaintainTree()
      // .then(res => {
      //   // console.log(JSON.stringify(res))
      //   if (res.head.result == "200") {
      //     this.organizationTreeList = res.context;
      //     this.organizationTreeListLength = this.organizationTreeList.length;
      //     this.organizationloading = false;
      //     if( this.organizationTreeList.length == 0) {
      //         this.isFirstOrganization = true;
      //       }
      //     if(this.curSelectedDepartment && !this.organizationloading) {
      //         // 重新定位到目前组织树中
      //         this.locationCurNode();
      //       }
      //     } else {
      //       this.organizationloading = false;
      //       this.$message({
      //         showClose: true,
      //         message: res.head.describle,
      //         type: "error",
      //       });
      //     }
      // }).catch(err => {

      // })
    },
    // 聚焦搜索框
    inputFocus() {
      this.$nextTick(function () {
        this.$refs.inputSearch.focus();
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.c_name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      console.log("节点点击", data);
      if (!this.isShowCheckbox) {
        this.$emit("on-check", [data]);
        this.$emit("input", data.i_id);
      }
    },
    // 节点多选事件
    onCheck(data, nodes) {
      console.log(data);
      if (this.isShowCheckbox) {
        this.userSelect = this.$refs.tree.getCheckedNodes();
        this.$emit("input", nodes.checkedKeys);
        this.$emit("on-check", nodes.checkedNodes);
      }
      // 子父关联
      if (!this.isCheckStrictly && this.isShowCheckbox) {
        let checkedNodes = this.$refs.tree.getCheckedNodes() || [];
        let checkedKeys = this.$refs.tree.getCheckedKeys() || [];
        this.$emit("input", checkedKeys);
        this.$emit("on-check", checkedNodes);
      }
    },
    //设置选中节点
    setCheckedNodes(data) {
      console.log("设置选中节点", data);
      setTimeout(() => {
        this.$refs.tree.setCheckedNodes(data);
      }, 100);
      // this.$refs.tree.setCheckedNodes(data);
    },
    //设置选中节点
    setCheckedkeys(data) {
      console.log("设置选中节点", data);
      this.$refs.tree.setCheckedKeys(data);
      setTimeout(() => {
        let checkedNodes = this.$refs.tree.getCheckedNodes() || [];
        console.log(checkedNodes);
        this.isFirstSelect = false;
        this.sendOnCheck(checkedNodes);
      }, 300);
    },
    sendOnCheck(checkedNodes) {
      if (this.isShowCheckbox) {
        this.$emit("on-check", checkedNodes);
      }
    },
    // 单选Id回显
    setSelectCheckedKeys(id) {
      setTimeout(() => {
        this.$refs.tree.setCurrentKey(id);
        let node = this.$refs.tree.getCurrentNode(id);
        if (node) {
          this.handleNodeClick(node);
        }
      }, 60);
    },
    // 设置当前的key
    setCurrentKey(currentKey) {
      // this.defaultKeys = currentKey;
      // alert(JSON.stringify(this.defaultKeys))
      setTimeout(() => {
        this.$refs.tree.setCurrentKey(currentKey[0]);
      }, 100);
      // this.$refs.tree.setCurrentKey(currentKey[0]);
    },

    findSelectedNode() {},

    // 找对应的ID 节点数据
    outNode(node) {
      if (node.dept_id == this.defaultKeys[0]) {
        this.handleNodeClick(node);
        return false;
      }
      if (!!node.children.length) {
        node.children.forEach((item) => {
          this.outNode(item);
        });
      }
    },

    //清空选中
    resetChecked() {
      this.$refs.tree.setCheckedNodes([]);
      // console.log("当前选中节点", this.$refs.tree.getCheckedNodes());
      this.userSelect = [];
      if (this.data.length > 0) {
        this.defaultKeys = [this.data[0].i_id];
      }
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
