<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-form-item label="评分季度" prop="score_year">
      <div style="display: flex;width: 100%;">
        <el-date-picker
          v-model="form.score_year"
          value-format="yyyy"
          format="yyyy"
          type="year"
          placeholder="选择年">
        </el-date-picker>
        <el-select v-model="form.score_season" placeholder="请选择季度" clearable>
          <el-option
            v-for="item in quarterList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </el-form-item>
    <el-form-item label="被评分驾驶员" prop="driver_ids">
      <get-driver-select-tree
        ref="personalTree"
        v-model="form.driver_ids"
        :isShowCheckbox="true"
        :placeholder="'请选择驾驶员'"
        :isExportMultiple="true"
        :isCheckStrictly="false"
      ></get-driver-select-tree>
    </el-form-item>
    <el-form-item :label="'所在部门'" prop="dept_id">
      <get-department-select
        ref="departmenTree"
        v-model="form.dept_ids"
        :isShowCheckbox="true"
        :placeholder="'请选择部门'"
        :isContainEmp="false"
        :isExportMultiple="true"
      ></get-department-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="onBtn('export')">导出</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import {formatDate} from '@/utils'
export default {
  components: {
    getDriverSelectTree,
    getDepartmentSelect,
  },
  data() {
    return {
      form: {
        score_year: formatDate(new Date,'yyyy'),
        score_season: '1',
        driver_ids: [],
        dept_ids: [],
      },
      quarterList: [
        {
          label: '第一季度',
          value: '1'
        },
        {
          label: '第二季度',
          value: '2'
        },
        {
          label: '第三季度',
          value: '3'
        },
        {
          label: '第四季度',
          value: '4'
        }
      ],
    }
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
    // 查询
    onSubmit() {
      let info = {...this.form};
      if (info.driver_ids.length == 0) {
        delete info.driver_ids
      }
      if (info.dept_ids.length == 0) {
        delete info.dept_ids
      }
      this.$emit("on-ok", info);
    },
    resetForm() {
      this.$refs.personalTree.onClear();
      this.$refs.departmenTree.onClear();
      Object.assign(this.$data, this.$options.data());
      this.onSubmit()
    },
    onBtn(type) {
      this.$emit("on-" + type);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>