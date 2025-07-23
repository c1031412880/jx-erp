<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="注销时间:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            placeholder="选择日期范围"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('reset')" type="primary" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onExport()" icon="el-icon-upload2">导出</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import moment from 'moment'; // 引入moment.js用于日期处理

export default {
  data() {
    const oneMonthAgo = moment().subtract(1, 'months').format('YYYY-MM-DD');
    const today = moment().format('YYYY-MM-DD');
    return {
      date: [oneMonthAgo, today], // 初始化为最近一个月的时间范围
      form: {
        start_time: oneMonthAgo,
        end_time: today,
      },
    };
  },
  mounted() {
    this.onSubmit(); // 初始化时调用 onSubmit
  },
  methods: {
    // 查询
    onSubmit() {
      let info = {};
      if (this.date && this.date.length > 0) {
        info.start_time = moment(this.date[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        info.end_time = moment(this.date[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss');
      } else {
        info.start_time = '';
        info.end_time = '';
      }
      this.$emit("on-ok", info);
    },
    resetForm(type) {
      if (type === "reset") {
        const oneMonthAgo = moment().subtract(1, 'months').format('YYYY-MM-DD');
        const today = moment().format('YYYY-MM-DD');
        this.date = [oneMonthAgo, today];
        this.form = {
          start_time: oneMonthAgo,
          end_time: today,
        };
      }
      this.onSubmit();
    },
    // 导出Excel
    onExport() {
      console.log(this.form,Object.assign({}, this.form),'export')
      let params = Object.assign({}, this.form);
      params.start_time = this.date[0];
      params.end_time = this.date[1];
      this.$client.ExportBicycleManage({context:params})
        .then(res => {
          if (res.head.result === '200') {
            window.location.href = res.context;
            this.$message({ type: 'success', message: '导出成功' });
          } else {
            this.$message({ type: 'error', message: '导出失败' });
          }
        })
        .catch(err => {
          console.error('导出失败:', err);
          this.$message({ type: 'error', message: '导出失败，请稍后再试' });
        });
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
