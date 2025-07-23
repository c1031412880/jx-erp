<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    
    <!-- <el-form-item label="登记类型：">
      <el-select v-model="form.create_type" placeholder="请选择" clearable>
        <el-option
          v-for="item in curOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item> -->
    <!-- <el-form-item :label="'部门'">
      <get-department-select
        ref="departmenTree"
        v-model="form.dept_id"
        :isShowCheckbox="false"
        :placeholder="'请选择部门'"
        :isContainEmp="false"
        :isExportMultiple="false"
      ></get-department-select>
    </el-form-item> -->
    <!-- <el-form-item label="类型：">
      <el-select v-model="form.type" placeholder="请选择" clearable>
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item> -->
    <el-form-item label="申请人：">
      <get-department-select
        ref="personalTree"
        v-model="form.user_id"
        :isShowCheckbox="true"
        :isCheckStrictly="false"
        :placeholder="'请选择申请人'"
        :isContainEmp="true"
        :show_all="true"
        :isExportMultiple="true"
      ></get-department-select>
    </el-form-item>
    <el-form-item label="入库日期：">
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
      <el-button type="primary" icon="el-icon-search" @click="resetForm()">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onBtn('export')">导出</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: { getDepartmentSelect },
  data() {
    return {
      date: [],
      form: {
        // create_type: 0,
        start: '',
        end: '',
        user_id: [],
        // type: 0
      },
      // curOptions: [
      //   {value: 0, label: '全部'},
      //   {value: 1, label: '审批单登记'},
      //   {value: 2, label: '管理员登记'},
      // ],
      // typeOptions: [
      //   {value: 0, label: '全部'},
      //   {value: 1, label: '领用'},
      //   {value: 2, label: '归还'},
      //   {value: 3, label: '报修'},
      //   {value: 4, label: '报废'},
      //   {value: 5, label: '采购'},
      //   {value: 6, label: '管理员领用'},
      //   {value: 7, label: '管理员归还'},
      //   {value: 8, label: '入库'},
      // ],
    }
  },
  mounted() {
    this.onSetTime()
    // this.onSubmit()
  },
  methods: {
    // 初始化时间
    onSetTime(type = 'lastOneMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.start = this.date[0]
      this.form.end = this.date[1]
      // this.onSubmit()
    },
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.start = this.date[0];
        this.form.end = this.date[1];
      }else{
        this.form.start = '';
        this.form.end = '';
      }
    },
    // 选择人员后获取部门信息
    selectedUser(userIds, nodes,parentNode) {
      if(userIds.length > 0 && !!parentNode) {
        this.form.dept_id = parentNode.i_id
      }else{
        this.form.dept_id = ''
        this.$refs.departmentlTree.onClear()
      }
    },
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    onBtn(type) {
      this.$emit('on-' + type)
    },
    resetForm() {
      Object.assign(this.$data.form, this.$options.data().form)
      this.onSetTime()
      this.onSubmit()
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>