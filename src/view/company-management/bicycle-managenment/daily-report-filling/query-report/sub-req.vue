<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="日期" prop="date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择申请日期"
            v-model="form.date"
            style="width: 100%;"
            :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {formatDate} from '@/utils/index'
export default {
  components: {
  },
  data() {
    return {
      form: {
        date:formatDate(new Date(),'yyyy-MM-dd'),
      },
    };
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
    // 查询
    onSubmit() {
      this.$emit("on-ok", this.form);
    },
    // 重置
    resetForm() {
      this.form.date = formatDate(new Date(),'yyyy-MM-dd')
      this.onSubmit();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
