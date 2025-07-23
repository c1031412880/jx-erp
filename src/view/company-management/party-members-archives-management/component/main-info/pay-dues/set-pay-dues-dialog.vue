<template>
  <el-dialog
    :visible="dialogBool"
    :title="showPartyDeeTitle"
    width="700px"
    append-to-body
    :before-close="dialogClose"
  >
    <div class="base-info" style="height: 290px; overflow-x: hidden">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formData"
        label-width="140px"
        class="demo-formData"
        size="mini"
      >
        <div class="show-flex-box-r">
          <el-form-item label="党费缴纳标准:" prop="standard">
            <el-select v-model="formData.standard" placeholder="请选择党费缴纳标准" clearable>
              <el-option v-for="(item, index) in politicalOptions" :key="index" :label="item.name"
              :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实发工资(元):" prop="wage">
            <el-input
              placeholder="请输入实发工资"
              v-model="formData.wage"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.wage = $event.target.value"
              @input="countShouldPayPartyFee"
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
           <el-form-item label="缴纳基数:" prop="base_pay">
            <el-input
              placeholder="请输入缴纳基数"
              v-model="formData.base_pay"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.base_pay = $event.target.value"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="党费计算比例:" prop="ratio">
            <el-input
              placeholder="请输入党费计算比例"
              v-model="formData.ratio"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.ratio = $event.target.value"
              disabled
            >
            <template slot="append">%</template></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
           <el-form-item label="应缴党费:" prop="should_fee">
            <el-input
              placeholder="请输入应缴党费"
              v-model="formData.should_fee"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.should_fee = $event.target.value"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="缴纳月份:" prop="month">
            <el-date-picker
              v-model="formData.month"
              type="month"
              format="yyyy-MM"
              value-format="yyyy-MM"
              placeholder="请选择缴纳月份">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
           <el-form-item label="本次缴纳金额:" prop="actual_fee">
            <el-input
              placeholder="请输入本次缴纳金额"
              v-model="formData.actual_fee"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.actual_fee = $event.target.value"
            ></el-input>
          </el-form-item>
          <el-form-item label="缴纳日期:" prop="submit_date">
            <el-date-picker
              v-model="formData.submit_date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="本次缴纳党费类别:" prop="fee_type">
          <el-input
            placeholder="请输入本次缴纳党费类别"
            v-model="formData.fee_type"
          ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogClose()">取 消</el-button>
      <el-button type="primary" @click="submitForm('formData')"
        >保 存</el-button
      >
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
export default {
  components: {
    getSelectDictionaries,
    getDriverSelectTree
  },
  props: {
    dialogBool: Boolean,
    showPartyDeeTitle: [String],
    curType:{
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
       politicalOptions:[
        { value: 1, name: "按标准缴纳" },
        { value: 2, name: "经批准少交党费" },
        { value: 3, name: "免交党费" },
        { value: 4, name: "自愿多交党费" },
      ],
      formData: {
        id: "",
        party_user_id: "",
        ex_phone: "",
        standard: "",
        wage: "",
        base_pay: "",
        ratio: "",
        should_fee: "",
        month: "",
        actual_fee: "",
        submit_date: "",
        fee_type: "",
      },
      rules: {
        standard: [
          { required: true, message: "请选择党费缴纳标准", trigger: "change" },
        ],
        wage: [
          { required: true, message: "请填写实发工资", trigger: "change" },
        ],
        base_pay: [
          { required: true, message: "请填写缴纳基数", trigger: "change" },
        ],
        ratio: [
          { required: true, message: "请填写党费计算比例", trigger: "change" },
        ],
        should_fee: [
          { required: true, message: "请填写应缴党费", trigger: "change" },
        ],
        month: [
          { required: true, message: "请选择缴纳月份", trigger: "change" },
        ], 
        actual_fee: [
          { required: true, message: "请填写本次缴纳金额", trigger: "change" },
        ],
        submit_date: [
          { required: true, message: "请填写缴纳日期", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        if(this.curType == 'add') {
          this.setDate();
        }
        this.$nextTick(() => {
          this.$refs.formData.clearValidate();
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
      this.formData.month =  Y + '-' + M;
      this.formData.submit_date = Y + '-' + M + '-' + D
    },
    // 计算应缴党费
    countShouldPayPartyFee(val) {
      // console.log(val)
      if(!!val) {
        let re = /([0-9]+.[0-9]{2})[0-9]*/;
        this.formData.wage = val.replace(re,"$1");
        this.formData.base_pay = this.formData.wage
        this.reqCountProportion(this.formData.wage)
      }else{
        this.formData.wage = "";
        this.formData.ratio = "";
        this.formData.should_fee = ""
      }
    },
    // 获取党计算比列
    reqCountProportion(val) {
      let parmas = {
        fee: val
      }
      this.$client
        .PartyFeeQueryPartyFee(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.formData.ratio = res.context;
            this.formData.should_fee = ((this.formData.base_pay * this.formData.ratio) / 100).toFixed(2)
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    // 编辑设置回显、
    setData(val) {
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(val, key)) {
          this.formData[key] = val[key]
        }
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        if(this.curType == 'add') {
          delete this.formData.id
        }
          this.$emit("sure-submit-casualties", this.formData);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.base-info /deep/ .el-date-editor {
  width: 180px;
}
.base-info /deep/.el-select,.el-select--mini {
  width: 180px;
}
.base-info /deep/ .el-input,.el-input--mini{
  width: 180px;
}

// .base-info /deep/ .el-textarea {
//   width: 605px;
// }
</style>
