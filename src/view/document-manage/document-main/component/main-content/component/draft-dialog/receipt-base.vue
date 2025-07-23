<template>
  <el-descriptions :column="2" border>
    <el-descriptions-item label="来文字号">
      {{formData.font_number}}
    </el-descriptions-item>
    <el-descriptions-item label="收文编号">
      {{formData.code}}
    </el-descriptions-item>
    <el-descriptions-item label="来文机关">
      {{formData.organ}}
    </el-descriptions-item>
    <el-descriptions-item label="来文日期">
      {{formData.accept_date}}
    </el-descriptions-item>
    <el-descriptions-item label="密级">
      {{formData.secret_name}}
    </el-descriptions-item>
    <el-descriptions-item label="来文类型">
      {{formData.type_name}}
    </el-descriptions-item>
    <el-descriptions-item label="文件标题" :span="2">
      {{formData.title}}
    </el-descriptions-item>
    <el-descriptions-item label="登记人" :span="2">
      {{formData.register_name}}
    </el-descriptions-item>
    <el-descriptions-item label="登记人部门" :span="2">
      {{formData.department_name}}
    </el-descriptions-item>
    <el-descriptions-item label="主送单位">
      {{formData.main_department_name}}
    </el-descriptions-item>
    <el-descriptions-item label="主送人员">
      {{formData.main_person_names}}
      <el-popover
        placement="top"
        trigger="hover">
        <el-tag v-for="(item, index) in formData.main_person_details" :key="index" :type="!!item.read ? 'success' : 'info'" size="mini" style="margin: 5px 5px;">
          {{item.person_info.name + (!!item.read ? '(已读)' : '(未读)')}}
        </el-tag>
        <span v-show="!!formData.main_persons && formData.main_persons.length" slot="reference" style="color: #00ccff;cursor: pointer;font-size: 12px;">
          {{formData.main_read}}人已读
        </span>
      </el-popover>
    </el-descriptions-item>
    <el-descriptions-item label="抄送单位">
      {{formData.copy_department_names}}
    </el-descriptions-item>
    <el-descriptions-item label="抄送人员">
      {{formData.copy_person_names}}
      <el-popover
        placement="top"
        trigger="hover">
        <el-tag v-for="(item, index) in formData.copy_person_details" :key="index" :type="!!item.read ? 'success' : 'info'" size="mini" style="margin: 5px 5px;">
          {{item.person_info.name + (!!item.read ? '(已读)' : '(未读)')}}
        </el-tag>
        <span v-show="!!formData.copy_persons && formData.copy_persons.length" slot="reference" style="color: #00ccff;cursor: pointer;font-size: 12px;">
          {{formData.copy_read}}人已读
        </span>
      </el-popover>
    </el-descriptions-item>
    <el-descriptions-item label="选择收文流程" :span="2">
      {{formData.flow_name}}
    </el-descriptions-item>
  </el-descriptions>
</template>

<script type="text/ecmascript-6">
import getFlowSelect from '../get-flow-select'
import getDeptEmpSelectTree from '@/components/base/formModel/tree/get-dept-emp-select-tree'
export default {
  name: "base-info",
  components: {getFlowSelect, getDeptEmpSelectTree},
  data() {
    return {
      formData: {
        id: 0,
        code: '',
        font_number: '',
        title: '',
        type: '',
        secret: '',
        is_sms: 1,
        flow_id: 0,
        organ: '',
        accept_date: '',
        post_id: 0,
        department_id: 0,
        main_department: 0,
        main_persons: [],
        copy_departments: [],
        copy_persons: [],
        register_id: '',
        main_department_name: '',
        register_name: '',
        department_name: '',
        copy_department_names: '',
        copy_person_names: '',
        flow_name: '',
        main_person_names: '',
        secret_name: '',
        type_name: '',
        main_read: 0,
        main_person_details: [],
        copy_read: 0,
        copy_person_details: [],
        content: '',
        doc_id: 0,
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
