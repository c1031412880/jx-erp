<template>
  <el-popover
    placement="bottom"
    trigger="click"
    v-model="visible">
    <div style="max-height: 300px;overflow:auto;" :style="`${!!width? `min-width: ${width}px;` : ''}`">
      <department-tree
        v-model="id"
        ref="tree"
        @on-check="departmentCheck"
        :data="userTree"
      ></department-tree>
    </div>
    <el-input
      clearable
      slot="reference"
      @clear="onClear"
      @input="inputOut"
      placeholder="请选择人员"
      prefix-icon="el-icon-search"
      type="textarea"
      v-model="input_names" class="popover-input-box">
    </el-input>
  </el-popover>
</template>

<script type="text/ecmascript-6">
  import departmentTree from './get-user-tree'
  export default {
    name: "get-all-dept-user-tree",
    components: {departmentTree},
    props: {
      value: {},
      placeholder: [String],
      width: {
        type:[String,Number],
        default: '',
      },
      userTree: [Array],
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
      departmentCheck(node,parentNode) {
        let nodes = []
        let vehs = []
        let names = []
        node.forEach(item => {
          if (!item.type) {
            nodes.push(item)
            vehs.push(item.i_id)
            names.push(item.c_name)
          }
        })
        this.input_names_old = names.toString()
        this.input_names = names.toString()
        this.$emit('input', vehs)
        this.$emit('on-change', vehs, nodes, parentNode)
        // 回显人员tree选中
        // this.$refs.tree.setCheckedNodes(node);
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
        this.$emit('input', [])
        this.$emit('on-change', [])
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.popover-input-box{
  // width 300px
}

</style>
