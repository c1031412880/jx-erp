<template>
  <el-descriptions :column="2" border>
    <el-descriptions-item label="公文编号" :span="2">
      <el-input v-model="formData.code" :disabled="!isNumber" placeholder="请输入编号"></el-input>
    </el-descriptions-item>
    <el-descriptions-item label="公文字号" :span="2">
      <el-select v-model="formData.font">
        <el-option label="上行文" :value="1"></el-option>
        <el-option label="下行文" :value="2"></el-option>
        <el-option label="平行文" :value="3"></el-option>
      </el-select>
    </el-descriptions-item>
    <el-descriptions-item label="公文标题" :span="2">
      <el-input v-model="formData.title" placeholder="请输入标题"></el-input>
    </el-descriptions-item>
    <el-descriptions-item label="发文类型">
      <tr-select-dictionaries v-model="formData.type" class-key="发文类型"></tr-select-dictionaries>
<!--      <el-select v-model="formData.type" placeholder="请选择发文类型">-->
<!--        <el-option-->
<!--          v-for="(item,i) in typeArr"-->
<!--          :key="i"-->
<!--          v-bind="item"-->
<!--        ></el-option>-->
<!--      </el-select>-->
    </el-descriptions-item>
    <el-descriptions-item label="发文份数">
      <el-input-number v-model="formData.post_count"></el-input-number>
    </el-descriptions-item>
    <el-descriptions-item label="发文日期">
      <el-date-picker
        v-model="formData.posy_time"
        type="datetime"
        placeholder="选择发文日期"
        value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
    </el-descriptions-item>
    <el-descriptions-item label="缓急程度">
      <el-select v-model="formData.degree" placeholder="请选择缓急程度">
        <el-option label="平急" :value="1"></el-option>
        <el-option label="加急" :value="2"></el-option>
        <el-option label="特急" :value="3"></el-option>
      </el-select>
    </el-descriptions-item>
    <el-descriptions-item label="保密密级">
      <el-select v-model="formData.secret" placeholder="请选择保密密级">
        <el-option label="秘密" :value="1"></el-option>
        <el-option label="机密" :value="2"></el-option>
        <el-option label="绝密" :value="3"></el-option>
      </el-select>
    </el-descriptions-item>
    <el-descriptions-item label="主题词">
      <el-input v-model="formData.keyword" placeholder="请输入主题词"></el-input>
    </el-descriptions-item>
    <el-descriptions-item label="选择发文流程" :span="2">
      <get-flow-select @change="flowChange" v-model="formData.flow_id"></get-flow-select>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script type="text/ecmascript-6">
import getFlowSelect from '../get-flow-select'
export default {
  name: "base-info",
  components: {getFlowSelect},
  props: {
    isNumber: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      formData: {
        id: 0,
        code: '',
        font: 1,
        title: '',
        department_id: 0,
        type: 1,
        post_id: 0,
        post_count: 0,
        posy_time: '',
        degree: 1,
        secret: 1,
        keyword: '',
        content: '',
        is_sms: 1,
        flow_id: '',
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
  },
  methods: {
    flowChange(flowItem) {
      this.$emit('on-flow-change', flowItem.flow_id, flowItem)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
