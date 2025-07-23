<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-form-item label="考核周期">
        <get-quarter-select ref="getQuarterSelect" @on-change="funcQuarter" :defaultValue="defaultValue" :clearable="false"></get-quarter-select>
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
      <el-form-item label="本次评定星级">
        <el-select v-model="form.stars" clearable multiple collapse-tags placeholder="请选择星级">
          <el-option label="无星级" :value="0"></el-option>
          <el-option label="一星级" :value="1"></el-option>
          <el-option label="二星级" :value="2"></el-option>
          <el-option label="三星级" :value="3"></el-option>
          <el-option label="四星级" :value="4"></el-option>
          <el-option label="五星级" :value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="变化情况">
        <!-- multiple collapse-tags -->
        <el-select v-model="form.star_change" clearable placeholder="请选择星级">
          <el-option label="升星" :value="1"></el-option>
          <el-option label="降星" :value="2"></el-option>
          <el-option label="不变" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审批状态">
        <el-select v-model="form.state" clearable placeholder="请选择状态">
          <el-option
            v-for="item in appOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.is_leave" :true-label="1" :false-label="2">仅显示在职驾驶员</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.is_cancle_star" :true-label="1" :false-label="2">是否取消本季度星级考核资格</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button 
          type="primary" 
          @click="onSubmit"
          icon="el-icon-search" 
        >查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="" 
          @click="resetForm"
          icon="el-icon-refresh-right"
        >重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button 
          type="primary" 
          @click="onBtn('rebuild')"
        >重新生成</el-button>
          <!-- v-if="$isPowerShow('rebuild')"  -->
      </el-form-item>
      <el-form-item>
        <el-button 
          type="primary" 
          @click="onBtn('add')"
        >批量提交审批</el-button>
          <!-- v-if="$isPowerShow('add')"  -->
      </el-form-item>
      <el-form-item>
        <el-button 
          type="primary" 
          icon="el-icon-download" 
          @click="onBtn('export')">导出</el-button>
          <!-- v-if="$isPowerShow('export')"  -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
import { formatTime } from '@/utils/index';  
import getQuarterSelect from 'components/base/formModel/select/get-quarter-select'
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
export default {
  components: { 
    getQuarterSelect,getDriverSelectTree
  },

  data() {
    return {
      defaultValue: '',
      form: {
        year: '',
        quarter: '',
        driver_ids: [],
        stars: '',
        star_change: '',
        state: '',
        is_leave: 1,
        is_cancle_star: 2,
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
    this.$nextTick(() => {
      this.onSubmit()
    })
  },
  methods: {
    // 查询
    onSubmit () {
      let info = this.$outFormData(this.form)
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data())
      this.defaultValue = formatTime(new Date(), 'yyyy-MM');
      this.$refs.driverTree.onClear()
      setTimeout(() => {
        this.onSubmit()
        this.$message({ message: "重置成功", type: "success" });
      }, 100);
    },
    funcQuarter(value){
      this.defaultValue = ''
      this.form.year = Number(value.slice(0,4))
      if(value.indexOf('一') > -1) {
        this.form.quarter = 1
      }
      if(value.indexOf('二') > -1) {
        this.form.quarter = 2
      }
      if(value.indexOf('三') > -1) {
        this.form.quarter = 3
      }
      if(value.indexOf('四') > -1) {
        this.form.quarter = 4
      }
    },
    // 事件抛出
    onBtn(type) {
      this.$emit(`on-${type}`, type);
    },
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>