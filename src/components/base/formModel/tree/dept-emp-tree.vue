<template>
  <div class="get-vehicle-tree">
    <el-input
      size="mini"
      ref="inputSearch"
      :placeholder="placeholder"
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
      :expand-on-click-node="true"
      :data="data"
      node-key="i_id"
      :props="defaultProps"
      :default-expanded-keys="defaultKeys"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
      @check="onCheck"
      :check-strictly="!is_contain_emp"
      style="margin-top: 20px"
      ref="tree"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <i style="margin-right: 5px; color:#409EFF" :class="data.type == 1 ? 'el-icon-office-building' : data.type == 2 ? 'el-icon-user': 'el-icon-user'"></i>
          <span style="margin-right: 25px">{{ node.label }}</span>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from '@/utils/index'

export default {
  name: "dept-emp-tree",
  props:{
    value: {},
    isShowCheckbox: {
      type:Boolean,
      default: true
    },
    placeholder:{
      type:String,
      default: '请输入关键词'
    },
    // 是否包含人员(默认不包含)
    is_contain_emp: {
      type: Boolean,
      default: false
    },
    // 是否包含从属人员(默认不包含)
    show_all: {
      type: Boolean,
      default: false
    },
    // 功能类别(1:营运单元 2:维修单元 3:仓储单元, 默认营运单元)
    func_type: {
      type: [Number, String],
      default: 1
    }
  },
  data() {
    return {
      valSelect: "",
      data: [],
      defaultProps: {
        children: "children",
        label: "c_name",
      },
      curSelectNode: [],
      defaultKeys:[],
      isBool: true,
      notTypeKey: [],
      loading: false,
      debounceFilter: null,
    };
  },
  created() {
    this.loadData();
    this.debounceFilter = debounce((val) => {
      this.$refs.tree && this.$refs.tree.filter(val);
      if(!val) {
        this.allExpanded(false)
      }
    }, 300);
  },
  watch: {
    valSelect(val) {
      this.debounceFilter(val);
    },
    value(newValue) {
      this.setCheckedKeys(newValue)
      this.setCurrentKey(newValue)
    }
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
    // 聚焦搜索框
    inputFocus() {
      this.$nextTick(function () {
        this.$refs.inputSearch.focus();
      })
    },
    loadData() {
      this.loading = true;
      this.$client
        .getUserEmps({
          is_contain_emp: this.is_contain_emp,
          show_all: this.show_all,
          func_type: this.func_type
        })
        .then((res) => {
          if (res.head.result === '200') {
            this.data = res.context;
            this.setCheckedKeys(this.value)
            this.setCurrentKey(this.value)
          }
          this.loading = false;
        })
        .catch((err) => {});
    },

    filterNode(value, data) {
      // console.log(value,data)
      if (!value) return true;

      return !!data.c_name && data.c_name.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      if(!this.isShowCheckbox) {
        this.$emit("on-check", [data]);
        this.$emit('input', data.i_id)
        this.outNodesName()
      }
    },
    // 节点多选事件
    onCheck(data, nodes) {
      if(this.isShowCheckbox) {
        let curSelectNode = this.$refs.tree.getCheckedNodes();
        this.notTypeKey = []
        let nodes = []
        let keys = []
        if (this.is_contain_emp) {
          for(let i = 0;i<curSelectNode.length;i++) {
            let item = curSelectNode[i]
            if (item.type === 0) {
              nodes.push(item)
              keys.push(item.i_id)
            } else {
              this.notTypeKey.push(item.i_id)
            }
          }
        } else {
          nodes = curSelectNode
          keys = this.$refs.tree.getCheckedKeys();
        }

        if (!this.isBool) {
          return false
        }
        // this.$emit()
        this.$emit('input', keys)
        this.$emit("on-check", nodes,keys);
        this.outNodesName()
      }
    },
    // 设置勾选节点
    setCheckedKeys(keys) {
      if (!this.isShowCheckbox) {
        return false
      }
      let arr = []
      if (keys) {
        if (keys.length > 0) {
          arr = [...keys]
        }
      }
      this.isBool = false
      setTimeout(() => {
        if (arr.length) {
          this.$refs.tree.setCheckedKeys([...arr, ...this.notTypeKey])
        } else {
          this.$refs.tree.setCheckedKeys([])
        }
        setTimeout(() => {
          this.isBool = true
        }, 100)
        this.outNodesName()
      }, 60)
    },
    // 设置选中节点
    setCurrentKey(key) {
      if (this.isShowCheckbox) {
        return false
      }
      this.isBool = false
      setTimeout(() => {
        this.$refs.tree.setCurrentKey(key || null)
        setTimeout(() => {
          this.isBool = true
        }, 100)
        this.outNodesName()
      }, 100)
    },
    // 名称回显
    outNodesName() {
      setTimeout(() => {
        let nodes = []
        let names = []
        let values = []
        let valueObj = {}
        if (this.isShowCheckbox) {
          nodes = this.$refs.tree.getCheckedNodes();
        } else {
          let node = this.$refs.tree.getCurrentNode();
          if (node) {
            nodes.push(node)
          }
        }
        nodes.forEach(item => {
          if (this.is_contain_emp) {
            if (item.type === 0) {
              valueObj[item.i_id] = {
                value: item.i_id,
                label: item.c_name
              }
            }
          } else {
            valueObj[item.i_id] = {
              value: item.i_id,
              label: item.c_name
            }
          }
        })
        Object.keys(valueObj).forEach(key => {
          let item = valueObj[key]
          names.push(item.label)
          values.push(item)
        })
        this.$emit('on-names', names, values)
      }, 100)
    },
    // 返回父组节点
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
      this.curSelectNode = [];
      this.defaultKeys = [];
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.get-vehicle-tree {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
