<template>
  <el-col>
    <el-input v-if="tag === 'input'" v-model="model" @input="onInput" :placeholder="`请输入${label}`"></el-input>
    <el-date-picker
      v-if="tag === 'picker'"
      v-model="model"
      @input="onInput"
      v-bind="props"
      placeholder="选择日期">
    </el-date-picker>
  </el-col>
</template>

<script type="text/ecmascript-6">
export default {
  name: "form-model",
  props: {
    value: {},
    tag: {
      type: String,
      default: 'input'
    },
    props: {},
    label: {
      type: String,
      default: ''
    }
  },
  watch: {
    value(val) {
      this.model = val
    }
  },
  data() {
    //这里存放数据",
    return {
      model: ''
    }
  },
  //方法集合",
  methods: {
    onInput(value) {
      this.$emit('input', value)
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
