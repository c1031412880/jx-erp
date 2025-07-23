<template>
  <div class="edit-charge">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="110px"
      class="demo-ruleForm"
      :label-position="'right'"
      size="mini"
    >
      <div>
        <el-form-item label="所属类别:">
          <span style="font-size: 16px;font-weight: 700;font-style: normal;color: #2B85E4;">充电桩</span>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="充电桩名称:" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入充电桩名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属充电站:" prop="station_id">
          <el-select
            v-model="ruleForm.station_id"
            placeholder="请选择所属充电站"
          >
            <el-option
              v-for="item in competentUserOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="额定功率:" prop="power">
          <el-input
            v-model="ruleForm.power"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="ruleForm.power = $event.target.value"
            placeholder="请输入额定功率"
            ><i slot="suffix" style="color: #333">kw</i></el-input
          >
        </el-form-item>
        <el-form-item label="设备类型:" prop="type">
          <get-select-dictionaries
            v-model="ruleForm.type"
            :classKey="'充电设备类型'"
            :placeholder="'请选择充电设备类型'"
          ></get-select-dictionaries>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="备注:" prop="remark">
          <el-input
            type="textarea"
            v-model="ruleForm.remark"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="show-flex-box-r show-flex-center" style="margin-top: 80px;" v-if="$isPowerShow('save')">
      <el-button type="primary" @click="updatePlaybill('ruleForm')" size="mini"
        >保 存</el-button
      >
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  props: {
    curSelectedDepartment: [Object],
    competentUserOptions: [Array],
  },
  components: { getSelectDictionaries },
  data() {
    return {
      ruleForm: {
        id: '',
        name: "",
        station_id: "",
        type: "",
        power: "",
        remark: "",
      },
      rules: {
        name: [
          { required: true, message: "请填写充电站名称", trigger: "change" },
        ],
        station_id: [
          { required: true, message: "请选择所属充电站", trigger: "change" },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    // 查询
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.ruleForm)
          this.$emit("save-add-edit-charge",this.ruleForm);
        } else {
          return false;
        }
      });
    },
    setFormData(val) {
      for (const key in this.ruleForm) {
        if (Object.hasOwnProperty.call(val, key)) {
          this.ruleForm[key] = val[key];
          
        }
      }
    },
  },
  watch: {
    curSelectedDepartment: {
      handler(newVal, oldVal) {
        // this.ruleForm.name = "";
      },
      deep: true,
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
// .edit-charge
.edit-charge /deep/ .el-input {
  width: 250px;
}

.edit-charge /deep/ .el-input__inner {
  width: 250px;
}

.edit-charge /deep/ .el-date-editor .el-range-separator {
  width: 10%;
}

.edit-charge /deep/ .el-textarea {
  width: 350px;
}
</style>
