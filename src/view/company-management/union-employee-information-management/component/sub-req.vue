<template>
  <el-form :inline="true" size="mini">
    <el-form-item label="请选择部门人员">
      <get-department-select
        ref="tree"
        :show_all="true"
        v-model="user_indexs"
        :isContainEmp="true"
        :isExportMultiple="true"
        :isCheckStrictly="false"
        :placeholder="'请选择部门人员'"
        @on-change="onSelectChange"
      ></get-department-select>
    </el-form-item>
    <el-form-item label="职位:">
      <tr-select-dictionaries
        v-model="form.trade_post"
        :classKey="'岗位级别'"
        :placeholder="'请选择职位'"
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
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="onBtn('import')" icon="el-icon-upload2" v-if="$isPowerShow('import')">导入</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="onBtn('export')" icon="el-icon-download" v-if="$isPowerShow('export')">导出</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" v-if="$isPowerShow('add')">添加员工</el-button>
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
  </el-form>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree2";
import {getDate} from '@/utils/index'
export default {
  components: {
    getDepartmentSelect
  },
  data() {
    return {
      date: [],
      form: {
        user_ids: [],
        trade_post: '',
        is_difficulty: '',
        join_difficuly_start: '',
        join_difficuly_end: '',
      },
      isStaffRepresentativeOptions:[
        { value: 1, name: "是" },
        { value: 0, name: "否" },
      ],
      user_indexs: []
    };
  },
  mounted() {
    // this.setDate()
    this.onSubmit()
  },
  methods: {
    onSelectChange(vehs, nodes) {
      if (vehs && vehs.length > 0) {
        this.form.user_ids = vehs.map(item => {
          return Number(item.split('_')[1])
        });
      } else {
        this.form.user_ids = []
      }
    },
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
    // 事件发布
    onBtn(type) {
      this.$emit(`on-${type}`, type);
    },
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i] || this.form[i] == 0) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.$refs.tree.onClear()
      Object.assign(this.$data.form, this.$options.data().form)
      // this.setDate()
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$emit('open-setting-page')
      // this.$parent.openSettingPageEvent();
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
