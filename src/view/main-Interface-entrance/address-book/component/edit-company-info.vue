<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="480px">
    <el-form :model="form" :rules="basicRules" ref="form" label-width="80px" size="mini">
      <el-form-item label="部门:" prop="dept_name">
        <el-input v-model="form.dept_name" placeholder="请输入部门" disabled></el-input>
      </el-form-item>
      <el-form-item label="姓名:" prop="user_name">
        <el-input v-model="form.user_name" placeholder="请输入姓名" disabled></el-input>
      </el-form-item>
      <!-- <el-form-item label="工号:" prop="work_code">
        <el-input v-model="form.work_code" placeholder="请输入工号" :disabled="isEdit"></el-input>
      </el-form-item> -->
      <el-form-item label="手机号:" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="分机号:" prop="extension_number">
        <el-input v-model="form.extension_number" placeholder="请输入分机号" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="短号:" prop="short_number">
        <el-input v-model="form.short_number" placeholder="请输入短号" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱:" prop="e_mail">
        <el-input v-model="form.e_mail" placeholder="请输入电子邮箱" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="号码隐藏:" prop="is_hide">
        <!-- <el-switch
          style="display: block"
          v-model="form.phone_view"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="高管模式"
          inactive-text="号码隐藏">
        </el-switch> -->
        <el-radio-group v-model="form.phone_view" size="small">
          <el-radio :label="1" border>不隐藏</el-radio>
          <el-radio :label="2" border>部分隐藏</el-radio>
          <el-radio :label="3" border>高管模式</el-radio>
        </el-radio-group>
         <span style="font-size: 12px; color: #999; font-weight: 400;">*{{form.phone_view == 1 ? '手机号在个人资料中全部显示' : form.phone_view == 2 ? '手机号在个人资料中部分隐藏' : '手机号对所有员工隐藏'}}</span>
      </el-form-item>
      <!-- <el-form-item label="号码隐藏:" prop="is_hide">
        <el-switch v-model="form.is_hide" :active-value="1" :inactive-value="0"  :disabled="isEdit"></el-switch>
        <span style="font-size: 12px; color: #999; font-weight: 400;">若开启,手机号在个人资料中显示隐藏,需手动打开</span>
      </el-form-item>
      <el-form-item label="高管模式:" prop="high_senior">
        <el-switch v-model="form.high_senior"  :active-value="1" :inactive-value="0"  :disabled="isEdit"></el-switch>
        <span style="font-size: 12px; color: #999; font-weight: 400;">若开启,手机号对所有员工隐藏</span>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="!isEdit">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')" size="mini">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { encryptionNum } from '@/utils/index'
export default {
  components: {},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    isEdit: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      isShow: false,
      form: {
        id: 0,
        dept_name: '',
        user_name: '',
        // work_code: '',
        phone: '',
        extension_number: '',
        short_number: '',
        e_mail: '',
        tenant_id: '',
        phone_view: 1,
      },
      basicRules: {
        dept_name: [
          { required: true, message: "请输入部门", trigger: "change" },
        ],
        user_name: [
          { required: true, message: "请输入姓名", trigger: "change" },
        ],
      },
    }
  },
  mounted() {
    
  },
  watch: {
    dialogBool(bool) {
      if(!bool) {
        Object.assign(this.$data.form, this.$options.data().form);
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    setData(val) {
      for(let key in this.form) {
        if(val[key]) {
          if(this.title == '查看' && key == 'phone') {
            if(val.phone_view == 3) {
              this.form.phone = encryptionNum(val.phone, 0, 0)
            }else if(val.phone_view == 2) {
              this.form.phone = encryptionNum(val.phone, 3, 4)
            }else {
              this.form.phone = val.phone
            }
          }else {
            this.form[key] = val[key]
          }
        }
        this.form.id = val.i_id
      }
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          this.$emit("save-edit", info);
        } else {
          return false;
        }
      });
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
