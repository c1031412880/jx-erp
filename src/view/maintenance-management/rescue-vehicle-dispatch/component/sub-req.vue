<template>
  <el-form :inline="true" size="mini">
    <el-form-item label="出车人">
      <get-department-select
        ref="tree"
        :show_all="true"
        v-model="form.request_person_ids"
        :isContainEmp="true"
        :isExportMultiple="true"
        :isCheckStrictly="false"
        :placeholder="'请选择出车人'"
      ></get-department-select>
    </el-form-item>
    <el-form-item label="日期:">
      <el-date-picker
        v-model="date"
        type="daterange"
        range-separator="至"
        start-placeholder="选择开始日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        end-placeholder="选择结束日期"
        @change="selectedTime">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="支付方式">
      <el-select v-model="form.pay_type" clearable placeholder="请选择支付方式">
        <el-option label="全部" :value="0"></el-option>
        <el-option label="月结" :value="1"></el-option>
        <el-option label="现结" :value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="审批单状态">
      <el-select v-model="form.state" clearable placeholder="请选择状态">
        <el-option
          v-for="item in appOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="施救类型">
      <el-select v-model="form.rescue_vehicle_type" clearable placeholder="请选择施救类型">
        <el-option label="全部" :value="0"></el-option>
        <el-option label="小型车" :value="1"></el-option>
        <el-option label="中型车" :value="2"></el-option>
        <el-option label="大型车" :value="3"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-input v-model="form.rescue_position"  placeholder="请输入施救地点" clearable></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="resetForm()" icon="el-icon-refresh-left">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onBtn('export')" v-if="$isPowerShow('export') && !isRelevance" icon="el-icon-plus">导出</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onBtn('add')" v-if="$isPowerShow('add') && !isRelevance" icon="el-icon-plus">添加</el-button>
    </el-form-item>
    <div v-if="!isRelevance" style="float: right; height: 47px; display: flex">
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
import { getDate } from "@/utils/index";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {getDepartmentSelect},
  props: {
    isRelevance:{
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      date:[],
      form: {
        request_person_ids: [],
        query_date_start: '',
        query_date_end: '',
        pay_type: '',
        state: '',
        rescue_vehicle_type: '',
        rescue_position: '',
      },
      appOptions: [
        {value: 1, label: '审批中'},
        {value: 2, label: '审批通过'},
        {value: 3, label: '审批拒绝'},
        {value: 4, label: '审批撤销'},
      ],
    }
  },
  mounted() {
    this.onSetTime();
    this.onSubmit();
  },
  methods: {
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.query_date_start = this.date[0]
      this.form.query_date_end = this.date[1]
    },
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.query_date_start = this.date[0];
        this.form.query_date_end = this.date[1];
      }else{
        this.form.query_date_start = '';
        this.form.query_date_end = '';
      }
    },
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      if(!this.form.request_person_ids.length) delete info.request_person_ids
      this.$emit("on-ok", info);
    },
    resetForm() {
      Object.assign(this.$data.form, this.$options.data().form)
      this.$refs.tree.onClear()
      this.onSetTime()
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    onBtn(type) {
      this.$emit('on-' + type)
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.$parent.loadData();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>