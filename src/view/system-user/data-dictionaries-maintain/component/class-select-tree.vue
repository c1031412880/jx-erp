<template>
  <el-popover
    placement="bottom"
    title="选择组织树"
    trigger="click">
    <el-input slot="reference" :value="inputText" placeholder="选择字典组织"></el-input>
    <div style="width: 250px;height: 350px;overflow: auto;margin-bottom: 5px;">
      <class-tree v-model="id" ref="classTree" placeholder="组织搜索" @on-tree="onChange"></class-tree>
    </div>
  </el-popover>
</template>

<script type="text/ecmascript-6">
import classTree from './class-tree'
export default {
  model: ['value', 'input'],
  props: {
    value: {}
  },
  name: "class-select-tree",
  components: {classTree},
  data() {
    return {
      visible: false,
      inputText: '',
      id: ''
    }
  },
  mounted() {
    this.id = this.value
  },
  watch: {
    visible(val) {
      if (!val) {
        this.$refs.classTree.filterText = ''
      }
    },
    value(val) {
      this.id = val
    }
  },
  methods: {
    onChange(node) {
      this.inputText = node.c_name
      this.$emit('change', node)
      this.$emit('input', node.i_id)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
