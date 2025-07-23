<template>
  <el-form :inline="true" size="mini">
    <el-form-item label="驾驶员:">
      <get-driver-select-tree
        ref="driverTree"
        v-model="form.driver_ids"
        :isShowCheckbox="true"
        :placeholder="'请选择驾驶员'"
        :isExportMultiple="true"
      ></get-driver-select-tree>
    </el-form-item>
    <el-form-item label="部门:">
      <get-department-select
        ref="personalTree"
        v-model="form.dept_ids"
        :isShowCheckbox="true"
        :placeholder="'请选择部门'"
        :isContainEmp="false"
        :show_all="true"
        :isExportMultiple="true"
      ></get-department-select>
    </el-form-item>
    <el-form-item label="审批状态">
      <el-select v-model="form.status" collapse-tags multiple clearable placeholder="请选择状态">
        <el-option
          v-for="item in appOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus"
        v-if="$isPowerShow('add')">添加</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="Reset" icon="el-icon-refresh-left">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getDriverSelectTree from '@/components/base/formModel/tree/get-driver-select-tree'
import getDepartmentSelect from '@/components/base/formModel/tree/get-department-select-tree'
export default {
  components: {
    getDriverSelectTree,
    getDepartmentSelect
  },
  data() {
    return {
      form: {
        driver_ids: [],
        dept_ids: [],
        status: [],
      },
      appOptions: [
        {value: 0, label: '未发起'},
        {value: 1, label: '审批中'},
        {value: 2, label: '审批通过'},
        {value: 3, label: '审批拒绝'},
        {value: 4, label: '审批撤销'},
      ],
    }
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
    onSubmit() {
      let info = {}
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i]
        }
      }
      this.$emit('on-ok', info)
    },
    // 重置
    Reset() {
      this.form.driver_ids = []
      this.form.dept_ids = []
      this.form.status = []
      // 清空驾驶员选中
      this.$refs.driverTree.onClear()
      this.$refs.personalTree.onClear()
      this.onSubmit()
    },
    onBtn(com) {
      this.$emit('on-' + com)
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>