<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="制表人" prop="user_id">
          <get-department-select
            ref="personalTree1"
            v-model="form.user_id"
            :isShowCheckbox="false"
            :placeholder="'请选择制表人'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="false"
            @on-change="dateChange"
            clearable
          ></get-department-select>
        </el-form-item>
        <!-- :disabled="isShowSelectUser || isAgain" -->
      </el-col>
      <el-col :span="12">
        <el-form-item label="日期" prop="date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            v-model="form.date"
            style="width: 100%"
            clearable
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="乘客姓名" prop="passenger_name">
          <el-input
            v-model="form.passenger_name"
            placeholder="请输入乘客姓名"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="联系电话" prop="passenger_phone">
          <el-input
            v-model="form.passenger_phone"
            placeholder="请输入联系电话"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="退款金额" prop="fee">
          <el-input
            placeholder="请输入退款金额"
            v-model="form.fee"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="form.fee = $event.target.value"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="退款方式" prop="refund_type">
          <get-select-dictionaries
            style="width: 100%"
            v-model="form.refund_type"
            :classKey="'退款方式'"
            :placeholder="'请选择退款方式'"
            @change = selectChange
            :clearable="false"
          ></get-select-dictionaries>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="退还时间" prop="refund_time">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期"
            v-model="form.refund_time"
            style="width: 100%"
            clearable
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-if="showAccount">
        <el-form-item label="退款账号" prop="refund_account">
          <el-input
            placeholder="请输入退款账号"
            v-model="form.refund_account"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="服务受理人" prop="handle_user">
          <get-department-select
            ref="personalTree2"
            v-model="form.handle_user"
            :isShowCheckbox="false"
            :placeholder="'请选择服务受理人'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="false"
            clearable
          ></get-department-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="3D视频审核确认人" prop="confirm_user">
          <get-department-select
            ref="personalTree3"
            v-model="form.confirm_user"
            :isShowCheckbox="false"
            :placeholder="'请选择视频审核确认人'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="false"
            clearable
          ></get-department-select>
        </el-form-item>
      </el-col>
      <el-col :span="24" class="table-box">
        <div style="display: flex; align-items: center; margin-bottom: 5px">
          <h2 style="margin-right: 10px">消费明细</h2>
          <el-button type="primary" size="small" @click="add()"
            >新增行</el-button
          >
          <el-button type="primary" size="small" @click="copy()"
            >复制行</el-button
          >
          <el-button type="primary" size="small" @click="del()">删除</el-button>
          <el-button type="primary" size="small" @click="sign()">标记</el-button>
          <el-button type="primary" size="small" @click="clearSign()">清空标记</el-button>

          <!-- <el-button type="primary" size="small">导入模板</el-button> -->
        </div>
        <tr-table
          ref="table"
          :selectionShow="true"
          :data="form.details"
          :tableHeaderList="customSettingListCopy"
          :TableHeight="300"
          @on-select-row="selectedRowInfo"
          @on-select-change-row="handleSelectionChange"
          :stripe="false"
          :showRowClass="true"
          :rowClassName="rowClassName"
        >
          <template slot-scope="scope" slot="consume_type">
            <get-select-dictionaries
              v-model="scope.data.consume_type"
              :classKey="'消费方式'"
              :placeholder="'请选择消费方式'"
              clearable
            >
            </get-select-dictionaries>
          </template>
          <template slot-scope="scope" slot="ic_card_no">
            <el-input v-model="scope.data.ic_card_no" clearable></el-input>
          </template>
          <template slot-scope="scope" slot="consume_time">
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择消费时间"
              v-model="scope.data.consume_time"
              clearable
              style="width: 100%"
            >
            </el-date-picker>
          </template>
          <template slot-scope="scope" slot="consume_fee">
            <el-input
              placeholder="请输入消费金额"
              v-model="scope.data.consume_fee"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="scope.data.consume_fee = $event.target.value"
              clearable
            >
            </el-input>
          </template>
          <template slot-scope="scope" slot="vehicle_id">
            <get-vehicle-select-tree
              ref="vehicleTree"
              width="200"
              :placeholder="'选择车辆'"
              :isShowCheckbox="false"
              :isExportMultiple="false"
              :oilType="2"
              v-model="scope.data.vehicle_id"
              clearable
              @on-change="onSelectChange(scope.data)"
            >
            </get-vehicle-select-tree>
          </template>
          <template slot-scope="scope" slot="dept_company">
            <get-department-select
              ref="baseTree"
              :isShowCheckbox="false"
              :funcType="1"
              :placeholder="'所属公司'"
              :isExportMultiple="false"
              v-model="scope.data.dept_company"
              clearable
            ></get-department-select>
            <!-- @on-change="selectedDeparment(scope.index)" -->
          </template>
          <template slot-scope="scope" slot="line_id">
            <get-line-select-tree
              ref="getLineSelectTree"
              placeholder="请选择线路"
              :isShowCheckbox="false"
              :isExportMultiple="false"
              v-model="scope.data.line_id"
              clearable
            >
            </get-line-select-tree>
          </template>
          <template slot-scope="scope" slot="driver_id">
            <get-driver-select-tree
              ref="driverTree"
              v-model="scope.data.driver_id"
              :width="'220'"
              :isShowCheckbox="false"
              :placeholder="'请选择司机'"
              :isExportMultiple="false"
              clearable
            >
            </get-driver-select-tree>
          </template>
        </tr-table>
      </el-col>
      <el-col :span="24">
        <el-form-item label="处理原因" prop="handle_reason">
          <el-input
            type="textarea"
            show-word-limit
            v-model="form.handle_reason"
            :rows="4"
            placeholder="请输入处理原因"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="margin-bottom: 20px">
        <image-file-upload
          :images="form.thumbnail_imgs"
          :files="form.files_list"
          :isCompress="true"
          @files-update-success="filesUpdateSuccess"
          @images-update-success="imagesUpdateSuccess"
        ></image-file-upload>
      </el-col>
      <el-col :span="24">
        <p style="font-size: 24px; color: #000; margin-bottom: 15px">
          银行转账方式退款信息
        </p>
      </el-col>
      <el-col :span="12">
        <el-form-item label="姓名" prop="refund_name">
          <el-input
            v-model="form.refund_name"
            placeholder="请输入姓名"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="身份证号" prop="id_card">
          <el-input
            v-model="form.id_card"
            placeholder="请输入身份证号"
            clearable
            oninput="value=value.replace(/\D/g, '')"
            @blur="form.id_card = $event.target.value"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="开户行" prop="bank">
          <el-input
            v-model="form.bank"
            placeholder="请输入开户行"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="银行卡号" prop="bank_no">
          <el-input
            v-model="form.bank_no"
            placeholder="请输入银行卡号"
            clearable
            oninput="value=value.replace(/\D/g, '')"
            @blur="form.bank_no = $event.target.value"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import imageFileUpload from "@/components/imageFileUpload";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import { getUser } from "@/utils/auth";
