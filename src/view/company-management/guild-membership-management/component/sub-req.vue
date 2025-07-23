<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="职位:">
          <tr-select-dictionaries
            v-model="form.trade_post"
            :classKey="'岗位级别'"
            :placeholder="'请选择职级'"
            :isMultiple="false"
          ></tr-select-dictionaries>
        </el-form-item>
        <el-form-item label="是否为困难职工:">
          <el-select v-model="form.is_difficulty" placeholder="请选择是否为困难职工" clearable>
            <el-option 
              v-for="(item, index) in isStaffRepresentativeOptions" 
              :key="index" 
              :label="item.name"
              :value="item.value" >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="困难职工入选日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            placeholder="选择困难职工入选日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
        <!-- <el-form-item>
          <el-button @click="addBut()" type="primary" v-if="$isPowerShow('add')"
            >添加会员</el-button
          >
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary"  @click="openSurePage()" v-if="$isPowerShow('del')">入会确认</el-button>
        </el-form-item> -->
      </el-row>
      <el-row>
        <el-form-item>
          <el-button @click="addBut()" type="primary" v-if="$isPowerShow('add')"
            >添加会员</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="openSurePage()" v-if="$isPowerShow('del')">入会确认</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="onBut('import')" v-if="$isPowerShow('import')">导入</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="onBut('export')" v-if="$isPowerShow('export')">导出</el-button>
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
import {getDate} from '@/utils/index'
export default {
  components: {
    getDepartmentSelect
  },
  data() {
    return {
      date: [],
      form: {
        trade_post: '',
        is_difficulty: '',
        join_difficuly_start: '',
        join_difficuly_end: '',
      },
      isStaffRepresentativeOptions:[
        { value: 1, name: "是" },
        { value: 0, name: "否" },
      ],
    };
  },
  mounted() {
    this.setDate()
    this.onSubmit()
  },
  methods: {
    setDate() {
      let timeObj = getDate('thisMonth');
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime]);
      this.form.join_difficuly_start = this.date[0]
      this.form.join_difficuly_end = this.date[1]
    },
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.join_difficuly_start = this.date[0];
        this.form.join_difficuly_end = this.date[1];
      }else{
        this.form.join_difficuly_start = '';
        this.form.join_difficuly_end = '';
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
    onBut(type) {
      this.$emit(`on-${type}`)
    },
    // 重置
    resetForm() {
      this.form.name = "";
      this.form.code = "";
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 添加编辑
    addBut() {
      this.$emit("on-add", 'add');
    },
    openSurePage() {
      this.$emit("open-sure-Page");     
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
