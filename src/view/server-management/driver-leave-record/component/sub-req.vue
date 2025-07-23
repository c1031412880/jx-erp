<template>
  <div v-cloak>
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item label="驾驶员" prop="driver_ids">
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.driver_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择驾驶员'"
            :isExportMultiple="true"
            :isCheckStrictly="false"
          ></get-driver-select-tree>
        </el-form-item>
        
        <el-form-item label="所属组织" prop="dept_ids">
          <get-department-select-tree
            ref="deptTree"
            v-model="form.dept_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择所属组织'"
            :isExportMultiple="true"
            :isCheckStrictly="false"
          ></get-department-select-tree>
        </el-form-item>
        
        <el-form-item label="类型" prop="leave_type">
          <tr-select-dictionaries
            v-model="form.leave_type"
            :clearable="true"
            :isMultiple="false"
            :collapseTags="false"
            :classKey="'驾驶员病、工、事假类型'" 
            :placeholder="'请选择类型'"
            @on-change="changeType"
          ></tr-select-dictionaries>
        </el-form-item>
        
        <el-form-item label="时间" prop="leave_time">
          <el-date-picker
            v-model="date"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('add')" type="primary">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-popconfirm
            @confirm="onBtn('delete')"
            title="确定删除选中的数据吗？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="primary" icon="el-icon-delete" size="mini">删除</el-button>
          </el-popconfirm>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" type="success" icon="el-icon-download">导出</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getDepartmentSelectTree from "@/components/base/formModel/tree/get-department-select-tree";
import { getDate } from "@/utils/index";
export default {
  components: {
    getDriverSelectTree,
    getDepartmentSelectTree
  },
  data() {
    return {
      date: [],
      form: {
        driver_ids: [],
        dept_ids: [],
        leave_type: '',
        start: '',
        end: ''
      }
    };
  },
  mounted() {
    this.onSetTime();
    this.onSubmit()
  },
  methods: {
    // 初始化时间
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.start = this.date[0]
      this.form.end = this.date[1]
    },
    
    // 时间选择变化
    selectedTime: function() {
      if(this.date && this.date.length) {
        this.date = this.$addTime(this.date)
        this.form.start = this.date[0];
        this.form.end = this.date[1];
      }else{
        this.form.start = '';
        this.form.end = '';
      }
    },
    
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form){
        if(this.form[i] !== undefined && this.form[i] !== null && this.form[i] !== ''){
          info[i] = this.form[i]
        }
      }
      this.$emit("on-ok", info);
    },
    
    // 重置表单
    resetForm() {
      this.date = []
      // 清空公共组件
      this.$refs.driverTree && this.$refs.driverTree.onClear()
      this.$refs.deptTree && this.$refs.deptTree.onClear()
      
      // 重置表单数据
      Object.assign(this.$data.form, this.$options.data().form);
      this.onSetTime();
      this.onSubmit()
    },
    
    // 假期类型变化
    changeType(val) {
      // 这里可以根据选择的假期类型做相应处理
      console.log('选择的假期类型：', val);
    },
    
    // 按钮操作
    onBtn(type) {
      this.$emit(`on-${type}`)
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style> 