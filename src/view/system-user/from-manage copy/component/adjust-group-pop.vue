<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="30%"
    top="-100px"
  >
    <div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="当前分组:">
          <span style="font-size: 18px; font-weight: bold">{{
            curGroupName
          }}</span>
        </el-form-item>

        <el-form-item label="移动到:" prop="name">
          <el-select v-model="ruleForm.id" placeholder="请选择移动到分组">
            <el-option
              v-for="item in fromGroupList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('ruleForm')"
        >保存</el-button
      >
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "调整分组",
    },
    curGroupName: [String],
    fromGroupList: [Object, Array],
  },
  data() {
    return {
      ruleForm: {
        id: "",
      },
      rules: {
        id: [
          { required: true, message: "请选择表单组名称", trigger: "blur" },
        ],
      },
      groupOptions: [],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.$refs["ruleForm"].resetFields();
      } else {
        this.configGroupOptions();
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configGroupOptions() {
      // this.fromGroupList.forEach((item, index) => {
      //   let childObj = {
      //     value: item.id,
      //     label: item.label,
      //   };
      //   this.groupOptions.push(childObj);
      // });
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.ruleForm)
          this.$emit("submit-adjust-group", this.ruleForm.id);
          this.dialogClose();
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog__wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
