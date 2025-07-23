<template>
  <div class="passengers-mistakenly-audit" v-loading="loading">
    <div class="head-image">
      <img :src="require('../../launch-affair/component/tableData/img/zhang1.png')" v-if="formData.state === 2" alt="">
      <img :src="require('../../launch-affair/component/tableData/img/zhang2.png')" v-if="formData.state === 4" alt="">
      <img :src="require('../../launch-affair/component/tableData/img/zhang3.png')" v-if="formData.state === 3" alt="">
    </div>
    <title-box-new :title="formData.flow_title">
      <div class="head-content">
        <p style="color: #bbbbbb">审批编号:{{ formData.flow_code }}</p>
        <p :style="{ color: outColor(formData.state) }">
          {{ formData.state === 0 ? "发起审批" : formData.state_name }}
        </p>
      </div>
    </title-box-new>
    <item-box-new title="基本信息">
      <el-row :gutter="20">
        <el-col :span="12">
          <p>制表人</p>
          <em>{{ formData.user_name }}</em>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.date === 3)">
          <p>日期</p>
          <em v-if="flowFields.date === 1">{{ formData.date }}</em>
          <el-date-picker
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            v-if="flowFields.date === 2" 
            @change="changeInputContent"
            type="date"
            placeholder="选择日期"
            v-model="formData.date"
            clearable
            style="width: 100%">
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" v-if="!(flowFields.passenger_name === 3)">
          <p>乘客姓名</p>
          <em v-if="flowFields.passenger_name === 1">{{ formData.passenger_name }}</em>
          <el-input
            v-model="formData.passenger_name"
            @change="changeInputContent"
            v-if="flowFields.passenger_name === 2"
            clearable
            placeholder="请输入乘客姓名"
          ></el-input>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.passenger_phone === 3)">
          <p>联系电话</p>
          <em v-if="flowFields.passenger_phone === 1">{{ formData.passenger_phone }}</em>
          <el-input
            v-model="formData.passenger_phone"
            @change="changeInputContent"
            v-if="flowFields.passenger_phone === 2"
            placeholder="请输入联系电话"
          ></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" v-if="!(flowFields.fee === 3)">
          <p>退款金额</p>
          <em v-if="flowFields.fee === 1">{{ formData.fee }}</em>
          <el-input
            placeholder="请输入退款金额"
            v-model="formData.fee"
            v-if="flowFields.fee === 2"
            @change="changeInputContent"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="formData.fee = $event.target.value"
          ></el-input>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.refund_type === 3)">
          <p>退款方式</p>
          <em v-if="flowFields.refund_type === 1">{{ formData.refund_type_name }}</em>
          <get-select-dictionaries
            v-if="flowFields.refund_type === 2"    
            v-model="formData.refund_type"
            :classKey="'退款方式'"
            :width="'100%'"
            :placeholder="'请选择退款方式'"
            @change="selectDictionary"
          ></get-select-dictionaries>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" v-if="!(flowFields.refund_time === 3)">
          <p>退还时间</p>
          <em v-if="flowFields.refund_time === 1">{{ formData.refund_time }}</em>
          <el-date-picker
            v-if="flowFields.refund_time === 2"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期"
            v-model="formData.refund_time"
            style="width: 100%;"
            clearable
            @change="changeInputContent"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="12" v-if="(formData.refund_type_name == '微信' ||formData.refund_type_name == '支付宝') && !(flowFields.refund_account === 3)">
          <p>退款账号</p>
          <em v-if="flowFields.refund_account === 1">{{ formData.refund_account }}</em>
          <el-input
            v-if="flowFields.refund_account === 2"
            v-model="formData.refund_account"
            clearable
            style="width: 100%;"
            :placeholder="'请输入退款账号'"
            @change="changeInputContent"
          ></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" v-if="!(flowFields.handle_user === 3)">
          <p>服务受理人</p>
          <em v-if="flowFields.handle_user === 1">{{ formData.handle_user_name }}</em>
          <get-department-select
            ref="personalTree2"
            v-model="formData.handle_user"
            :isShowCheckbox="false"
            :placeholder="'请选择服务受理人'"
            :isContainEmp="true"
            :show_all="true"
            v-if="flowFields.handle_user === 2"
            :isExportMultiple="false"
            @change="changeInputContent"
            clearable
          ></get-department-select>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.confirm_user === 3)">
          <p>3D视频审核确认人</p>
          <em v-if="flowFields.confirm_user === 1">{{ formData.confirm_user_name }}</em>
          <get-department-select
            ref="personalTree3"
            v-model="formData.confirm_user"
            :isShowCheckbox="false"
            :placeholder="'请选择视频审核确认人'"
            :isContainEmp="true"
            :show_all="true"
            v-if="flowFields.confirm_user === 2"
            @change="changeInputContent"
            :isExportMultiple="false"
            clearable
          ></get-department-select>
        </el-col>
        <el-col :span="24" v-if="!(flowFields.handle_reason === 3)">
          <p>处理原因</p>
          <el-input
            autosize
            type="textarea"
            class="richText"
            disabled
            v-if="flowFields.handle_reason === 1"
            v-model="formData.handle_reason"
          ></el-input>
          <el-input
            type="textarea"
            show-word-limit
            v-model="formData.handle_reason"
            @change="changeInputContent"
            :rows="4"
            v-if="flowFields.handle_reason === 2"
            placeholder="请输入处理原因"
            clearable
          ></el-input>
        </el-col>
      </el-row> 
      <el-row :gutter="20">
        <el-col :span="24" class="table-box">
          <tr-table
            ref="table"
            :data="formData.details"
            :tableHeaderList="customSettingListCopy"
            :TableHeight="300"
            :stripe="false"
            :showRowClass="true"
            :rowClassName="rowClassName">
            <template slot-scope="scope" slot="consume_type_name">
              <span v-if="!(flowFields.consume_type === 3)"></span>
              <span v-if="flowFields.consume_type === 1">{{ scope.data.consume_type_name }}</span>
              <get-select-dictionaries
                v-model="scope.data.consume_type"
                @change="changeInputContent"
                :classKey="'消费方式'"
                v-if="flowFields.consume_type === 2"
                :placeholder="'请选择消费方式'"
                clearable>
              </get-select-dictionaries>
            </template>
            <template slot-scope="scope" slot="ic_card_no">
              <span v-if="!(flowFields.ic_card_no === 3)"></span>
              <span v-if="flowFields.ic_card_no === 1">{{ scope.data.ic_card_no }}</span>
              <el-input v-model="scope.data.ic_card_no" @change="changeInputContent" v-if="flowFields.ic_card_no === 2" clearable></el-input>
            </template>
            <template slot-scope="scope" slot="consume_date_time">
              <span v-if="!(flowFields.consume_time === 3)"></span>
              <span v-if="flowFields.consume_time === 1">{{ scope.data.consume_date_time }}</span>
              <el-date-picker
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择消费时间"
                v-if="flowFields.consume_time === 2"
                v-model="scope.data.consume_time"
                @change="changeInputContent"
                clearable
                style="width: 100%">
              </el-date-picker>
            </template>
            <template slot-scope="scope" slot="consume_fee">
              <span v-if="!(flowFields.consume_fee === 3)"></span>
              <span v-if="flowFields.consume_fee === 1">{{ scope.data.consume_fee }}</span>
              <el-input
                placeholder="请输入消费金额"
                v-model="scope.data.consume_fee"
                @change="changeInputContent"
                v-if="flowFields.consume_fee === 2"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="scope.data.consume_fee = $event.target.value"
                clearable>
              </el-input>
            </template>
            <template slot-scope="scope" slot="vehicle_name">
              <span v-if="!(flowFields.vehicle_id === 3)"></span>
              <span v-if="flowFields.vehicle_id === 1">{{ scope.data.vehicle_name }}</span>
              <get-vehicle-select-tree
                ref="vehicleTree"
                :placeholder="'选择车辆'"
                :isShowCheckbox="false"
                :isExportMultiple="false"
                :oilType="2"
                v-model="scope.data.vehicle_id"
                v-if="flowFields.vehicle_id === 2"
                clearable
                @on-change="onSelectChange(scope.data)">
              </get-vehicle-select-tree>
            </template>
            <template slot-scope="scope" slot="dept_name">
              <span v-if="!(flowFields.I_DEPT_COMPANY === 3)"></span>
              <span v-if="flowFields.I_DEPT_COMPANY === 1">{{ scope.data.dept_name }}</span>
              <get-department-select
                ref="baseTree"
                :isShowCheckbox="false"
                :funcType="1"
                :placeholder="'所属公司'"
                :isExportMultiple="false"
                v-if="flowFields.I_DEPT_COMPANY === 2"
                v-model="scope.data.dept_company"
                @change="changeInputContent"
                clearable
              ></get-department-select>
            </template>
            <template slot-scope="scope" slot="line_name">
              <span v-if="!(flowFields.line_id === 3)"></span>
              <span v-if="flowFields.line_id === 1">{{ scope.data.line_name }}</span>
              <get-line-select-tree
                ref="getLineSelectTree"
                placeholder="请选择线路"
                :isShowCheckbox="false"
                :isExportMultiple="false"
                v-if="flowFields.line_id === 2"
                v-model="scope.data.line_id"
                @change="changeInputContent"
                clearable>
              </get-line-select-tree>
            </template>
            <template slot-scope="scope" slot="driver_name">
              <span v-if="!(flowFields.driver_id === 3)"></span>
              <span v-if="flowFields.driver_id === 1">{{ scope.data.driver_name }}</span>
              <get-driver-select-tree
                ref="driverTree"
                v-model="scope.data.driver_id"
                @change="changeInputContent"
                v-if="flowFields.driver_id === 2"
                :width="'220'"
                :isShowCheckbox="false"
                :placeholder="'请选择司机'"
                :isExportMultiple="false"
                clearable>
              </get-driver-select-tree>
            </template>
          </tr-table>
        </el-col>
      </el-row>
      <el-row class="image-box">
        <image-file-upload
          :images="formData.thumbnail_imgs"
          :files="formData.files_list"
          :isShowOriginal="true"
          :isCompress="true"
          :isShowBox="false"
        ></image-file-upload>
      </el-row>
    </item-box-new>
    <item-box-new title="银行转账方式退款信息">
      <el-row :gutter="20">
        <el-col :span="12" v-if="!(flowFields.refund_name === 3)">
          <p>姓名</p>
          <em v-if="flowFields.refund_name === 1">{{ formData.refund_name }}</em>
          <el-input
            v-model="formData.refund_name"
            @change="changeInputContent"
            placeholder="请输入姓名"
            v-if="flowFields.refund_name === 2"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.id_card === 3)">
          <p>身份证号</p>
          <em v-if="flowFields.id_card === 1">{{ formData.id_card }}</em>
          <el-input
            v-model="formData.id_card"
            @change="changeInputContent"
            placeholder="请输入身份证号"
            clearable
            v-if="flowFields.id_card === 2"
            oninput="value=value.replace(/\D/g, '')"
            @blur="formData.id_card = $event.target.value"
          ></el-input>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.bank === 3)">
          <p>开户行</p>
          <em v-if="flowFields.bank === 1">{{ formData.bank }}</em>
          <el-input
            v-model="formData.bank"
            @change="changeInputContent"
            placeholder="请输入开户行"
            v-if="flowFields.bank === 2"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="12" v-if="!(flowFields.bank_no === 3)">
          <p>银行卡号</p>
          <em v-if="flowFields.bank_no === 1">{{ formData.bank_no }}</em>
          <el-input
            v-model="formData.bank_no"
            @change="changeInputContent"
            placeholder="请输入银行卡号"
            clearable
            v-if="flowFields.bank_no === 2"
            oninput="value=value.replace(/\D/g, '')"
            @blur="formData.bank_no = $event.target.value"
          ></el-input>
        </el-col>
      </el-row>
    </item-box-new>
  </div>
