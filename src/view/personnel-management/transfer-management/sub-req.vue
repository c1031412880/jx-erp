<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-form-item label="员工姓名">
        <el-input v-model="form.name" placeholder="请输入员工姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="原部门">
        <get-department-select
          ref="oldDeptTree"
          v-model="form.old_dept_ids"
          :isShowCheckbox="true"
          :placeholder="'请选择原部门'"
          :isContainEmp="false"
          :isExportMultiple="true"
          :isCheckStrictly="false"
        ></get-department-select>
      </el-form-item>
      <el-form-item label="调动后部门">
        <get-department-select
          ref="newDeptTree"
          v-model="form.new_dept_ids"
          :isShowCheckbox="true"
          :placeholder="'请选择调动后部门'"
          :isContainEmp="false"
          :isExportMultiple="true"
          :isCheckStrictly="false"
        ></get-department-select>
      </el-form-item>
      <el-form-item label="考勤时间:">
        <el-date-picker
          v-model="date"
          type="daterange"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="选择开始日期"
          end-placeholder="选择结束日期"
          :clearable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm" icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus">人员调动</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-download" @click="onBtn('export')">导出</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getDate } from '@/utils/index'
import getDepartmentSelect from '@/components/base/formModel/tree/get-department-select-tree'
export default {
  components: {
    getDepartmentSelect
  },
  data() {
    let timeObj = getDate('thisMonth')
    return {
      date: [timeObj.startTime, timeObj.endTime],
      form: {
        name: '',
        old_dept_ids: [],
        new_dept_ids: [],
        start_time: '',
        end_time: ''
      }
    }
  },
  created() {
    this.onSubmit()
  },
  methods: {
    // 查询
    onSubmit() {
      let info = this.$outFormData(this.form)
      if (!this.date) {
        info.start_time = ''
        info.end_time = ''
      }
      info.start_time = this.date[0] + ' 00:00:00'
      info.end_time = this.date[1] + ' 23:59:59'
      this.$emit('on-submit', info)
    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data())
      this.$refs.driverTree.onClear()
      setTimeout(() => {
        this.onSubmit()
        this.$message({ message: '重置成功', type: 'success' })
      }, 100)
    },
    // 事件抛出
    onBtn(type) {
      this.$emit(`on-${type}`, type)
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped></style>
