<template>
  <div style="height: 470px; overflow-x: hidden" class="show-flex-box-c">
    <div class="car-damage show-flex-box-c">
      <div class="show-flex-box-r" style="margin-bottom:20px;">
        <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" size="mini" v-if="curChangeType != 'detail'">添加</el-button>
        <el-button type="primary" @click="onBtn('delete')" icon="el-icon-delete" size="mini" v-if="curChangeType != 'detail'">删除</el-button>
        <el-button type="primary" @click="onBtn('export')" icon="el-icon-download" size="mini">导出</el-button>
      </div>
      <span style="margin-bottom:20px; color:#33333385; font-size: 14px;">说明：必须保存事故基本信息后才能编辑车损信息。事故结案后将无法再次编辑。</span>
      <tr-table
        :selectionShow="true"
        :data="damageRecordList"
        :tableHeaderList="canRendererTableHeader"
        :isShowBottomOptions="false"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="0"
        :backFixedNum="1"
        @on-select-change-row="selectedDamageList"
        :isFixedEmptyPlaceholder="false"
      >
        <template slot-scope="scope" slot="operation">
          <el-button type="primary" size="mini" :disabled="curChangeType=='detail'" @click="editInfo(scope.data)">编辑</el-button>
          <el-popconfirm
            @confirm="deleteInfo(scope.data)"
            title="是否确删除此条记录？">
            <el-button slot="reference" :disabled="curChangeType=='detail'" type="danger" size="mini" style="margin-left: 10px;">删除</el-button>
          </el-popconfirm>
          <!-- <el-button type="danger" size="mini" @click="deleteInfo(scope.data)" :disabled="curChangeType=='detail'">删除</el-button> -->
        </template>
      </tr-table>
    </div>
    <div class="form-with-repair show-flex-box-c">
      <div class="show-flex-box-r" style="align-items :center; margin: 20px 0;">
        <em style="width: 6px;height: 18px; background: #409EFF; margin-right: 5px;"></em>
        <span>关联报修、维修工单：</span>
        <el-button type="primary" @click="formWithRepair()" icon="" size="mini" v-if="curChangeType != 'detail'" :disabled="repairData.length > 0 || repairDataLoading">事故关联报修</el-button>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="关联报修单" name="first">
          <tr-table
            :selectionShow="false"
            :data="repairData"
            :tableHeaderList="secondCanRendererTableHeader"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :loading="repairDataLoading"
            :frontFixedNum="0"
            :backFixedNum="0"
            :isFixedEmptyPlaceholder="false"
          >
            <template slot-scope="scope" slot="state_name">
              <div  v-if="scope.data.state == 1">
              <div style="color: #d71345;">
                <p class = "mark" style="background-color: #d71345;"></p> <span>{{scope.data.state_name}}</span>
              </div>
              </div>
                <div  v-else-if="scope.data.state == 2">
                  <div style="color: #18BE6B;">
                  <p class = "mark" style="background-color: #18BE6B;"></p> <span>{{scope.data.state_name}}</span>
                </div>
              </div>
                <div   v-else-if="scope.data.state == 3">
                <div style="color: #c88400;">
                  <p class = "mark" style="background-color: #c88400;"></p> <span>{{scope.data.state_name}}</span>
                </div>
              </div>
                <div   v-else-if="scope.data.state == 4">
                <div style="color: #ffc20e;">
                  <p class = "mark" style="background-color: #ffc20e;"></p> <span>{{scope.data.state_name}}</span>
                </div>
              </div>
                <div   v-else-if="scope.data.state == 5">
                <div style="color: #409EFF;">
                  <p class = "mark" style="background-color: #409EFF;"></p> <span>{{scope.data.state_name}}</span>
                </div>
              </div>
                <div   v-else-if="scope.data.state == 7" >
                <div style="color: #77787b;">
                  <p class = "mark" style="background-color: #77787b;"></p> <span>{{scope.data.state_name}}</span>
                </div>
              </div>
            </template>
            <template slot-scope="scope" slot="vehicle_number">
              <!-- <span v-if="scope.data.vehicle_info == null" ></span>
              <el-button v-else type="text" size="mini" @click="jumpVehInfoPage(scope.data)">{{scope.data.vehicle_number}}</el-button> -->
              <span v-if="scope.data.vehicle_info == null" ></span>
              <el-button v-else type="text" size="mini">{{scope.data.vehicle_info.vehicle_number}}</el-button>
            </template>
            <template slot-scope="scope" slot="vehicle_name">
              <span v-if="scope.data.vehicle_info == null" ></span>
              <span v-else>{{scope.data.vehicle_info.vehicle_name}}</span>
            </template>
              <!-- <template slot-scope="scope" slot="labor_contract_time">
                <span
                  v-if="scope.data.labor_contract_time.length > 1"
                >{{scope.data.labor_contract_time[0]}}-{{scope.data.labor_contract_time[1]}}</span>
                <span v-else>--</span>
              </template> -->

              <template slot-scope="scope" slot="department_name">
                <span v-if="scope.data.vehicle_info == null" ></span>
                <span v-else>{{scope.data.vehicle_info.department_name}}</span>
              </template>
              <template slot-scope="scope" slot="vehicle_kind_name">
                <span v-if="scope.data.vehicle_info == null" ></span>
                <span v-else>{{scope.data.vehicle_info.vehicle_kind_name}}</span>
              </template>
              <template slot-scope="scope" slot="maint_dept_name">
                <span v-if="scope.data.repair_check == null" ></span>
                <span v-else>{{scope.data.repair_check.maint_dept_name}}</span>
              </template>
              <template slot-scope="scope" slot="check_state_name">
              <el-tag v-if="scope.data.check_state_name == '已检验'"  type="success"  > {{scope.data.check_state_name}}</el-tag>
              <el-tag  v-else-if="scope.data.check_state_name == '未检验'" type="danger" >{{scope.data.check_state_name}}</el-tag>
              <el-tag  v-else-if="scope.data.check_state_name == '检验未通过'" type="danger" >{{scope.data.check_state_name}}</el-tag>
            </template>
            <template slot-scope="scope" slot="check_name">
              <span v-if="scope.data.repair_check == null" ></span>
              <span v-else>{{scope.data.repair_check.check_name}}</span>
            </template>
            <template slot-scope="scope" slot="check_time">
              <span v-if="scope.data.repair_check == null" ></span>
              <span v-else>{{scope.data.repair_check.check_time}}</span>
            </template>
            <template slot-scope="scope" slot="check_describe">
              <span v-if="scope.data.repair_check == null" ></span>
              <span v-else>{{scope.data.repair_check.check_describe}}</span>
            </template>
          </tr-table>
        </el-tab-pane>
        <el-tab-pane label="关联维修工单" name="second">
          <tr-table
            :selectionShow="false"
            :data="orderLisData"
            :tableHeaderList="thirdCanRendererTableHeader"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :loading="orderLisDataLoading"
            :frontFixedNum="0"
            :backFixedNum="0"
          >
            <template slot-scope="scope" slot="state_detail_name">
                            <div  v-if="scope.data.state == 1">
                <div style="color: #d71345;">
                <p class = "mark" style="background-color: #d71345;"></p> <span>{{scope.data.state_detail_name}}</span>
              </div>
            </div>    
              <div  v-else-if="scope.data.state == 2">
                <div style="color: #18BE6B;">
                <p class = "mark" style="background-color: #18BE6B;"></p> <span>{{scope.data.state_detail_name}}</span>
              </div>
            </div> 
              <div   v-else-if="scope.data.state == 3">
              <div style="color: #c88400;">
                <p class = "mark" style="background-color: #c88400;"></p> <span>{{scope.data.state_detail_name}}</span>
              </div>
            </div> 
              <div   v-else-if="scope.data.state == 4">
              <div style="color: #ffc20e;">
                <p class = "mark" style="background-color: #ffc20e;"></p> <span>{{scope.data.state_detail_name}}</span>
              </div>
            </div> 
              <div   v-else-if="scope.data.state == 5">
              <div style="color: #409EFF;">
                <p class = "mark" style="background-color: #409EFF;"></p> <span>{{scope.data.state_detail_name}}</span>
              </div>
            </div>
              <div   v-else-if="scope.data.state == 7" >
              <div style="color: #77787b;">
                <p class = "mark" style="background-color: #77787b;"></p> <span>{{scope.data.state_detail_name}}</span>
              </div>
              </div> 
            </template>
            <template slot-scope="scope" slot="state">
              <div v-if="!scope.data.repair_fee" style="color: #f47920;" >
              
                  <div
                    class="mark"
                    style="
                      background-color: #f47920;
                      border-radius: 1px solid #f47920;
                    "
                  ></div>
                  <span>未结算</span>
                
              </div>
                <div v-else-if="scope.data.repair_fee.state == 1" style="color: #f47920;" >
              
                  <div
                    class="mark"
                    style="
                      background-color: #f47920;
                      border-radius: 1px solid #f47920;
                    "
                  ></div>
                  <span> {{ scope.data.repair_fee.state_name }}</span>
              
              </div>
              <div v-else style="color: #18BE6B;" >
              
                  <div
                    class="mark"
                    style="
                      background-color: #18BE6B;
                      border-radius: 1px solid #18BE6B;
                    "
                  ></div>
                  <span> {{ scope.data.repair_fee.state_name }}</span>
              </div>
              
              <!-- <p v-if="!scope.data.repair_fee" style="color: #f47920">未结算</p> -->
              <!-- <p
                style="color: #f47920"
                v-else-if="scope.data.repair_fee.state == 1"
              >
                {{ scope.data.repair_fee.state_name }}
              </p> -->
              <!-- <p style="color: #225a1f" v-else>
                {{ scope.data.repair_fee.state_name }}
              </p> -->
            </template>
            
            <template slot-scope="scope" slot="vehicle_number">
              <span v-if="scope.data.vehicle_info == null"></span>
              <span v-else>
                {{ scope.data.vehicle_info.vehicle_number }}
              </span>
            </template>
            <template slot-scope="scope" slot="vehicle_name">
              <span v-if="scope.data.vehicle_info == null"></span>
              <span v-else>{{ scope.data.vehicle_info.vehicle_name }}</span>
            </template>
            <template slot-scope="scope" slot="department_name">
              <span v-if="scope.data.vehicle_info == null"></span>
              <span v-else>{{ scope.data.vehicle_info.department_name }}</span>
            </template>
            <template slot-scope="scope" slot="vehicle_kind_name">
              <span v-if="scope.data.vehicle_info == null"></span>
              <span v-else>{{ scope.data.vehicle_info.vehicle_kind_name }}</span>
            </template>
            <template slot-scope="scope" slot="check_time">
              <span v-if="scope.data.repair_check == null"></span>
              <span v-else>{{ scope.data.repair_check.check_time }}</span>
            </template>
            <template slot-scope="scope" slot="check_describe">
              <span v-if="scope.data.repair_check == null"></span>
              <span v-else>{{ scope.data.repair_check.check_describe }}</span>
            </template>
            <template slot-scope="scope" slot="state_child">
              <span v-if="scope.data.repair_check == null"></span>
              <span v-else>{{ scope.data.repair_check.state_child }}</span>
            </template>
            <template slot-scope="scope" slot="total_hours">
              <span v-if="scope.data.repair_items == null"></span>
              <span v-else>{{ scope.data.total_hours }}</span>
            </template>
            <template slot-scope="scope" slot="material_fee">
              <span v-if="scope.data.repair_items == null"></span>
              <span v-else>{{ scope.data.material_fee }}</span>
            </template>
            <template slot-scope="scope" slot="hour">
              <span v-if="scope.data.repair_fee == null"></span>
              <span v-else>{{ scope.data.repair_fee.hour }}</span>
            </template>
            <template slot-scope="scope" slot="material">
              <span v-if="scope.data.repair_fee == null"></span>
              <span v-else>{{ scope.data.repair_fee.material }}</span>
            </template>
            <template slot-scope="scope" slot="ingredients">
              <span v-if="scope.data.repair_fee == null"></span>
              <span v-else>{{ scope.data.repair_fee.ingredients }}</span>
            </template>
            <template slot-scope="scope" slot="management">
              <span v-if="scope.data.repair_fee == null"></span>
              <span v-else>{{ scope.data.repair_fee.management }}</span>
            </template>  
            <template slot-scope="scope" slot="maint_dept_name">
              <span v-if="scope.data.repair_check == null"></span>
              <span v-else>{{ scope.data.repair_check.maint_dept_name }}</span>
            </template>
            <template slot-scope="scope" slot="overtime">
              <span v-if="scope.data.repair_fee == null"></span>
              <span v-else>{{ scope.data.repair_fee.overtime }}</span>
            </template>
            <template slot-scope="scope" slot="sale">
              <span v-if="scope.data.repair_fee == null"></span>
              <span v-else>{{ scope.data.repair_fee.sale }}</span>
            </template>
            <template slot-scope="scope" slot="total">
              <span v-if="scope.data.repair_fee == null"></span>
              <span v-else>{{ scope.data.repair_fee.total }}</span>
            </template>
          </tr-table>
        </el-tab-pane>
      </el-tabs>

    </div>
    <!-- 弹窗 -->
    <div>
      <!-- 添加详情弹窗 -->
      <cardamage-dialog
        ref="damageDialog"
        :showCarDamageTitle="showCarDamageTitle"
        :dialogBool.sync="isShowAddDialog"
        :curType="curType"
        :curInfo="curInfo"
        @sure-submit-cardamage="sureAddCarDamage"
      ></cardamage-dialog>
      <!-- 事故关联报修单 -->
      <!-- @sure-save-info="sureSaveInfo"
        @sure-edit-info="sureEditInfo"
        @sure-checkout-info="surecheckoutInfo"
        @sure-checkout-info1="surecheckoutInfo1" -->
      <accident-repair-dialog
        ref="addDialog"
        :dialogBool.sync="addDialogShow"
        :curChangeType="repairsCurChangeType"
        :appendToBody="true"
        :detailLoading="false"
        :isAccidentCorrelation="true"
        @sure-save-info="sureSaveInfo"
      ></accident-repair-dialog>
    </div>
  </div>
