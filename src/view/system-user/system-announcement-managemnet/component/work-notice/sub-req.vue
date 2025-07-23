<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="发布日期范围:">
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
        <el-form-item label="标题:">
          <el-input v-model="form.title" placeholder="搜索标题" clearable></el-input>
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
        <el-form-item>
          <el-button @click="addJob()" type="primary" v-if="$isPowerShow('add')"
            >添加</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="deleteRow()" v-if="$isPowerShow('del')">删除</el-button>
        </el-form-item>
      </el-row>
      <!-- <el-row>
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
      </el-row> -->
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import { getDate, formatTime} from '@/utils/index'
export default {
  data() {
    return {
      typeOptions: [{
        value: 1,
        label: 'web版本升级'
      }, {
        value: 2,
        label: '系统维护'
      }, {
        value: 3,
        label: 'app版本升级'
      }],
      date:[],
      form: {
        title:"",
        start_date: "",
        end_date: "",
      },
    };
  },
  mounted() {
    this.onSetTime();
    this.onSubmit();
  },
  methods: {
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        // console.log(this.date)
        this.form.start_date = this.date[0];
        this.form.end_date = formatTime(new Date(this.date[1]));
      }else{
        this.form.start_date = '';
        this.form.end_date = '';
      }
    },
    onSetTime(type = 'lastOneYear') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.start_date = this.date[0]
      this.form.end_date = formatTime(new Date(this.date[1]))
      // console.log(this.date)
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
      this.form.title = "";
      this.form.start_date = "";
      this.form.end_date = "";
      this.date = [];
      this.onSetTime();
      this.onSubmit();
      // this.$parent.restTableList();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 添加编辑
    addJob() {
      this.$emit("on-add", 'add');
    },
    deleteRow() {
      this.$emit("delete-row");     
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
