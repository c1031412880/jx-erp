<template>
  <div class="form-data-box">
    <el-form
      size="mini"
      :model="form"
      :rules="basicRules"
      ref="form"
      label-width="120px"
    >
      <el-form-item label="用户账号:" prop="c_login_id">
        <el-input v-model="form.c_login_id" placeholder="请输入用户账号"></el-input>
      </el-form-item>
      <el-form-item label="用户姓名:" prop="c_name">
        <el-input v-model="form.c_name" placeholder="请输入用员工姓名"></el-input>
      </el-form-item>
      <el-form-item label="员工工号:" prop="c_worker_id">
        <el-input v-model="form.c_worker_id" placeholder="请输入员工工号"></el-input>
      </el-form-item>
      <el-form-item label="岗位:" prop="i_position_id">
        <get-position-list v-model="form.i_position_id"></get-position-list>
      </el-form-item>
      <el-form-item label="用户类型:" prop="c_not_employee">
        <el-radio-group v-model="form.c_not_employee">
          <el-radio label="0">真实员工</el-radio>
          <el-radio label="1">非真实员工</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="可登录系统:" prop="platform">
        <el-select v-model="form.platform" multiple placeholder="请选择">
          <el-option
            v-for="item in platformOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="用户状态:" prop="c_state">
        <el-select v-model="form.c_state" placeholder="请选择用户状态">
          <el-option label="永久" value="1"></el-option>
          <el-option label="临时" value="2"></el-option>
          <el-option label="停用" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="到期时间:" v-if="form.c_state == 2" prop="d_expired">
        <el-date-picker
          v-model="form.d_expired"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择到期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="备注:">
        <el-input
          placeholder="请填写备注"
          type="textarea"
          :rows="3"
          v-model="form.c_remark"
        ></el-input>
      </el-form-item>
      <el-form-item label="说明:">
        <el-alert
          :closable="false"
          title="以上信息仅为简单的用户信息，若要编辑完整的员工档案信息，请前往人事管理-员工档案管理"
          type="info">
        </el-alert>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import getPositionList from "@/components/base/formModel/select/get-position-list";
  export default {
    components: {
      getPositionList
    },
    data() {
      return {
        platformOptions:[
          {
            value: 1,
            label: 'ERP'
          }, {
            value: 2,
            label: '企业APP'
          }, {
            value: 3,
            label: '维修APP'
          }, {
            value: 4,
            label: '综合服务平台'
          }, 
        ],
        form: {
          i_id: 0,
          c_login_id: '',
          c_password: '',
          c_name: '',
          c_worker_id: '',
          i_position_id: '',
          c_not_employee: '0',
          c_state: '1',
          c_remark: '',
          d_expired: '',
          systems_login: ['erp'],
          platform:[1,2]
        },
        basicRules: {
          c_login_id: [
            {
              required: true,
              message: "请输入用户账号",
              trigger: "change",
            },
          ],
          c_name: [
            {
              required: true,
              message: "请输入用员工姓名",
              trigger: "change",
            },
          ],
          // c_worker_id: [
          //   {
          //     required: true,
          //     message: "请输入员工工号",
          //     trigger: "change",
          //   },
          // ],
          // i_position_id: [
          //   {
          //     required: true,
          //     message: "请选择岗位",
          //     trigger: "change",
          //   },
          // ],
          c_not_employee: [
            {
              required: true,
              message: "请选择用户类型",
              trigger: "change",
            },
          ],
          c_state: [
            {
              required: true,
              message: "请选择用户状态",
              trigger: "change",
            },
          ],
          d_expired: [
            {
              required: true,
              message: "请选择到期时间",
              trigger: "change",
            },
          ],

        },
      }
    },
    methods: {
      assign() {
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .form-data-box /deep/ .el-select,.el-select--mini {
    width: 550px;
  }
</style>
