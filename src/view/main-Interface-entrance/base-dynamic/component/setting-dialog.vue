<template>
  <el-dialog
    title="审核设置"
    :visible="dialogBool"
    :before-close="dialogClose">
    <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
      <div class="show-flex-box-r">
        <el-form-item label="需要审核的部门" style="width: 400px;" prop="check_dept_ids">
          <get-department-select-tree
            ref="personalTree2"
            v-model="form.dept_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择需要审核的部门'"
            :isContainEmp="false"
            :show_all="false"
            :isExportMultiple="true"
            :isCheckStrictly="false"
          ></get-department-select-tree>
        </el-form-item>
        <span style="padding: 32px 0 0 20px; font-size: 20px;">
          <el-tooltip class="item" effect="dark" content="不设置时默认不需要审批" placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </span>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import getDepartmentSelectTree from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    getDepartmentSelectTree
  },
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      form: {
        id: null,
        dept_ids: []
      },
      rules: {
        dept_ids: [
          { required: true, message: "请选择需要审核的部门", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    dialogBool(bool) {
      if (!bool) {
        this.form.id = null
        this.form.dept_ids = []
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit('update:dialogBool', false)
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("save-set", this.form);
        } else {
          return false;
        }
      });
    },
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>