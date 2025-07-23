<template>
  <div style="height:400px;overflow-x:hidden" class="user-info-box">
    <el-form
      size="mini"
      ref="formData"
      label-width="120px"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="用户账号:"  prop="c_login_id">
        <el-input v-model="formData.c_login_id" placeholder="请输入用户账号(默认名字全为拼音)" :disabled="curChangeType == 'detail'"></el-input>
      </el-form-item>
      <!-- <el-form-item label="用户密码:" prop="c_password">
        <el-input type="password" v-model="formData.c_password" placeholder="请输入用户密码"></el-input>
      </el-form-item> -->
      <el-form-item label="用户姓名:" prop="c_name">
        <el-input v-model="formData.c_name" placeholder="请输入用员工姓名" @change="changeName" :disabled="curChangeType == 'detail'"></el-input>
      </el-form-item>
      <el-form-item label="员工工号:" prop="c_worker_id">
        <el-input v-model="formData.c_worker_id" @change="changeWorkerId" placeholder="请输入员工工号" :disabled="curChangeType == 'detail'"></el-input>
      </el-form-item>
      <!-- <el-form-item label="岗位:" prop="i_position_id">
        <el-input v-model="formData.i_position_id" placeholder="请输入岗位"></el-input>
      </el-form-item> -->
      <el-form-item label="用户类型:" prop="c_not_employee">
        <el-radio-group v-model="formData.c_not_employee" :disabled="curChangeType == 'detail'">
          <el-radio :label="0"><span style="color:#606266">真实员工</span></el-radio>
          <!-- <el-radio label="0">非真实员工</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <el-form-item label="可登录系统:" prop="platform">
        <el-select v-model="formData.platform" multiple placeholder="请选择" :disabled="curChangeType == 'detail'">
          <el-option
            v-for="item in platformOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户状态:" prop="c_state">
        <el-select v-model="formData.c_state" placeholder="请选择用户状态" :disabled="curChangeType == 'detail'">
          <el-option label="永久" value="1"></el-option>
          <el-option label="临时" value="2"></el-option>
          <el-option label="停用" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="有效期至:" v-if="formData.c_state == 2" prop="d_expired">
        <el-date-picker
          v-model="formData.d_expired"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择到期时间"
          :disabled="curChangeType == 'detail'">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="备注:" prop="c_remark">
        <el-input
          placeholder="请填写备注"
          type="textarea"
          :rows="3"
          v-model="formData.c_remark"
          :disabled="curChangeType == 'detail'"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    curChangeType:{
      type: String,
      default: 'add'
    }
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
      formData: {
        c_login_id: '',
        // c_password: '',
        c_name: '',
        c_worker_id: '',
        // i_position_id: '',
        c_not_employee: 0,
        c_state: '',
        d_expired:'',
        c_remark: '',
        platform:[1,2]
      },
      rules: {
         c_login_id: [{
          required: true,
          message: '请输入用户账号',
          trigger: 'blur'
        }],
        // c_password: [{
        //   required: true,
        //   message: '请输入用户密码',
        //   trigger: 'blur'
        // }],
        c_name: [{
          required: true,
          message: '请输入用户姓名',
          trigger: 'blur'
        }],
        c_not_employee: [{
          required: true,
          message: '请选择用户类型',
          trigger: 'blur'
        }],
        c_state: [{
          required: true,
          message: '请选择用户状态',
          trigger: 'change'
        }],
        d_expired: [{
          required: true,
          message: '请选择有效期',
          trigger: 'change'
        }],
        platform: [{
          required: true,
          message: '请选择可登陆平台',
          trigger: 'change'
        }],
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化数据
    resetData(){ 
      this.$refs['formData'].resetFields()
    },
    // 更改员工工号
    changeWorkerId(vaule) {
      // alert(vaule)
      this.$emit('change-worker-id',vaule, 'user')
    },
    // 更改员工姓名
    changeName(vaule) {
      this.$emit('change-personal-name',vaule, 'user')
    },
    // 数据回显
    setData(val){
      this.formData.c_login_id = val.c_login_id;
      // this.formData.c_password = val.c_password;
      this.formData.c_name = val.c_name;
      this.formData.c_worker_id = val.c_worker_id;
      this.formData.c_not_employee = !!val.c_not_employee? Number(val.c_not_employee): 1;
      this.formData.c_state = val.c_state + '';
        this.formData.platform = val.platform || [];
      if(this.formData.c_state == '2') {
        this.formData.d_expired = val.d_expired;
      }
      this.formData.c_remark = val.c_remark;
    },
    // 给父级页面提供得获取本页数据
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs['formData'].validate(valid => {
          if (!valid) {
            reject({
              result: 400,
              msg: '获取失败,带星号的为必填项'
            })
            return
          }
          resolve({ 
            formData: this.formData,
            result:200,
            msg: '获取成功'

          })
        })
      })
    },
  }
}

</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .user-info-box /deep/ .el-select,.el-select--mini {
    width: 740px;
  }
</style>

</style>

