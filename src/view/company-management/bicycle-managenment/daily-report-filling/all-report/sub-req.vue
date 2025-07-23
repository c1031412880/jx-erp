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
        <el-form-item label="经办人" prop="user_id">
          <get-department-select
            ref="personalTree"
            v-model="form.user_ids"
            :isShowCheckbox="true"
            :isContainEmp="true"
            :isExportMultiple="true"
          ></get-department-select>
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
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    getDepartmentSelect
  },
  data() {
    return {
      form: {
        user_ids: [],
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
      this.form.user_ids =  []
      this.$refs.personalTree.onClear()
      this.onSubmit()
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
