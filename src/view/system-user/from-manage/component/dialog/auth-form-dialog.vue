<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    width="30%"
    top="-100px"
    :before-close="dialogClose">
    <div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm">
        <!-- <el-form-item label="" prop="type">
          <el-radio-group v-model="ruleForm.type">
            <el-radio :label="2">人员</el-radio>
            <el-radio :label="1">部门</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="分配人员:" prop="object_ids">
          <get-department-select
            ref="personalTree"
            v-model="ruleForm.object_ids"
            :isShowCheckbox="true"
            :show_all="true"
            :placeholder="'请选择人员'"
            :isContainEmp="true"
            :isExportMultiple="true"
            :isCheckStrictly="false"
          ></get-department-select>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    getDepartmentSelect,
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "表单权限分配",
    },
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        form_id: '',
        type: 2,
        object_ids: [],
      },
      rules: {
        // object_ids: [
        //   { required: true, message: "请选择人员", trigger: "blur" },
        // ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.$refs.personalTree.onClear()
        this.$refs['ruleForm'].resetFields();
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    setDate(info) {
      this.ruleForm = JSON.parse(JSON.stringify(info))
      this.ruleForm.type = 2
      console.log(this.ruleForm);
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // let info = {}
          // for(let key in this.ruleForm) {
          //   if(this.ruleForm[key]) {
          //     info[key] = this.ruleForm[key]
          //   }
          // }
          console.log(this.ruleForm);
          this.$emit('on-auth', this.ruleForm)
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
