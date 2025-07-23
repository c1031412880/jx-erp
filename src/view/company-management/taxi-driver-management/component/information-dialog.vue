<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="750px"
    
  >
    <div class="el-dialog-div">
      <el-form
        size="mini"
        :model="formData"
        :rules="rules"
        ref="formData"
        label-width="135px"
      >
        <div class="el-form-row">
          <el-form-item label="姓名:" prop="name">
            <el-input
              placeholder="请输入人员姓名"
              v-model="formData.name"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话:" prop="phone">
            <el-input
              placeholder="请输入电话"
              v-model="formData.phone"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.phone = $event.target.value"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
        </div>
        <div class="el-form-row">
          <el-form-item label="身份证号:" prop="id_number">
            <el-input
              placeholder="请输入身份证号"
              v-model="formData.id_number"
              @change="checkIdCardIsUses"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="性别:" prop="gender">
            <el-radio-group v-model="formData.gender" :disabled="curSelecedType == 'detail'">
              <el-radio :label="1"><span style="color:#606266">男</span></el-radio>
              <el-radio :label="2"><span style="color:#606266">女</span></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="el-form-row">
          <el-form-item label="籍贯:" prop="address">
            <el-input
              placeholder="请输入籍贯"
              v-model="formData.address"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="中介所:" prop="agency">
            <el-input
              placeholder="请输入中介所"
              v-model="formData.agency"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
        </div>

        <div class="el-form-row">
          <el-form-item label="驾驶证到期日期:" prop="driver_end_date">
            <el-date-picker
              v-model="formData.driver_end_date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :disabled="curSelecedType == 'detail'"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发证机构:" prop="auth_license">
            <el-input
              placeholder="请输入发证机构"
              v-model="formData.auth_license"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
        </div>
        <div class="el-form-row">
          <el-form-item label="服务证到期日期:" prop="service_end_date">
            <el-date-picker
              v-model="formData.service_end_date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :disabled="curSelecedType == 'detail'"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="服务证号:" prop="service_number">
            <el-input
              placeholder="请输入服务证号"
              v-model="formData.service_number"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
        </div>

        <div class="el-form-row">
          <el-form-item label="从业资格日期:" prop="qulification_date">
            <el-date-picker
              v-model="formData.qulification_date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :disabled="curSelecedType == 'detail'"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="从业资格证号:" prop="qulification_number">
            <el-input
              placeholder="请输入从业资格证号"
              v-model="formData.qulification_number"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
        </div>
        <div class="el-form-row">
          <el-form-item label="聘用开始日期:" prop="hire_start">
            <el-date-picker
              v-model="formData.hire_start"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :disabled="curSelecedType == 'detail'"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="聘用到期日期:" prop="hire_end">
            <el-date-picker
              v-model="formData.hire_end"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :disabled="curSelecedType == 'detail'">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="el-form-row">
          <el-form-item label="备案卡:" prop="record_number">
            <el-input
              placeholder="请输入备案卡"
              v-model="formData.record_number"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="关联车辆:" prop="taxi_id">
            <el-select v-model="formData.taxi_id" filterable  clearable placeholder="请选择" :disabled="curSelecedType == 'detail'">
              <el-option
                v-for="item in taxiList"
                :key="item.id"
                :label="item.lincense_plate_number"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        
        <div class="el-form-row">
          <el-form-item label="备注:" prop="remark">
            <el-input
              type="textarea"
              :disabled="curSelecedType == 'detail'"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入备注"
              v-model="formData.remark"
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="当前状态:" prop="state">
            <el-radio-group v-model="formData.state" :disabled="curSelecedType == 'detail'">
              <el-radio :label="1"><span style="color:#606266">在聘</span></el-radio>
              <el-radio :label="2"><span style="color:#606266">解聘</span></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer" v-if="curSelecedType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('formData')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import {byIdCardGettingInfo, checkCard} from '@/utils/verificationIDcard'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {getDepartmentSelect},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
    taxiList:[Array]
  },
  mounted() {
  },
  data() {
    return {
      formData: {
        id:'',
        name: '',
        phone: '',
        id_number: '',
        gender: '', 
        address: '',
        agency: '',
        driver_end_date: '',
        auth_license: '',
        service_end_date: '',
        service_number: '',
        qulification_date: '',
        qulification_number: '',
        hire_start: '',
        hire_end: '',
        record_number: '',
        taxi_id: '',
        remark: '',
        state: 1,
      },
      rules: {
        name: [
          { required: true, message: '请输入出租车驾驶员姓名', trigger: 'change' },
        ],
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
    // // 输入驾驶证校验
    checkIdCardIsUses(val) {
      if(checkCard(val)){
         this.formData.id_number = ''
      }
    },
     // 数据回显
    setData(val){
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(val, key)) {
          this.formData[key] = val[key];
        }
      }
      this.$nextTick(() =>{
        this.$refs.formData.clearValidate();
      })
    },
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.formData};
          this.$emit("save-add-edit", info);
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
  height: 450px;
  overflow-y:scroll; 
}

.el-form-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.el-dialog-div /deep/ .el-date-editor {
  width: 180px;
}
.el-dialog-div /deep/.el-select,.el-select--mini {
  width: 180px;
}
.el-dialog-div /deep/ .el-input,.el-input--mini{
  width: 180px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 495px;
}

</style>

