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
      node-key="i_id"
      :props="defaultProps"
      :default-expanded-keys="defaultKeys"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
      @check-change="onCheck"
      style="margin-top: 20px"
      ref="tree"
    >
      <div class="custom-tree-node show-flex-box-r" slot-scope="{ node, data }">
        <span class="show-flex-box-r" style="align-items: center;">
          <!-- <i style="margin-right: 5px; color:#409EFF" :class="data.type == 1 ? 'el-icon-office-building' : data.type == 2 ? 'el-icon-s-unfold': 'el-icon-truck'"></i> -->
          <i class="show-flex-box-r" style="margin-right: 5px; width: 13px;height: 13px;flex-shrink: 0;">
            <img src="@/assets/components/org.png" alt="" style="flex-shrink: 0; height: 100%;width: 100%;object-fit: cover;" v-if="data.type == 1">
            <img src="@/assets/components/line.png" alt="" style="flex-shrink: 0; height: 100%;width: 100%;object-fit: cover;" v-if="data.type == 2">
            <img src="@/assets/components/car.png" alt="" style="flex-shrink: 0; height: 100%;width: 100%;object-fit: cover;" v-if="data.type == 3">
          </i>
          <span style="margin-right: 25px; margin-bottom: 3px;">{{node.label}}</span>
        </span>
      </div>
    </el-tree>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  name: "get-vehicle-tree",
  props:{
    value: {},
    isContainEmp:{
      type: Boolean,
      default: false
    },
    isShowCheckbox: {
      type: Boolean,
      default: true
    },
    placeholder:{
      type: String,
      default: '请输入关键词'
    },
    // codeAndName: {    // 展示形式为 自编号(车牌号)
    //   type: Boolean,
    //   default: false
    // }
    data: [Array]
  },
  data() {
    return {
      valSelect: "",
      defaultProps: {
        children: "children",
        label: "c_name",
      },
      curSelectNode: [],
      defaultKeys:[],
      notTypeKey: [],
      isBool: true,
      loading: false
    };
  },
  created() {
  },
  watch: {
    valSelect(val) {
      this.$refs.tree.filter(val);
    },
    value(newValue) {
      // console.log(newValue, 'ceshishuju')
      this.setCheckedKeys(newValue)
      // this.setCurrentKey(newValue)
    }
  },
  methods: {
    // loadData() {
    //   this.loading = true;
    //   let params = {
    //     oil_type: this.oilType
    //   }
    //   this.$client
    //     .getVehicleTree(params)
    //     .then((res) => {
    //       // console.log(JSON.stringify(res));
    //       if (res.head.result === "200") {
    //         this.data = res.context;
    //         if(!!this.data && this.data.length){
    //           this.defaultKeys.push(this.data[0].i_id)
    //         }
    //         if (this.value) {
    //           this.setCheckedKeys(this.value)
    //           this.setCurrentKey(this.value)
    //         }
    //       }
    //       this.loading = false;
    //     })
    //     .catch((err) => {});
    // },
    // 聚焦搜索框
    inputFocus() {
      this.$nextTick(function () {
        this.valSelect = '';
        this.$refs.inputSearch.focus();
      })
    },
    // 数据筛选
    filterNode(value, data) {
      // console.log(value,data)
      if (!value) return true;
      return !!data.c_name && data.c_name.indexOf(value) !== -1
    },
    // 节点点击事件
    handleNodeClick(data) {
      if (!this.isBool) {
        return false
      }
      if (data.type === 3) {
        this.$emit('input', data.i_id)
        this.$emit("on-check", [data.i_id],[data]);
        this.outNodesName()
      }
    },
    // 节点多选事件
    onCheck() {
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
    },
    // 设置勾选节点
    setCheckedKeys(keys) {
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
    // // 设置选中节点
    // setCurrentKey(key) {
    //   if (this.isShowCheckbox) {
    //     return false
    //   }
    //   this.isBool = false
    //   setTimeout(() => {
    //     this.$refs.tree.setCurrentKey(key || null)
    //     setTimeout(() => {
    //       this.isBool = true
    //     }, 100)
    //     this.outNodesName()
    //   }, 100)
    // },
    // 名称回显
    outNodesName() {
      let nodes = []
      let names = []
      setTimeout(() => {
          nodes = this.$refs.tree.getCheckedNodes();
        // if (this.isShowCheckbox) {
        //   nodes = this.$refs.tree.getCheckedNodes();
        // } else {
        //   let node = this.$refs.tree.getCurrentNode();
        //   if (node) {
        //     nodes.push(node)
        //   }
        // }
        nodes.forEach(item => {
          if (item.type == 3) {
            names.push(item.c_name)
          }
        })
        this.$emit('on-names', names)
      }, 100)
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