import { formatTime, formatDate } from "@/utils/index";
import common from "./common/index";
export default {
  name: "work-contact",
  components: {
    getDepartmentSelect,
    imageFileUpload,
    getSelectDictionaries,
    getVehicleSelectTree,
    getLineSelectTree,
    getDriverSelectTree,
  },
  mixins: [common],
  props: {
    dialogBool: {
      type: Boolean,
      default: false,
    },
    isShowSelectUser: {
      type: Boolean,
      default: true,
    },
    isAgain: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        user_id: null,
        date: formatDate(new Date(), "yyyy-MM-dd"),
        passenger_name: "",
        passenger_phone: "",
        fee: "",
        refund_type: "",
        refund_type_name: "",
        refund_time: "",
        handle_user: "",
        confirm_user: "",
        details: [],
        files_list: [],
        thumbnail_imgs: [],
        refund_name: "",
        id_card: "",
        bank: "",
        bank_no: "",
        refund_account:"",
        id: 0,
      },
      rules: {
        user_id: [
          {
            required: true,
            message: "请选择制表人",
            trigger: "change",
          },
        ],
        // passenger_name: [
        //   {
        //     required: true,
        //     message: "请输入乘客姓名",
        //     trigger: "change",
        //   },
        // ],
        passenger_phone: [
          {
            required: true,
            message: "请输入联系电话",
            trigger: "change",
          },
        ],
        fee: [
          {
            required: true,
            message: "请输入退款金额",
            trigger: "change",
          },
        ],
        refund_type: [
          {
            required: true,
            message: "请选择退款方式",
            trigger: "change",
          },
        ],
        // refund_account: [
        //   {
        //     required: true,
        //     message: "请输入退款账号",
        //     trigger: "change",
        //   },
        // ],
      },

      customSettingListCopy: [
        {
          id: 1,
          label: "*消费方式",
          prop: "consume_type",
          width: "160",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "公交IC卡号或支付宝订单号",
          prop: "ic_card_no",
          width: "180",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "*消费时间",
          prop: "consume_time",
          width: "210",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "*消费金额",
          prop: "consume_fee",
          width: "160",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "车号(车牌号)",
          prop: "vehicle_id",
          width: "200",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "所属公司",
          prop: "dept_company",
          width: "180",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "线路",
          prop: "line_id",
          width: "150",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "司机",
          prop: "driver_id",
          width: "150",
          align: "center",
          signIndex: 7,
        },
      ],
      copyInfo: null,
      rowIndex: null,
      ids: [],
      indexList: [],
      dept_id: null,
      changeNum: 0,
      showAccount:false,
      oldForm: null, // 历史草稿数据   用来比较是否修改
      vehicle_info:{}, //暂存通过车辆id获取的所有信息
      rowClassName:[], //动态添加行类
    };
  },
  watch: {
    dialogBool() {
      if (!this.dialogBool) {
        this.$refs.personalTree1.onClear();
        this.$refs.personalTree2.onClear();
        this.$refs.personalTree3.onClear();
        Object.assign(this.$data.form, this.$options.data().form);
      } else {
        this.$nextTick(() => {
          this.$refs["form"].resetFields();
        });
      }
    },
  },
  methods: {
    // 初始化数据
    initSet(info) {
      if (!!info) {
        for (const key in this.form) {
          if (Object.hasOwnProperty.call(info, key)) {
            this.form[key] = info[key];
          }
        }
        if(info.refund_type_name && (["支付宝", "微信"].includes(info.refund_type_name))) {
          this.showAccount = true;
        }
      } else {
        if (getUser()) {
          let userInfo = JSON.parse(getUser());
          this.form.user_id = Number(userInfo.user_id);
          this.form.handle_user = Number(userInfo.user_id);
          this.form.confirm_user = Number(userInfo.user_id);
        }
      }
    },
    // 添加
    add() {
      this.form.details.push({
        consume_type: "",
        ic_card_no: "",
        consume_time: "",
        consume_fee: "",
        vehicle_id: "",
        dept_company: "",
        line_id: "",
        driver_id: "",
        isSign:false,
      });
      this.getTableIndex();
    },
    // 复制
    copy() {
      if (!this.copyInfo) {
        this.$message({
          showClose: true,
          message: "请先选中需要复制的信息",
          type: "warning",
        });
        return;
      }
      let row = JSON.parse(JSON.stringify(this.copyInfo));
      this.form.details.splice(this.rowIndex, 0, row);
      this.getTableIndex();
      this.copyInfo = null;
      this.$refs.table.cancelSelectRow();
      this.getRowClassName()
    },
    // 删除
    del() {
      if (this.ids.length == 0) {
        this.$message({
          showClose: true,
          message: "请先选中需要删除的信息",
          type: "warning",
        });
        return;
      }
      this.form.details = this.form.details.filter((item) => {
        return this.ids.indexOf(item.index) == -1;
      });
      this.getTableIndex();
      this.getRowClassName()
    },
    //标记
    sign(){
      if (this.ids.length == 0) {
        this.$message({
          showClose: true,
          message: "请先勾选需要标记的信息",
          type: "warning",
        });
        return;
      }
      this.form.details.forEach((item,index) => {
        if (this.ids.indexOf(index) !== -1) {
          item.isSign = true //设置为已标记
        }
      });
      console.log(this.form.details)
      this.getRowClassName()
      this.ids = []
      this.$refs.table.$refs.table.clearSelection();;
      
    },
    //清空标记
    clearSign(){
      this.form.details.forEach((item,index) => {
          item.isSign = false //清除标记
      });
      this.getRowClassName()
    },
    // 添加动态行类
    getRowClassName() {
      this.rowClassName = []
      this.form.details.forEach((item,index) => {
        if (item.isSign) {
          this.rowClassName.push({
            index:index,
            name: 'sign-row'
          })
        }
      });
    },
    //选择车辆 绑定所属公司和线路
    onSelectChange(scopeData) {
      this.$client
        .GetVehicleInfoById({ id: scopeData.vehicle_id })
        .then((res) => {
          if (res.head.result == "200") {
            this.form.details[scopeData.index].dept_company = res.context.dept_id
            this.form.details[scopeData.index].line_id = res.context.line_id
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
    selectChange(item){
      this.form.refund_account = ""
      this.form.refund_type_name = item.c_name
      if(item.c_name == '微信' || item.c_name == '支付宝'){
        this.showAccount = true
      }else{
        this.showAccount = false
      }
    },
    selectedRowInfo(row, column, event) {
      this.copyInfo = row;
      this.rowIndex = row.index;
    },
    handleSelectionChange(rows) {
      this.ids = [];
      rows.forEach((item) => {
        this.ids.push(item.index);
      });
    },
    // 组装表格获取index下标
    getTableIndex() {
      this.form.details.forEach((item, index) => {
        item.index = index;
      });
    },
    outData() {
      return new Promise((resolve, reject) => {
        let id_card_length_bool = false
        let id_card_length = this.form.id_card.length
        let bank_card_length = this.form.bank_no.length
        //身份证号码只能为空或者15位和18位
        if(id_card_length == 0 || id_card_length == 15 ||id_card_length == 18){
          id_card_length_bool = true
        }
        this.$refs.form.validate((valid) => {
          if(this.showAccount && this.form.refund_account == ""){
            reject({
              msg: '请填写退款账号(支付宝或微信)'
            })
          }
          else if(!id_card_length_bool){
            reject({
              msg: '请输入15位或18位身份证号码'
            })
          }
          //银行卡号限制16位阿拉伯数字
          else if(bank_card_length !== 0 && bank_card_length !== 16 && bank_card_length !== 17 && bank_card_length !== 19){
            reject({
              msg: '请输入16位或17位或19位银行卡号'  
            })
          }else if (valid && id_card_length_bool) {
            resolve({
              form: this.form
            });
          }else {
            reject({
              msg: '获取失败,带星号的为必填项'
            });
            return false;
          }
        });
      });
    },
  },
};
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
</style>
