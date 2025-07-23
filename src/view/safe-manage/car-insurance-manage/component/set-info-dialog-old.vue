<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    width="675px"
    
  >
    <div class="el-dialog-div" style="height:450px;overflow-x: hidden;">
      <el-form
      size="mini"
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="120px"
      v-if="curChangeType!='history'"
    >
      <div class="show-flex-box-r">
        <el-form-item label="车辆自编号:" prop="vehicle_id">
          <get-carcode-select-tree
            ref="carcodeTree"
            :placeholder="'选择车辆自编号'"
            :isShowCheckbox="false"
            v-model="formData.vehicle_id"
            @on-change="onSelectChange"
            :isExportMultiple="false"
            :width="'160'"
            :disabled="curChangeType=='detail'"
          >
          </get-carcode-select-tree>
        </el-form-item>
        <el-form-item label="车牌号:" prop="vehicle_id">
          <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="false"
            v-model="formData.vehicle_id"
            @on-change="onSelectChange"
            :isExportMultiple="false"
            :width="'360'"
            :disabled="curChangeType=='detail'"
          >
          </get-vehicle-select-tree>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="所属组织:" prop="vehicle_id">
          <el-input
            placeholder="请选择所属组织"
            v-model="department_name"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="保险单号:" prop="insurance_code">
          <el-input
            placeholder="请输入保险单号"
            v-model="formData.insurance_code"
            :disabled="curChangeType=='detail'"
          ></el-input>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="保险种类:" prop="types">
          <get-select-dictionaries v-model="formData.types" :isMultiple="true" :classKey="'车辆保险种类'" :placeholder="'请选择保险种类'" :disabled="curChangeType=='detail'"></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="保险公司:" prop="company">
          <get-select-dictionaries v-model="formData.company" :classKey="'车辆保险公司'" :placeholder="'请选择保险公司'" :disabled="curChangeType=='detail'"></get-select-dictionaries>
        </el-form-item>
      </div>

      <div class="show-flex-box-r">
        <el-form-item label="投保日期:" prop="insurance_start">
         <el-date-picker
            v-model="formData.insurance_start"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="changeInsuranceStart"
            :disabled="curChangeType=='detail'">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="保险到期日期:" prop="insurance_end">
          <el-date-picker
            v-model="formData.insurance_end"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :disabled="curChangeType=='detail'">
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
        <el-form-item label="投保金额:" prop="insure_fee">
          <el-input
            placeholder="请输入投保金额"
            v-model="formData.insure_fee"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="formData.insure_fee = $event.target.value"
            @change="inputInsureFee"
            :disabled="curChangeType=='detail'"
          ></el-input>
        </el-form-item>
        <el-form-item label="实付金额:" prop="actual_fee">
         <el-input
            placeholder="请输入实付金额"
            v-model="formData.actual_fee"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="formData.actual_fee = $event.target.value"
            @change="inputActualFee"
            :disabled="curChangeType=='detail'"
          ></el-input>
        </el-form-item>
      </div>
      <div class="show-flex-box-r">
         <el-form-item label="备注:" prop="remark">
          <el-input
            type="textarea"
            :disabled="curChangeType=='detail'"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入内容"
            v-model="formData.remark"
          ></el-input>
        </el-form-item>
      </div>
      </el-form>
      <div class="use-table-record show-flex-box-c" style="margin:0 20px;">
        <span style="font-size: 14px;color: #606266;font-weight: 700; margin-bottom:20px;">车辆历史投保记录:</span>
        <div class="table">
          <tr-table
            :selectionShow="false"
            :data="data"
            :tableHeaderList="canRendererTableHeader"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :loading="loading"
            :frontFixedNum="0"
            :backFixedNum="0"
            :isFixedEmptyPlaceholder="false"
            >
            </tr-table>
        </div>
      </div>
    </div>

    <span slot="footer" class="dialog-footer" v-if="curChangeType!='detail' && curChangeType!='history'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill()">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getCarcodeSelectTree from "@/components/base/formModel/tree/get-carcode-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import {getDate} from '@/utils/index'
