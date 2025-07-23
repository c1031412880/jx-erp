<template>
  <el-form label-width="100px" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="来文字号">
          <span>{{formData.font_number}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="收文编号">
          <span>{{formData.code}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="来文机关">
          <span>{{formData.organ}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="密级">
          <span>{{formData.secret_name}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="登记人">
          <span>{{formData.register_name}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="登记人部门">
          <span>{{formData.department_name}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="公文标题" v-if="!(flowFields.title === 3)">
          <el-input v-model="formData.title"  placeholder="请输入标题" @blur="UpdateDocument" :disabled="flowFields.title === 1 ? true : false"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="来文类型" v-if="!(flowFields.type === 3)">
          <el-select v-model="formData.type" @change="UpdateDocument" :disabled="flowFields.type === 1 ? true : false" placeholder="请选择来文类型" clearable style="width: 100%;">
            <el-option
              v-for="(item,i) in typeArr"
              :key="i"
              v-bind="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="主送单位" v-if="!(flowFields.main_department === 3)">
          <get-dept-emp-select-tree @on-change="UpdateDocument" placeholder="选择主送单位" :disabled="flowFields.main_department === 1 ? true : false" :func_type="0" v-model="formData.main_department" :isShowCheckbox="true"></get-dept-emp-select-tree>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="抄送单位" v-if="!(flowFields.copy_departments === 3)">
          <get-dept-emp-select-tree @on-change="UpdateDocument" placeholder="选择抄送单位" :disabled="flowFields.copy_departments === 1 ? true : false" :func_type="0" v-model="formData.copy_departments" :isShowCheckbox="true"></get-dept-emp-select-tree>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="主送人员" v-if="!(flowFields.main_persons === 3)">
          <vue-user-role-tree @on-change="UpdateDocument" placeholder="选择主送人员" :disabled="flowFields.main_persons === 1 ? true : false" :func_type="0" :show_all="true" :is_contain_emp="true" :isShowCheckbox="true" v-model="formData.main_persons"></vue-user-role-tree>
          <p style="height:16px;">
            <el-popover
              placement="top"
              trigger="hover">
              <el-tag v-for="(item, index) in formData.main_person_details" :key="index" :type="!!item.read ? 'success' : 'info'" size="mini" style="margin: 5px 5px;">
                {{item.person_info ? item.person_info.name + (!!item.read ? '(已读)' : '(未读)') : ''}}
              </el-tag>
              <p v-show="!!formData.main_persons && formData.main_persons.length" slot="reference" style="color: #00ccff;cursor: pointer;font-size: 12px;">
                {{formData.main_read}}人已读
              </p>
            </el-popover>
        </p>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="抄送人员" v-if="!(flowFields.copy_persons === 3)">
          <vue-user-role-tree @on-change="UpdateDocument" placeholder="选择抄送人员" :disabled="flowFields.copy_persons === 1 ? true : false" :show_all="true" :func_type="0" :is_contain_emp="true" :isShowCheckbox="true" v-model="formData.copy_persons"></vue-user-role-tree>
          <p style="height:16px;">
            <el-popover
              placement="top"
              trigger="hover">
              <el-tag v-for="(item, index) in formData.copy_person_details" :key="index" :type="!!item.read ? 'success' : 'info'" size="mini" style="margin: 5px 5px;">
                {{item.person_info ? item.person_info.name + (!!item.read ? '(已读)' : '(未读)') : ''}}
              </el-tag>
              <p v-show="!!formData.copy_person_details && formData.copy_persons.length" slot="reference" style="color: #00ccff;cursor: pointer;font-size: 12px;">
                {{formData.copy_read}}人已读
              </p>
            </el-popover>
          </p>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="来文日期" v-if="!(flowFields.accept_date === 3)">
          <el-date-picker
            v-model="formData.accept_date"
            :disabled="flowFields.accept_date === 1 ? true : false"
            type="datetime"
            @change="UpdateDocument"
            style="width: 100%;"
            placeholder="选择来文日期"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="收文流程">
          <span>{{formData.flow_name}}</span>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries'
import getDeptEmpSelectTree from '@/components/base/formModel/tree/get-dept-emp-select-tree'
import VueUserRoleTree from '@/components/base/formModel/tree/user-role-tree/index'
export default {
  name: "base-info",
  components: {getDeptEmpSelectTree, VueUserRoleTree, getSelectDictionaries},
  props: {
    
  },
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
        main_department: [],
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
        user_ids: [],
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
        {label: '总结', value: 18},
      ],
      flowFields: {
        title: 1,
        type: 1,
        accept_date: 1,
        main_department: 1,
        main_persons: 1,
        copy_departments: 1,
        copy_persons: 1,
      }, //表单字段权限 
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.setUser()
    // })
  },
  methods: {
    dateChange(time) {
      let date = new Date(time)
      this.fontForm.year = date.getFullYear()
      this.GetNumber(false)
    },
    // 更新基础信息
    UpdateDocument() {
      if(!this.formData.title && this.flowFields.title === 2) {
        this.$message.warning('请填写来文标题')
        return false
      }
      // if(!this.formData.type && this.flowFields.type_name === 2) {
      //   this.$message.warning('请选择来文类型')
      //   return false
      // }
      if(!this.formData.post_time && this.flowFields.post_time === 2) {
        this.$message.warning('请选择来文日期')
        return false
      }
      if(!this.formData.main_department && this.flowFields.main_department_name === 2) {
        this.$message.warning('请选择主送单位')
        return false
      }
      // if(!this.formData.main_persons && this.flowFields.main_person_names === 2) {
      //   this.$message.warning('请选择主送人员')
      //   return false
      // }
      // 更新公文信息
      this.$client.UpdateDocumentAccept({context: this.formData}).then((res) => {}).catch((err) => {});
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
