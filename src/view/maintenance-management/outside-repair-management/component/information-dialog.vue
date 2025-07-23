<template>
  <el-dialog
    top="20px"
    width="1020px"
    :title="showTitle" 
    :before-close="dialogClose"
    :visible="dialogBool">
    <div class="el-dialog-div-content">
      <el-form 
        size="mini"
        ref="elForm"
        :rules="rules"
        label-width="115px"
        :model="form">
        <div
          style="
          float: left;
          width: 6px;
          height: 16px;
          background: #409eff;"></div>
        <p
          style="
            margin-left: 15px;
            margin-bottom: 15px;
            color: #409eff;
            font-size: 14px;
            font-weight: bold;
            margin-top: 10px;">工单信息</p>
        <el-row>
          <el-col :span="8">
            <el-form-item label="车辆自编号:" prop="vehicle_id">
              <get-carcode-select-tree
                ref="carcodeTree"
                :placeholder="'选择车辆自编号'"
                :isShowCheckbox="false"
                v-model="form.vehicle_id"
                @on-change="onSelectChange"
                :isExportMultiple="false"
                :disabled="curChangeType == 'detail'"
                :width="'220'"></get-carcode-select-tree>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车牌号:" prop="vehicle_id">
              <get-vehicle-select-tree
                ref="vehicleTree"
                :placeholder="'选择车辆'"
                :isShowCheckbox="false"
                v-model="form.vehicle_id"
                @on-change="onSelectChange"
                :isExportMultiple="false"
                :disabled="curChangeType == 'detail'"
                :width="'220'"></get-vehicle-select-tree>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属组织:">
              <el-input
                ref="tree"
                v-model="dept_id"
                :width="'420'"
                :isShowCheckbox="false"
                :isExportMultiple="false"
                :placeholder="'请选择所属组织'"
                :isContainEmp="false"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        <!-- </el-row>
        <el-row> -->
          <el-col :span="8">
            <el-form-item label="车辆型号:">
              <el-input
                v-model="cid"
                placeholder="请输入车辆型号"
                :width="'420'"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工单类型:" :required="true">
              <span style="color: red">外修</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报修人:" prop="repair_user_id">
              <get-user-select
                ref="driverTree1"
                v-model="form.repair_user_id"
                :width="'390'"
                :isShowCheckbox="false"
                :placeholder="'请选择报修人'"
                :disabled="curChangeType == 'detail'"
                :isExportMultiple="false"></get-user-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="维修工单号码:">
              <el-input
                v-model="form.order_number"
                :disabled="curChangeType == 'detail'"
                placeholder="请输入维修工单号码"></el-input>
            </el-form-item>
          </el-col>
        <!-- </el-row>
        <el-row> -->
          <el-col :span="8">
            <el-form-item label="工单状态:">
              <el-select
                v-model="form.state"
                clearable
                :disabled="curChangeType == 'detail'"
                placeholder="工单状态">
                <el-option
                  v-for="item in orderStatusList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="送修单位:" prop="repair_unit">
              <!-- <el-select
                v-model="form.repair_unit"
                clearable
                placeholder="请选择送修单位">
                <el-option
                  v-for="item in repairUnitList"
                  :key="item.repair_unit"
                  :label="item.repair_unit_name"
                  :value="item.repair_unit"></el-option>
              </el-select> -->
              <get-repair-unit v-model="form.repair_unit" :disabled="curChangeType == 'detail'"></get-repair-unit>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检验员:">
              <getDeptEmpSelectTree
                ref="deptEmpTree"
                placeholder="请选择检验员"
                :func_type="2"
                :show_all="true"
                :is_contain_emp="true"
                :disabled="curChangeType == 'detail'"
                v-model="form.check_id"></getDeptEmpSelectTree>
                <!-- :isExportMultiple="false" -->
            </el-form-item>
          </el-col>
        <!-- </el-row>
        <el-row> -->
          <el-col :span="8">
            <el-form-item label="登记时间:" prop="repair_time">
              <el-date-picker
                v-model="form.repair_time"
                type="datetime"
                size="mini"
                placeholder="选择日期"
                format="yyyy-MM-dd HH:mm:ss"
                :disabled="curChangeType == 'detail'"
                value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="进厂时间:">
              <el-date-picker
                v-model="form.finish_time"
                type="datetime"
                placeholder="选择日期"
                format="yyyy-MM-dd HH:mm:ss"
                :disabled="curChangeType == 'detail'"
                value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出厂时间:">
              <el-date-picker
                v-model="form.out_time"
                type="datetime"
                placeholder="选择日期"
                format="yyyy-MM-dd HH:mm:ss"
                :disabled="curChangeType == 'detail'"
                value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </el-col>
        <!-- </el-row>
        <el-row> -->
          <el-col :span="8">
            <el-form-item label="报修内容:">
              <el-input
                v-model="form.repair_content"
                type="textarea"
                placeholder="请输入报修内容"
                :disabled="curChangeType == 'detail'"
                :autosize="{ minRows: 2, maxRows: 2 }"
                :style="{ width: '100%' }"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工单备注:">
              <el-input
                v-model="form.order_remark"
                type="textarea"
                placeholder="请输入备注说明"
                :disabled="curChangeType == 'detail'"
                :autosize="{ minRows: 2, maxRows: 2 }"
                :style="{ width: '100%' }"></el-input>
            </el-form-item>
          </el-col>
        
          <el-col :span="8">
            <el-form-item label="维修项目:">
            <el-input
              v-model="form.repair_item"
              :disabled="curChangeType == 'detail'"
              placeholder="请输入维修项目"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工时费:">
            <el-input-number
              :controls="false"
              :precision="2"
              v-model="form.hour_fee"
              @change="hourFeeChange"
              :disabled="curChangeType == 'detail'"
              placeholder="请输入工时费"></el-input-number>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="附加项目:">
            <el-input
              v-model="form.annex_item"
              :disabled="curChangeType == 'detail'"
              placeholder="请输入附加项目"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="附加费:">
            <el-input-number
              :controls="false"
              :precision="2"
              v-model="form.annex_fee"
              @change="hourFeeChange"
              :disabled="curChangeType == 'detail'"
              placeholder="请输入附加费"></el-input-number>
          </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总计费用:">
              <span style="color: red">{{total_fee ? total_fee.toFixed(2) : 0}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="材料清单:">
              <el-button type="primary" size="mini" @click="addData" v-if="curChangeType != 'detail'">添加</el-button>
              <el-button type="primary" size="mini" @click="deleteSelect" v-if="curChangeType != 'detail'">移除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="table">
        <table-data
          ref="table"
          :isShowSummary="true"
          :selectionShow="true"
          :data="MaterialList"
          :TableHeight="280"
          :frontFixedNum="1"
          :backFixedNum="1"
          @on-select-change-row="selectedList"
          :tableHeaderList="tableHeaderLists"
          :isFixedEmptyPlaceholder="false">
          <template slot-scope="scope" slot="name">
              <el-input size="mini" v-model="scope.data.name" :disabled="curChangeType == 'detail'"></el-input>
          </template>
          <template slot-scope="scope" slot="specification">
            <el-input size="mini" v-model="scope.data.specification" :disabled="curChangeType == 'detail'"></el-input>
          </template>
          <template slot-scope="scope" slot="unit">
            <el-input size="mini" v-model="scope.data.unit" :disabled="curChangeType == 'detail'"></el-input>
          </template>
          <template slot-scope="scope" slot="count">
            <el-input-number
              v-model="scope.data.count"
              :precision="0"
              :controls="false"
              :min="0"
              :disabled="curChangeType == 'detail'"
              @change="priceChange(scope.data)"
              size="mini"></el-input-number>
          </template>
          <template slot-scope="scope" slot="price">
            <el-input-number
              v-model="scope.data.price"
              :precision="2"
              :controls="false"
              :min="0"
              :disabled="curChangeType == 'detail'"
              @change="priceChange(scope.data)"
              size="mini"></el-input-number>
          </template>
          <template slot-scope="scope" slot="total_fee">
            <el-input-number
              disabled
              v-model="scope.data.total_fee"
              :precision="2"
              :controls="false"
              :min="0"
              size="mini"
            ></el-input-number>
          </template>
          <template slot-scope="scope" slot="reamrk">
            <el-input size="mini" v-model="scope.data.reamrk" :disabled="curChangeType == 'detail'"></el-input>
          </template>
          <template slot-scope="scope" slot="operation">
            <el-button type="primary" size="mini" :disabled="curChangeType == 'detail'" @click="deleteRow(scope.data)">移除</el-button>
          </template>
        </table-data>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose()" v-if="curChangeType != 'detail'">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill" v-if="curChangeType != 'detail'">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { formatDateTime } from "@/utils/index";
import { getUser } from "@/utils/auth";
import getCarcodeSelectTree from '@/components/base/formModel/tree/get-carcode-select-tree'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getDeptEmpSelectTree from "@/components/base/formModel/tree/get-dept-emp-select-tree";
import getUserSelect from "@/components/base/formModel/tree/get-user-select";
import getRepairUnit from "@/components/base/formModel/select/get-repair-unit";
import tableData from "./data-table"
export default {
  components: {
    getCarcodeSelectTree,
    getDepartmentSelect,
    getVehicleSelectTree,
    getDeptEmpSelectTree,
    getUserSelect,
    getRepairUnit,
    tableData
  },
  props: {
    dialogBool: Boolean,
    selectionShow: {
        type: Boolean,
        default: false
    },
    curChangeType: {
      type: String,
      default: 'add' //add添加  edit编辑  detail详情
    },
  },
  data() {
    return {
      loading:false,
      showTitle:'添加',
      cid: '', //车辆型号
      dept_id: '', //所属组织
      total_fee: 0,
      MaterialList: [],
      selectedProjectIds: [],
      form: {
        vehicle_id: '', 
        repair_user_id: '', //报修人ID
        state: '5', //工单状态
        repair_unit: '', //送修单位ID
        check_id: '', //检验员ID
        repair_time: '', //登记时间
        finish_time: '', //进厂时间
        out_time: '', //出厂时间
        repair_content: '', //报修内容
        order_remark: '', //工单备注
        repair_item: '', //维修项目
        hour_fee: 0, //工时费
        order_number: '', //维修工单号
        annex_item: '', //附件项目
        annex_fee: 0, //附加费
      },
      rules: {
        vehicle_id: [
          {
            required: true,
            message: "请填写",
            trigger: "change",
          },
        ],
        repair_user_id: [
          {
            required: true,
            message: "请选择报修人",
            trigger: "change",
          },
        ], 
        repair_unit: [
          {
            required: true,
            message: "请选择送修单位",
            trigger: "change",
          },
        ], 
        repair_time: [
          {
            required: true,
            message: "请填写登记时间",
            trigger: "change",
          },
        ],
      },
      tableHeaderLists: [
        {
          id: 1,
          label: "物料名称",
          prop: "name",
          width: "160",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "规格",
          prop: "specification",
          width: "120",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "单位",
          prop: "unit",
          width: "80",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "数量",
          prop: "count",
          width: "160",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "单价",
          prop: "price",
          width: "160",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "总金额",
          prop: "total_fee",
          width: "160",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "备注",
          prop: "reamrk",
          width: "160",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "操作",
          prop: "operation",
          align: "center",
          width: "80",
          signIndex: 7,
        },
      ],
      orderStatusList: [
        //工种属性
        { value: "1", name: "等待接修" },
        { value: "2", name: "维修中" },
        { value: "3", name: "待完工检验" },
        { value: "4", name: "待出厂" },
        { value: "5", name: "已出厂" },
      ],
    };
  },
  mounted() {
    let userInfo = JSON.parse(getUser());
    this.form.repair_user_id = Number(userInfo.user_id);
    this.form.repair_time = formatDateTime(new Date());
    this.form.finish_time = formatDateTime(new Date());
  },
  watch: {
    dialogBool(bool) {
      if(bool === false) {
        this.resetData()
      }else {
        this.configAddDialog()
      }
    }
  },
  methods: {
    configAddDialog() {
      if(this.curChangeType == 'add') {
        this.showTitle = '添加';
      }else if(this.curChangeType == 'edit'){
        this.showTitle = '编辑'
      }else{
        this.showTitle = '详情'
      }
    },
    // 数据回显
    setData(val) {
      this.total_fee = val.total_fee
      this.MaterialList = val.MaterialList
      this.form.vehicle_id = val.vehicle_id
      this.form.repair_user_id = val.repair_user_id
      this.form.repair_unit = val.repair_unit
      this.form.repair_time = val.repair_time
      this.form.finish_time = val.finish_time
      this.form.repair_item = val.repair_item
      this.form.repair_content = val.repair_content
      this.form.state = val.state + ''
      this.form.check_id = val.check_id
      this.form.out_time = val.out_time
      this.form.order_remark = val.order_remark
      this.form.hour_fee = val.hour_fee  
      this.form.order_number = val.order_number  
      this.form.annex_item = val.annex_item  
      this.form.annex_fee = val.annex_fee  
      this.form.id = val.id   
    },
    // 初始化表单
    resetData() {
      this.$refs['elForm'].resetFields()
      this.$refs.carcodeTree.onClear()
      this.$refs.driverTree1.onClear()
      this.$refs.deptEmpTree.onClear()
      this.cid = ''
      this.dept_id = ''
      this.total_fee = 0
      this.MaterialList = []
      this.form.vehicle_id = ''
      this.form.repair_user_id = ''
      this.form.state = '5'
      this.form.finish_time = ''
      this.form.out_time = ''
      this.form.repair_content = ''
      this.form.order_remark = ''
      this.form.repair_item = ''
      this.form.hour_fee = 0
      this.form.order_number = ''
      this.form.annex_item = ''
      this.form.annex_fee = 0
      setTimeout(() => {
        let userInfo = JSON.parse(getUser());
        this.form.repair_user_id = Number(userInfo.user_id);
        this.form.repair_time = formatDateTime(new Date());
        this.form.finish_time = formatDateTime(new Date());
      })
    },
    hourFeeChange(val) {
      if(this.MaterialList.length > 0) {
        let total = 0
        this.MaterialList.forEach(item => {
          if(item.total_fee) {
            total += item.total_fee
          }
        })
        this.total_fee = total + this.form.hour_fee + this.form.annex_fee
        // let total = this.MaterialList.reduce((pre, item) => {
        //   return pre + Number(item.total_fee)
        // },0)
        // console.log(total);
      }else {
        this.total_fee = this.form.hour_fee + this.form.annex_fee
      }
    },
    // 计算总金额
    priceChange(val) {
      let i = this.MaterialList.findIndex((item) => {
        return item.id == val.id;
      }); 
      if(this.MaterialList[i].count && this.MaterialList[i].price) {
          this.MaterialList[i].total_fee = this.MaterialList[i].count * this.MaterialList[i].price
      }else {
        this.MaterialList[i].total_fee = ''
      }
      let total = 0 
      this.MaterialList.forEach(item => {
        if(item.total_fee) {
          total += item.total_fee
        }
      })
      // console.log(total, this.form.hour_fee);
      // if(this.form.hour_fee) {
      //   this.total_fee = total + this.form.hour_fee
      // }else {
      //   this.total_fee = total
      // }
        this.total_fee = total + this.form.hour_fee + this.form.annex_fee
    },
    //删除选中
    deleteSelect() {
      if (this.selectedProjectIds.length == 0) {
        this.$message({
          showClose: true,
          message: "请勾选要删除的选项",
          type: "warning",
        });
        return;
      }
      this.selectedProjectIds.forEach((item, index) => {
        this.deleteRow(item);
      });
    },
    //选择的行
    selectedList(projectList) {
      this.selectedProjectIds = [];
      projectList.forEach((item, index) => {
        this.selectedProjectIds.push(item);
      });
      // console.log(this.selectedProjectIds, "11111");
      // this.$emit('func',this.selectedProjectIds)
    },
    // 移除该行
    deleteRow(row) {
      let i = this.MaterialList.findIndex((item) => {
        return item.id == row.id;
      }); 
      this.MaterialList.splice(i, 1)
      this.hourFeeChange()
    },
    // 保存
    updatePlaybill() {
      this.$refs.elForm.validate(valid => {
        if(valid) {
          if(this.MaterialList.length == 0) {   
            let info = {}
            for(let i in this.form) {
              info[i] = this.form[i]
            }
            info.total_fee = this.total_fee
            info.MaterialList = this.MaterialList
            if(this.curChangeType == 'add') {
              this.$parent.saveAddInfo(info)
            }else {
              this.$parent.saveEditInfo(info)
            }
          }else {
            if(
              !this.MaterialList[0].name ||
              !this.MaterialList[0].count ||
              !this.MaterialList[0].price
            ) {
              this.$message({
                type: 'error',
                message: '请完整填写物料明细'
              })
            }else {
              let info = {}
              for(let i in this.form) {
                info[i] = this.form[i]
              }
              info.total_fee = this.total_fee
              info.MaterialList = this.MaterialList
              if(this.curChangeType == 'add') {
                this.$parent.saveAddInfo(info)
              }else {
                this.$parent.saveEditInfo(info)
              }
            }
          }
        }else{
          return false
        }          
      })
    },
    // 关闭对话框
    dialogClose() {
      this.$emit("update:dialogBool", false)
    },
    // 添加空行
    addData() {
      if(this.MaterialList.length === 0) {
        this.MaterialList.push({id:1})
      }else {
        const arr = []
        this.MaterialList.forEach(item => {
          arr.push(item.id)
        })
        this.MaterialList.push({id: Math.max.apply(Math, arr) + 1})
      }
      // console.log(this.MaterialList);
    },
    // 获取车辆信息
    onSelectChange(vehs, nodes) {
      if(vehs != 0) {
        this.dept_id = ''
        this.cid = ''
        this.$client.getCarinfo({ id:Number(vehs)}).then(res => {
          if(res.head.result == '200') {
            if(res.context.list){
              let carInfo = res.context.list[0];
              this.dept_id = carInfo.group_name;
              this.cid = carInfo.name
            }else{
              this.cid = ''
              this.dept_id = ''
            }
          }else{
            this.$message({
              type: 'error',
              message: res.head.describle, 
              showClose: true
            })
          }
        })
      }
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-form {
  /deep/ .el-input__inner {
    width: 192px;
  }
  /deep/ .el-textarea__inner {
  width: 192px;
  }
  /deep/ .el-form-item__content {
  width: 192px;
  }
}


</style>