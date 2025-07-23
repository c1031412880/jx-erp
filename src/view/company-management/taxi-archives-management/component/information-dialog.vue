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
          <el-form-item label="车牌号:" prop="lincense_plate_number">
            <el-input
              placeholder="请输入车牌号"
              v-model="formData.lincense_plate_number"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="发动机号:" prop="engine_number">
            <el-input
              placeholder="请输入发动机号"
              v-model="formData.engine_number"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
        </div>
         <div class="el-form-row">
          <el-form-item label="车架号码:" prop="frame_number">
            <el-input
              placeholder="请输入车架号码"
              v-model="formData.frame_number"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="道路运输证号:" prop="road_trans_number">
            <el-input
              placeholder="请输入道路运输证号"
              v-model="formData.road_trans_number"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
        </div>

        <div class="el-form-row">
          <el-form-item label="品牌型号:" prop="brand_number">
            <tr-select-dictionaries v-model="formData.brand_number" :classKey="'出租车品牌型号'" :placeholder="'请选择品牌型号'"></tr-select-dictionaries>
          </el-form-item>
          <el-form-item label="注册日期:" prop="regist_date">
            <el-date-picker
              v-model="formData.regist_date"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :disabled="curSelecedType == 'detail'">
            </el-date-picker>
          </el-form-item>
        </div>

        <div class="el-form-row">
          <el-form-item label="车辆所有权:" prop="vehicle_owner">
            <el-select v-model="formData.vehicle_owner" placeholder="请选择车辆所有权" :disabled="curSelecedType == 'detail'">
              <el-option
                v-for="item in ownershipOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="行驶证年审日期:" prop="check_date">
            <el-date-picker
              v-model="formData.check_date"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :disabled="curSelecedType == 'detail'">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="el-form-row">
          <!-- 需求变更可以修改 -->
          <el-form-item label="营运证号:" prop="operation_number">
            <el-input
              placeholder="请输入营运证号"
              v-model="formData.operation_number"
              :disabled="curSelecedType == 'detail'"
            ></el-input>
          </el-form-item>
           <el-form-item label="营运证到期日期:" prop="operation_end_date">
            <el-date-picker
              v-model="formData.operation_end_date"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :disabled="curSelecedType == 'detail'">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="el-form-row">
          <el-form-item label="车主:" prop="driver_ids">
            <el-select v-model="formData.driver_ids" multiple filterable  collapse-tags  clearable placeholder="请选择" :disabled="curSelecedType == 'detail'">
              <el-option
                v-for="item in taxiDriverList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="operation_state" label="车辆状态">
            <el-select v-model="formData.operation_state" clearable placeholder="请选择" :disabled="curSelecedType == 'detail'">
              <el-option
                v-for="item in carStatusOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="el-form-row">
          <el-form-item label="备注:" prop="remark">
            <el-input
              v-model="formData.remark" 
              type="textarea"
              maxlength="200"
              :rows="4"
              show-word-limit
              placeholder="请输入备注"
              :disabled="curSelecedType == 'detail'"></el-input>
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
export default {
  components: {},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
    taxiDriverList:[Array]
  },
  mounted() {
  },
  data() {
    return {
      ownershipOptions:[
        { value: 1, name: "自营" },
        { value: 2, name: "挂靠" }
      ],
      carStatusOptions:[
        { value: 1, name: "营运" },
        { value: 2, name: "停运" },
        { value: 3, name: "报废" },
      ],
      formData: {
        id:'',
        lincense_plate_number: '',
        engine_number: '',
        frame_number: '',
        road_trans_number: '', 
        brand_number: '',
        regist_date: '',
        vehicle_owner: '',
        check_date: '',
        operation_number: '',
        operation_end_date: '',
        operation_state: '',
        remark: '',
        driver_ids:[],

        relations:[]
      },
      rules: {
        lincense_plate_number: [
          { required: true, message: '请输入车牌号', trigger: 'change' },
        ],
        vehicle_owner: [
          { required: true, message: '请选择车辆所有权', trigger: 'change' },
        ],
        operation_state: [
          { required: true, message: '请选择车辆状态', trigger: 'change' },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
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
    // // 设置驾驶证号
    // setDrivingLicence(val) {
    //   this.formData.c_driving_licence = val
    // },
    // // 输入驾驶证校验
    // checkIdCardIsUses(val) {
    //   if(checkCard(val)){
    //     this.formData.d_birthday = byIdCardGettingInfo(val,'birthday')
    //   }
    // },
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
  height: 400px;
  // overflow-y:scroll; 
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

