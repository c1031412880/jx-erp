<template>
  <div class="el-dialog-div show-flex-box-r" >
    <el-form :model="form" :rules="basicRules" ref="form" label-width="185px" size="mini">
      <el-form-item label="登录方式:" prop="type">
         <el-select v-model="form.type" placeholder="请选择登录方式">
          <el-option label="同时登录" :value="1"></el-option>
          <el-option label="单点登录" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="密码最短长度:" prop="min_length">
        <el-input v-model="form.min_length" placeholder="请输入密码最短长度"  oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.min_length = $event.target.value"></el-input>
      </el-form-item>
      <el-form-item label="密码包含:" prop="pwd_contain">
        <el-checkbox-group v-model="form.pwd_contain">
          <el-checkbox :label="1">数字</el-checkbox>
          <el-checkbox :label="2">大写字母</el-checkbox>
          <el-checkbox :label="3">小写字母</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="无操作退出系统（小时）:" prop="exit_hour">
        <el-input v-model="form.exit_hour" placeholder="请输入退出时间"  oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.exit_hour = $event.target.value"></el-input>
      </el-form-item>
      <div class="show-flex-box-r">
        <el-form-item label="锁定系统:" prop="error_count">
          <div class="show-flex-box-r">
            <span>连续输入密码错误达 &nbsp;</span>
            <el-input v-model="form.error_count" placeholder="请输入"  oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.error_count = $event.target.value" style="width: 80px">
            </el-input>
            <span>&nbsp;次,</span>
              
          </div>
        </el-form-item>
        <div class="lock-minutes-content">
          <el-form-item label="" prop="lock_minutes">
            <span>将锁定登录 &nbsp;</span>
            <el-input v-model="form.lock_minutes" placeholder="请输入"  oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.lock_minutes = $event.target.value" style="width: 80px">
              </el-input>
            <span>&nbsp;分钟</span>
          </el-form-item>
        </div>
        
      </div>
       
      <div class="show-flex-box-r show-flex-center" style="margin-top: 50px">
        <el-button type="primary" @click="updatePlaybill('form')" size="mini">保 存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
  props: {
    data:[Object],
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    var minLength =(rule, value, callback) => {
      if(value !== '') {
        value = Number(value)
        if (value > 10 || value < 1) {
          callback(new Error('设置最短密码长度在1位-10位'));
        } else {
          callback();
        }
      }
    };
    var exitHour = (rule, value, callback) => {
      if(value !== '') {
        value = Number(value)
        if (value > 24 || value < 0) {
          callback(new Error('设置无操作退出系统的时间在0-24小时在内'));
        } else {
          callback();
        }
      }
    };
    var errorCount =(rule, value, callback) => {
      if(value !== '') {
        value = Number(value)
        if (value > 10 || value < 1) {
          callback(new Error('设置密码输入错误次数在1-10次'));
        } else {
          callback();
        }
      }
    };
    var lockMinutes =(rule, value, callback) => {
      if(value !== '') {
        value = Number(value)
        if (value > 60 || value < 1) {
          callback(new Error('设置限制登陆时间在1-60分钟'));
        } else {
          callback();
        }
      }
    };
    return {
      form: {
        type: 1,
        min_length: '',
        pwd_contain: [],
        exit_hour: 3,
        error_count: '',
        lock_minutes: ''
      },
      basicRules: {
        min_length: [
          { validator: minLength, trigger: "change" },
        ],
        exit_hour: [
          { validator: exitHour, trigger: "change" },
        ],
        error_count: [
          { validator: errorCount, trigger: "change" },
        ],
        lock_minutes: [
          { validator: lockMinutes, trigger: "change" },
        ],
        // c_remark: [
        //   { required: true, message: "请填写岗位描述", trigger: "change" },
        // ],
      },
    };
  },
  watch: {

  },
  methods: {
    setSecuritySettingData(info) {
      this.form.type = info.type
      this.form.min_length = !!info.min_length? info.min_length: ''
      this.form.pwd_contain = !!info.pwd_contain? info.pwd_contain: []
       this.form.exit_hour = !!info.exit_hour? info.exit_hour: ''
      this.form.error_count = !!info.error_count? info.error_count: ''
      this.form.lock_minutes = !!info.lock_minutes? info.lock_minutes: ''
    },
    updatePlaybill(formName) {
      let info = {...{},...this.form};
      console.log(info)
      if(info.min_length !== '') {
        if(info.min_length > 10 || info.min_length < 1) {
          return
        }
      }

      if(info.exit_hour !== '') {
        if(info.exit_hour > 24 || info.exit_hour < 0) {
          return
        }
      }

      if(info.error_count !== '') {
        if(info.error_count > 10 || info.error_count < 1) {
          return
        }
      }

      if(info.lock_minutes !== '') {
        if(info.lock_minutes > 60 || info.lock_minutes < 1) {
          return
        }
      }

      //  console.log(info)
       this.$emit("save-add-edit-security-setting", info);
      
          

      //  this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     let info = {...this.form};
      //     console.log(info)
      //     this.$emit("save-add-edit-job", info);
      //   } else {
      //     return false;
      //   }
      // });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  height: 800px;
}
.el-dialog-div /deep/ .el-input {
  width: 430px;
}

.el-dialog-div /deep/ .el-date-editor {
  width: 430px;
}
.el-dialog-div /deep/.el-select,.el-select--mini {
  width: 430px;
}
.el-dialog-div /deep/ .el-input,.el-input--mini{
  width: 430px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 430px;
}

.el-dialog-div  .lock-minutes-content /deep/ .el-form-item__content {
  margin-left: 0 !important;
}

</style>