export default {
  components: {
    getCarcodeSelectTree,
    getVehicleSelectTree,
    getSelectDictionaries
  },
  props: {
    dialogBool: Boolean,
    curChangeType: [String],
  },
  data() {
    return {
      showTitle: "",
      department_name:"", //部门名称
      formData: {
        id: "",
        vehicle_id: "",
        insurance_code: "",
        types: "",
        company: "",
        insurance_start: "",
        insurance_end: "",
        insure_fee: "",
        actual_fee: "",
        remark: "",
      },
      rules:{
        vehicle_id: [
          {
            required: true,
            message: "请选择车辆",
            trigger: "change",
          },
        ],
        types: [
          {
            required: true,
            message: "请选择保险种类",
            trigger: "change",
          },
        ],
        company: [
          {
            required: true,
            message: "请选择保险公司",
            trigger: "change",
          },
        ],
        insurance_start: [
          {
            required: true,
            message: "请选择投保日期",
            trigger: "change",
          },
        ],
        insurance_end: [
          {
            required: true,
            message: "请选择保险到期日期",
            trigger: "change",
          },
        ],
        insure_fee: [
          {
            required: true,
            message: "请输入投保金额",
            trigger: "change",
          },
        ]
      },
      isFirstLoad: false, //第一次进来编辑
      canRendererTableHeader: [
        {
          id: 1,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "vehicle_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "department_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "保险种类",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "保险公司",
          prop: "company_name",
          width: "165",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "投保日期",
          prop: "insurance_start",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "到期日期",
          prop: "insurance_end",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "投保金额",
          prop: "insure_fee",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "实付金额",
          prop: "actual_fee",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "保险单号",
          prop: "insurance_code",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        }
      ],
      data:[], //历史车辆使用记录
      TableHeight:300,
      loading:false,
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.resetData();
      } else {
        this.configTitle();
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
    configTitle() {
      // alert(this.curChangeType)
      if (this.curChangeType == "add") {
        this.showTitle = "添加保险详细";
      }else if(this.curChangeType == "edit") {
        this.showTitle = "编辑保险详细";
      }else if(this.curChangeType == "detail") {
        this.showTitle = "保险详细信息";
      } else if(this.curChangeType == "renewal") {
        this.showTitle = "车辆续保详细";
      } else if(this.curChangeType == "history") {
        this.showTitle = "车辆历史保单详细";
      }
    },
     // 初始化数据
    resetData() {
      // 清空部门选中
      if(this.curChangeType == "history") {
        return
      }
      this.$refs.carcodeTree.onClear();
      this.$refs.vehicleTree.onClear();
      this.department_name = '';
      this.$refs["formData"].resetFields();
    },
    // 选择投保日期算出保险到期日期
    changeInsuranceStart(curdate) {
      let getDateData = getDate('nextOneYear', new Date(curdate));
      if(!!getDateData) {
        this.formData.insurance_end = getDateData.endTime
      }
    },
    inputInsureFee(val) {
      this.formData.insure_fee = Number(val).toFixed(2)      
    },
    inputActualFee(val) {
      this.formData.actual_fee = Number(val).toFixed(2) 
    },
    // 车辆选择
    onSelectChange(vehs, nodes) {
      // console.log(vehs, nodes)
      // if(this.isFirstLoad && this.curChangeType != 'add' && !!this.formData.vehicle_id) {
      //   this.isFirstLoad = false
      //   // console.log("第一次")
      //   return
      // }

      // if(!this.isFirstLoad && this.curChangeType != 'add' && !!this.formData.vehicle_id) {
      //   this.isFirstLoad = true
      //   // console.log("第二次")
      //   return
      // }

      if (vehs && vehs.length > 0) {
        this.reqVehicleRelationInfo(vehs[0])
        this.reqVehicleInsuranceRecord(vehs[0])
      }
    },
    // 获取车辆相关信息
    reqVehicleRelationInfo(car_id) {
      let params = {
        id: car_id
      };
      this.$client.getVehicleRelationInfo(params).then(res => {
        if(res.head.result == '200') {
          this.department_name = res.context.department_name;
        }else{
          this.$message({
            type: 'error',
            message: res.head.describle,
            showClose: true
          })
        }
      })
    },
    // 获取车辆历史投保记录
    reqVehicleInsuranceRecord(car_id) {
      this.loading = true;
      let params = {
        vehicle_id: car_id
      }
       this.$client.getByPageVehicleInsurance(params)
        .then(res => {
          if (res.head.result == "200") {
            this.data = res.context.list;
          } else {
            this.data = []
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
          this.loading = false;
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 数据回显
    setData(val) {
      console.log(val)
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(val, key)) {
          // const element = this.formData[key];
          this.formData[key] = val[key]
        }
      }
      this.department_name = val.department_name;
    },
    // 设置车辆续保
    setRenewalInsuranceData(val) {
      this.formData.vehicle_id = val.vehicle_id
      this.formData.company = val.company
      this.formData.types = (!!val.types && val.types.length)? val.types :[] 

    },
    //
    checkHistoryInsuranceList(val) {
      this.reqVehicleInsuranceRecord(val.vehicle_id)
      this.TableHeight = 410;
    },
    // 保存提交
    updatePlaybill() {
      this.$refs["formData"].validate((valid) => {
        if (valid) {
         let info = this.$outFormData(this.formData)
         this.$emit('save-add-edit', info)
        }else{
          return false;
        }
      });
    }

  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
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
  width: 480px;
}


</style>



