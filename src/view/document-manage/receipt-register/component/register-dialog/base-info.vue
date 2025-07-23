<template>
  <el-descriptions :column="2" border>
    <el-descriptions-item label="收文编号">
      <el-input v-model="formData.code" placeholder="请输入编号"></el-input>
    </el-descriptions-item>
    <el-descriptions-item label="来文机关">
      <el-input v-model="formData.organ" placeholder="请输入编号"></el-input>
    </el-descriptions-item>
    <el-descriptions-item label="来文字号">
      <el-select v-model="formData.font">
        <el-option label="上行文" :value="1"></el-option>
        <el-option label="下行文" :value="2"></el-option>
        <el-option label="平行文" :value="3"></el-option>
      </el-select>
    </el-descriptions-item>
    <el-descriptions-item label="来文日期">
      <el-date-picker
        v-model="formData.accept_date"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
    </el-descriptions-item>
    <el-descriptions-item label="密级">
      <el-select v-model="formData.secret" placeholder="请选择保密密级">
        <el-option label="秘密" :value="1"></el-option>
        <el-option label="机密" :value="2"></el-option>
        <el-option label="绝密" :value="3"></el-option>
      </el-select>
    </el-descriptions-item>
    <el-descriptions-item label="来文类型">
      <el-select v-model="formData.type" placeholder="请选择发文类型">
        <el-option
          v-for="(item,i) in typeArr"
          :key="i"
          v-bind="item"
        ></el-option>
      </el-select>
    </el-descriptions-item>
    <el-descriptions-item label="文件标题" :span="2">
      <el-input v-model="formData.title" placeholder="请输入标题"></el-input>
    </el-descriptions-item>
    <el-descriptions-item label="选择收文流程" :span="2">
      <get-flow-select v-model="formData.flow_id"></get-flow-select>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script type="text/ecmascript-6">
import getFlowSelect from '../get-flow-select'
export default {
  name: "base-info",
  components: {getFlowSelect},
  data() {
    return {
      formData: {
        id: 0,
        code: '',
        font: 1,
        title: '',
        type: 1,
        secret: 1,
        is_sms: 1,
        flow_id: 0,
        organ: '',
        accept_date: ''
      },
      typeArr: [
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
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
