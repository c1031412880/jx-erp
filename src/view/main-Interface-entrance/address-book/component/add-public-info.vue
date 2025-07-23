<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="460px">
    <el-form :model="form" :rules="basicRules" ref="form" label-width="100px" size="mini">
      <el-form-item label="所属分组:" prop="group_id">
        <el-select v-model="form.group_id" placeholder="请选择所属分组" style="width: 100%;" :disabled="isEdit">
          <el-option
            v-for="item in publicGroupList"
            :key="item.id"
            :label="item.c_name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名:" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名"  :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="手机号:" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号"  :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱:" prop="email">
        <el-input v-model="form.email" placeholder="请输入电子邮箱" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="办公号码:" prop="public_phone">
        <el-input v-model="form.public_phone" placeholder="请输入办公号码" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="公司:" prop="company">
        <el-input v-model="form.company" placeholder="请输入公司" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="职位:" prop="position">
        <el-input v-model="form.position" placeholder="请输入职位" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
          <el-input
          v-model="form.remark" 
          type="textarea"
          maxlength="200"
          :rows="4"
          show-word-limit
          :disabled="isEdit"
          placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="!isEdit">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')" size="mini">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "添加",
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    publicGroupList: {
      type: Array,
      default: () => []
    }
  },
  data() {
     var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入电话号码'))
      }
      // 验证电话号码手机号码，包含至今所有号段? ?
      var ab = /^[1][3,4,5,6,7,8][0-9]{9}$/
      if (value.length !== 11 || ab.test(value) === false) {
        callback(new Error('请输入正确电话号码'))
      }
      callback()
    }
    return {
      form: {
        id: 0,
        group_id: '',
        name: '',
        phone: '',
        email: '',
        public_phone: '',
        company: '',
        position: '',
        remark: '',
      },
      basicRules: {
        group_id: [
          { required: true, message: "请选择分组", trigger: "change" },
        ],
        name: [
          { required: true, message: "请输入姓名", trigger: "change" },
        ],
        phone: [
          { required: true, message: "请输入联系人电话", trigger: "blur", },
          { validator: validatePhone, trigger: 'blur' }
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
        if(val[key]) this.form[key] = val[key]
      }
    },
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          this.$emit("save-add-edit", info);
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
