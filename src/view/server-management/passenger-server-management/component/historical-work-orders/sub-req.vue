<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="工单编号或信访编号:">
          <el-input
            placeholder="请输入工单编号或信访编号"
            clearable
            v-model="form.content"
          ></el-input>
        </el-form-item>
        <el-form-item label="工单所属:">
          <el-select v-model="form.order_affiliation" placeholder="请选择处理状态" clearable>
            <el-option
              v-for="item in workAffiliation"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="信息来源:">
          <get-select-dictionaries
            v-model="form.message_sources"
            :isShowDefaultValue="false"
            :classKey="'乘客服务信息来源'"
            :placeholder="'请选择信息来源'"
          ></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="工单类型:">
          <get-select-dictionaries
            v-model="form.order_type"
            :classKey="'乘客服务工单类型'"
            :placeholder="'请选择工单类型'"
          ></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="事发时间:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择事发开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择事发结束日期"
            @change="selectedTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="责任部门:">
          <get-department-select
            ref="personalTree"
            v-model="form.duty_departments"
            :isShowCheckbox="true"
            :placeholder="'请选择责任部门'"
            :isContainEmp="false"
            :show_all="true"
            :isExportMultiple="true"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="反映人:">
          <el-input placeholder="请输入反映人" clearable v-model="form.call_name"></el-input>
        </el-form-item>
        <el-form-item label="反映人电话:">
          <el-input placeholder="请输入反映人电话" clearable v-model="form.call_phone"></el-input>
        </el-form-item>
        <el-form-item label="是否需要回复:">
          <el-select v-model="form.is_reply" placeholder="请选择是否需要回复" clearable>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否有责:">
          <get-select-dictionaries
            v-model="form.is_duty"
            :classKey="'乘客服务是否有责'"
            :placeholder="'请选择是否有责'"
          ></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="超时状态:">
          <el-select v-model="form.time_out" placeholder="请选择处理状态" clearable>
            <el-option
              v-for="item in timeoutStatus"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="Reset" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import getDriverSelectTree from '@/components/base/formModel/tree/get-driver-select-tree'
import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries'
import getVehicleSelectTree from '@/components/base/formModel/tree/get-vehicle-select-tree'
import getDepartmentSelect from '@/components/base/formModel/tree/get-department-select-tree'
import { getDate } from '@/utils/index'
export default {
  components: {
    getDriverSelectTree,
    getSelectDictionaries,
    getVehicleSelectTree,
    getDepartmentSelect
  },
  data() {
    return {
      workAffiliation: [
        { value: 1, name: '公交车' },
        { value: 2, name: '自行车' }
      ],
      timeoutStatus: [
        { value: 2, name: '未逾期' },
        { value: 1, name: '已逾期' }
      ],
      form: {
        // order_state: 4,
        content: '',
        order_affiliation: '',
        message_sources: '',
        order_type: '',
        call_time_start: '',
        call_time_end: '',
        duty_departments: [],
        call_name: '',
        call_phone: '',
        is_reply: '',
        is_duty: '',
        over_due: '',
        time_type: 2
      },
      date: []
    }
  },
  mounted() {
    this.onSetTime()
  },
  methods: {
    onSetTime(type = 'lastTwoMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.call_time_start = this.date[0]
      this.form.call_time_end = this.date[1]
    },
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.call_time_start = this.date[0]
        this.form.call_time_end = this.date[1] + ' 23:59:59'
      } else {
        this.form.call_time_start = ''
        this.form.call_time_end = ''
      }
    },
    onSubmit() {
      let info = {}
      for (let i in this.form) {
        if (this.form[i] || this.form[i] == 0) {
          info[i] = this.form[i]
        }
      }
      this.$emit('on-ok', info)
    },
    // 重置
    Reset() {
      Object.assign(this.$data.form, this.$options.data().form)
      this.$refs.personalTree.onClear()
      this.onSetTime()
      this.onSubmit()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
