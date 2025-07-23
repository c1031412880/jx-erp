<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="400px">
    <el-form :model="form" :rules="basicRules" ref="form" label-width="120px" size="mini">
      <el-form-item label="">
        <span>公共通讯录</span>
      </el-form-item>
      <el-form-item label="名称:" prop="c_name">
        <el-input v-model="form.c_name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
          <el-input
          v-model="form.remark" 
          type="textarea"
          maxlength="200"
          :rows="4"
          show-word-limit
          placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
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
      default: "添加分组",
    },
  },
  data() {
    return {
      form: {
        id: 0,
        c_name: '',
        remark: ''
      },
      basicRules: {
        c_name: [
          { required: true, message: "请输入名称", trigger: "change" },
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
