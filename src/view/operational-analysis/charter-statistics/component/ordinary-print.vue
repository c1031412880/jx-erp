<template>
  <div style="width: 100%;height: 100%;position: relative">
    <h5>接送部门:<span style="text-decoration: underline">{{form.dept_name}}</span></h5>
    <el-descriptions class="custom-descriptions"
                     :column="6" border
                     :contentStyle="{textAlign: 'center',color: '#000',borderColor: '#000'}"
                     :labelStyle="{textAlign: 'center',color: '#000',borderColor: '#000'}">
      <el-descriptions-item label="用车单位" :span="6">{{form.use_uint}}</el-descriptions-item>
      <el-descriptions-item label="用车时间" :span="6">{{form.use_start_time}}/{{form.use_end_time }}接送车</el-descriptions-item>
      <el-descriptions-item label="人数" :span="2">{{ form.use_people }}</el-descriptions-item>
      <el-descriptions-item label="车型" :span="2">{{form.car_type === 1 ? '大客' : '中客'}}</el-descriptions-item>
      <el-descriptions-item label="投放台数" :span="2">{{form.deployment_units}}台</el-descriptions-item>
      <el-descriptions-item label="车辆自编号" :span="4">{{tableData.data[0].vehicle_name}}</el-descriptions-item>
      <el-descriptions-item label="驾驶员" :span="2">{{tableData.data[0].driver_name}}</el-descriptions-item>
      <el-descriptions-item label="联系人" :span="3">{{form.contact_person}}</el-descriptions-item>
      <el-descriptions-item label="联系电话" :span="3">{{form.contact_phone}}</el-descriptions-item>
      <el-descriptions-item label="上车地点" :span="3">{{form.starting_point}}</el-descriptions-item>
      <el-descriptions-item label="始发时间" :span="3">{{form.starting_point_use_time}}</el-descriptions-item>
      <el-descriptions-item label="到达地点" :span="3">{{form.ending_point}}</el-descriptions-item>
      <el-descriptions-item label="返回时间" :span="3">{{form.end_point_use_time}}</el-descriptions-item>
      <el-descriptions-item label="费用结算（元）" :span="3">{{form.cost_settlement}}元</el-descriptions-item>
      <el-descriptions-item label="结算方式" :span="3">{{form.settlement_mode === 1 ? '转账' : '现金'}}</el-descriptions-item>
      <el-descriptions-item label="说明" :span="6">{{form.work_order_description}}</el-descriptions-item>
    </el-descriptions>

    <div style="position: absolute;bottom: 50px;right: 120px">
      <p style="text-align: right">签发人:<span></span></p>
      <p style="text-align: right;margin-top: 20px">日期:</p>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
    }
  },
  props: {
    form: {},
    tableData: {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
