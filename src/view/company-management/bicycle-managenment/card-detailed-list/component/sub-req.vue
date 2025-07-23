<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="onBut('export')">导出</el-button>
        </el-form-item>
        <!-- <div style="float: right; height: 47px; display: flex">
          <i
            class="el-icon-refresh"
            style="margin-right: 15px; cursor: pointer"
            @click="refreshTableList()"
          ></i>
          <i
            class="el-icon-s-tools"
            style="cursor: pointer"
            @click="openSettingPage()"
          ></i>
        </div> -->
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import {getDate} from '@/utils/index'
export default {
  components: {
    getDepartmentSelect
  },
  data() {
    return {
      date: [],
      form: {
        start_date: '',
        end_date: '',
      },
    };
  },
  mounted() {
    this.setDate()
    this.onSubmit()
  },
  methods: {
    setDate() {
      let timeObj = getDate('thisMonth');
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime]);
      this.form.start_date = this.date[0]
      this.form.end_date = this.date[1]
    },
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.start_date = this.date[0];
        this.form.end_date = this.date[1];
      }else{
        this.form.start_date = '';
        this.form.end_date = '';
      }
    },
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    onBut(type) {
      this.$emit(`on-${type}`)
    },
    // 重置
    resetForm() {
      this.setDate()
      this.onSubmit();
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
