<template>
  <el-popover
    placement="bottom"
    trigger="click"
    v-model="visible"
    :disabled="disabled">
    <div style="max-height: 300px;overflow:auto;" :style="`${!!width? `min-width: ${width}px;` : '260px'}`">
      <party-org-tree
        v-model="id"
        ref="tree"
        :isShowCheckbox="isShowCheckbox"
        :isCheckStrictly="isCheckStrictly"
        :placeholder="'请输入关键词'"
        @on-check="vehicleCheckNew"
        @input="setInput"
        @on-names="inputNames"
      ></party-org-tree>
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
  import partyOrgTree from './party-org-tree'
  export default {
    name: "get-party-org-select-tree",
    components: {partyOrgTree},
    props: {
      value: {},
      placeholder: [String],
      isShowCheckbox:{
        type: Boolean,
        default: true
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
      isCheckStrictly: {
        type:Boolean,
        default: true
      },
    },
    watch:{
     value(newVal, oldVal) {
      //  console.log(newVal, oldVal,'shuaxin')

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
          // if (item.type === 3) {
            nodes.push(item)
            vehs.push(item.id)
            names.push(item.name)
          // }
        })
        this.input_names = names.toString()
        if(this.isExportMultiple) {
          this.$emit('input', vehs)
        }else{
          if(vehs.length > 0) {
            this.$emit('input', vehs[0])
            this.visible = false
          }
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
        this.id = this.isExportMultiple ? [] : ''
        this.setInput(this.isExportMultiple ? [] : '')
        this.$emit('on-change', [], [])
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.popover-input-box{
  // width 300px
}

</style>
