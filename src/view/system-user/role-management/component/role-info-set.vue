<template>
  <div class="role-info-set show-flex-box-c">
    <el-alert
      title="警告提示:"
      type="warning"
      :description="`此为${ruleForm.c_name}为角色(组)，用于审批时使用，无法删除(修改)`"
      show-icon
      :closable="false"
      v-if="!curIsdel"
    >
    </el-alert>
    <div style="margin-top: 30px;">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        size="mini"
      >
        <el-form-item label="角色名称:" prop="c_name" label-width="120px">
          <el-input v-model="ruleForm.c_name" :disabled="!curIsdel"></el-input>
        </el-form-item>
        <el-form-item label="所属角色组:" prop="i_group_id" label-width="120px" v-if="!!curRoleType">
          <el-select v-model="ruleForm.i_group_id" clearable placeholder="请选择" :disabled="!curIsdel">
            <el-option
              v-for="item in roleGroupOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="" label-width="120px" v-if="!curRoleType && ruleForm.i_id != 1">
          <el-switch v-model="ruleForm.is_auth" :active-value="1" :inactive-value="0" @change="setGroupAuth"></el-switch>
          <span style="color: #999">开启角色组管理员权限，管理员有权限分配角色组下角色权限</span>
        </el-form-item>
        <el-form-item label="备注:" prop="c_remark" label-width="120px" v-if="curRoleType != 2">
          <el-input
            type="textarea"
            maxlength="200"
            :rows="4"
            v-model="ruleForm.c_remark"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="set-footter show-flex-box-r">
        <el-button type="primary" size="mini" style="margin-right: 15px;" @click="saveRoleInfo('ruleForm')" :disabled="curRoleType == 2">保存</el-button>
        
        <el-popover
          placement="bottom"
          title="操作确认"
          width="400"
          v-model="visible"
          v-if="!curRoleType"
          >
          <div class="show-flex-box-r" style="">
            <span style="margin-right: 10px; color: #FF9900;" class="show-flex-box-r">
              <i class="el-icon-question" style="font-size: 25px;"></i>
            </span>
            <div class="show-flex-box-c">
              <p style="font-size: 15px; margin-bottom: 5px;">当前角色组下共有{{curGourpRoleNum}}个角色，若确定则会删除所有角色组下面的角色信息</p>
              <span>是否确定删除？</span>
            </div>
          </div>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="deleteRoleInfo()">确定</el-button>
          </div>
          <el-button slot="reference" type="danger" :disabled="!curIsdel"  size="mini" v-if="$isPowerShow('del_role')">删除</el-button>
        </el-popover>
        <div v-else>
          <el-button type="danger" size="mini" :disabled="!curIsdel" @click="deleteRoleInfo()" v-if="$isPowerShow('del_role')">删除</el-button>
        </div>

        
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  props: {
    // curRoleInfo:[Object]
    roleGroupOptions:[Array]
  },
  components: {

  },
  watch:{
    ruleForm: {
      handler(newValue, oldValue) {
        if(!this.curRoleType) {
          this.visible = false
        }
      },
      deep: true,
    },
  },
  data() {
    return {
     showTitle: "",
      ruleForm: {
        i_id: "",
        is_auth: 0,
        c_name: "",
        c_remark: "",
        i_group_id:"",
      },
      rules: {
        c_name: [
          { required: true, message: "请填写名称", trigger: "change" },
        ],
        i_group_id: [
          { required: true, message: "请输选择分组", trigger: "change" },
        ],
      },
      curRoleType:"0", //0是角色組，1是角色 
      curIsdel:'0',
      visible: false,
      curGourpRoleNum:"0"
    };
  },
  methods: {
    // 保存
    saveRoleInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
         console.log(this.ruleForm)
          let info = {};
          for (let i in this.ruleForm) {
            if (this.ruleForm[i]) {
              info[i] = this.ruleForm[i];
            }
          }
          if(this.curRoleType == '0') {
            info.is_auth = this.ruleForm.is_auth
          } 
          this.$emit("save-add-edit-role",info);
        } else {
          return false;
        }
      });
    },
    // 删除
    deleteRoleInfo() {
      this.$emit("delete-role-info", this.ruleForm.i_id, this.curRoleType, this.ruleForm.i_group_id);
      setTimeout(() => {
        this.visible = false;
      },100)
    },
    setGroupAuth(val) {
      this.$emit('on-set', val)
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.role-info-set {
  width: 100%;
}

.role-info-set /deep/ .el-select {
  width: 100%;
}

.set-footter{
  justify-content: center;
}

</style>
