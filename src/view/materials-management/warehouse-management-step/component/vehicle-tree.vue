<template>
  <div class="get-vehicle-tree">
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
      :check-strictly="false"
      :expand-on-click-node="true"
      :data="data"
      node-key="c_name"
      :props="defaultProps"
      :default-expanded-keys="defaultKeys"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
      @check-change="onCheck"
      style="margin-top: 20px"
      ref="tree"
      :key="key"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <i style="margin-right: 5px; color:#409EFF" :class="data.type == 1 ? 'el-icon-office-building' : data.type == 2 ? 'el-icon-s-unfold': 'el-icon-truck'"></i
          >{{data.type != 3 ? data.c_name : data.new_name  }}
        </span>
          <!-- >{{data.type == 1 ? data.c_name : (car_type == 2 ? (data.lable || data.c_name) : data.c_name)  }} -->
      </span>
    </el-tree>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  name: "get-vehicle-tree",
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
    placeholder:{
      type:String,
      default: '请输入关键词'
    },
    isName: {
      type: Number,
      default: 1
    },
    // 1 车牌号 2 自编号
    car_type: {
      type: Number,
      default: 2
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
      notTypeKey: [],
      isBool: true,
      loading: false,
      key: null
    };
  },
  created() {
    // if (this.car_type == 1) {
    //   this.defaultProps = {
    //     children: "children",
    //     label: "c_name",
    //   }
    // } else {
    //   this.defaultProps = {
    //     children: "children",
    //     label: "lable",
    //   }
    // }
    this.loadData();
  },
  watch: {
    valSelect(val) {
      this.$refs.tree.filter(val);
    },
    value(newValue) {
      console.log(newValue, 'ceshishuju')
      this.setCheckedKeys(newValue)
      this.setCurrentKey(newValue)
    }
  },
  methods: {
    loadData() {
      this.loading = true;
      this.$client
        .getVehicleTree()
        .then((res) => {
          // console.log(JSON.stringify(res));
          if (res.head.result === "200") {
            this.data = res.context;
            this.setLineId(this.data)
            this.assemblyData(this.data)
            if (this.value) {
              this.setCheckedKeys(this.value)
              this.setCurrentKey(this.value)
            }
          }
          this.loading = false;
        })
        .catch((err) => {});
    },
    // 设置线路唯一id
    setLineId(list) {
      list.forEach(item => {
        if(item.type === 2) {
          item.i_id = item.i_id + '_' + item.parent_id
        }
        if(item.children && item.children.length) {
          this.setLineId(item.children)
        }
      })
    },
    // 组装数据  将自编号和车牌和组装
    assemblyData(data) {
      data.forEach(item => {
        if (item.type == 3) {
          item.new_name = `${item.lable}(${item.c_name})`
        }else {
          if (item.children.length > 0) {
            this.assemblyData(item.children)
          }
        }
      })
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
      return !!data.new_name && data.new_name.indexOf(value) !== -1
    },
    // 节点点击事件
    handleNodeClick(data) {
      if (!this.isBool) {
        return false
      }
      if(!this.isShowCheckbox) {
        if (data.type === 3) {
          this.$emit('input', data.c_name)
          this.$emit("on-check", data.i_id,[data]);
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
          if (item.type === 3) {
            nodes.push(item)
            keys.push(item.i_id)
          } else {
            this.notTypeKey.push(item.i_id)
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
          if (item.type == 3) {
            names.push(item.new_name)
          }
        })
        this.$emit('on-names', names)
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
