<template>
  <div class="sub-req">
    <el-form :inline="true" size="mini">
      <el-form-item label="月份">
        <el-date-picker
          v-model="form.start_month"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月">
        </el-date-picker>
        <el-date-picker
          v-model="form.end_month"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="分公司">
        <el-select v-model="form.dept_ids" placeholder="请选择" multiple>
          <el-option
            v-for="item in branchOffice"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
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
      <el-form-item>
        <el-button  @click="onBtn('setting')" type="primary">风险标准设置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button  @click="onBtn('setMile')" type="primary">公里数设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {formatDate} from '@/utils/index'
export default {
  components: { },
  data() {
    return {
      form: {
        start_month: "",
        end_month: "",
        dept_ids: [],
      },
      branchOffice: []
    };
  },
  mounted() {
    this.GetDeptInfoCaches()
    this.onSetTime()
    this.onSubmit()

  },
  methods: {
    onSetTime() {
      let year = new Date().getFullYear()
      this.form.start_month = `${year}-01`
      this.form.end_month = formatDate(new Date(),'yyyy-MM')
    },
    onSubmit() {
      let time1 = new Date(this.form.start_month).getTime()
      let time2 = new Date(this.form.end_month).getTime()

      let year1 = new Date(this.form.start_month).getFullYear()
      let year2 = new Date(this.form.end_month).getFullYear()
      if (time1 > time2) {
        this.form.end_month = ''
        this.$message({
          showClose: true,
          message: '结束时间不能大于开始时间',
          type: "warning",
        });
        return
      }

      if (year1 != year2) {
        this.$message({
          showClose: true,
          message: '请选择同年月份',
          type: "warning",
        });
        return
      }


      this.$emit("on-ok", this.form);
    },
    GetDeptInfoCaches() {
      this.$client.GetDeptInfoCaches({}).then(res => {
        if (res.head.result === '200') {
          this.branchOffice = res.context 
        }
      })
    },
    // 重置
    Reset(){
      this.onSetTime()
      this.onSubmit()
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.sub-req{
  // background: #fff;
  // border-radius 5px
  margin 10px 0;
  // padding 18px 0 0 18px
  // box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
</style>
