<template>
  <el-dialog
    :visible="dialogBool"
    :title="showCarDamageTitle"
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
        label-width="100px"
        class="demo-formData"
        size="mini"
      >
        <el-form-item label="车辆区分:" prop="i_type">
          <el-radio-group @change="changeRadio" :disabled="curType == 'edit'" v-model="formData.i_type">
            <el-radio :label="1"><span style="color:#606266">对方</span></el-radio>
            <el-radio :label="2"><span style="color:#606266">己方</span></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="车辆:" prop="c_vehicle_number" v-if="formData.i_type == 1">
          <el-input
            placeholder="请输入车辆"
            v-model="formData.c_vehicle_number"
          ></el-input>
        </el-form-item>
        <el-form-item label="车辆:" prop="i_vehicle_id" v-else>
          <get-vehicle-select-tree
            ref="vehicleTree"
            :width="'380'"
            :placeholder="'选择车辆'"
            :isShowCheckbox="false"
            v-model="formData.i_vehicle_id"
            @on-change="onSelectChange"
            :isExportMultiple="false"
          >
          </get-vehicle-select-tree>
        </el-form-item>
        <el-form-item label="车辆类型:" prop="i_vehicle_type">
          <get-select-dictionaries v-model="formData.i_vehicle_type" :disabled="formData.i_type == 2" :classKey="'车辆类型'" :placeholder="'请选择车辆类型'"></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="驾驶员:" prop="c_driver_name" v-if="formData.i_type == 1">
          <el-input
            placeholder="请输入驾驶员"
            v-model="formData.c_driver_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="驾驶员:" prop="i_driver_id" v-else>
           <get-driver-select-tree
            ref="driverTree"
            v-model="formData.i_driver_id"
            :width="'380'"
            :isShowCheckbox="false"
            :placeholder="'请选择驾驶员'"
            :isExportMultiple="false"
            @on-change="onSelectDriverChange"
          ></get-driver-select-tree>
        </el-form-item>
        <el-form-item label="身份证号:" prop="c_driver_code">
          <el-input
            placeholder="请输入人身份证号"
            v-model="formData.c_driver_code"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式:" prop="c_driver_phone">
          <el-input
            placeholder="请输入人联系方式(只能输入数字)"
            v-model="formData.c_driver_phone"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="formData.c_driver_phone = $event.target.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="车损程度:" prop="i_damage">
          <get-select-dictionaries v-model="formData.i_damage" :classKey="'车损程度'" :placeholder="'请选择车损程度'"></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="内部估价：" prop="n_inside_fee">
          <el-input
            placeholder="请输入内部估价(只能输入数字)"
            v-model="formData.n_inside_fee"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="formData.n_inside_fee = $event.target.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="保险公司估价:" prop="n_insurance_fee">
          <el-input
            placeholder="请输入保险公司估价(只能输入数字)"
            v-model="formData.n_insurance_fee"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="formData.n_insurance_fee = $event.target.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="评估中心估价:" prop="n_assessment_fee">
          <el-input
            placeholder="请输入评估中心估价(只能输入数字)"
            v-model="formData.n_assessment_fee"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="formData.n_assessment_fee = $event.target.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="定损金额:" prop="n_actual_fee">
          <el-input
            placeholder="请输入定损金额(只能输入数字)"
            v-model="formData.n_actual_fee"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="formData.n_actual_fee = $event.target.value"
          ></el-input>
        </el-form-item>

        <el-form-item label="车损描述:" prop="c_describe">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入车损描述"
            v-model="formData.c_describe"
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
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
export default {
  components: {
    getSelectDictionaries,
    getVehicleSelectTree,
    getDriverSelectTree
  },
  props: {
    dialogBool: Boolean,
    showCarDamageTitle: [String],
    curType:{
      type: String,
      default: 'add'
    },
    curInfo:[Object]
  },
  data() {
    return {
      formData: {
        i_type: 1,
        i_vehicle_id: '',
        c_vehicle_number: '',
        i_vehicle_type: '', //5325公交先写死  后续调车人关系加上
        i_driver_id: '',
        c_driver_name: '',
        c_driver_code: '',
        c_driver_phone: '',
        i_damage: '',
        n_inside_fee: '',
        n_insurance_fee: '',
        n_assessment_fee: '',
        n_actual_fee: '',
        c_describe: '', 

      },
      rules: {
        i_type: [
          { required: true, message: "请选车辆区分", trigger: "blur" },
        ],
        i_vehicle_id: [
          { required: true, message: "请填写或选择车辆", trigger: "change" },
        ],
        c_vehicle_number: [
          { required: true, message: "请填写或选择车辆", trigger: "change" },
        ],
        i_vehicle_type: [
          { required: true, message: "请选择车辆类型", trigger: "change" },
        ],
        i_damage: [
          { required: true, message: "请选择车损程度", trigger: "change" },
        ],
      },
      curAccidentInfo:{}, //当前编辑信息
      isFirstLoad: true
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.formData.n_inside_fee = '';
        this.formData.n_insurance_fee = '';
        this.formData.n_assessment_fee = '';
        this.formData.n_actual_fee = '';
      }else{
        this.$nextTick(() => {
          this.$refs.formData.clearValidate();
        });
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },

    //选择人员类型
    changeRadio(type) {
      if(type == 2) {
        this.formData.i_vehicle_type = 5325
        if(this.curType == 'add' && this.curInfo) {
          this.formData.i_vehicle_id = this.curInfo.i_vehicle_id;
          this.formData.c_vehicle_number = this.curInfo.lincense_plate_number;
          this.formData.i_driver_id = this.curInfo.i_driver_id;
        }
        // this.formData.c_vehicle_number = '';
      }else{
        if(this.curType == 'add') {
          // this.formData.i_vehicle_type = ''
          // this.formData.i_vehicle_id = '';
          // this.formData.i_driver_id = '';
          Object.assign(this.$data.formData, this.$options.data().formData);
        }else{
          this.formData.i_vehicle_type = this.curAccidentInfo.i_vehicle_type
        }
      }
    },
    // 选择车辆
    onSelectChange(vehs, nodes) {
      console.log(nodes)
      if(!!nodes && nodes.length > 0) {
        this.formData.c_vehicle_number = nodes[0].c_name;
      }else{
        this.formData.c_vehicle_number = ''
      }
      
    },
    // 选择驾驶员
    onSelectDriverChange(drivers, nodes) {
      // console.log(drivers)
      if(this.isFirstLoad && this.curType == 'edit' && this.formData.i_type == 2 && !!this.formData.i_driver_id) {
        this.isFirstLoad = false
        return
      }

      let parmas = {
        id: drivers[0]
      }
      this.$client.getDriverInfo(parmas).then(res => {
        if(res.head.result == '200') {
          let info = res.context;
          this.formData.c_driver_name = info.c_name
          this.formData.c_driver_code = info.c_idcord
          this.formData.c_driver_phone = info.c_phone
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    setData(val) {
      console.log(val)
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(this.formData, key)) {
          // const element = this.formData[key];
          this.formData[key] = val[key]
        }
      }
      this.formData.i_type = Number(val.i_type)
      if(this.formData.i_type == 2) {
        let vehList = []
        let vehObj = {
          c_name: val.c_vehicle_number,
          i_id: val.i_vehicle_id,
          type: 3
        }
        vehList.push(vehObj)
        setTimeout(() => {
          this.$refs.vehicleTree.vehicleCheck(vehList);
        }, 60);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // let info = this.$outFormData(this.formData)
          // console.log(info)
          // return

          if(this.curType == 'add') {
            delete this.formData.i_id
          }
          this.$emit("sure-submit-cardamage", this.formData);
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
  width: 400px;
}

.scrap-dialog /deep/ .el-input--mini {
  width: 400px;
}

.scrap-dialog /deep/ .el-date-editor {
  width: 410px;
}
</style>
