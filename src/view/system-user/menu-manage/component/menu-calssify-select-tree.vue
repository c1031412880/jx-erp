<template>
  <el-popover
    placement="bottom"
    trigger="click"
    v-model="visible"
    :disabled="disabled">
    <div style="max-height: 300px;overflow:auto;" :style="`${!!width? `min-width: ${width}px;` : ''}`">
      <menu-calssify-tree 
        v-model="id"
        ref="tree"
        :isShowCheckbox="isShowCheckbox"
        :placeholder="'请输入关键词'"       
        @on-check="lineCheck"
      ></menu-calssify-tree>
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
  import menuCalssifyTree from './menu-calssify-tree'
  export default {
    name: "menu-calssify-select-tree",
    components: {menuCalssifyTree},
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
      
    },
    methods: {
      lineCheck(node) {
        // alert(JSON.stringify(node))
        let nodes = []
        let vehs = []
        let names = []
        node.forEach(item => {
          
            nodes.push(item)
            vehs.push(item.id)
            names.push(item.name)
          
        })
        this.input_names_old = names.toString()
        this.input_names = names.toString()
        if(this.isExportMultiple) {
          this.$emit('input', vehs)
        }else{
          this.$emit('input', vehs[0])
          if(vehs.length > 0) {
            this.visible = false
          }
        }
        this.$emit('on-change', vehs, nodes)
        // 回显tree选中
        this.$refs.tree.setCheckedNodes(node);
        this.$refs.tree.setCurrentKey(vehs);
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
        this.$refs.tree.setCurrentKey([]);
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
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.popover-input-box{
  // width 300px
}

</style>
