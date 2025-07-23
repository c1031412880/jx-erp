<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="400px">
    <el-form :model="form" :rules="basicRules" ref="form" label-width="100px" size="mini">
      <el-form-item label="日程名称:" prop="schedule_type">
        <el-input v-model="form.schedule_type" placeholder="请输入日程名称"></el-input>
      </el-form-item>
      <el-form-item label="颜色:" prop="colour">
        <el-color-picker v-model="form.colour"></el-color-picker>
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
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
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
    curSelectedType: [String],
  },
  data() {
    return {
      form: {
        id: 0,
        schedule_type: '',
        colour: '',
        remark: ''
      },
      basicRules: {
        schedule_type: [
          { required: true, message: "请输入日程名称", trigger: "change" },
        ],
        colour: [
          { required: true, message: "请选择日程颜色", trigger: "change" },
        ],
      },
    }
  },
  watch: {
    dialogBool(bool) {
      if(bool == false) {
        this.$refs['form'].resetFields();
        Object.assign(this.$data.form, this.$options.data().form);
      }
    }
  },
  mounted() {
    
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 编辑回显
    setData(info) {
      for(let key in this.form) {
        if(info[key]) {
          this.form[key] = info[key]
        }
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