</template>
  
<script type="text/ecmascript-6">
import imageFileUpload from "@/components/imageFileUpload/index";
import titleBoxNew from "../component/title-box-new";
import itemBoxNew from "../component/item-box-new";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
export default {
  name: "passengers-mistakenly-audit",
  components: {
    itemBoxNew,
    titleBoxNew,
    imageFileUpload,
    getSelectDictionaries,
    getDepartmentSelect,
    getVehicleSelectTree,
    getLineSelectTree,
    getDriverSelectTree,
  },
  mounted() {
  },
  props: {
    step_id: "",
    userId: "",
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        flow_id: 0,
        thumbnail_imgs: [],
        files_list: [],
        details:[],
      },
      rowClassName:[], //动态添加行类
      flowFields:{
        date: 1,
        passenger_name: 1,
        passenger_phone: 1,
        fee: 1,
        refund_type: 1,
        refund_time: 1,
        refund_account: 1,
        handle_user: 1,
        confirm_user: 1,
        handle_reason: 1,
        refund_name: 1,
        id_card: 1,
        bank: 1,
        bank_no: 1,
        // 下面是表格的
        consume_type: 1,
        ic_card_no: 1,
        consume_time: 1,
        consume_fee: 1,
        vehicle_id: 1,
        I_DEPT_COMPANY: 1,
        line_id: 1,
        driver_id: 1,
      },
      customSettingListCopy: [
        {
          id: 1,
          label: "*消费方式",
          prop: "consume_type_name",
          width: "150",
          align: "center",
          signIndex: 0,
          notTooltip: true,
        },
        {
          id: 2,
          label: "公交IC卡号或支付宝订单号",
          prop: "ic_card_no",
          width: "200",
          align: "center",
          signIndex: 1,
          notTooltip: true,
        },
        {
          id: 3,
          label: "*消费时间",
          prop: "consume_date_time",
          width: "220",
          align: "center",
          signIndex: 2,
          notTooltip: true,
        },
        {
          id: 4,
          label: "*消费金额",
          prop: "consume_fee",
          width: "150",
          align: "center",
          signIndex: 3,
          notTooltip: true,
        },
        {
          id: 5,
          label: "*车号(车牌号)",
          prop: "vehicle_name",
          width: "200",
          align: "center",
          signIndex: 4,
          notTooltip: true,
        },
        {
          id: 6,
          label: "*所属公司",
          prop: "dept_name",
          width: "180",
          align: "center",
          signIndex: 5,
          notTooltip: true,
        },
        {
          id: 7,
          label: "*线路",
          prop: "line_name",
          width: "180",
          align: "center",
          signIndex: 6,
          notTooltip: true,
        },
        {
          id: 8,
          label: "*司机",
          prop: "driver_name",
          width: "180",
          align: "center",
          signIndex: 7,
          notTooltip: true,
        },
      ],
    };
  },
  watch: {
    step_id(id) {
      if(this.formData.user_ids && this.formData.user_ids.includes(this.userId)) {
        this.getFlowFields(id)
      }else {
        Object.assign(this.flowFields, this.$options.data().flowFields)
      }
    },
  },
  methods: {
    // 审批单状态
    outColor(state) {
      switch (state) {
        case 0:
          return "#00ccff";
          break;
        case 1:
          return "#F58A40";
          break;
        case 2:
          return "#0CB780";
          break;
        case 3:
          return "#F2260E";
          break;
        case 4:
          return "#999999";
          break;
      }
    },
    //选择车辆 绑定所属公司和线路
    onSelectChange(scopeData) {
      this.$client
        .GetVehicleInfoById({ id: scopeData.vehicle_id })
        .then((res) => {
          if (res.head.result == "200") {
            this.formData.details[scopeData.index].dept_company = res.context.dept_id
            this.formData.details[scopeData.index].line_id = res.context.line_id
            this.changeInputContent()
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {});
    },
    initData(info) {
      // 添加动态行类
      info.details.forEach((item,index) => {
        if (item.isSign) {
          this.rowClassName.push({
            index:index,
            name: 'sign-row'
          })
        }
      });
    },
    // 获取表单字段控制
    getFlowFields(id) {
      let params = {
        flow_step_id: id
      }
      this.$client.GetFlowFieid(params).then((res) => {
        if (res.head.result == "200") {
          let data = res.context
          let fields = Object.keys(this.flowFields)
          if(data && data.length) {
            data.forEach(item => {
              if(fields.indexOf(item.fieid_code) > -1) {
                this.flowFields[item.fieid_code] = item.type
              }
            })
          }
        }
      }).catch((err) => {});
    },
    selectDictionary(info){
      this.formData.refund_type_name = info.c_name
      this.formData.refund_account = ""
      this.changeInputContent()
      // if(info.c_name == '微信' || info.c_name == '支付宝'){
      //   this.showAccount = true
      // }else{
      //   this.showAccount = false
      // }
    },
    // 修改input内容
    changeInputContent() {
      if(this.formData.state) {
        let params = {
          context: {
            form_data: {},
            step_data: null
          }
        }
        params.context.form_data = Object.assign({}, this.formData)
        this.$client.EditMistakeHandle(params).then((req) => {})
      }
    },
  },
};
</script>
  
  <style lang="stylus" rel="stylesheet/stylus" scoped>
  .passengers-mistakenly-audit {
    .head-image {
      position: absolute;
      top: 32px;
      right: 38px;

      img {
        height: 98px;
        width: 98px;
      }
    }

    .head-content {
      position: relative;
      width: 100%;

      p {
        font-size: 12px;
        font-weight: 400;
        margin-top: 15px;
      }
    }

    .el-col {
      margin-bottom: 22px;

      p {
        font-family: Source Han Sans SC-Medium, Source Han Sans SC;
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        margin-bottom: 6px;
      }

      em, /deep/ .el-textarea__inner {
        font-size: 14px;
        font-weight: 500;
        color: #333333;
      }

      /deep/ .el-textarea__inner {
        min-height: 60px !important;
      }
    }

    .image-box {
      margin-bottom: 0px;
    }

    .richText {
      width: 100%;

      /deep/ {
        .el-textarea__inner {
          background-color: #fff;
          border: none;
          cursor: auto;
          padding: 0;
        }
      }
    }
  }
</style>
  