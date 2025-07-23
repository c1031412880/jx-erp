<template>
  <el-form :inline="true" size="mini">
    <el-form-item label="员工姓名:">
      <el-input v-model="form.name" placeholder="请输入员工姓名" clearable></el-input>
    </el-form-item>
    <el-form-item label="部门:">
      <get-department-select
        ref="tree"
        v-model="form.org_ids"
        :isCheckStrictly="false"
        :isContainEmp="false"
      ></get-department-select>
    </el-form-item>
    <el-form-item label="预计离职日期:">
      <el-date-picker
        v-model="form.hope_date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd">
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="resetForm" type="primary" icon="el-icon-refresh-right">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="onBtn('add')" type="primary">办理离职</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="onBtn('leave')" type="primary">批量确认</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="" class="el-icon-download"  @click="onBtn('export')">导出</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="" class="el-icon-upload2"  @click="onBtn('import')">导入</el-button>
    </el-form-item>
    <div style="float: right; height: 47px; display: flex">
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
    </div>
  </el-form>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: { getDepartmentSelect },
  data() {
    return {
      form: {
        name:"",
        org_ids: [],
        hope_date: []
      },
    }
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.form.hope_date = [timeObj.startTime, timeObj.endTime]
    },
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      if(this.form.hope_date && this.form.hope_date.length > 0) {
        info.hope_date = this.$addTime(this.form.hope_date)
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.form.name = "";
      this.form.org_ids = [];
      this.form.hope_date = [];
      this.$refs.tree.onClear();
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 事件发布
    onBtn(type) {
      this.$emit(`on-${type}`, type);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$emit('open-setting-page')
      // this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>