<template>
  <el-form label-width="120px">
    <el-form-item label="发文字号" v-show="formData.font_number">
      {{formData.font_number}}
    </el-form-item>
    <el-form-item label="发文编号" v-show="formData.code">
      {{formData.code}}
    </el-form-item>
    <el-form-item label="公文标题" required>
      <el-input v-model="formData.title" :disabled="draftType=='show'" placeholder="请输入标题"></el-input>
    </el-form-item>
    <el-form-item label="拟稿人" required>
      <vue-user-role-tree placeholder="选择拟稿人" :disabled="draftType=='show'" :show_all="true" :func_type="0" :is_contain_emp="true" v-model="formData.post_id"></vue-user-role-tree>
<!--      <get-dept-emp-select-tree placeholder="选择拟稿人" :func_type="0" :is_contain_emp="true" v-model="formData.post_id"></get-dept-emp-select-tree>-->
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="拟稿部门" required>
          <get-dept-emp-select-tree placeholder="选择拟稿部门" :disabled="draftType=='show'" :func_type="0" v-model="formData.department_id"></get-dept-emp-select-tree>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="发文份数">
          <el-input-number v-model="formData.post_count" :disabled="draftType=='show'"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="发文类型" required>
          <!-- <el-select v-model="formData.type" :disabled="draftType=='show'" style="width:100%;" placeholder="请选择发文类型">
              <el-option
                v-for="(item,i) in typeArr"
                :key="i"
                v-bind="item"
              ></el-option>
            </el-select> -->
          <el-select v-model="formData.type" :disabled="draftType=='show'" placeholder="请选择发文类型" clearable>
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
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="缓急程度">
          <el-select v-model="formData.degree" :disabled="draftType=='show'" placeholder="请选择缓急程度" clearable>
            <el-option label="平急" :value="1"></el-option>
            <el-option label="加急" :value="2"></el-option>
            <el-option label="特急" :value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="发文日期" required>
          <el-date-picker
            v-model="formData.posy_time"
            :disabled="draftType=='show'"
            type="datetime"
            placeholder="选择发文日期"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="保密密级">
          <el-select v-model="formData.secret" placeholder="请选择保密密级" clearable>
            <el-option label="秘密" :value="1"></el-option>
            <el-option label="机密" :value="2"></el-option>
            <el-option label="绝密" :value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="主送单位" required>
          <get-dept-emp-select-tree placeholder="选择主送单位" :disabled="draftType=='show'" :func_type="0" v-model="formData.main_department" :isShowCheckbox="true"></get-dept-emp-select-tree>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="主题词">
          <el-input v-model="formData.keyword" :disabled="draftType=='show'" placeholder="请输入主题词"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="主送人员">
          <vue-user-role-tree placeholder="选择主送人员" :disabled="draftType=='show'" :func_type="0" :show_all="true" :is_contain_emp="true" :isShowCheckbox="true" v-model="formData.main_persons"></vue-user-role-tree>
<!--          <get-dept-emp-select-tree placeholder="选择主送人员" :func_type="0" :is_contain_emp="true" :isShowCheckbox="true" v-model="formData.main_persons"></get-dept-emp-select-tree>-->
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="抄送单位">
          <get-dept-emp-select-tree placeholder="选择抄送单位" :disabled="draftType=='show'" :func_type="0" v-model="formData.copy_departments" :isShowCheckbox="true"></get-dept-emp-select-tree>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="选择发文流程" required>
          <get-flow-select @change="flowChange" :disabled="draftType=='show'" v-model="formData.flow_id"></get-flow-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="抄送人员">
          <vue-user-role-tree placeholder="选择抄送人员" :disabled="draftType=='show'" :show_all="true" :func_type="0" :is_contain_emp="true" :isShowCheckbox="true" v-model="formData.copy_persons"></vue-user-role-tree>
<!--          <get-dept-emp-select-tree placeholder="选择抄送人员" :func_type="0" :is_contain_emp="true" :isShowCheckbox="true" v-model="formData.copy_persons"></get-dept-emp-select-tree>-->
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getFlowSelect from '../get-flow-select'
import getDeptEmpSelectTree from '@/components/base/formModel/tree/get-dept-emp-select-tree'
import { getUser } from '@/utils/auth'
import {formatDateTime} from '@/utils/index'
import VueUserRoleTree from '@/components/base/formModel/tree/user-role-tree/index'
export default {
  name: "base-info",
  components: {getFlowSelect, getDeptEmpSelectTree, VueUserRoleTree},
  props: {
    isNumber: {
      type: Boolean,
      default: true
    },
    draftType: {
      type: String,
      default: ''
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
        type: 100,
        type: '',
        post_id: 0,
        post_count: 0,
        posy_time: '',
        degree: '',
        secret: '',
        keyword: '',
        is_sms: 1,
        flow_id: null,
        main_department: [],
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
          name: '',
          list: [
            {label: '党总支纪要', value: 403},
            {label: '嘉公交纪要', value: 404},
            {label: '嘉公自纪要', value: 405},
            {label: '国鸿汽运纪要', value: 406},
            {label: '嘉通交运党委纪要', value: 407},
            {label: '嘉通交运行政纪要', value: 408},
          ]
        },
        {
          name: '上行文',
          list: [
            {label: '请示', value: 100},
            {label: '报告', value: 101},
            {label: '意见', value: 102},
            {label: '批示', value: 103},
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
            {label: '决定', value: 310},
          ]
        },
        {
          name: '其他',
          list: [
            {label: '其他', value: 400},
            {label: '总结', value: 401},
            {label: '方案', value: 402},
          ]
        }
      ],
      // typeArr: [
      //   {label: '请示', value: 100},
      //   {label: '报告', value: 101},
      //   {label: '意见', value: 102},
      //   {label: '批示', value: 103},
      //   {label: '函', value: 200},
      //   {label: '议案', value: 201},
      //   {label: '公告', value: 202},
      //   {label: '通告', value: 203},
      //   {label: '通知', value: 204},
      //   {label: '党总纪要', value: 205},
      //   {label: '嘉公交纪要', value: 207},
      //   {label: '嘉公自纪要', value: 208},
      //   // {label: '意见', value: 206},
      //   {label: '命令', value: 300},
      //   {label: '决议', value: 301},
      //   {label: '公报', value: 302},
      //   {label: '通报', value: 303},
      //   {label: '批复', value: 304},
      //   // {label: '公告', value: 305},
      //   // {label: '通告', value: 306},
      //   // {label: '通知', value: 307},
      //   // {label: '纪要', value: 308},
      //   // {label: '意见', value: 309},
      //   {label: '决定', value: 310},
      //   {label: '其他', value: 400},
      //   {label: '总结', value: 401},
      //   {label: '方案', value: 402}
      // ],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setUser()
    })
  },
  methods: {
    flowChange(flowItem) {
      this.$emit('on-flow-change', flowItem.flow_id, flowItem)
    },
    setUser() {
      let userInfo = JSON.parse(getUser())
      this.formData.post_id = userInfo.user_id
      this.formData.department_id = userInfo.department_id
      this.formData.posy_time = formatDateTime(new Date())
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.my-content {
  background: #FDE2E2 !important;
}
</style>
