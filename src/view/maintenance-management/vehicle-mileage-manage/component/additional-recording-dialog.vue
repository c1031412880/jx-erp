<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    width="500px"
    
  >
    <div class="el-dialog-div">
      <el-form
        size="mini"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="自编号:" prop="vehicle_id" label-width="140px">
          <get-carcode-select-tree
            ref="carcodeTree"
            :placeholder="'选择车辆自编号'"
            :isShowCheckbox="false"
            v-model="ruleForm.vehicle_id"
            :isExportMultiple="false"
            :width="'280'"
          >
          </get-carcode-select-tree>
        </el-form-item>
        <el-form-item label="车牌号:" prop="vehicle_id" label-width="140px">
          <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="false"
            v-model="ruleForm.vehicle_id"
            :isExportMultiple="false"
            :width="'280'"
          >
          </get-vehicle-select-tree>
        </el-form-item>
        <el-form-item label="添加日期:" prop="date" label-width="140px">
          <el-date-picker
            v-model="ruleForm.date"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :disabled="curType =='edit'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="添加公里数(km):" prop="mile" label-width="140px">
          <el-input
            v-model="ruleForm.mile"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="ruleForm.mile = $event.target.value"
            placeholder="输入公里数"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="desc" label-width="140px">
          <el-input
            type="textarea"
            maxlength="200"
            :rows="4"
            v-model="ruleForm.remark"
            placeholder="请输入备注"
            style="width: 300px"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('ruleForm')">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getCarcodeSelectTree from "@/components/base/formModel/tree/get-carcode-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
export default {
  components: {getCarcodeSelectTree, getVehicleSelectTree},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curType: [String],
  },
  data() {
    return {
      showTitle: "",
      ruleForm: {
        id: "",
        vehicle_id: "",
        date: "",
        mile: "",
        remark: "",
      },
      rules: {
        vehicle_id: [
          { required: true, message: "请选择车牌号", trigger: "change" },
        ],
        date: [
          { required: true, message: "请输添加日期", trigger: "change" },
        ],
        mile: [
          { required: true, message: "请添加公里数", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.resetForm();
      } else {
        this.configTitle();
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configTitle() {
      // alert(this.curType)
      if (this.curType == "add") {
        this.showTitle = "添加车辆公里";
      } else {
        this.showTitle = "编辑车辆公里";
      }
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("save-add-edit-vehicle-mileage", this.ruleForm);
        } else {
          return false;
        }
      });

    },

    resetForm() {
      this.$refs.carcodeTree.onClear();
      this.$refs.vehicleTree.onClear();
      this.$refs["ruleForm"].resetFields();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog__wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.el-dialog-div {
  height: 380px;
  overflow-y: auto;
}

.el-dialog-div /deep/ .el-input {
  width: 300px;
}

.el-dialog-div /deep/ .el-input__inner {
  width: 300px;
}
.el-dialog-div /deep/ .el-date-editor .el-range-separator {
  width 10%
}



.el-cascader {
  width: 100% !important;
}
</style>


