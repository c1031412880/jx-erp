<template>
  <el-popover
    placement="bottom"
    trigger="click"
    v-model="visible"
    :disabled="disabled">
    <div style="max-height: 300px;overflow:auto;" :style="`${!!width? `min-width: ${width}px;` : ''}`">
      <get-assets
        v-model="id"
        ref="tree"
        :isShowCheckbox="isShowCheckbox"
        :placeholder="'请输入关键词'"       
        @on-check="lineCheck"
        :type="type"
      ></get-assets>
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
  import GetAssets from './get-assets'
  export default {
    name: "get-driver-select-tree",
    components: {GetAssets},
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
      type: {
        type: Number,
        default: 1
      }
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
      lineCheck(node) {
        // alert(JSON.stringify(node))
        let nodes = []
        let drivers = []
        let names = []
        node.forEach(item => {
          // 0人员 1部门 2线路 3车辆
          if (item.type) {
            nodes.push(item)
            drivers.push(item.id)
            names.push(item.name)
          }
        })
        this.input_names_old = names.toString()
        this.input_names = names.toString()
        if(this.isExportMultiple) {
          this.$emit('input', drivers)
        }else{
          this.$emit('input', drivers[0])
          if(drivers.length > 0) {
            this.visible = false
          }
        }
        this.$emit('on-change', drivers, nodes)
        // // 回显tree选中
        // this.$refs.tree.setCheckedNodes(node);
        // this.$refs.tree.setCurrentKey(drivers);
      },
      inputOut() {
        console.log("inputout")
        this.input_names = this.input_names_old.toString()
      },
      onClear() {
        // alert(1111)
        this.input_names_old = ''
        this.input_names = ''
        this.$refs.tree.setCurrentKey([]);
        this.$refs.tree.resetChecked()
        if(this.isExportMultiple) {
          this.$emit('input', [])
        }else{
          this.$emit('input', '')
        }
        
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
