<template>
  <el-popover
    placement="bottom"
    trigger="click"
    v-model="visible"
    :disabled="disabled">
    <div style="max-height: 300px;overflow:auto;" :style="`${!!width? `min-width: ${width}px;` : '260px'}`">
      <vehicle-tree
        v-model="id"
        ref="tree"
        :placeholder="'请输入关键词'"
        :data="vehicleTree"
        @on-check="vehicleCheckNew"
        @input="setInput"
        @on-names="inputNames"
      ></vehicle-tree>
    </div>
    <el-input
      clearable
      slot="reference"
      @clear="onClear"
      :placeholder="placeholder"
      prefix-icon="el-icon-search"
      :disabled="disabled"
      :style="`${!!width? `min-width: ${width}px;` : '260px'}`"
      :value="input_names" class="popover-input-box">
    </el-input>
  </el-popover>
</template>

<script type="text/ecmascript-6">
  import vehicleTree from './get-vehicle-tree'
  export default {
    name: "get-vehicle-select-tree",
    components: {vehicleTree},
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
      vehicleTree: [Array]
    },
    watch:{
     value(newVal, oldVal) {
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
        visible: false,
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
        // console.log(JSON.stringify(node))
        let nodes = []
        let vehs = []
        let names = []
        node.forEach(item => {
          if (item.type === 3) {
            nodes.push(item)
            vehs.push(item.i_id)
            names.push(item.c_name)
          }
        })
        this.input_names = names.toString()
        if(vehs.length > 0) {
          this.$emit('input', vehs[0])
          this.visible = false
        }
        this.$emit('on-change', vehs, nodes)
      },
      // input返回
      setInput(val) {
        this.$emit('input', val)
      },
      // 点击或者多选返回
      vehicleCheckNew(value, node) {
        if(node.length > 0) {
          this.visible = false
        }
        this.$emit('on-change', value, node)
        this.$emit('on-out-change', value, node)
      },
      onClear() {
        this.input_names = ''
        this.id = ''
        this.setInput('')
        // console.log(this.input_names);
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.popover-input-box{
  // width 300px
}

</style>
