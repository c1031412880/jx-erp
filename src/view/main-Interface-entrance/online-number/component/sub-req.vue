<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-form-item label="搜索人员">
      <el-input v-model="form.name" placeholder="请输入人员名字"></el-input>
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="form.state" placeholder="请选择状态" clearable>
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button @click="onSubmit" type="primary" icon="el-icon-search">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
export default {               
  data() {
    return {
      form: {
        name: '',
        state: 1,
      },
      typeOptions: [
        {value: 1, label: '在线'},
        {value: 2, label: '离线'},
      ],
    }
  },
  mounted() {

  },
  methods: {
    onSubmit() {
      let info = {...this.form}
      this.$emit("on-ok", info);
    },
    resetForm() {
      this.form.name = ''
      this.onSubmit()
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>