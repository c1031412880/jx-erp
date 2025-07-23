<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="姓名:">
          <!-- <el-input v-model="form.c_name" placeholder="请选择员工姓名" clearable></el-input> -->
          <get-department-select
              ref="personalTree"
              v-model="form.user_id"
              :width="'220'"
              :isShowCheckbox="false"
              :placeholder="'请选择员工姓名'"
              :isContainEmp="true"
              :isExportMultiple="false"
              :show_all="true"
            ></get-department-select>
        </el-form-item>
        <el-form-item label="反馈日期:">
          <el-date-picker
            v-model="created_date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择结束日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="反馈渠道:">
          <el-select v-model="form.type" placeholder="请选择反馈渠道">
            <el-option label="全部" :value="0"></el-option>
            <el-option label="ERP" :value="1"></el-option>
            <el-option label="app" :value="2"></el-option>
            <el-option label="小程序" :value="3"></el-option>
            <el-option label="公众号" :value="4"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right"
            >重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus">添加</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import { getDate } from "@/utils/index";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components:{
    getDepartmentSelect
  },
  data() {
    return {
      created_date: [],
      form: {
        user_id:"",
        query_start:"",
        query_end:"",
      },
    };
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate('thisMonth')
      this.created_date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.query_start = this.created_date[0]
      this.form.query_end = this.created_date[1]
    },
    selectedTime(date) {
      if(date==null||date==[]){
        this.form.query_start = ''
        this.form.query_end = ''
      }else{
        this.form.query_start = date[0]
        this.form.query_end = `${date[1]} 23:59:59`
      }
    },
    onBtn(method) {
      this.$emit(`on-${method}`)
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
      this.form.user_id = '';
      this.form.query_start = '';
      this.form.query_end = '';
      this.$refs.personalTree.onClear();
      this.onSetTime();
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
