<template>
  <div class="get-vehicle-tree">
    <el-input
      ref="inputSearch"
      size="mini"
      :placeholder="placeholder"
      prefix-icon="el-icon-search"
      v-model="valSelect"
    ></el-input>
    <div class="scap-radio" v-if="showScap">
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
      :expand-on-click-node="true"
      :data="data"
      node-key="i_id"
      :props="defaultProps"
      :default-expanded-keys="defaultKeys"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
      @check-change="onCheck"
      style="margin-top: 10px"
      ref="tree"
    >
      <div class="custom-tree-node show-flex-box-r" slot-scope="{ node, data }">
        <span class="show-flex-box-r" style="align-items: center">
          <!-- <i style="margin-right: 5px; color:#409EFF" :class="data.type == 1 ? 'el-icon-office-building' : data.type == 2 ? 'el-icon-s-unfold': 'el-icon-truck'"></i> -->
          <i
            class="show-flex-box-r"
            style="margin-right: 5px; width: 13px; height: 13px; flex-shrink: 0"
          >
            <img
              src="@/assets/components/org.png"
              alt=""
              style="flex-shrink: 0; height: 100%; width: 100%; object-fit: cover"
              v-if="data.type == 1"
            />
            <img
              src="@/assets/components/line.png"
              alt=""
              style="flex-shrink: 0; height: 100%; width: 100%; object-fit: cover"
              v-if="data.type == 2"
            />
            <img
              src="@/assets/components/car.png"
              alt=""
              style="flex-shrink: 0; height: 100%; width: 100%; object-fit: cover"
              v-if="data.type == 3"
            />
          </i>
          <span style="margin-right: 25px; margin-bottom: 3px">{{ node.label }}</span>
        </span>
      </div>
    </el-tree>
  </div>
</template>

<script>
import { debounce } from '@/utils/index'

export default {
  name: 'get-vehicle-tree',
  props: {
    value: {},
    isContainEmp: {
      type: Boolean,
      default: false
    },
    isShowCheckbox: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请输入关键词'
    },
    isName: {
      type: Number,
      default: 1
    },
    oilType: {
      type: [String, Number],
      default: 0 //0是全部车辆 1是燃油车 2纯电动
    },
    codeAndName: {
      // 展示形式为 自编号(车牌号)
      type: Boolean,
      default: false
    },
    // 是否显示 scapshow 筛选
    showScap: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      valSelect: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'c_name'
      },
      curSelectNode: [],
      defaultKeys: [],
      notTypeKey: [],
      isBool: true,
      loading: false,
      scapshow: 1,
      debounceFilter: null,
    }
  },
  created() {
    this.loadData()
    this.$emit('on-scap', this.scapshow)
    this.debounceFilter = debounce((val) => {
      this.$refs.tree && this.$refs.tree.filter(val);
      if(!val) {
        this.allExpanded && this.allExpanded(false)
      }
    }, 300);
  },
  watch: {
    valSelect(val) {
      this.debounceFilter(val);
    },
    value(newValue) {
      // console.log(newValue, 'ceshishuju')
      this.setCheckedKeys(newValue)
      this.setCurrentKey(newValue)
    }
  },
  methods: {
    // 咱开或收起树节点
    allExpanded(isCanGo) {
      // 展开还是收起
      var treeNodeList = this.$refs.tree.store._getAllNodes()

      for (var i = 0; i < treeNodeList.length; i++) {
        treeNodeList[i].expanded = isCanGo
      }
    },
    scapChange() {
      this.$emit('on-scap', this.scapshow)
      if (this.isShowCheckbox) {
        this.$emit('input', null)
        this.$emit('on-change', [], [])
        this.outNodesName()
      } else {
        this.$emit('input', null)
        this.$emit('on-change', [], [])
        this.outNodesName()
      }
      this.loadData()
    },
    loadData() {
      this.loading = true
      let params = {
        oil_type: this.oilType
      }
      let scapshow = this.scapshow - 1
      if (scapshow > -1) params.scapshow = scapshow
      this.$client
        .getVehicleTree(params)
        .then(res => {
          // console.log(JSON.stringify(res));
          if (res.head.result === '200') {
            this.data = res.context
            this.setLineId(this.data)
            console.log(this.data)
            if (this.codeAndName) {
            }
            if (!!this.data && this.data.length) {
              this.defaultKeys.push(this.data[0].i_id)
            }
            if (this.value) {
              this.setCheckedKeys(this.value)
              this.setCurrentKey(this.value)
            }
          }
          this.loading = false
        })
        .catch(err => {})
    },
    // 设置线路唯一id
    setLineId(list) {
      list.forEach(item => {
        if (item.type === 2) {
          item.i_id = item.i_id + '_' + item.parent_id
        }
        if (item.children && item.children.length) {
          this.setLineId(item.children)
        }
      })
    },
    // 聚焦搜索框
    inputFocus() {
      this.$nextTick(function () {
        this.valSelect = ''
        this.$refs.inputSearch.focus()
      })
    },
    // 数据筛选
    filterNode(value, data) {
      // console.log(value,data)
      if (!value) return true
      return !!data.c_name && data.c_name.indexOf(value) !== -1
    },
    // 节点点击事件
    handleNodeClick(data) {
      if (!this.isBool) {
        return false
      }
      if (!this.isShowCheckbox) {
        if (data.type === 3) {
          this.$emit('input', data.i_id)
          this.$emit('on-check', [data.i_id], [data])
          this.outNodesName()
        }
      }
    },
    // 节点多选事件
    onCheck() {
      if (this.isShowCheckbox) {
        this.notTypeKey = []
        let curSelectNode = this.$refs.tree.getCheckedNodes()
        let nodes = []
        let keys = []
        for (let i = 0; i < curSelectNode.length; i++) {
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
        this.$emit('on-check', keys, [...nodes])
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
          nodes = this.$refs.tree.getCheckedNodes()
        } else {
          let node = this.$refs.tree.getCurrentNode()
          if (node) {
            nodes.push(node)
          }
        }
        nodes.forEach(item => {
          if (item.type == 3) {
            names.push(item.c_name)
          }
        })
        this.$emit('on-names', names)
      }, 100)
    },
    // 返回父组节点
    outGroupTreeNode(nodes, node, key = 'i_id') {
      let groupNode = null
      const out = (as, a) => {
        for (let i = 0; i < as.length; i++) {
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
      out(nodes, node)
      return groupNode
    }
  }
}
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
