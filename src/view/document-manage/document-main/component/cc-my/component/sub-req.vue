<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
         <el-form-item label="公文标题/编号:">
          <el-input v-model="form.keyword" clearable placeholder="请输入公文标题/编号"></el-input>
        </el-form-item>
        <el-form-item label="公文字号:">
          <el-input v-model="form.font_number" clearable placeholder="请输入公文字号"></el-input>
        </el-form-item>
        <el-form-item label="公文流程类型:">
          <el-select v-model="form.document_type" placeholder="请选择收类型" clearable @change="onChangeDocumentType">
            <el-option label="全部" :value="0"></el-option>
            <el-option label="发文" :value="1"></el-option>
            <el-option label="收文" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发文类型:" v-if="form.document_type == 1">
          <el-select v-model="form.type" placeholder="请选择发文类型" clearable>
            <el-option-group
              v-for="(group,i) in typeArr"
              :label="group.name"
              :key="i">
              <el-option
                v-for="(item,i) in group.list"
                :key="i"
                v-bind="item"
              ></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="收文类型:" v-if="form.document_type == 2">
          <el-select v-model="form.accept_type" placeholder="请选择收类型" clearable>
            <el-option
              v-for="(item,i) in acceptTypeArr"
              :key="i"
              v-bind="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拟稿人/创建人:">
          <get-dept-emp-select-tree placeholder="选择拟稿人/创建人" :func_type="0" :is_contain_emp="true" v-model="form.post_id"></get-dept-emp-select-tree>
        </el-form-item>
        <el-form-item label="公文日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectedTime"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="form.state" clearable>
            <el-option label="已归档" :value="4"></el-option>
            <el-option label="已作废" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
        <div style="float: right; height: 47px; display: flex">
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
import getDeptEmpSelectTree from '@/components/base/formModel/tree/get-dept-emp-select-tree'
import {getDate} from '@/utils/index'
export default {
  components: {getDepartmentSelect, getDeptEmpSelectTree},
  data() {
    return {
      date: '',
      typeArr: [
        {
          name: '上行文',
          list: [
            {label: '请示', value: 100},
            {label: '报告', value: 101},
            {label: '意见', value: 102},
          ]
        },
        {
          name: '平行文',
          list: [
            {label: '函', value: 200},
            {label: '议案', value: 201},
            {label: '公告', value: 202},
            {label: '通告', value: 203},
            {label: '通知', value: 204},
            {label: '纪要', value: 205},
            {label: '意见', value: 206},
          ]
        },
        {
          name: '下行文',
          list: [
            {label: '命令', value: 300},
            {label: '决议', value: 301},
            {label: '公报', value: 302},
            {label: '通报', value: 303},
            {label: '批复', value: 304},
            {label: '公告', value: 305},
            {label: '通告', value: 306},
            {label: '通知', value: 307},
            {label: '纪要', value: 308},
            {label: '意见', value: 309},
          ]
        }
      ],
      draft_option: [
        {label: '草稿', value: '1'},
        {label: '待校对', value: '2'},
        {label: '初审核', value: '3'},
        {label: '待会签', value: '4'},
        {label: '待审核', value: '5'},
        {label: '待签发', value: '6'},
        {label: '待排版', value: '7'},
        {label: '待套红', value: '8'},
        {label: '待盖章', value: '9'},
        {label: '待打印', value: '10'},
        {label: '待发布', value: '11'},
        {label: '待归档', value: '13'},
        {label: '待修改', value: '14'},
        {label: '已归档', value: '15'},
      ],
      acceptTypeArr: [
        {label: '命令', value: 1},
        {label: '决定', value: 2},
        {label: '议案', value: 3},
        {label: '指示', value: 4},
        {label: '公告', value: 5},
        {label: '布告', value: 6},
        {label: '通告', value: 7},
        {label: '通知', value: 8},
        {label: '通报', value: 9},
        {label: '报告', value: 10},
        {label: '请示', value: 11},
        {label: '批复', value: 12},
        {label: '意见', value: 13},
        {label: '决议', value: 14},
        {label: '公报', value: 15},
        {label: '函', value: 16},
        {label: '会议纪要', value: 17},
      ],
      form: {
        start_time: '',
        font_number: '',
        end_time: '',
        type: '',
        keyword: '',
        degree: '',
        secret: '',
        state: '',
        post_id: '',
        department_id: '',
        accept_type: '',
        document_type: 0,
      },
      chartChange: true
    };
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    onSetTime(type = 'lastOneMonth') {
      let timeObj = getDate(type)
      this.form.start_time = timeObj.startTime
      this.form.end_time = timeObj.endTime
      this.date = [this.form.start_time, this.form.end_time]
      this.form.end_time = this.form.end_time + ' 23:59:59'
    },
    selectedTime() {
      if(this.date && this.date.length>0) {
        this.form.start_time = this.date[0]
        this.form.end_time = this.date[1] + ' 23:59:59'
      } else {
        this.form.start_time = ''
        this.form.end_time = ''
      }
    },
    chartSet() {
      this.chartChange = !this.chartChange
      this.$emit('on-chart-show', this.chartChange)
    },
    onChangeDocumentType(val) {
      // console.log(val, typeof(val));
      switch (val) {
        // case 0:
        //   this.form.type = ''
        //   this.form.accept_type = ''
        //   break;
        case 1:
          this.form.accept_type = ''
          break;
        case 2:
          this.form.type = ''
          break;
        default:
          this.form.type = ''
          this.form.accept_type = ''
          break;
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
    onDraft() {
      this.$emit('on-draft')
    },
    // 导出
    exportForm() {

    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      setTimeout(() => {
        this.onSubmit()
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 刷新列表
    refreshTableList() {
      // alert("刷新成功")
      this.$parent.informationDialogOk();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
