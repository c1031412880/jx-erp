<template>
  <el-popover
    placement="bottom"
    trigger="click"
    v-model="visible"
    :disabled="disabled">
    <div style="max-height: 300px;overflow:auto;" :style="`${!!width? `min-width: ${width}px;` : ''}`">
      <dept-emp-tree
        v-model="id"
        ref="tree"
        :isShowCheckbox="isShowCheckbox"
        :placeholder="'请输入关键词'"
        :is_contain_emp="is_contain_emp"
        :show_all="show_all"
        :func_type="func_type"
        @on-check="vehicleCheckNew"
        @input="setInput"
        @on-names="inputNames"
      ></dept-emp-tree>
    </div>
    <el-input
      clearable
      slot="reference"
      @clear="onClear"
      :placeholder="placeholder"
      prefix-icon="el-icon-search"
      :disabled="disabled"
      :value="input_names" class="popover-input-box">
    </el-input>
  </el-popover>
</template>

<script type="text/ecmascript-6">
import deptEmpTree from './dept-emp-tree'
export default {
  name: "get-dept-emp-select-tree",
  components: {deptEmpTree},
  props: {
    value: {},
    placeholder: [String],
    isShowCheckbox:{
      type: Boolean,
      default: false
    },
    disabled:{
      type: Boolean,
      default: false
    },
    width: {
      type:[String,Number],
      default: '',
    },
    isExportMultiple: {
      type: Boolean,
      default: true
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
  watch:{
    value(newVal) {
      this.id = newVal
      if (!newVal) {
        this.input_names = ''
      }
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
      visible: false
    }
  },
  mounted() {
    this.id = this.value
  },
  methods: {
    inputNames(names) {
      this.input_names = names.toString()
    },
    vehicleCheck(node) {
      // alert(JSON.stringify(node))
      let nodes = []
      let vehs = []
      let names = []
      node.forEach(item => {
        nodes.push(item)
        vehs.push(item.i_id)
        names.push(item.c_name)
      })
      this.input_names = names.toString()
      if(this.isShowCheckbox) {
        this.$emit('input', vehs)
      }else{
        this.$emit('input', this.id)
      }
      this.$emit('on-change', vehs, nodes)
    },
    // input返回
    setInput(val) {
      this.$emit('input', val)
    },
    // 点击或者多选返回
    vehicleCheckNew(value, node) {
      if(!this.isExportMultiple) {
        if(node.length > 0) {
          this.visible = false
        }
      }
      this.$emit('on-change', value, node)
    },
    onClear() {
      // alert(1111)
      this.input_names = ''
      this.id = this.isShowCheckbox ? [] : ''
      // this.$refs.tree.resetChecked()
      // this.$refs.tree.setCheckedNodes([]);
      // this.$refs.tree.setCurrentKey(null);
      if(this.isShowCheckbox) {
        this.$emit('input', [])
      }else{
        this.$emit('input', '')
      }

      this.$emit('on-change', [])
    },
    // // 回显
    // setCheckedKeys(keys) {
    //   this.$refs.tree.setCheckedkeys(keys);
    // },
    // // 设置当前的key
    // setCurrentKey(keys) {
    //   this.$refs.tree.setCurrentKey(keys);
    // }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.popover-input-box{
  // width 300px
}

</style>
