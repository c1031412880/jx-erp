<template>
  <el-popover
    placement="bottom"
    trigger="click"
    v-model="visible"
    :disabled="disabled">
    <div style="max-height: 300px;overflow:auto;" :style="`${!!width? `min-width: ${width}px;` : ''}`">
      <department-tree
        v-model="id"
        ref="tree"
        :isShowCheckbox="isShowCheckbox"       
        @on-check="departmentCheck"
        :isContainEmp="isContainEmp"
        :show_all="show_all"
        :funcType="funcType"
        :isCheckStrictly="isCheckStrictly"
        :isParentOrganization="isParentOrganization"
        :ownId="ownId"
      ></department-tree>
    </div>
    <el-input
      :clearable="clearable"
      slot="reference"
      @clear="onClear"
      @input="inputOut"
      :disabled="disabled"
      :placeholder="placeholder? placeholder :`请选择${isContainEmp? '人员':'部门'}`"
      prefix-icon="el-icon-search"
      v-model="input_names" class="popover-input-box">
    </el-input>
  </el-popover>
</template>

<script type="text/ecmascript-6">
  import departmentTree from './department-tree'
  export default {
    name: "get-driver-select-tree",
    components: {departmentTree},
    props: {
      value: {},
      ownId: {},
      placeholder: [String],
      // 是否包含人员(默认不包含)
      isContainEmp: {
        type: Boolean,
        default: false
      },
      // 是否包含所有人员(默认不包含)
      show_all: {
        type:Boolean,
        default: false
      },
      // 是否显示多选框
      isShowCheckbox: {
        type: Boolean,
        default: true
      },
      // 功能类别(1:营运单元 2:维修单元 3:仓储单元)
      funcType:[Number,String],
      width: {
        type:[String,Number],
        default: '',
      },
      disabled: {
        type:Boolean,
        default: false,
      },
      // 是否多选
      isExportMultiple: {
        type: Boolean,
        default: true
      },
      // 多选时子父是否关联   true为不关联
      isCheckStrictly: {
        type:Boolean,
        default: true
      },
      // 组织架构 是否剔除自己或子集
      isParentOrganization: {
        type: Boolean,
        default: false
      },
      clearable: {
        type:Boolean,
        default: true
      },
    },
    watch:{
      value(newVal) {
        this.id = newVal
        // alert(JSON.stringify(newVal))
        // this.$refs.tree.findSelectedNode()

      },
      visible(vaule) {
        if(vaule) {
          this.$refs.tree.inputFocus()
        }
      }
    },
    data() {
      return {
        id: '',
        input_names: '',
        input_names_old: '',
        visible: false,
      }
    },
    mounted() {
      this.id = this.value
    },
    methods: {
      departmentCheck(node,parentNode) {
        // alert(JSON.stringify(node))
        let nodes = []
        let vehs = []
        let names = []
        node.forEach(item => {
          if(!this.isContainEmp) {
            if (item.type) {
              nodes.push(item)
              vehs.push(item.i_id)
              names.push(item.c_name)
            }
          }else{
            if (!item.type) {
              nodes.push(item)
              vehs.push(item.i_id)
              names.push(item.c_name)
            }
          }
        })
        this.input_names_old = names.toString()
        this.input_names = names.toString()
        if(this.isExportMultiple) {
          this.$emit('input', vehs)
        }else{
          this.$emit('input', vehs[0])
          this.visible = false
        }
        this.$emit('on-change', vehs, nodes, parentNode)
        // 回显人员tree选中
        this.$refs.tree.setCheckedNodes(node);
        if (!this.isExportMultiple) {
          this.$refs.tree.setCurrentKey(vehs);
        }
      },
      inputOut() {
        console.log("inputout")
        this.input_names = this.input_names_old.toString()
      },
      onClear() {
        // alert(1111)
        this.input_names_old = ''
        this.input_names = ''
        this.$refs.tree.resetChecked()
        this.$refs.tree.setCheckedNodes([]);
        this.$refs.tree.setCurrentKey([]);
        if(this.isExportMultiple) {
            this.$emit('input', [])
         }else{
            this.$emit('input', '')
        }
        this.$emit('on-change', [])      },
      // 回显
      setCheckedKeys(keys) {
        this.$refs.tree.setCheckedkeys(keys);
      },
      // 设置当前的key
      setCurrentKey(keys) {
        this.$refs.tree.setCurrentKey(keys);
      },
      updateData() {
        this.$refs.tree.loadData()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.popover-input-box{
  // width 300px
}

</style>
