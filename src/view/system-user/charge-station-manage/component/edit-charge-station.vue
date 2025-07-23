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
          <span style="font-size: 16px;font-weight: 700;font-style: normal;color: #2B85E4;">充电站</span>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="充电站名称:" prop="name" >
          <el-input v-model="ruleForm.name" placeholder="请输入充电站名称"></el-input>
        </el-form-item>
        <el-form-item label="充电站类型:" prop="type" >
          <get-select-dictionaries v-model="ruleForm.type" :classKey="'充电站类型'" :placeholder="'请选择充电设备类型'"></get-select-dictionaries>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="联系方式:" prop="phone" >
          <el-input v-model="ruleForm.phone" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="ruleForm.phone = $event.target.value" placeholder="请输入联系方式"></el-input>
        </el-form-item>
        <el-form-item label="详细地址:" prop="address" >
          <el-input v-model="ruleForm.address" placeholder="请输入详细地址"></el-input>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="谷电量电费:" prop="price" >
          <el-input v-model="ruleForm.price" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="ruleForm.price = $event.target.value" placeholder="请输入谷电量电费"> <i slot="suffix" style="color:#333">元/kwh</i></el-input>
        </el-form-item>
        <el-form-item label="服务费:" prop="service_fee" >
          <el-input v-model="ruleForm.service_fee" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="ruleForm.service_fee = $event.target.value" placeholder="请输入服务费"><i slot="suffix" style="color:#333">元/kwh</i></el-input>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
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
      </div>
      <div>
        <el-form-item label="备注:" prop="remark" >
          <el-input
            type="textarea"
            v-model="ruleForm.remark"
            :autosize="{ minRows: 4, maxRows: 8}"
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
  mounted() {},
  methods: {
    // 查询
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = JSON.parse(JSON.stringify(this.ruleForm))
          if(!!this.ruleForm.date && this.ruleForm.date.length) {
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
    setFormData(val) {
      for (const key in this.ruleForm) {
        if (Object.hasOwnProperty.call(val, key)) {
          this.ruleForm[key] = val[key];
          if(key == 'start') {
            if( !!val.start) {
              this.ruleForm.date = [val.start, val.end]
            }else{
              this.ruleForm.date = null
            }
          }
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
