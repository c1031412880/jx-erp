<template>
  <div class="sub-model">
    <el-form :inline="true" size="mini">
      <el-form-item v-for="item in data" :key="item.tag" :label="item.label">
        <form-model v-bind="item" v-model="form[item.prop]"></form-model>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import formModel from './form-model'
export default {
  name: "sub-model",
  components: {formModel},
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    data(val) {
      let form = {}
      this.data.forEach(item => {
        form[item.prop] = ''
      })
      Object.assign(this.form, form)
    }
  },
  data() {
    //这里存放数据",
    return {
      form: {}
    }
  },
  //方法集合",
  methods: {
    onSubmit() {
      console.log(this.form)
      this.$emit('ok', this.form)
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
