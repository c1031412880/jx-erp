<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="考核周期:">    
          <get-quarter-select ref="getQuarterSelect" @on-change="funcQuarter" :defaultValue="defaultValue"></get-quarter-select>          
        </el-form-item>
        <el-form-item label="分公司:">
          <get-department-select
            ref="baseTree"
            :isContainEmp="isContainEmp"
            :isShowCheckbox="true"
            :funcType="funcType"
            :placeholder="'分公司'"
            :isExportMultiple="true"
            v-model="form.group_id"
          ></get-department-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-refresh-left" @click="resetForm">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-download" @click="exportFile">导出</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getQuarterSelect from './get-quarter-select'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    getQuarterSelect,
    getDepartmentSelect
  },
  mounted() {
    this.setDate()
    this.onSubmit()
  },
  data() {
    return {
      isContainEmp: false,
      defaultValue: '',
      funcType: 1, // 功能类别 1 运营单元 2 维修单元 3 仓储单元
      form: {
        quater: '',
        year: '',
        group_id: [],
      },
    }
  },
  methods: {
    setDate() {
      let year = new Date().getFullYear()
      let month = new Date().getMonth()
      if(month < 3) {
        this.defaultValue = year + '01-' + year + '03'
        this.form.quater = 1
        this.form.year = year
      }else if (month < 6) {
        this.defaultValue = year + '04-' + year + '06'
        this.form.quater = 2
        this.form.year = year
      }else if (month < 9) {
        this.defaultValue = year + '07-' + year + '09'
        this.form.quater = 3
        this.form.year = year
      }else if (month < 12) {
        this.defaultValue = year + '10-' + year + '12'
        this.form.quater = 4
        this.form.year = year
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
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data())
      this.$refs.baseTree.onClear();
      this.setDate();
      if(this.form.quater === 1) {
        this.$refs.getQuarterSelect.showValue = `${this.form.year}年第一季度`;
      } else if (this.form.quater === 2) {
        this.$refs.getQuarterSelect.showValue = `${this.form.year}年第二季度`;
      } else if (this.form.quater === 3) {
        this.$refs.getQuarterSelect.showValue = `${this.form.year}年第三季度`;
      } else if (this.form.quater === 4) {
        this.$refs.getQuarterSelect.showValue = `${this.form.year}年第四季度`;
      }
      this.onSubmit();
    },
    // 导出
    exportFile() {
      this.$emit("export-file");
    },
    funcQuarter(value){
      console.log(value)
      this.form.year = Number(value.slice(0,4))
      if(value.indexOf('一') > -1) {
        this.form.quater = 1
      }
      if(value.indexOf('二') > -1) {
        this.form.quater = 2
      }
      if(value.indexOf('三') > -1) {
        this.form.quater = 3
      }
      if(value.indexOf('四') > -1) {
        this.form.quater = 4
      }
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
/deep/ .el-input__inner {
  height: 28px;
}
</style>