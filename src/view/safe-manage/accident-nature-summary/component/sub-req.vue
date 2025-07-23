<template>
  <div class="sub-req">
    <el-form :inline="true" size="mini">
      <el-form-item label="月份">
        <el-date-picker
          v-model="form.begin"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月">
        </el-date-picker>
        <el-date-picker
          v-model="form.end"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button  @click="Reset" icon="el-icon-refresh-left">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button  @click="onBtn('export')" icon="el-icon-refresh-left">导出</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-radio-group v-model="form.type" size="small" @change="changeRadio">
        <el-radio-button :label="1">按月份汇总</el-radio-button>
        <el-radio-button :label="2">按分公司汇总</el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {formatDate} from '@/utils/index'
export default {
  components: { },
  data() {
    return {
      form: {
        begin: "",
        end: "",
        type: 1,
      },
    };
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    onSetTime() {
      let year = new Date().getFullYear()
      this.form.begin = `${year}-01`
      this.form.end = formatDate(new Date(),'yyyy-MM')
    },
    onSubmit() {
      let time1 = new Date(this.form.begin).getTime()
      let time2 = new Date(this.form.end).getTime()

      if (time1 > time2) {
        this.form.end = ''
        this.$message({
          showClose: true,
          message: '结束时间不能大于开始时间',
          type: "warning",
        });
        return
      }
      this.$emit("on-ok", this.form);
    },
    // 重置
    Reset(){
      this.onSetTime()
      this.onSubmit()
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
    changeRadio() {
      this.$emit('on-radio',this.form)
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.sub-req{
  margin 10px 0;
}
</style>
