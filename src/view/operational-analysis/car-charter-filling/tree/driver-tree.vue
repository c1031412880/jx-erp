<template>
  <el-popover
    placement="bottom"
    trigger="click"
    v-model="visible"
    :disabled="disabled">
    <div style="max-height: 300px;overflow:auto;" :style="`${!!width? `min-width: ${width}px;` : ''}`">
      <driver-tree
        v-model="id"
        ref="tree"
        :placeholder="'请输入关键词'"       
        :data="driverTree"
        @on-check="lineCheck"
      ></driver-tree>
    </div>
    <el-input
      clearable
      slot="reference"
      @clear="onClear"
      @input="inputOut"
      :placeholder="placeholder"
      prefix-icon="el-icon-search"
      :disabled="disabled"
      v-model="input_names" class="popover-input-box">
    </el-input>
  </el-popover>
</template>

<script type="text/ecmascript-6">
  import driverTree from './get-driver-tree'
  export default {
    name: "get-driver-select-tree",
    components: {driverTree},
    props: {
      value: {},
      placeholder: [String],
      disabled:{
        type: Boolean,
        default: false
      },
      width: {
        type:[String,Number],
        default: '',
      },
      driverTree: [Array],
    },
    watch:{
       value(newVal) {
        this.id = newVal
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
      lineCheck(node) {
        let nodes = []
        let drivers = []
        let names = []
        node.forEach(item => {
          // 0人员 1部门 2线路 3车辆
          if (!item.type) {
            nodes.push(item)
            drivers.push(item.i_id)
            names.push(item.c_name)
          }
        })
        this.input_names_old = names.toString()
        this.input_names = names.toString()
        this.$emit('input', drivers[0])
        if(drivers.length > 0) {
          this.visible = false
        }
        this.$emit('on-change', drivers, nodes)
        // // 回显tree选中
      },
      inputOut() {
        this.input_names = this.input_names_old.toString()
      },
      onClear() {
        this.input_names_old = ''
        this.input_names = ''
        this.$refs.tree.setCurrentKey([]);
        this.$refs.tree.resetChecked()
        this.$emit('input', '')
        this.$emit('on-change', [])
      },
      // 回显
      setCheckedKeys(keys) {
        this.$refs.tree.setCheckedkeys(keys);
      },
      // 设置当前的key
      setCurrentKey(keys) {
        this.$refs.tree.setCurrentKey(keys);
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.popover-input-box{
  // width 300px
}

</style>
