<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="统计年份：">
          <el-date-picker
            v-model="form.year"
            type="year"
            value-format="yyyy"
            placeholder="选择年份"
            :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="onSubmit"
            icon="el-icon-search" 
            >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="" 
            @click="resetForm"
            icon="el-icon-refresh-right"
            >重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="$isPowerShow('export')"
            @click="onBtn('export')" 
            icon="el-icon-download" 
            >导出</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
import { formatDate } from "@/utils/index";
export default {
  components: { 
  },
  data() {
    return {
      form: {
        year: formatDate(new Date(),'yyyy'),
      },
    }
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
    // 查询
    onSubmit () {
      this.$emit("on-ok", this.form);
    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data())
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 100);
    },

    // 导出Excel
    onBtn(type) {
      this.$emit(`on-btn-${type}`);
    },
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>