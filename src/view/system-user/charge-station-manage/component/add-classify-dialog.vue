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
        <el-form-item label="充电站名称:" prop="name" >
          <el-input v-model="ruleForm.name" placeholder="请输入充电站名称"></el-input>
        </el-form-item>
        <el-form-item label="充电站类型:" prop="type" >
          <get-select-dictionaries v-model="ruleForm.type" :classKey="'充电站类型'" :placeholder="'请选择充电设备类型'"></get-select-dictionaries>

          <!-- <el-input v-model="ruleForm.c_name" placeholder="请输入充电站类型"></el-input> -->
        </el-form-item>
        <el-form-item label="联系方式:" prop="phone" >
          <el-input v-model="ruleForm.phone" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="ruleForm.phone = $event.target.value" placeholder="请输入联系方式"></el-input>
        </el-form-item>
        <el-form-item label="详细地址:" prop="address" >
          <el-input v-model="ruleForm.address" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <el-form-item label="谷电量电费:" prop="price" >
          <el-input v-model="ruleForm.price" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="ruleForm.price = $event.target.value" placeholder="请输入谷电量电费"> <i slot="suffix" style="color:#333">元/kwh</i></el-input>
        </el-form-item>
        <el-form-item label="服务费:" prop="service_fee" >
          <el-input v-model="ruleForm.service_fee" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="ruleForm.service_fee = $event.target.value" placeholder="请输入服务费"><i slot="suffix" style="color:#333">元/kwh</i></el-input>
        </el-form-item>
        <el-form-item label="峰电量电费:" prop="high_price" >
          <el-input v-model="ruleForm.high_price" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="ruleForm.high_price = $event.target.value" placeholder="请输入谷电量电费"> <i slot="suffix" style="color:#333">元/kwh</i></el-input>
        </el-form-item>
        <el-form-item label="峰电量时段:" prop="date" >
          <el-time-picker
            is-range
            arrow-control
            v-model="ruleForm.date"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            format="HH:mm"
            value-format="HH:mm"
            :editable="false">
          </el-time-picker>
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
      showTitle: "",
      ruleForm: {
        // id: "",
        name: "",
        type: "",
        phone: "",
        address: "",
        price: "",
        high_price: "",
        start: "",
        end: "",
        service_fee: "",
        remark: "",

        date:['08:00','22:00'],
      },
      rules: {
        name: [
          { required: true, message: "请填写充电站名称", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate();
        })
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
        this.showTitle = "添加充电桩";
      } else{
        this.showTitle = "编辑充电桩";
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
          if(this.ruleForm.date.length) {
            info.start = this.ruleForm.date[0]
            info.end = this.ruleForm.date[1]
          }
          delete info.date
          this.$emit("save-add-edit-organization",info);
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
  height: 390px;
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


