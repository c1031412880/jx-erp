<template>
  <div v-cloak>
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-form-item label="年份" prop="date">
        <el-date-picker
          value-format="yyyy"
          type="year"
          placeholder="选择年份"
          v-model="form.year"
          style="width: 100%"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="exportInfo()" type="primary" icon="el-icon-download">导出</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import { formatDate } from '@/utils/index'
export default {
  props:{
  },
  data() {
    return {
      form: {
        year:formatDate(new Date(),'yyyy'),
      },
    };
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
    // 查询
    onSubmit() {
      let info = {...this.form};
      this.$emit("on-ok", info);
    },
    // 添加编辑
    exportInfo() {
      this.$emit("on-export");
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
