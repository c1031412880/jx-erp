<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :close-on-click-modal="false"
    :before-close="dialogClose">
    <div class="el-dialog-div" style="height:450px;overflow-x: hidden;">
      <el-form
      size="mini"
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="130px"
      v-if="curChangeType!='history'">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="车辆自编号:" prop="vehicle_id">
              <get-vehicle-select-tree
                ref="vehicleTree1"
                :placeholder="'选择车辆自编号'"
                :isShowCheckbox="false"
                v-model="formData.vehicle_id"
                @on-change="onSelectChange"
                :isExportMultiple="false"
                :width="'160'"
                :disabled="curChangeType=='detail'"
              >
              </get-vehicle-select-tree>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌号:" prop="vehicle_id">
              <get-vehicle-select-tree
                ref="vehicleTree"
                :placeholder="'选择车辆'"
                :isShowCheckbox="false"
                v-model="formData.vehicle_id"
                @on-change="onSelectChange"
                :isExportMultiple="false"
                :width="'160'"
                :disabled="curChangeType=='detail'"
              >
              </get-vehicle-select-tree>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属组织:" prop="vehicle_id">
              <el-input
                placeholder="请选择所属组织"
                v-model="formData.department_name"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆型号:">
              <el-input
                v-model="formData.vehicle_model"
                placeholder="请输入车辆型号"
                disabled>
              </el-input>
            </el-form-item>
          </el-col>
          <p
            style="
              margin-left: 15px;
              margin-bottom: 15px;
              color: #409eff;
              font-size: 14px;
              font-weight: bold;
              margin-top: 10px;">保险信息：</p>
          <el-col :span="24">
            <el-form-item label="保险公司:" prop="commercial_insurance_company">
              <get-select-dictionaries 
                v-model="formData.commercial_insurance_company" 
                clearable 
                style="width:100%"
                :classKey="'车辆保险公司'" 
                :placeholder="'请选择保险公司'"
                :disabled="curChangeType=='detail'"></get-select-dictionaries>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交强险(元):" prop="compulsory_insurance">
              <el-input
                placeholder="请输入交强险"
                v-model="formData.compulsory_insurance"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="formData.compulsory_insurance = $event.target.value"
                @change="inputInsureFee('compulsory_insurance')"
                :disabled="curChangeType=='detail'"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="三者险(元):" prop="third_party_insurance">
              <el-input
                placeholder="请输入三者险"
                v-model="formData.third_party_insurance"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="formData.third_party_insurance = $event.target.value"
                @change="inputInsureFee('third_party_insurance')"
                :disabled="curChangeType=='detail'"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车损险(元):" prop="collision_insurance">
              <el-input
                placeholder="请输入车损险"
                v-model="formData.collision_insurance"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="formData.collision_insurance = $event.target.value"
                @change="inputInsureFee('collision_insurance')"
                :disabled="curChangeType=='detail'"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="承运人责任险(元):" prop="carrier_liability_insurance">
              <el-input
                placeholder="请输入承运人责任险"
                v-model="formData.carrier_liability_insurance"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="formData.carrier_liability_insurance = $event.target.value"
                @change="inputInsureFee('carrier_liability_insurance')"
                :disabled="curChangeType=='detail'"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="交强险期限:">
              <el-date-picker
                v-model="compulsory_insurance"
                type="datetimerange"
                range-separator="至"
                start-placeholder="选择开始日期"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                end-placeholder="选择结束日期"
                :picker-options="pickerOptions"
                :default-time="['00:00:00', '23:59:59']"
                :disabled="curChangeType=='detail'"
                @change="selectedTime('compulsory_insurance')">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="交强险保单号:" prop="compulsory_code">
              <el-input
                placeholder="请选择交强险保单号"
                v-model="formData.compulsory_code"
                :disabled="curChangeType=='detail'"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="商业险期限:">
              <el-date-picker
                v-model="commercial_insurance"
                type="datetimerange"
                range-separator="至"
                start-placeholder="选择开始日期"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                end-placeholder="选择结束日期"
                :picker-options="pickerOptions"
                :disabled="curChangeType=='detail'"
                :default-time="['00:00:00', '23:59:59']"
                @change="selectedTime('commercial_insurance')">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="商业险保单号:" prop="commercial_code">
              <el-input
                placeholder="请选择商业险保单号"
                v-model="formData.commercial_code"
                :disabled="curChangeType=='detail'"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="承运险期限:">
              <el-date-picker
                v-model="carrier_liability"
                type="datetimerange"
                range-separator="至"
                start-placeholder="选择开始日期"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                end-placeholder="选择结束日期"
                :picker-options="pickerOptions"
                :disabled="curChangeType=='detail'"
                :default-time="['00:00:00', '23:59:59']"
                @change="selectedTime('carrier_liability')">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="承运险保单号:" prop="carrier_code">
              <el-input
                placeholder="请选择承运险保单号"
                v-model="formData.carrier_code"
                :disabled="curChangeType=='detail'"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="承保人数(人):" prop="policy_holder_count">
              <el-input
                placeholder="请输入承保人数"           
                v-model="formData.policy_holder_count"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="formData.policy_holder_count = $event.target.value"
                @change="inputActualFee('policy_holder_count')"
                :disabled="curChangeType=='detail'"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车船税(元):" prop="vehicle_vessel_tax">
              <el-input
                placeholder="请输入车船税"
                v-model="formData.vehicle_vessel_tax"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="formData.vehicle_vessel_tax = $event.target.value"
                @change="inputInsureFee('vehicle_vessel_tax')"
                :disabled="curChangeType=='detail'"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="打款日期" prop="fee_date">
              <el-date-picker
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择打款日期"
                v-model="formData.fee_date"
                :disabled="curChangeType=='detail'"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合计保费(元):" prop="total_premium">
              <el-input
                placeholder="请输入投保金额"
                v-model="formData.total_premium"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="formData.total_premium = $event.target.value"
                @change="() => {
                  formData.total_premium = Number(formData.total_premium).toFixed(2)
                }"
                :disabled="curChangeType=='detail'"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注:" prop="remark">
              <el-input
                type="textarea"
                :disabled="curChangeType=='detail'"
                :autosize="{ minRows: 4, maxRows: 8}"
                placeholder="请输入内容"
                v-model="formData.remark"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
            <template slot-scope="scope" slot="compulsory_date">
              <span v-show="scope.data.compulsory_insurance_start && scope.data.compulsory_insurance_end">
                {{scope.data.compulsory_insurance_start + '~' + scope.data.compulsory_insurance_end}}
              </span>
            </template>
            <template slot-scope="scope" slot="commercial_date">
              <span v-show="scope.data.commercial_insurance_start && scope.data.commercial_insurance_end">
                {{scope.data.commercial_insurance_start + '~' + scope.data.commercial_insurance_end}}
              </span>
            </template>
            <template slot-scope="scope" slot="carrier_date">
              <span v-show="scope.data.carrier_liability_start && scope.data.carrier_liability_end">
                {{scope.data.carrier_liability_start + '~' + scope.data.carrier_liability_end}}
              </span>
            </template>
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
      compulsory_insurance: [],
      commercial_insurance: [],
      carrier_liability: [],
      formData: {
        id: "",
        vehicle_id: "",
        department_name:"", //部门名称
        vehicle_model:"", //车型名称
        commercial_insurance_company: "",
        compulsory_insurance: "",
        third_party_insurance: "",
        collision_insurance: "",
        carrier_liability_insurance: "",
        vehicle_vessel_tax: "",
        policy_holder_count: "",
        compulsory_insurance_start: "",
        compulsory_insurance_end: "",
        commercial_insurance_start: "",
        commercial_insurance_end: "",
        carrier_liability_start: "",
        carrier_liability_end: "",
        compulsory_code: "",
        commercial_code: "",
        carrier_code : "",
        total_premium: "",
        fee_date: "",
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
        total_premium: [
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
          sortable: true,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "vehicle_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
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
          label: "车型",
          prop: "vehicle_model",
          width: "160",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 4,
          label: "保险公司",
          prop: "commercial_insurance_company_name",
          width: "160",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "交强险(元)",
          prop: "compulsory_insurance",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "三者险(元)",
          prop: "third_party_insurance",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "车损险(元)",
          prop: "collision_insurance",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "承运人责任险(元)",
          prop: "carrier_liability_insurance",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 8,
          label: "车船税(元)",
          prop: "vehicle_vessel_tax",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "承保人数(人)",
          prop: "policy_holder_count",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "交强险期限",
          prop: "compulsory_date",
          width: "260",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 10,
          label: "交强险保单号",
          prop: "compulsory_code",
          width: "260",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "商业险期限",
          prop: "commercial_date",
          width: "260",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 11,
          label: "商业险保单号",
          prop: "commercial_code",
          width: "260",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "承运险期限",
          prop: "carrier_date",
          width: "260",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 12,
          label: "承运险保单号",
          prop: "carrier_code",
          width: "260",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 12,
          label: "打款日期",
          prop: "fee_date",
          width: "260",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "合计保费",
          prop: "total_premium",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: true,
        },
        {
          id: 14,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
      ],
      data:[], //历史车辆使用记录
      TableHeight:300,
      loading:false,
      pickerOptions: {
        shortcuts: [{
          text: '日前一年',
          onClick(picker) {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            const end = new Date(year, month, day - 1, 23, 59, 59);
            const start = new Date(year - 1, month, day, 0, 0, 0);
            // const num = (year%4 == 0 && year%100 != 0 || year%400 == 0) ? 365 : 366
            // console.log(start,num);
            // start.setTime(start.getTime() - 3599 * 1000 * 24 * 365);
            picker.$emit('pick', [start, end]);
          }
        },
        {
          text: '日后一年',
          onClick(picker) {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            const end = new Date(year + 1, month, day - 1, 23, 59, 59);
            const start = new Date(year, month, day, 0, 0, 0);
            // end.setTime(start.getTime() + 3599 * 1000 * 24 * 365);
            picker.$emit('pick', [start, end]);
          }
        },
        {
          text: '日后二年',
          onClick(picker) {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            const end = new Date(year + 2, month, day - 1, 23, 59, 59);
            const start = new Date(year, month, day, 0, 0, 0);
            // end.setTime(start.getTime() + 3599 * 1000 * 24 * 365 * 2);
            picker.$emit('pick', [start, end]);
          }
        },
        {
          text: '日后三年',
          onClick(picker) {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            const end = new Date(year + 3, month, day - 1, 23, 59, 59);
            const start = new Date(year, month, day, 0, 0, 0);
            // end.setTime(start.getTime() + 3599 * 1000 * 24 * 365 * 3);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
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
      this.$refs.vehicleTree1.onClear();
      this.$refs.vehicleTree.onClear();
      this.$refs["formData"].resetFields();
    },
    // 规范钱数小数点位数
    inputInsureFee(name) {
      this.formData[name] = Number(this.formData[name]).toFixed(2)      
      this.getTotalFee()
    },
    // 取整人数
    inputActualFee(name) {
      this.formData[name] = parseInt(this.formData[name]) 
    },
    // 计算总保费
    getTotalFee() {
      this.formData.total_premium = 
        (Number(this.formData.compulsory_insurance) + 
        Number(this.formData.third_party_insurance) +
        Number(this.formData.collision_insurance) +
        Number(this.formData.carrier_liability_insurance)).toFixed(2) 
    },
    // 选择期限
    selectedTime(name, val) {
      console.log(name, val, this[name]);
      const start = name + '_start'
      const end = name + '_end'
      if(this[name] && this[name].length) {
        this.formData[start] = this[name][0]
        this.formData[end] = this[name][1]
      }else {
        this.formData[start] = ''
        this.formData[end] = ''
      }
    },
    // 车辆选择
    onSelectChange(vehs, nodes) {
      console.log(vehs, nodes);
      if (vehs && vehs.length > 0) {
        this.reqVehicleRelationInfo(vehs[0])
        this.reqVehicleInsuranceRecord(vehs[0])
      }else {
        this.formData.vehicle_model = "";
        this.formData.department_name = "";
      }
    },
    // 获取车辆相关信息
    reqVehicleRelationInfo(car_id) {
      this.$client.GetVehicleInfoById({ id: car_id }).then((res) => {
          if (res.head.result == "200") {
            this.formData.department_name = res.context ? res.context.dept_name : '';
            this.formData.vehicle_model = res.context ? res.context.vehicle_model_name : '';
          } else {
            this.$message({
              type: "error",
              message: res.head.describle,
              showClose: true,
            });
          }
        }).catch(err => {});
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
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(val, key)) {
          this.formData[key] = val[key]
        }
      }
      if(val.compulsory_insurance_start && val.compulsory_insurance_end) {
        this.compulsory_insurance = [val.compulsory_insurance_start, val.compulsory_insurance_end]
      }
      if(val.commercial_insurance_start && val.commercial_insurance_end) {
        this.commercial_insurance = [val.commercial_insurance_start, val.commercial_insurance_end]
      }
      if(val.carrier_liability_start && val.carrier_liability_end) {
        this.carrier_liability = [val.carrier_liability_start, val.carrier_liability_end]
      }
      console.log(val, this.formData);
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
</style>