</template>
<script>
import { getSession, getUser } from "@/utils/auth";
import cardamageDialog from '../dialog/cardamage-dialog.vue'
import accidentRepairDialog from '@/view/maintenance-management/repairs-management/component/dialog/add-dialog.vue'
export default {
  components: {
    cardamageDialog,
    accidentRepairDialog
  },
  props: {
    curChangeType: {
      type: String,
      default: "add",
    }
  },
  data() {
    return {
      // 车损信息表头
      canRendererTableHeader: [
        {
          id: 1,
          label: "车牌号",
          prop: "c_vehicle_number",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },{
          id: 2,
          label: "车辆区分",
          prop: "type",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },{
          id: 3,
          label: "车辆类型",
          prop: "vehicle_type",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },{
          id: 4,
          label: "车损程度",
          prop: "damage",
          width: "165",
          align: "center",
          signIndex: 3,
          sortable: false,
        },{
          id: 5,
          label: "驾驶员",
          prop: "c_driver_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },{
          id: 6,
          label: "身份证",
          prop: "c_driver_code",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },{
          id: 7,
          label: "联系方式",
          prop: "c_driver_phone",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },{
          id: 8,
          label: "内部估价",
          prop: "n_inside_fee",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },{
          id: 9,
          label: "保险公司估价",
          prop: "n_insurance_fee",
          width: "160",
          align: "center",
          signIndex: 8,
          sortable: true,
        },{
          id: 10,
          label: "评估中心估价",
          prop: "n_assessment_fee",
          width: "160",
          align: "center",
          signIndex: 9,
          sortable: true,
        },{
          id: 11,
          label: "定损金额",
          prop: "n_actual_fee",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: true,
        },{
          id: 12,
          label: "车损描述",
          prop: "c_describe",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },{
          id: 13,
          label: "操作",
          prop: "operation",
          width: "150",
          align: "center",
          signIndex: 12,
          sortable: false,
        }
      ],

      activeName: 'first',
      // 关联事故表单表头
      secondCanRendererTableHeader: [
        {
          id: 1,
          label: "工单号码",
          prop: "work_code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "工单状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "车牌号",
          prop: "vehicle_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "报修类别",
          prop: "type_child_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "报修时间",
          prop: "repair_time",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "报修描述",
          prop: "repair_describe",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "驾驶员",
          prop: "driver_name",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "进厂检验状态",
          prop: "check_state_name",
          width: "140",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "检验人",
          prop: "check_name",
          width: "140",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "检验时间",
          prop: "check_time",
          width: "140",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "检验备注",
          prop: "check_describe",
          width: "140",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
      ],
      thirdCanRendererTableHeader: [
        {
          id: 1,
          label: "维修工单号",
          prop: "work_code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "工单状态",
          prop: "state_detail_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "车牌号",
          prop: "vehicle_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "报修类型",
          prop: "type_child_name",
          width: "115",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "报修时间",
          prop: "repair_time",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "维修项目",
          prop: "item_name",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "维修人员",
          prop: "person_name",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "工时费",
          prop: "total_hours_fees",
          width: "140",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "材料费",
          prop: "total_materials",
          width: "140",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "总费用",
          prop: "total_fees",
          width: "140",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "完工日期",
          prop: "finish_time",
          width: "140",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "出厂日期",
          prop: "out_time",
          width: "140",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
      ],
      TableHeight: 200,
      isShowAddDialog: false,
      showCarDamageTitle: "车损详情",
      selectedIds:[],
      data:[], //管理保修单数据
      secondLoading:false,
      curInfo: {},
      curType: 'add', //添加、编辑
      rowId:"", //车损当前行的ID
      loading: false,
      damageRecordList:[], //车损记录,

      repairsCurChangeType: "addtrue",
      addDialogShow: false,
      repair_address_id:"",
      repair_address: "",
      repairData:[], //关联报修单
      repairDataLoading: false,
      orderLisData: [], //关联工单
      orderLisDataLoading: false
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化数据
    resetData() {
     this.activeName = 'first'
     this.repairData = []
     this.orderLisData = []
    },
    // 数据回显
    setData(val) {
      this.curInfo = val;
      this.reqDamageRecordList();
      this.reqFirstRepairWorkshop();
      this.handleClick({name:'first'})
    },
     // 获取车损记录
    reqDamageRecordList() {
      this.loading = true
      let parmas = {
        i_id: this.curInfo.i_id
      }
      this.$client.getDamageRecordList(parmas)
        .then(res => {
          if (res.head.result == "200") {
            this.damageRecordList = res.context.list;
            this.loading = false
          } else {
            this.loading = false
            this.damageRecordList = [];
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
        })
    },
    
    // 操作
    onBtn(type) {
      switch (type) {
        case 'add':
          this.curType = 'add';
          this.isShowAddDialog = true;
          break;
        case 'delete':
          this.deleteCasualtiesRecode()
          break;
        case 'export':
          this.exportFile()
          break;
      }
    },
     // 导出Excel
    exportFile(){
      let parmas = {
        i_id: this.curInfo.i_id
      }
      this.$client.exportDamageInfo(parmas)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 编辑车损信息
    editInfo(row) {
      this.curType = 'edit';
      this.rowId = row.i_id;
      // this.$refs.damageDialog.setData(row)
      this.$refs['damageDialog'].setData(row)
      this.isShowAddDialog = true;
    },
    // 确定添加
    sureAddCarDamage(info) {
      if(this.curType == 'edit') {
        info.i_id = this.rowId
      }
      info.i_main_id = this.curInfo.i_id;
      let params = {
        context: info
      }
      if(!params.context.i_id) {
        this.$client.addDamageInfo(params).then(res => {
          if(res.head.result == '200') {
            this.isShowAddDialog = false
            this.reqDamageRecordList();
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "success",
            });
          }else{
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
      }else{
        this.$client.EditDamageAccidentManage(params).then(res => {
          if(res.head.result == '200') {
            this.isShowAddDialog = false
            this.reqDamageRecordList();
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "success",
            });
          }else{
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
      }
      
    },
    // 删除车损信息
    deleteInfo(row) {
      this.selectedIds = [];
      this.selectedIds.push(row.i_id)
      if(this.selectedIds.length > 0) {
        this.deleteCasualtiesRecode()
      }
    },

    // 勾选车损
    selectedDamageList(list) {
      console.log(list)
      this.selectedIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedIds.push(item.i_id)
        });
      }
    },
    // 删除车损记录
    deleteCasualtiesRecode() {
      if(this.selectedIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选至少一条要移除的',
          type: "warning",
        });
        return
      }

      let parmas = {
        context: this.selectedIds,
      };
      this.$client.deleteDamageInfo(parmas)
      .then(res => {
        if(res.head.result == '200') {
          this.selectedIds = [];
          this.reqDamageRecordList();
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }
          
      })
    },

    // 选择切换报修单和维修工单
    handleClick(tab, event) {
      // console.log(tab, event);
      switch (tab.name) {
        case 'first':
          this.reqAssociatedRepairRequest()
          break;
        case 'second':
          if(!!this.repairData && this.repairData.length > 0) {
            this.reqAssociatedRepairOrder(this.repairData[0].work_code)
          }
          break;
      }
    },
    // 获取关联报修单
    reqAssociatedRepairRequest() {
      if(!!this.curInfo.i_id) {
        this.repairDataLoading = true
        let params = {
          accident_id:this.curInfo.i_id
        }
        this.$client.getByPageMaintRepairRecord(params).then(res => {
          if (res.head.result == "200") {
            this.repairDataLoading = false
            this.repairData =  res.context.list;
          } else {
            this.repairDataLoading = false
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error"
            });
          }
        });
      }
    },
    // 关联维修工单
    reqAssociatedRepairOrder(work_code) {
      this.orderLisDataLoading = true
      let params = {
        work_code: work_code
      }
      this.$client.getrOrderList(params)
      .then(res => {
        if (res.head.result == "200") {
          this.orderLisData = res.context.list;
          if(this.orderLisData.length>0){
            this.orderLisData.forEach(item => {
              let item_name = []
              let person_name = []
              if(item.repair_items.length>0){
                item.repair_items.forEach(element => {
                  item_name.push(element.item_name)
                  person_name.push(element.person_name)
                });
              }
              this.$set(item,'item_name',item_name.join('、'))
               this.$set(item,'person_name',person_name.join('、'))
            })
        
          
          }
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        };
        this.orderLisDataLoading = false;
      })
    },

    
    // 勾选关联表单
    selectedList() {

    },
    // 设置报修人和报修时间
    configData() {
      let userInfo = JSON.parse(getUser());
      // console.log(userInfo)
      let info= {
        repair_user_id: Number(userInfo.user_id),
        repair_time: this.setDate()
      }
      return info

    },
    // 设置默认日期为当天
    setDate() {
      let created_time = '';
      let date = new Date();
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      let hours = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()
      let minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
      let seconds = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()
      return created_time = Y + '-' + M + '-' + D + ' ' + hours + ':' + minutes + ':' + seconds
    },
    // 获取报修地点取第一个
    reqFirstRepairWorkshop() {
      this.$client.getMaintainDep()
        .then((res) => {
          console.log(res)
          if (res.head.result == "200") {
              let data = res.context;
              if(!!data && data.length > 0) {
               this.repair_address_id = data[0].id
               this.repair_address = data[0].name
              }
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    //关联事故保修单 
    formWithRepair() {
      let form = {
        type: 2,
        type_child: -1,
        accident_id: this.curInfo.i_id,
        vehicle_id: this.curInfo.i_vehicle_id,
        driver_id: this.curInfo.i_driver_id,
        i_result_person: this.curInfo.i_result_person,
        repair_user_id: this.configData().repair_user_id,
        repair_time: this.configData().repair_time,
        repair_address_id: this.repair_address_id,
        repair_address: this.repair_address,
        is_trailer: 1,
      }
      this.addDialogShow = true
      this.$refs["addDialog"].setData(form);

    },
    // 确定添加
    sureSaveInfo(context) {
      let params = {
        context: context
      };
      this.$client.addMaintRepairRecord(params).then(res => {
        if (res.head.result == "200") {
          this.activeName = 'first'
          this.reqAssociatedRepairRequest();
          this.addDialogShow = false;
          this.$message({
            showClose: true,
            type: "success",
            message: "保存成功"
          });
        } else {
          this.$message({
            showClose: true,
            type: "error",
            message: res.head.describle
          });
        }
      });
    },

  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
