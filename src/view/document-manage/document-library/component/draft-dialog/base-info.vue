<template>
  <el-descriptions :column="2" border>
    <el-descriptions-item label="公文字号" :span="2">
      <el-input v-model="formData.font"  placeholder="请输入字号"></el-input>
    </el-descriptions-item>
    <el-descriptions-item label="公文标题" :span="2">
      <el-input v-model="formData.title" placeholder="请输入标题"></el-input>
    </el-descriptions-item>
    <el-descriptions-item label="拟稿人" :span="2">
      <get-dept-emp-select-tree placeholder="选择拟稿人" :is_contain_emp="true" v-model="formData.post_id"></get-dept-emp-select-tree>
    </el-descriptions-item>
    <el-descriptions-item label="发文份数">
      <el-input-number v-model="formData.post_count"></el-input-number>
    </el-descriptions-item>
    <el-descriptions-item label="拟稿部门">
      <get-dept-emp-select-tree placeholder="选择拟稿部门" v-model="formData.department_id"></get-dept-emp-select-tree>
    </el-descriptions-item>
    <el-descriptions-item label="发文类型">
      <el-select v-model="formData.type" placeholder="请选择发文类型" clearable>
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
      <el-select v-model="formData.degree" placeholder="请选择缓急程度" clearable>
        <el-option label="平急" :value="1"></el-option>
        <el-option label="加急" :value="2"></el-option>
        <el-option label="特急" :value="3"></el-option>
      </el-select>
    </el-descriptions-item>
    <el-descriptions-item label="保密密级">
      <el-select v-model="formData.secret" placeholder="请选择保密密级" clearable>
        <el-option label="秘密" :value="1"></el-option>
        <el-option label="机密" :value="2"></el-option>
        <el-option label="绝密" :value="3"></el-option>
      </el-select>
    </el-descriptions-item>
    <el-descriptions-item label="主题词">
      <el-input v-model="formData.keyword" placeholder="请输入主题词"></el-input>
    </el-descriptions-item>
    <el-descriptions-item label="主送单位">
      <get-dept-emp-select-tree placeholder="选择主送单位" v-model="formData.main_department"></get-dept-emp-select-tree>
    </el-descriptions-item>
    <el-descriptions-item label="主送人员">
      <get-dept-emp-select-tree placeholder="选择主送人员" :is_contain_emp="true" :isShowCheckbox="true" v-model="formData.main_persons"></get-dept-emp-select-tree>
    </el-descriptions-item>
    <el-descriptions-item label="抄送单位">
      <get-dept-emp-select-tree placeholder="选择抄送单位" v-model="formData.copy_departments" :isShowCheckbox="true"></get-dept-emp-select-tree>
    </el-descriptions-item>
    <el-descriptions-item label="抄送人员">
      <get-dept-emp-select-tree placeholder="选择抄送人员" :is_contain_emp="true" :isShowCheckbox="true" v-model="formData.copy_persons"></get-dept-emp-select-tree>
    </el-descriptions-item>
    <el-descriptions-item label="是否发送提醒短信" :span="2">
      <el-radio-group v-model="formData.is_sms">
        <el-radio :label="0">是</el-radio>
        <el-radio :label="1">否</el-radio>
      </el-radio-group>
    </el-descriptions-item>
    <el-descriptions-item label="选择发文流程" :span="2">
      <get-flow-select @change="flowChange" v-model="formData.flow_id"></get-flow-select>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script type="text/ecmascript-6">
import getFlowSelect from '../get-flow-select'
import getDeptEmpSelectTree from '@/components/base/formModel/tree/get-dept-emp-select-tree'
export default {
  name: "base-info",
  components: {getFlowSelect, getDeptEmpSelectTree},
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
        font: '',
        title: '',
        department_id: 0,
        type: 100,
        post_id: 0,
        post_count: 0,
        posy_time: '',
        degree: 1,
        secret: 1,
        keyword: '',
        content: '',
        is_sms: 1,
        flow_id: '',
        main_department: '',
        copy_departments: [],
        main_persons: [],
        copy_persons: [],
        post_count_view: 0,
        posy_time_view: 0,
        degree_view: 0,
        secret_view: 0,
        main_department_view: 0,
        copy_department_view: 0
      },
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
