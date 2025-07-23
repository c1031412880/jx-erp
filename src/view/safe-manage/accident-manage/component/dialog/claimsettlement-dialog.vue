<template>
  <el-dialog
    :visible="dialogBool"
    :title="showCasualtiesTitle"
    width="590px"
    :close-on-click-modal="false"
    append-to-body
    :before-close="dialogClose"
  >
    <div class="scrap-dialog" style="height: 400px; overflow-x: hidden">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formData"
        label-width="140px"
        class="demo-formData"
        size="mini"
      >
        <el-form-item label="关联保单号:" prop="main_id">
          <el-select v-model="formData.main_id" placeholder="请选择" @change="selectedInsuranceMumber">
            <el-option
              v-for="item in insuranceMumberList"
              :key="item.id"
              :label="item.insurance_code"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="保险公司:" prop="company">
          <el-input
            placeholder="请选择保险公司"
            v-model="formData.company"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="保险种类:" prop="type_name">
          <el-input
            placeholder="请选择保险种类"
            v-model="formData.type_name"
            disabled
          ></el-input>
        </el-form-item>
        
        <el-form-item label="保险有效期范围:" prop="date">
          <el-date-picker
            v-model="formData.date"
            type="daterange"
            range-separator="至"
            start-placeholder="保险有效开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="保险有效结束日期"
            disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="保单金额:" prop="insure_fee">
          <el-input
            placeholder="请填写保单金额"
            v-model="formData.insure_fee"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="理赔完成日期:" prop="finish_date">
          <el-date-picker
            v-model="formData.finish_date"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="理赔提交金额:" prop="actual_fee">
          <el-input
            placeholder="请填写理赔提交金额"
            v-model="formData.actual_fee"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="formData.actual_fee = $event.target.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="保险赔付金额：" prop="insurance_fee">
          <el-input
            placeholder="请填写保险赔付金额"
            v-model="formData.insurance_fee"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="formData.insurance_fee = $event.target.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="理赔进度：" prop="state">
          <el-select v-model="formData.state" placeholder="请选择">
            <el-option
              v-for="item in scheduleOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入备注"
            v-model="formData.remark"
          ></el-input>
        </el-form-item>
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
    showCasualtiesTitle: [String],
    curType:{
      type: String,
      default: 'add'
    },
    insuranceMumberList:[Array], //保险单号列表
  },
  data() {
    return {
      date:[],
      scheduleOptions:[ //进度
        { value: 1, name: "待理赔" },
        { value: 2, name: "理赔中" },
        { value: 3, name: "理赔完成" }
      ],
      formData: {
        main_id: '', //保险单号ID
        actual_fee: '',
        finish_date: '',
        insurance_fee:'',
        state: '',
        remark: '',
        // 只作显示
        company:'',
        type_name: '',
        date:[],
        insure_fee:'',
      },
      rules: {
        // main_id: [
        //   { required: true, message: "请选择关联保单号", trigger: "change" },
        // ],
        finish_date: [
          { required: true, message: "请填选择理赔完成日期", trigger: "change" },
        ]
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
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
    selectedInsuranceMumber(val) {
      console.log(val)
      this.insuranceMumberList.forEach((item) => {
        if (item.id === val) {
          console.log(item)
          this.formData.company = item.company_name;
          this.formData.type_name = item.type_name;
          this.formData.date = [item.insurance_start, item.insurance_end];
          this.formData.insure_fee = item.insure_fee;
        }
      });
      
    },
    setData(val) {
      // console.log(val)
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(this.formData, key)) {
          this.formData[key] = val[key]
        }
        if(!!val.insurance_start || !!val.insurance_end) {
          this.formData.date = [val.insurance_start, val.insurance_end];
        }
        
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          delete this.formData.company
          delete this.formData.type_name
          delete this.formData.date
          delete this.formData.insure_fee
          this.$emit("sure-submit-claimsettlement", this.formData);
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
.scrap-dialog /deep/ .el-input {
  width: 340px;
}

.scrap-dialog /deep/ .el-input--mini {
  width: 340px;
}

.scrap-dialog /deep/ .el-date-editor {
  width: 340px;
}
</style>
