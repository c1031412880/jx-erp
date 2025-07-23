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
import { debounce } from '@/utils/index'
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
      isFirstSelect: true,
      debounceFilter: null,
    };
  },
  created() {
    this.loadData();
    this.id = this.value
    this.debounceFilter = debounce((val) => {
      this.safeCallTree(() => {
        this.safeTreeMethod('filter', val);
        if (!val) {
          this.allExpanded(false)
        }
      });
    }, 300);
  },
  mounted() {
    // 确保tree组件完全渲染后再执行初始化逻辑
    this.$nextTick(() => {
      if (this.value) {
        if (!this.isShowCheckbox && this.data.length > 0) {
          this.setSelectCheckedKeys(this.value)
        }
        if (this.isShowCheckbox && this.value.length > 0) {
          this.setCheckedkeys(this.value)
        }
      }
    });
  },
  beforeDestroy() {
    // 清理定时器和引用
    if (this.debounceFilter) {
      this.debounceFilter.cancel && this.debounceFilter.cancel();
    }
    this.data = [];
    this.userSelect = [];
    this.defaultKeys = [];
  },
  errorCaptured(err, vm, info) {
    // 捕获子组件的错误
    console.error('Department tree error:', err);
    console.error('Error info:', info);
    
    // 如果是tree相关的错误，尝试重新初始化
    if (err.message && err.message.includes('tree') || err.message.includes('setCheckedNodes')) {
      console.warn('Tree related error detected, attempting to reinitialize...');
      this.$nextTick(() => {
        this.loadData();
      });
    }
    
    // 返回false以阻止错误继续传播
    return false;
  },
  watch: {
    valSelect(val) {
      this.debounceFilter(val);
    },
    value(val) {
      if (val) {
        // 延迟执行，确保组件完全渲染
        this.$nextTick(() => {
          if (!this.isShowCheckbox && (this.isFirstSelect || !this.isContainEmp) && this.data.length > 0) {
            this.setSelectCheckedKeys(val)
          }
          // 影响审批单人员 存在副部门的时候  的选择了   如果影响了 别的地方 用其他方法  这个别用了
          // if (!this.isShowCheckbox && this.isContainEmp  && this.data.length > 0) {
          //   this.setSelectCheckedKeys(val)
          // }
          if (this.isShowCheckbox && this.isFirstSelect) {
            if (this.value && this.value.length > 0) {
              this.setCheckedkeys(this.value)
            }
          }
          // this.isFirstSelect = true;
        });
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
    /**
     * 检查tree组件是否可用
     * @returns {boolean} tree组件是否存在且可用
     */
    isTreeReady() {
      if (!this.$refs.tree || !this.$refs.tree.$el) {
        return false;
      }
      
      const requiredMethods = [
        'setCheckedNodes', 'setCurrentKey', 'setCheckedKeys', 
        'getCheckedNodes', 'getCheckedKeys', 'getCurrentNode', 'filter'
      ];
      
      return requiredMethods.every(method => 
        this.$refs.tree[method] && typeof this.$refs.tree[method] === 'function'
      );
    },
    
    /**
     * 安全调用tree方法
     * @param {Function} callback 回调函数
     * @param {number} delay 延迟时间
     */
    safeCallTree(callback, delay = 0) {
      if (delay > 0) {
        setTimeout(() => {
          if (this.isTreeReady()) {
            try {
              callback();
            } catch (error) {
              console.error('Tree method call failed:', error);
            }
          }
        }, delay);
      } else {
        if (this.isTreeReady()) {
          try {
            callback();
          } catch (error) {
            console.error('Tree method call failed:', error);
          }
        }
      }
    },
    
    /**
     * 通用的tree方法调用包装器
     * @param {string} methodName 方法名
     * @param {Array} args 参数数组
     * @returns {*} 方法返回值或null
     */
    safeTreeMethod(methodName, ...args) {
      if (!this.isTreeReady()) {
        console.warn(`Tree not ready, cannot call ${methodName}`);
        return null;
      }
      
      try {
        const method = this.$refs.tree[methodName];
        if (typeof method === 'function') {
          return method.apply(this.$refs.tree, args);
        } else {
          console.warn(`Method ${methodName} is not a function`);
          return null;
        }
      } catch (error) {
        console.error(`Error calling tree method ${methodName}:`, error);
        return null;
      }
    },
    
    // 展开或收起树节点
    allExpanded(isCanGo) {
      this.safeCallTree(() => {
        if (this.$refs.tree.store) {
          var treeNodeList = this.$refs.tree.store._getAllNodes();
          for (var i = 0; i < treeNodeList.length; i++) {
            treeNodeList[i].expanded = isCanGo;
          }
        }
      });
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
            this.data = res.context;
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
        if (this.$refs.inputSearch) {
          this.$refs.inputSearch.focus();
        }
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
      if (this.isShowCheckbox) {
        this.safeCallTree(() => {
          this.userSelect = this.safeTreeMethod('getCheckedNodes') || [];
          this.$emit('input', nodes.checkedKeys)
          this.$emit("on-check", nodes.checkedNodes);
        });
      }
      // 子父关联
      if (!this.isCheckStrictly && this.isShowCheckbox) {
        this.safeCallTree(() => {
          let checkedNodes = this.safeTreeMethod('getCheckedNodes') || [];
          let checkedKeys = this.safeTreeMethod('getCheckedKeys') || [];
          this.$emit('input', checkedKeys)
          this.$emit("on-check", checkedNodes);
        });
      }
    },
    
    //设置选中节点
    setCheckedNodes(data) {
      console.log("设置选中节点", data);
      this.safeCallTree(() => {
        this.safeTreeMethod('setCheckedNodes', data);
      }, 100);
    },
    
    //设置选中节点
    setCheckedkeys(data) {
      console.log("设置选中节点----------------------", data);
      this.$nextTick(() => {
        if (this.data.length > 0) {
          this.safeCallTree(() => {
            this.safeTreeMethod('setCheckedKeys', data);
          });
          
          this.safeCallTree(() => {
            let checkedNodes = this.safeTreeMethod('getCheckedNodes') || [];
            console.log(checkedNodes)
            this.isFirstSelect = false;
            this.sendOnCheck(checkedNodes)
          }, 300);
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
      this.safeCallTree(() => {
        this.safeTreeMethod('setCurrentKey', id);
        let node = this.safeTreeMethod('getCurrentNode', id);
        if (node) {
          this.handleNodeClick(node);
        }
      }, 60);
    },
    
    // 设置当前的key
    setCurrentKey(currentKey) {
      if (currentKey && currentKey.length > 0) {
        this.safeCallTree(() => {
          this.safeTreeMethod('setCurrentKey', currentKey[0]);
        }, 100);
      }
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
      this.safeCallTree(() => {
        this.safeTreeMethod('setCheckedNodes', []);
        // console.log("当前选中节点", this.safeTreeMethod('getCheckedNodes'));
      });
      this.userSelect = [];
      if (this.data.length > 0) {
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
