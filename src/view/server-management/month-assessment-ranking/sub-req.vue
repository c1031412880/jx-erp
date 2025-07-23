<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-form-item label="考核月份">
        <el-date-picker
          v-model="form.year_month"
          value-format="yyyy-MM"
          type="month"
          placeholder="选择月"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="驾驶员">
        <get-driver-select-tree
          ref="driverTree"
          v-model="form.driver_ids"
          :isShowCheckbox="true"
          :placeholder="'请选择驾驶员'"
          :isExportMultiple="true"
          :isCheckStrictly="false"
        ></get-driver-select-tree>
      </el-form-item>
      <el-form-item label="当前星级">
        <el-select v-model="form.stars" clearable multiple collapse-tags placeholder="请选择星级">
          <el-option label="无星级" :value="0"></el-option>
          <el-option label="一星级" :value="1"></el-option>
          <el-option label="二星级" :value="2"></el-option>
          <el-option label="三星级" :value="3"></el-option>
          <el-option label="四星级" :value="4"></el-option>
          <el-option label="五星级" :value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.is_leave" :true-label="1" :false-label="2">
          仅显示在职驾驶员
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="" @click="resetForm" icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-download" @click="onBtn('export')">导出</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { formatTime } from '@/utils/index'
import getQuarterSelect from 'components/base/formModel/select/get-quarter-select'
import getDriverSelectTree from '@/components/base/formModel/tree/get-driver-select-tree'
export default {
  components: {
    getQuarterSelect,
    getDriverSelectTree
  },

  data() {
    const now = new Date()
    let year = now.getFullYear()
    let month = ('0' + (now.getMonth() + 1)).slice(-2)
    return {
      form: {
        year_month: year + '-' + month,
        driver_ids: [],
        stars: '',
        is_leave: 1
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
