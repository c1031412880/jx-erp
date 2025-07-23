<template>
  <el-popover
    placement="bottom"
    trigger="click"
    v-model="visible"
    :disabled="disabled">
    <div style="max-height: 300px;overflow:auto;" :style="`${!!width? `min-width: ${width}px;` : ''}`">
      <get-charge-station-tree
        ref="tree"
        v-model="id"
        :isShowCheckbox="isShowCheckbox"
        :placeholder="'请输入关键词'"
        @on-check="carCodeCheck"
      ></get-charge-station-tree>
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
  import getChargeStationTree from './get-charge-station-tree'
  export default {
    name: "get-charge-station-select-tree",
    components: {getChargeStationTree},
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
    },
    watch:{
      value(val) {
        this.id = val
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
        visible: false,
      }
    },
    mounted() {
      this.id = this.value
    },
    methods: {
      carCodeCheck(node) {
        let nodes = []
        let carCode = []
        let names = []
        node.forEach(item => {
          // if (item.type == 3) {
            nodes.push(item)
            carCode.push(item.id)
            names.push(item.name)
          // }
        })
        this.input_names = names.toString()
        if(this.isExportMultiple) {
          this.$emit('input', carCode)
        }else{
          this.$emit('input', carCode[0])
          if(carCode.length == 1) {
            this.visible = false
          }
        }
        this.$emit('on-change', carCode, nodes)
        // 回显tree选中
        // this.$refs.tree.setCheckedNodes(node);
        // this.$refs.tree.setCurrentKey(carCode);
      },
      inputOut() {
        console.log("inputout")
        this.input_names = this.input_names_old.toString()
      },
      onClear() {
        // alert(1111)
        this.input_names_old = ''
        this.input_names = ''
        this.id = ''
        this.$refs.tree.resetChecked()
        // this.$refs.tree.setCheckedNodes([]);
        // this.$refs.tree.setCurrentKey([]);
        // this.setCheckedKeys([]);
        if(this.isExportMultiple) {
          this.setCheckedKeys([]);
          this.$emit('input', [])
        }else{
          this.$refs.tree.setCurrentKey([]);
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
