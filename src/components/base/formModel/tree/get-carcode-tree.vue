<template>
  <div class="get-vehicle-code-tree">
    <el-input
      ref="inputSearch"
      size="mini"
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
      :check-strictly="false"
      :expand-on-click-node="true"
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
      <div class="custom-tree-node show-flex-box-r" slot-scope="{ node, data }">
        <span class="show-flex-box-r" style="align-items: center;">
          <!-- <i style="margin-right: 5px; color:#409EFF" :class="data.type == 1 ? 'el-icon-office-building' : data.type == 2 ? 'el-icon-s-unfold': 'el-icon-truck'"></i> -->
          <i class="show-flex-box-r" style="margin-right: 5px; width: 13px;height: 13px;flex-shrink: 0;">
            <img src="@/assets/components/org.png" alt="" style="flex-shrink: 0; height: 100%;width: 100%;object-fit: cover;" v-if="data.type == 1">
            <img src="@/assets/components/line.png" alt="" style="flex-shrink: 0; height: 100%;width: 100%;object-fit: cover;" v-if="data.type == 2">
            <img src="@/assets/components/car.png" alt="" style="flex-shrink: 0; height: 100%;width: 100%;object-fit: cover;" v-if="data.type == 3">
          </i>
          <span style="margin-right: 25px; margin-bottom: 3px;">{{data.type == 3 ? data.number : node.label}}</span>
        </span>
      </div>
    </el-tree>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from '@/utils/index'
// import { get_driver_tree } from 'api/basicInfomation-api'
export default {
  name: "get-vehicle-code-tree",
  props:{
    isShowCheckbox: {
      type:Boolean,
      default: true
    },
    placeholder:{
      type:String,
      default: '请输入关键词'
    },
    oilType: {
      type: [String,Number],
      default: 0    //0是全部车辆 1是燃油车
    },
    value: {}
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
      debounceFilter: null,
    };
  },
  created() {
    this.loadData();
    this.debounceFilter = debounce((val) => {
      this.$refs.tree.filter(val);
      if(!val) {
        this.allExpanded(false)
      }
    }, 300);
  },
  watch: {
    valSelect(val) {
      this.debounceFilter(val);
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
    loadData() {
      this.loading = true;
      let params = {
        oil_type: this.oilType
      }
      this.$client
        .getVehicleTree(params)
        .then((res) => {
          if (res.head.result === "200") {
            this.data = res.context;
            this.setLineId(this.data)
            if(this.data.length > 0) {
              this.defaultKeys.push(this.data[0].i_id)
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
          item.i_id = item.i_id + '_' + item.parent_id
        }
        if(item.children && item.children.length) {
          this.setLineId(item.children)
        }
      })
    },
    // 聚焦搜索框
    inputFocus() {
      this.$nextTick(function () {
        this.valSelect = '';
        this.$refs.inputSearch.focus();
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return !!data.number && data.number.indexOf(value) !== -1;
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
        this.$emit("on-check", nodes.checkedNodes,nodes.checkedKeys);
      }
    },
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
      this.defaultKeys = currentKey;
      // alert(JSON.stringify(this.defaultKeys))
      setTimeout(() => {
          this.$refs.tree.setCurrentKey(currentKey[0]);
        },100)
      // this.$refs.tree.setCurrentKey(currentKey[0]);
    },

    resetChecked() {
      if(this.data.length > 0) {
        this.defaultKeys = [this.data[0].i_id];
      }
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.get-vehicle-code-tree {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
