<template>
  <el-form label-width="120px">
    <el-form-item label="公文编号">
      {{formData.code}}
    </el-form-item>
    <el-form-item label="公文字号">
      {{formData.font_number}}
    </el-form-item>
    <el-form-item label="公文标题">
      {{formData.title}}
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="拟稿人">
          {{formData.post_name}}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="发文类型">
          {{formData.type_name}}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="拟稿部门">
          {{formData.department_name}}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="发文份数">
          {{formData.post_count}}份
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="发文日期">
          {{formData.posy_time}}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="缓急程度">
          {{formData.degree_name}}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="保密密级">
          {{formData.secret_name}}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="主题词">
          {{formData.keyword}}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="主送单位">
          {{formData.main_department_name}}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="主送人员">
          {{formData.main_person_names}}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="抄送单位">
          {{formData.copy_department_names}}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="抄送人员">
          {{formData.copy_person_names}}
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="选择发文流程">
      {{formData.flow_name}}
    </el-form-item>
  </el-form>
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
        font_number: '',
        title: '',
        department_id: 0,
        type: 1,
        type_name: '',
        post_id: 0,
        post_count: 0,
        posy_time: '',
        degree: 1,
        secret: 1,
        keyword: '',
        content: '',
        is_sms: 1,
        flow_id: '',
        flow_name: '',
        post_name: '',
        degree_name: '',
        secret_name: '',
        department_name: '',
        main_department_name: '',
        main_person_names: '',
        copy_department_names: '',
        copy_person_names: ''
      },
      typeArr: [
        {label: '请示', value: 100},
        {label: '报告', value: 101},
        {label: '意见', value: 102},
        {label: '函', value: 200},
        {label: '议案', value: 201},
        {label: '公告', value: 202},
        {label: '通告', value: 203},
        {label: '通知', value: 204},
        {label: '纪要', value: 205},
        {label: '意见', value: 206},
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
