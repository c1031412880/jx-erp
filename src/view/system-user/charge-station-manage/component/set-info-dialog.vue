<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    width="500px"
  >
    <div class="el-dialog-div" style="overflow-x: hidden;">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="110px"
        class="demo-ruleForm"
        :label-position="'right'" 
        size="mini"
      >
        <el-form-item label="充电桩名称:" prop="name" >
          <el-input v-model="ruleForm.name" placeholder="请输入充电桩名称"></el-input>
        </el-form-item>
        <el-form-item label="所属充电站:" prop="station_id">
          <el-select v-model="ruleForm.station_id" placeholder="请选择所属充电站">
            <el-option
              v-for="item in competentUserOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型:" prop="type" >
          <get-select-dictionaries v-model="ruleForm.type" :classKey="'充电设备类型'" :placeholder="'请选择充电设备类型'"></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="额定功率:" prop="power" >
          <el-input v-model="ruleForm.power" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="ruleForm.power = $event.target.value" placeholder="请输入额定功率"><i slot="suffix" style="color:#333">kw</i></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="remark" >
          <el-input
            type="textarea"
            v-model="ruleForm.remark"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('ruleForm')" size="mini">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components: {
    getSelectDictionaries
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    superiorDeptName:{
      type: String,
      default: '无'
    },
    curType: [String],
    competentUserOptions:[Array],
  },
  data() {
    return {
      showTitle: '',
      ruleForm: {
        // id: '',
        name: '',
        station_id:'',
        type: '',
        power: '',
        remark: '',
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
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.configTitle();
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configTitle() {
      if (this.curType == "add") {
        this.showTitle = "添加充电站";
      } else{
        this.showTitle = "编辑充电站";
      }
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.ruleForm)
          let info = {};
          for (let i in this.ruleForm) {
            if (this.ruleForm[i]) {
              info[i] = this.ruleForm[i];
            }
          }
          this.$emit("save-add-edit-charge",info);
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
  // display: flex;
  // flex-direction: row;
  // justify-content: center;
  // align-items: center;
}

.el-dialog-div {
  height: 350px;
}

.el-dialog-div /deep/ .el-input {
  width: 320px;
}

.el-dialog-div /deep/ .el-input__inner {
  width: 320px;
}
.el-dialog-div /deep/ .el-date-editor .el-range-separator {
  width 10%
}

.el-dialog-div /deep/ .el-textarea {
  width: 320px;
}



.el-cascader {
  width: 100% !important;
}
</style>


