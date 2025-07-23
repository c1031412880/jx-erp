<template>
  <el-popover
    placement="bottom"
    trigger="click">
    <div style="max-height: 300px;min-width: 250px;overflow:auto;" >
      <user-tree :showCheckbox="true" @on-check="userCheck" :key="key" ref="tree"></user-tree>
    </div>
    <el-input
      clearable
      slot="reference"
      @clear="onClear"
      @input="inputOut"
      :placeholder="placeholder"
      v-model="input_names" class="popover-input-box">
    </el-input>
  </el-popover>
</template>

<script type="text/ecmascript-6">
  import UserTree from './get-user-tree'
  export default {
    name: "get-driver-select-tree",
    components: {UserTree},
    props: {
      placeholder: {
        type: String,
        default: '请选择人员'
      },
      value: {},
      isEcho: Boolean
    },
    data() {
      return {
        input_names: '',
        input_names_old: '',
        key: null
      }
    },
    watch: {
      value(val) {
            console.log('val',val);
        if (val && val.length > 0 && this.isEcho) {
          // 数据回显
          let name = []
          this.$refs.tree.setCheckedkeys(val)
          setTimeout(() => {
            let tree = this.$refs.tree.$refs.tree
            if (val instanceof Array) {
              val.forEach(item => {
                let node = tree.getNode(item)
            console.log('node',node);
                name.push(node.data.c_name)
              })
            } else {
                let node = tree.getNode(item)
                name = node.data.c_name
            }
            this.input_names = name.toString()
          }, 100);
        }
      }
    },
    methods: {
      userCheck(node) {
        const nodes = []
        const vehs = []
        const names = []
        node.forEach(item => {
          if (!item.type) {
            nodes.push(item)
            vehs.push(item.i_id)
            names.push(item.c_name)
          }
        })
        this.input_names = names.toString()
        this.input_names_old = names.toString()
        this.$emit('input', vehs)
        this.$emit('on-change', vehs, nodes)
        // 回显人员tree选中
        this.$refs.tree.setCheckedNodes(node);

      },
      inputOut() {
        console.log("inputout")
        this.input_names = this.input_names_old.toString()
      },
      onClear() {
        this.input_names = ''
        this.input_names_old = ''
        this.$refs.tree.resetChecked()
        this.$emit('input', [])
        this.$emit('on-change', [])
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.popover-input-box{
  min-width 250px
}

</style>
