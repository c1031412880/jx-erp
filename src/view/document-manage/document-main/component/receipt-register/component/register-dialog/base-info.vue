<template>
  <div>
    <el-form label-width="120px">
      <el-form-item label="来文字号">
        <span v-if="!isNumber">{{formData.font_number}}</span>
        <p v-else>
          <!-- <el-input-number v-model="fontForm.font" size="mini" :controls="false" style="width: 80px"></el-input-number>﹝ -->
          <el-input v-model="fontForm.font" :disabled="!isNumber" placeholder="请输入来文字号" size="mini" style="width: 120px"></el-input>﹝
          <el-date-picker
            v-model="year"
            @change="dateChange"
            size="mini"
            type="year"
            placeholder="选择年">
          </el-date-picker>﹞
          <el-input-number v-model="fontForm.number" size="mini" :controls="false" style="width: 80px"></el-input-number>号
        </p>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="来文机关" required>
            <el-input v-model="formData.organ" :disabled="!isNumber" placeholder="请输入来文机关"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收文编号">
            <!-- {{formData.code}} -->
            <el-input v-model="formData.code" :disabled="!isNumber" placeholder="请输入编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来文日期" required>
            <el-date-picker
              :disabled="!isNumber"
              v-model="formData.accept_date"
              type="datetime"
              style="width:100%;"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密级">
            <el-select v-model="formData.secret" :disabled="!isNumber" style="width:100%;" placeholder="请选择保密密级">
              <el-option label="秘密" :value="1"></el-option>
              <el-option label="机密" :value="2"></el-option>
              <el-option label="绝密" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来文类型">
            <el-select v-model="formData.type" :disabled="!isNumber" style="width:100%;" placeholder="请选择来文类型">
              <el-option
                v-for="(item,i) in typeArr"
                :key="i"
                v-bind="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文件标题" required>
            <el-input v-model="formData.title" :disabled="!isNumber" placeholder="请输入标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建人姓名" required>
            <vue-user-role-tree placeholder="选择登记人" :disabled="!isNumber" :show_all="true" :func_type="0" :is_contain_emp="true" v-model="formData.register_id"></vue-user-role-tree>
<!--            <get-dept-emp-select-tree placeholder="选择登记人" :func_type="0" :is_contain_emp="true" v-model="formData.register_id"></get-dept-emp-select-tree>-->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建人部门" required>
            <get-dept-emp-select-tree placeholder="选择登记人部门" :disabled="!isNumber" :func_type="0" v-model="formData.department_id"></get-dept-emp-select-tree>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主送单位" required>
            <get-dept-emp-select-tree placeholder="选择主送单位" :disabled="!isNumber" :func_type="0" v-model="formData.main_department" :isShowCheckbox="true"></get-dept-emp-select-tree>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主送人员">
            <vue-user-role-tree placeholder="选择主送人员" :disabled="!isNumber" :show_all="true" :func_type="0" :is_contain_emp="true" :isShowCheckbox="true" v-model="formData.main_persons"></vue-user-role-tree>
<!--            <get-dept-emp-select-tree placeholder="选择主送人员" :func_type="0" :is_contain_emp="true" :isShowCheckbox="true" v-model="formData.main_persons"></get-dept-emp-select-tree>-->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="抄送单位">
            <get-dept-emp-select-tree placeholder="选择抄送单位" :disabled="!isNumber" :func_type="0" v-model="formData.copy_departments" :isShowCheckbox="true"></get-dept-emp-select-tree>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="抄送人员">
            <vue-user-role-tree placeholder="选择抄送人员" :disabled="!isNumber" :show_all="true" :func_type="0" :is_contain_emp="true" :isShowCheckbox="true" v-model="formData.copy_persons"></vue-user-role-tree>
<!--            <get-dept-emp-select-tree placeholder="选择抄送人员" :func_type="0" :is_contain_emp="true" :isShowCheckbox="true" v-model="formData.copy_persons"></get-dept-emp-select-tree>-->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="选择收文流程" required>
            <get-flow-select  @change="flowChange" :disabled="!isNumber" style="width:100%;" v-model="formData.flow_id"></get-flow-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog
      width="30%"
      title="修改编号"
      :visible.sync="innerVisible"
      append-to-body>
      <el-form>
        <el-form-item label="当前值:">
          <el-input v-model="fontForm.number" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前最大值:">
          <el-input v-model="max" disabled></el-input>
        </el-form-item>
        <el-form-item label="修改值:">
          <el-input-number v-model="set_number"></el-input-number>
        </el-form-item>
        <el-form-item label="可补录空号:">
          <el-button @click="setBl(out_number)" v-if="out_number" size="mini" type="success">{{out_number}}</el-button>
          <el-button @click="setBl(item)" size="mini" type="primary" v-for="(item,i) in numberList" :key="i">{{item}}</el-button>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button  @click="innerVisible = false">取消</el-button>
<!--        <el-button  type="primary" @click="onNumberSubmit">确定</el-button>-->
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import getFlowSelect from '../get-flow-select'
import getDeptEmpSelectTree from '@/components/base/formModel/tree/get-dept-emp-select-tree'
import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries'
import VueUserRoleTree from '@/components/base/formModel/tree/user-role-tree/index'
import { getUser } from '@/utils/auth'
import {formatDateTime} from '@/utils/index'
export default {
  name: "base-info",
  components: {getFlowSelect, getDeptEmpSelectTree, getSelectDictionaries, VueUserRoleTree},
   props: {
    isNumber: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      year: '',
      formData: {
        id: 0,
        code: '',
        font_number: '',
        title: '',
        type: '',
        secret: '',
        is_sms: 1,
        created_id:'',
        flow_id: '',
        organ: '',
        accept_date: '',
        post_id: 0,
        register_id: '',
        department_id: 0,
        main_department: [],
        main_persons: [],
        copy_departments: [],
        copy_persons: []
      },
      fontForm: {
        font: '',
        year: 0,
        number: '',
      },
      numberList: [],
      max: 0,
      set_number: 0,
      isSetNumber: false,
      innerVisible: false,
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
      out_number: 0
    }
  },
  mounted() {
    let date = new Date()
    this.year = date
    this.fontForm.year = date.getFullYear()
    this.setUser()
  },
   methods: {
    dateChange(time) {
      let date = new Date(time)
      this.fontForm.year = date.getFullYear()
    },
    setUser() {
      let userInfo = JSON.parse(getUser())
      this.formData.register_id = userInfo.user_id
      this.formData.department_id = userInfo.department_id
      this.formData.accept_date = formatDateTime(new Date())
    },
     flowChange(flowItem) {
      this.$emit('on-flow-change', flowItem.flow_id, flowItem)
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
