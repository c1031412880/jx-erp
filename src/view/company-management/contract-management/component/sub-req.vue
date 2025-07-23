<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="合同名称/编号:">
          <el-input v-model="form.code_name" placeholder="搜索合同名称/编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="开始日期:">
          <el-date-picker
            v-model="date1"
            type="daterange"
            range-separator="至"
            start-placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="selectedTime1"
            end-placeholder="选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="selectedTime"
            end-placeholder="选择结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同状态:">
          <!-- <tr-select-dictionaries v-model="form.state" :classKey="'合同管理合同状态'" :placeholder="'合同状态'"></tr-select-dictionaries> -->
          <el-select v-model="form.state" clearable  placeholder="合同状态">
              <el-option
                label="有效合同"
                :value="1">
              </el-option>
              <el-option
                label="无效合同"
                :value="2">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="客户名称:">
          <el-input v-model="form.customer_name" placeholder="搜索客户名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="合同类型:">
          <el-select v-model="form.type" clearable placeholder="请选择合同类型">
            <el-option label="广告合同" :value="1"></el-option>
            <el-option label="租房合同" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建人:">
          <get-department-select
            ref="personalTree"
            v-model="form.created_id"
            :isShowCheckbox="false"
            :placeholder="'请选择创建人'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="false"
          ></get-department-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('reset')" type="primary" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button class="el-icon-plus" @click="addJob()" type="primary" v-if="$isPowerShow('add')"
            >添加合同</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button class="el-icon-bell" @click="addReminderSettings()" type="primary" v-if="$isPowerShow('reminderSettings')"
            >提醒设置</el-button
          >
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
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    getDepartmentSelect
  },
  data() {
    return {
      date:[],
      date1:[],
      form: {
        id:'', //合同id
        code_name: "",
        start_date_start: "",
        start_date_end: "",
        end_date_start: "",
        end_date_end: "",
        state: "",
        created_id:"",
        type:"",
        customer_name:"",
      },
    };
  },
  activated () {
    let ids = this.$route.params.ids
    if(!!ids) {
      this.form.id = ids
      this.onSubmit()
    }
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
    selectedTime() {
      if(!!this.date && this.date.length > 0) {
        this.date = this.$addTime(this.date);
        this.form.end_date_start = this.date[0];
        this.form.end_date_end = this.date[1];
      }else{
        this.form.end_date_start = '';
        this.form.end_date_end = '';
      }
    },
    selectedTime1() {
      if(!!this.date1 && this.date1.length > 0) {
        this.date1 = this.$addTime(this.date1);
        this.form.start_date_start  = this.date1[0];
        this.form.start_date_end = this.date1[1];
      }else{
        this.form.start_date_start  = '';
        this.form.start_date_end = '';
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
    resetForm(type) {
      this.date = [];
      this.date1 = [];
      this.form.code_name = "";
      this.form.end_date_start = "";
      this.form.end_date_end = "";
      this.form.start_date_start  = "";
      this.form.start_date_end = "";
      this.form.state = "";
      this.form.created_id = "";
      this.form.type = "";
      this.form.customer_name = "";
      this.form.id =  "";
      this.$refs.personalTree.onClear();
      this.onSubmit();
      if(type == 'reset') {
        setTimeout(() => {
          this.$message({ message: "重置成功", type: "success" });
        }, 50);
      }
    },
    // 添加编辑
    addJob() {
      this.$emit("on-add", 'add');
    },
    deleteJob() {
      this.$emit("delete-Job");     
    },
    addReminderSettings() {
      this.$emit("add-reminder-settings");  
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.$parent.restTableList();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
