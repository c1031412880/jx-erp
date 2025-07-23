<template>
  <el-dialog
    :visible="dialogBool"
    title="驾驶员调动"
    :before-close="dialogClose"
    width="500px"
    :close-on-click-modal="false"
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="90px" size="mini">
        <el-form-item label="姓名:" prop="user_id">
          <el-input v-model="form.ex_driver_name" placeholder="请输入姓名" disabled></el-input>
        </el-form-item>
        <el-form-item label="原组织:" prop="old_dept_id">
          <get-department-select
            ref="oldBaseTree"
            :isContainEmp="false"
            :funcType="1"
            :isShowCheckbox="false"
            :isExportMultiple="false"
            :width="340"
            v-model="form.old_dept_id"
            :disabled="true"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="新组织:" prop="new_dept_id">
          <get-department-select
            ref="baseTree"
            :isContainEmp="false"
            :funcType="1"
            :isShowCheckbox="false"
            :isExportMultiple="false"
            v-model="form.new_dept_id"
            :width="340"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="调动日期::" prop="change_date">
           <el-date-picker
            v-model="form.change_date"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="调动原因:" prop="reason">
          <el-input
            v-model="form.reason" 
            type="textarea"
            maxlength="200"
            :rows="4"
            show-word-limit
            placeholder="请输入调动原因"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="submitFormData('form')" size="mini">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    getDepartmentSelect
  },
  props: {
    dialogBool: Boolean,
    curSelecedType: [String],
  },
  data() {
    return {
      form: {
        user_id: "",
        ex_driver_name: "",
        old_dept_id: "",
        new_dept_id: "",
        change_date: "",
        reason: "",
      },
      basicRules: {
        user_id: [
          { required: true, message: "请选择姓名", trigger: "change" },
        ],
        old_dept_id: [
          { required: true, message: "请选择原组织", trigger: "change" },
        ],
        new_dept_id: [
          { required: true, message: "请选择新组织", trigger: "change" },
        ],
        change_date: [
          { required: true, message: "请选择调动日期", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.resetData();
        Object.assign(this.$data, this.$options.data());
      }else{
        this.setDate()
        this.$nextTick(() =>{
          this.$refs.form.clearValidate();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 设置默认日期为当天
    setDate() {
      let date = new Date();
      // date.setTime(new Date().getTime());
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      // let hours = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()
      // let minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
      // let seconds = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()
      // + ' ' + hours + ':' + minutes + ':' + seconds
      this.form.change_date = Y + '-' + M + '-' + D
    },
    resetData(){
      this.$refs.baseTree.onClear();
      this.$refs.oldBaseTree.onClear();
    },
    // 提交
    submitFormData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          this.$emit("sure-transfer-dirver", info);
        } else {
          return false;
        }
      });
    },

  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  height: 300px;
}
.el-dialog-div /deep/ .el-date-editor {
  width: 360px;
}
.el-dialog-div /deep/.el-select,.el-select--mini {
  width: 360px;
}
.el-dialog-div /deep/ .el-input,.el-input--mini{
  width: 360px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 360px;
}
</style>


