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
      node-key="index"
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
          <i style="margin-right: 5px; color:#409EFF" :class="data.type == 1 ? 'el-icon-office-building' : data.type == 2 ? 'el-icon-user': 'el-icon-user'"></i
          >{{node.label }}
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
      checkedKeys: [],
      idObj: {},
      indexObj: {},
      num: 1,
      id: '',
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
  mounted() {
    this.loadData();
  },
  created() {
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
    value(newValue) {
      this.id = this.isShowCheckbox ? [] : ''
      // this.notTypeKey = []
      if (this.isShowCheckbox) {
        let list = newValue
        list.forEach(id => {
          let isIdx = false
          let ids = this.idObj[id] ? this.idObj[id] : []
          for(let i=0;i<ids.length;i++) {
            if (this.checkedKeys.indexOf(ids[i]) > -1) {
              this.id = [...this.id,ids[i]]
              isIdx = true
            }
          }
          if (!isIdx) {
            this.id = [...this.id,...ids]
          }
        })
      } else {
        this.id = this.idObj[newValue] ? this.idObj[newValue][0] : ''
      }
      // console.log(this.id, '参数')
      this.setCheckedKeys(this.id)
      this.setCurrentKey(this.id)
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
      this.$nextTick(() => {
        this.$refs.inputSearch.focus();
      })
    },
    loadData() {
      this.loading = true;
      // console.log(1,this.show_all)
      this.$client
        .GetFillDeptEmpTreeDataBase({
          is_contain_emp: this.is_contain_emp,
          show_all: this.show_all,
          func_type: this.func_type
        })
        .then((res) => {
          this.loading = false;
          if (res.head.result === '200') {
            let data = res.context;
            data.forEach(node => {
              this.buildNodeObj(node)
            })
            this.data = data
            this.id = this.isShowCheckbox ? [] : ''
            if (this.isShowCheckbox) {
              let list = this.value
              list.forEach(id => {
                let isIdx = false
                let ids = this.idObj[id] ? this.idObj[id] : []
                for(let i=0;i<ids.length;i++) {
                  if (this.checkedKeys.indexOf(ids[i]) > -1) {
                    this.id = [...this.id,ids[i]]
                    isIdx = true
                  }
                }
                if (!isIdx) {
                  this.id = [...this.id,...ids]
                }
              })
            } else {
              this.id = this.idObj[this.value] ? this.idObj[this.value][0] : ''
            }
            // console.log('刷新的',this.id, this.data)
            this.setCheckedKeys(this.id)
            this.setCurrentKey(this.id)
          }
        })
        .catch((err) => {});
    },
    // 节点初始化
    buildNodeObj(node) {
      node.index = this.num
      if (this.idObj.hasOwnProperty(node.i_id)) {
        this.idObj[node.i_id].push(this.num)
      } else {
        this.idObj[node.i_id] = [this.num]
      }
      this.indexObj[this.num] = node.i_id
      this.num++
      if (node.children) {
        let length = node.children.length
        for(let i=0;i<length;i++) {
          this.buildNodeObj(node.children[i])
        }
      }
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
      this.checkedKeys = nodes.checkedKeys
      if(this.isShowCheckbox) {
        let curSelectNode = this.$refs.tree.getCheckedNodes();
        this.notTypeKey = []
        let notTypeKey = []
        let nodes = []
        let keys = []
        if (this.is_contain_emp) {
          for(let i = 0;i<curSelectNode.length;i++) {
            let item = curSelectNode[i]
            if (item.type === 0) {
              nodes.push(item)
              keys.push(item.i_id)
            } else {
              this.notTypeKey = [...this.notTypeKey, item.index]
            }
          }
          // this.notTypeKey = notTypeKey
        } else {
          nodes = curSelectNode
          let indexs = this.$refs.tree.getCheckedKeys();
          // console.log(indexs, '节点')
          let idObj = {}
          if (indexs) {
            indexs.forEach(idx => {
              idObj[this.indexObj[idx]] = idx
            })
          }
          keys = Object.keys(idObj)
        }
        if (!this.isBool) {
          return false
        }
        let newArr = keys.reduce((pre,cur)=>{
          if(!pre.includes(cur)){
            return pre.concat(cur)
          }else{
            return pre
          }
        },[])
        // console.log('选择',keys,newArr, this.notTypeKey)
        // this.$emit()
        this.$emit('input', newArr)
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
          // this.$refs.tree.setCheckedKeys(this.notTypeKey.length > 1 ? [] : this.notTypeKey)
          this.$refs.tree.setCheckedKeys([])
          if (this.notTypeKey.length) {
            // this.$message({message: '当前组织下没有人员不可勾选', type: 'warning'});
            this.notTypeKey = []
          }
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
                label: item.c_name,
                index: item.index
              }
            }
          } else {
            valueObj[item.i_id] = {
              value: item.i_id,
              label: item.c_name,
              index: item.index
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
    filterNotKeys(index) {
      let keys = this.notTypeKey.filter(obj => {
        return obj !== index
      })
      this.notTypeKey = keys
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
