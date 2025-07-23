<template>
  <el-popover
    placement="bottom"
    trigger="click"
    v-model="visible"
    :disabled="disabled">
    <div style="max-height: 300px;overflow:auto;" :style="`${!!width? `min-width: ${width}px;` : ''}`">
      <line-tree 
        v-model="id"
        ref="tree"
        :isShowCheckbox="isShowCheckbox"
        :placeholder="'请输入关键词'"   
        :isCheckStrictly="isCheckStrictly"  
        @on-name="name  => input_names = name"  
        @on-check="lineCheck"
      ></line-tree>
    </div>
    <el-input
      clearable
      slot="reference"
      @clear="onClear"
      :size="size"
      :placeholder="placeholder"
      prefix-icon="el-icon-search"
      :disabled="disabled"
      :value="input_names" class="popover-input-box">
    </el-input>
  </el-popover>
</template>

<script type="text/ecmascript-6">
  import lineTree from './line-tree'
  import { debounce } from '@/utils/index'
  export default {
    name: "get-line-tree",
    components: {lineTree},
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
      // 多选时子父是否关联
      isCheckStrictly: {
        type:Boolean,
        default: true
      },
      size: String,
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
      },
      valSelect(val) {
        this.debounceFilter(val);
      }
    },
    data() {
      return {
        id: '',
        input_names: '',
        input_names_old: '',
        visible: false,
        debounceFilter: null,
      }
    },
    created() {
      this.debounceFilter = debounce((val) => {
        this.$refs.tree && this.$refs.tree.filter(val);
        if(!val) {
          this.$refs.tree && this.$refs.tree.allExpanded && this.$refs.tree.allExpanded(false)
        }
      }, 300);
    },
    mounted() {
      this.id = this.value
    },
    methods: {
      lineCheck(node) {
        // alert(JSON.stringify(node))
        console.log(node)
        let nodes = []
        let vehs = []
        let names = []
        node.forEach(item => {
          if (item.type == 2) {
            nodes.push(item)
            vehs.push(item.i_id)
            names.push(item.c_name)
          }
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
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.popover-input-box{
  // width 300px
}

</style>
