<template>
  <div class="party-personnel-tree">
    <el-input
      ref="inputSearch"
      size="mini"
      :placeholder="placeholder"
      prefix-icon="el-icon-search"
      v-model="valSelect">
    </el-input>
    <!-- check-strictly 子父节点不相关 -->
    <el-tree
      v-loading="loading"
      :show-checkbox="isShowCheckbox"
      :highlight-current="true"
      :check-on-click-node="isShowCheckbox"
      :check-strictly="isCheckStrictly"
      :expand-on-click-node="true"
      :data="data"
      node-key="id"
      :props="defaultProps"
      :default-expanded-keys="defaultKeys"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
      @check-change="onCheck"
      style="margin-top: 20px"
      ref="tree"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <i style="margin-right: 5px; color:#409EFF" :class="data.type == 1 ? 'el-icon-wind-power' : data.type == 2 ? 'el-icon-user': ''"></i>
          <span style="margin-right: 25px">{{ node.label }}</span>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from '@/utils/index'

export default {
  name: "party-personnel-tree",
  props:{
    value: {},
    isContainEmp:{
      type:Boolean,
      default: false
    },
    isShowCheckbox: {
      type:Boolean,
      default: true
    },
    isCheckStrictly: {
      type:Boolean,
      default: true
    },
    placeholder:{
      type:String,
      default: '请输入关键词'
    },
    isName: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      valSelect: "",
      data: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      curSelectNode: [],
      defaultKeys:[],
      notTypeKey: [],
      isBool: true,
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
      console.log(newValue, 'ceshishuju')
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
    loadData() {
      this.loading = true;
      this.$client
        .getPartyUserTreeDataBase()
        .then((res) => {
          // console.log(JSON.stringify(res));
          if (res.head.result === "200") {
            this.data = res.context;
            if (this.value) {
              this.setCheckedKeys(this.value)
              this.setCurrentKey(this.value)
            }
          }
          this.loading = false;
        })
        .catch((err) => {});
    },
    // 聚焦搜索框
    inputFocus() {
      this.$nextTick(function () {
        this.$refs.inputSearch.focus();
      })
    },
    // 数据筛选
    filterNode(value, data) {
      console.log(value,data)
      if (!value) return true;
      return !!data.name && data.name.indexOf(value) !== -1
    },
    // 节点点击事件
    handleNodeClick(data) {
      if (!this.isBool) {
        return false
      }
      if(!this.isShowCheckbox) {
        if (data.type === 2) {
          this.$emit('input', data.id)
          this.$emit("on-check", [data.id],[data]);
          this.outNodesName()
        }
      }
    },
    // 节点多选事件
    onCheck() {
      if(this.isShowCheckbox) {
        this.notTypeKey = []
        let curSelectNode = this.$refs.tree.getCheckedNodes();
        let nodes = []
        let keys = []
        for(let i = 0;i<curSelectNode.length;i++) {
          let item = curSelectNode[i]
          if (item.type === 2) {
            nodes.push(item)
            keys.push(item.id)
          } else {
            this.notTypeKey.push(item.id)
          }
        }
        if (!this.isBool) {
          return false
        }
        this.$emit('input', keys)
        this.$emit("on-check", keys, [...nodes]);
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
      let nodes = []
      let names = []
      setTimeout(() => {
        if (this.isShowCheckbox) {
          nodes = this.$refs.tree.getCheckedNodes();
        } else {
          let node = this.$refs.tree.getCurrentNode();
          if (node) {
            nodes.push(node)
          }
        }
        nodes.forEach(item => {
          if (item.type == 2) {
            names.push(item.name)
          }
        })
        this.$emit('on-names', names)
      }, 100)
    },
    // 返回父组节点
    outGroupTreeNode(nodes,node, key = 'id') {
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
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.party-personnel-tree {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
