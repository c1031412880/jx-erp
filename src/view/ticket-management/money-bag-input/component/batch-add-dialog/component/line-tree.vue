<template>
  <div class="get-vehicle-tree">
    <el-input
      ref="inputSearch"
      size="mini"
      :placeholder="placeholder"
      prefix-icon="el-icon-search"
      clearable
      v-model="valSelect"
    ></el-input>
    <div class="scap-radio">
      <el-radio-group v-model="scapshow" @change="scapChange">
        <el-radio :label="0">全部</el-radio>
        <el-radio :label="1">营运</el-radio>
        <el-radio :label="2">报废</el-radio>
      </el-radio-group>
    </div>
    <!-- check-strictly 子父节点不相关 -->
    <el-tree
      v-loading="loading"
      :show-checkbox="isShowCheckbox"
      :highlight-current="true"
      :check-on-click-node="isShowCheckbox"
      :check-strictly="false"
      :expand-on-click-node="isNodeExpanded"
      :data="data"
      node-key="i_id"
      :props="defaultProps"
      :default-expanded-keys="defaultKeys"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
      @check="onCheck"
      style="margin-top: 10px"
      ref="tree"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <el-tooltip class="item" effect="dark" :content="node.label" placement="top">
          <span>
            <i
              style="margin-right: 5px; color: #409eff"
              :class="
                data.type == 1
                  ? 'el-icon-office-building'
                  : data.type == 2
                  ? 'el-icon-s-unfold'
                  : 'el-icon-truck'
              "
            ></i>
            {{ node.label }}
          </span>
        </el-tooltip>
        <!-- <span v-else>
          <i style="margin-right: 5px; color:#409EFF" :class="data.type == 1 ? 'el-icon-office-building' : data.type == 2 ? 'el-icon-s-unfold': 'el-icon-truck'"></i
          >{{ node.label }}
        </span> -->
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
    isNodeExpanded:{
      type: Boolean,
      default:true,
    },
    placeholder:{
      type:String,
      default: '请输入关键词'
    }
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
      curSelectNode: [],
      defaultKeys:[],
      scapshow: 1
    };
  },
  created() {
    this.loadData();
    this.id = this.value
  },
  // mounted() {
  //   this.id = this.value
  // },
  watch: {
    valSelect(val) {
      this.$refs.tree.filter(val);
      if(!val) {
        this.allExpanded(false)
      }
    },
    value(val) {
      if (val) {
        this.setSelectCheckedKeys(val)
      }
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
    scapChange() {
      if (this.isShowCheckbox) {
        this.$emit('input', null)
        this.$emit('on-check', [])
      } else {
        this.$emit('input', null)
        this.$emit('on-check', [])
      }
      this.loadData()
    },
    loadData() {
      this.loading = true;
      let params = {
        // is_contain_emp: this.isContainEmp,
        // show_all: false
      }
      let scapshow = this.scapshow - 1
      if (scapshow > -1) params.scapshow = scapshow
      this.$client
        .getVehicleTree(params)
        .then((res) => {
          // console.log(JSON.stringify(res));
          if (res.head.result === "200") {
            this.data = res.context;
            this.setLineId(this.data)
            if(this.data.length > 0) {
              this.defaultKeys.push(this.data[0].i_id)
            }
            if(this.curSelectNode.length > 0) {
              this.setCheckedNodes(this.curSelectNode);
            }
            if (this.value !== '') {
              this.setSelectCheckedKeys(this.value)
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
          item.i_id = item.parent_id + '_' + item.i_id
        }
        if(item.children && item.children.length) {
          this.setLineId(item.children)
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
      return !!data.c_name && data.c_name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      console.log('节点点击',data)
      if(!this.isShowCheckbox) {
        this.$emit("on-check", [data]);
        this.$emit('input', data.i_id)
      }
    },
    // 节点多选事件
    onCheck(data, nodes) {
      // console.log(nodes)
      if(this.isShowCheckbox) {
        this.curSelectNode = this.$refs.tree.getCheckedNodes();
        this.$emit('input', nodes.checkedKeys)
        this.$emit("on-check", nodes.checkedNodes);
      }
    },
    //设置选中节点
    setCheckedNodes(data) {
      // console.log("设置选中节点", data);
      this.curSelectNode = data;
      setTimeout(() => {
          this.$refs.tree.setCheckedNodes(data);
        },100)
      // this.$refs.tree.setCheckedNodes(data);
    },
    //id设置数回显
    setSelectCheckedKeys(id) {
      setTimeout(() => {
        this.$refs.tree.setCurrentKey(id)
        let node = this.$refs.tree.getCurrentNode(id)
        if (node) {
          this.handleNodeClick(node)
        }
      }, 60)
    },
    //设置选中节点
    setCheckedkeys(data) {
      console.log("设置选中节点", data);
      this.$refs.tree.setCheckedKeys(data);
    },
    // 设置当前的key
    setCurrentKey(currentKey) {
      this.defaultKeys = currentKey;
      // alert(JSON.stringify(this.defaultKeys))
      setTimeout(() => {
          this.$refs.tree.setCurrentKey(currentKey[0]);
        },100)
      // this.$refs.tree.setCurrentKey(currentKey[0]);
    },

    //清空选中
    resetChecked() {
      this.$refs.tree.setCheckedNodes([]);
      // console.log("当前选中节点", this.$refs.tree.getCheckedNodes());
      this.curSelectNode = [];
      if(this.data.length > 0) {
        this.defaultKeys = [this.data[0].i_id];
      }
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.get-vehicle-tree {
  width: 100%;
  height: 100%;
  overflow: auto;
  .scap-radio{
    width: 100%;
    margin-top: 10px;
  }
}
</style>
