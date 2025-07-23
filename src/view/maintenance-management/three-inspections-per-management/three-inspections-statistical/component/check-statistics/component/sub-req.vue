<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-form-item label="日期">
      <el-date-picker
        v-model="form.check_date"
        type="date"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
        :clearable="false"
        placeholder="选择日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="车辆:">
      <get-vehicle-select-tree
        ref="vehicleTree"
        :placeholder="'选择车辆'"
        :isShowCheckbox="true"
        v-model="form.vehicle_ids"
      >
      </get-vehicle-select-tree>
    </el-form-item>
    <el-form-item label="检查人:">
      <!-- <get-user-select
        ref="personTree"
        :placeholder="'请选择检查人'"
        :isShowCheckbox="true"
        v-model="form.check_user">
      </get-user-select> -->

      <el-input v-model="form.check_user" placeholder="'请选择检查人'" clearable></el-input>
    </el-form-item>
    <el-form-item label="风险等级:">
      <el-select v-model="form.risk_level" placeholder="请选择" clearable>
        <el-option
          v-for="item in riskList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="检查结果:">
      <el-select v-model="form.check_result" placeholder="请选择" clearable>
        <el-option
          v-for="item in resultsList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="处理状态:">
      <el-select v-model="form.handle_state" placeholder="请选择" clearable>
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否排班车辆:">
      <el-radio-group v-model="form.is_dispatch">
        <el-radio :label="true">是</el-radio>
        <el-radio :label="false">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
      <el-button icon="el-icon-refresh-right" @click="resetForm()">重置</el-button>
      <el-button type="primary" @click="onBtn('export')">导出</el-button>
      <el-button type="primary" v-if="$isPowerShow('setting')"  @click="onBtn('setting')">提醒设置</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getUserSelect from "@/components/base/formModel/tree/get-user-select-tree";
import {formatDate} from "@/utils/index"
export default {
  components: {
    getVehicleSelectTree,
    getUserSelect
  },
  data() {
    return {
      form: {
        check_date: formatDate(new Date(),'yyyy-MM-dd'),
        check_user: '',
        vehicle_ids: [],
        risk_level: '',
        check_result: '',
        handle_state: '',
        is_dispatch: '',
      },
      riskList: [
        {
          value: 1,
          label: '低'
        },
        {
          value: 2,
          label: '中'
        },
        {
          value: 3,
          label: '高'
        },
      ],
      resultsList: [
        {
          value: 1,
          label: '正常'
        },
        {
          value: 2,
          label: '早检'
        },
        {
          value: 3,
          label: '晚检'
        },
      ],
      statusList: [
        {
          value: 1,
          label: '待处理'
        },
        {
          value: 2,
          label: '已完成'
        },
      ],
    }
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
    onSubmit() {
      this.$emit("on-ok", this.form);
    },
    resetForm() {
      this.$refs.vehicleTree.onClear()
      Object.assign(this.$data, this.$options.data());
      this.onSubmit()
    },
    onBtn(type) {
      this.$emit('on-' + type)
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>