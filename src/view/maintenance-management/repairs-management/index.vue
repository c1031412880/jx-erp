<template>
  <div class="pressure-vessel-manage">
    <div class="pressure-vessel-manage-content">
      <sub-req
        ref="head"
        @on-add="addInfo"
        @on-ok="onSubmit"
        @on-export="exportFile"
        @on-screen="onScreen"
        @on-delete="onDelete"
        @on-addtrue="addInfo1"
        @on-print="print"
      ></sub-req>
      <el-image-viewer
        v-if="showViewer"
        :on-close="closeViewer"
        :url-list="srcList"
      ></el-image-viewer>
      <tr-table
        ref="table"
        :selectionShow="true"
        :data="pressureVesselData"
        :tableHeaderList="canRendererTableHeader"
        :TableHeight="TableHeight"
        :loading="loading || headerLoading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
        @on-select-change-row="selectedList"
      >
        <template slot-scope="scope" slot="work_code">
          <el-button type="text" size="mini" @click="jumpOrderPage(scope.data)">
            {{ scope.data.work_code }}
          </el-button>
        </template>
        <template slot-scope="scope" slot="state_name">
          <div v-if="scope.data.state == 1">
            <div style="color: #d71345">
              <p class="mark" style="background-color: #d71345"></p>
              <span>{{ scope.data.state_name }}</span>
            </div>
          </div>
          <div v-else-if="scope.data.state == 2">
            <div style="color: #18be6b">
              <p class="mark" style="background-color: #18be6b"></p>
              <span>{{ scope.data.state_name }}</span>
            </div>
          </div>
          <div v-else-if="scope.data.state == 3">
            <div style="color: #c88400">
              <p class="mark" style="background-color: #c88400"></p>
              <span>{{ scope.data.state_name }}</span>
            </div>
          </div>
          <div v-else-if="scope.data.state == 4">
            <div style="color: #ffc20e">
              <p class="mark" style="background-color: #ffc20e"></p>
              <span>{{ scope.data.state_name }}</span>
            </div>
          </div>
          <div v-else-if="scope.data.state == 5">
            <div style="color: #409eff">
              <p class="mark" style="background-color: #409eff"></p>
              <span>{{ scope.data.state_name }}</span>
            </div>
          </div>
          <div v-else-if="scope.data.state == 7">
            <div style="color: #77787b">
              <p class="mark" style="background-color: #77787b"></p>
              <span>{{ scope.data.state_name }}</span>
            </div>
          </div>
        </template>
        <template slot-scope="scope" slot="vehicle_number">
          <span v-if="scope.data.vehicle_info == null"></span>
          <el-button
            v-else
            type="text"
            size="mini"
            @click="jumpVehInfoPage(scope.data.vehicle_info.vehicle_number)"
          >
            {{ scope.data.vehicle_info.vehicle_number }}
          </el-button>
        </template>
        <template slot-scope="scope" slot="vehicle_name">
          <span v-if="scope.data.vehicle_info == null"></span>
          <el-button
            v-else
            type="text"
            size="mini"
            @click="jumpVehInfoPage(scope.data.vehicle_info.vehicle_name)"
          >
            {{ scope.data.vehicle_info.vehicle_name }}
          </el-button>
        </template>
        <!-- <template slot-scope="scope" slot="labor_contract_time">
          <span
            v-if="scope.data.labor_contract_time.length > 1"
          >{{scope.data.labor_contract_time[0]}}-{{scope.data.labor_contract_time[1]}}</span>
          <span v-else>--</span>
        </template> -->

        <template slot-scope="scope" slot="department_name">
          <span v-if="scope.data.vehicle_info == null"></span>
          <span v-else>{{ scope.data.vehicle_info.department_name }}</span>
        </template>
        <template slot-scope="scope" slot="vehicle_kind_name">
          <span v-if="scope.data.vehicle_info == null"></span>
          <span v-else>{{ scope.data.vehicle_info.vehicle_kind_name }}</span>
        </template>
        <template slot-scope="scope" slot="imgs">
          <span v-if="scope.data.imgs == ''"></span>
          <el-link v-else type="primary" :underline="false" @click="showImage(scope.data.imgs)">
            查看图片
          </el-link>
        </template>
        <template slot-scope="scope" slot="maint_dept_name">
          <span v-if="scope.data.repair_check == null"></span>
          <span v-else>{{ scope.data.repair_check.maint_dept_name }}</span>
        </template>
        <template slot-scope="scope" slot="check_state_name">
          <el-tag v-if="scope.data.check_state_name == '已检验'" type="success" size="mini">
            {{ scope.data.check_state_name }}
          </el-tag>
          <el-tag v-else-if="scope.data.check_state_name == '未检验'" type="warning" size="mini">
            {{ scope.data.check_state_name }}
          </el-tag>
          <el-tag v-else-if="scope.data.check_state_name == '检验未通过'" type="danger" size="mini">
            {{ scope.data.check_state_name }}
          </el-tag>
          <el-tag v-else-if="scope.data.check_state_name == '检验中'" type="primary" size="mini">
            {{ scope.data.check_state_name }}
          </el-tag>
        </template>
        <template slot-scope="scope" slot="limit_repair_flow_code">
          <span v-if="scope.data.repair_check == null"></span>
          <el-button
            type="text"
            size="mini"
            v-else
            @click="openDispatchHandle(scope.data.repair_check.limit_repair_order_id)"
          >
            {{ scope.data.repair_check.limit_repair_flow_code }}
          </el-button>
        </template>
        <template slot-scope="scope" slot="authorization_state">
          <span v-if="scope.data.repair_check == null"></span>
          <span v-else>{{ scope.data.repair_check.authorization_state }}</span>
        </template>
        <template slot-scope="scope" slot="check_name">
          <span v-if="scope.data.repair_check == null"></span>
          <span v-else>{{ scope.data.repair_check.check_name }}</span>
        </template>
        <template slot-scope="scope" slot="repair_tel">
          <span>{{ scope.data.repair_user_name }}</span>
          <span v-if="scope.data.repair_tel">({{ scope.data.repair_tel }})</span>
        </template>
        <template slot-scope="scope" slot="check_time">
          <span v-if="scope.data.repair_check == null"></span>
          <span v-else>{{ scope.data.repair_check.check_time }}</span>
        </template>
        <template slot-scope="scope" slot="check_describe">
          <span v-if="scope.data.repair_check == null"></span>
          <span v-else>{{ scope.data.repair_check.check_describe }}</span>
        </template>
        <template slot-scope="scope" slot="rescue_flow_code">
          <span v-if="scope.data.rescue_flow_code == null"></span>
          <el-button
            v-else
            type="text"
            size="mini"
            @click="openRescueHandle(scope.data.rescue_flow_id)"
          >
            {{ scope.data.rescue_flow_code }}
          </el-button>
        </template>
        <template slot-scope="scope" slot="operation">
          <el-link
            type="primary"
            size="mini"
            style="margin-left: 10px"
            @click="editInfo(scope.data, 'edit')"
            v-if="
              ($isPowerShow('edit') && scope.data.state == 7) ||
              !(scope.data.check_state == 1 || scope.data.check_state == 3)
            "
          >
            编辑
          </el-link>
          <el-link
            type="primary"
            size="mini"
            style="margin-left: 10px"
            @click="editInfo(scope.data, 'detail')"
          >
            查看
          </el-link>
          <el-link
            type="primary"
            size="mini"
            style="margin-left: 10px"
            @click="editInfo(scope.data, 'checkout')"
            v-if="
              $isPowerShow('checkout') &&
              !(scope.data.check_state == 1 || scope.data.check_state == 3)
            "
          >
            检验
          </el-link>
          <el-popconfirm
            @confirm="deleteCurRowInfo(scope.data)"
            title="是否确删除此条记录？"
            v-if="
              ($isPowerShow('del') && scope.data.state == 7) ||
              !(scope.data.check_state == 1 || scope.data.check_state == 3)
            "
          >
            <el-link slot="reference" type="danger" size="mini" style="margin-left: 10px">
              删除
            </el-link>
          </el-popconfirm>
        </template>
      </tr-table>
      <!-- 分页 -->
      <el-pagination
        style="margin: 5px 0; display: flex; justify-content: flex-end"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        ref="paginationH"
        :current-page="pageInfo.pageIndex"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="pageInfo.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="pageInfo.pageCount"
      ></el-pagination>
    </div>
    <!-- <el-dialog
          :visible.sync="dialogVisible"
          width="70%"
          >
          <div id="printContent">
            <h1 style="text-align:center;font-weight:bold">车 辆 故 障 报 修 单</h1>
               <table class="table table-striped table-bordered" align="center" valign="center">
                <tr>
                  <td class="column">车辆部门</td>
                  <td  class="value" v-if="printlist.vehicle_info == null" ></td>
                  <td  class="value" v-else>{{printlist.vehicle_info.department_name}}</td>
                  <td class="column">报修人</td>
                  <td class="value">{{printlist.repair_user_name}}</td>
                </tr>
                <tr>
                  <td class="column">车牌号</td>
                  <td  class="value" v-if="printlist.vehicle_info == null" ></td>
                  <td  class="value" v-else>{{printlist.vehicle_info.vehicle_name}}</td>
                  <td class="column">报修时间</td>
                  <td class="value">{{printlist.repair_time}}</td>
                </tr>
                <tr>
                  <td class="column">报修类别</td>
                  <td class="value">{{printlist.type_child_name}}</td>
                  <td class="column">报修地点</td>
                  <td class="value">{{printlist.repair_address}}</td>
                </tr>
                <tr>
                 <td class="column" >报修内容</td>
                  <td class="value" colspan="5" style="text-align:left;">
                  <p>{{printlist.repair_describe}}</p>
                  </td>
                </tr>
                <tr>
                 <td class="column" >修复情况</td>
                  <td class="value" colspan="5" style="text-align:left;">
                    <br>
                    <br>
                    <br>
                  </td>
                </tr>
                <tr>
                  <td class="column" align="left" colspan="2">竣工时间：<br><br>维修人员签名：</td>
                  <td class="column" align="left" colspan="2">验收时间：<br><br>维修部门验收人签字：</td>
                </tr>
                <tr>
                  <td class="column" align="left" colspan="2">驾驶员签字：<br><br>时间：</td>
                  <td class="column" colspan="2">车辆部门验收人签字：<br><br>时间：</td>
                </tr>
              </table>

          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" v-print="'#printContent'">打 印</el-button>
          </span>
      </el-dialog> -->

    <div class="dialog-box">
      <!-- 添加信息 -->
      <add-dialog
        ref="addDialog"
        :dialogBool.sync="addDialogShow"
        :curChangeType="curChangeType"
        @on-load="loadData"
        @sure-save-info="sureSaveInfo"
        @sure-edit-info="sureEditInfo"
        @sure-checkout-info="surecheckoutInfo"
        @sure-checkout-info1="surecheckoutInfo1"
        :detailLoading="detailLoading"
        :containerVehicleRecode="containerVehicleRecode"
        :containerLifeData="containerLifeData"
        :isAccidentDetail="isAccidentDetail"
        :isCheckout="isCheckout"
        :state="iState"
        :isAccidentEdit="isAccidentEdit"
      ></add-dialog>
      <!-- 高级筛选 -->
      <drawer-dialog
        ref="drawerDialog"
        :drawer.sync="isShowDrawerDialog"
        @on-ok="onSubmit"
      ></drawer-dialog>
      <!-- 表格自定义组件 -->
      <custom-setting
        :dialogBool.sync="customSettingVialogVisible"
        :customSettingList="customSettingList"
        :canRendererTableHeader="canRendererTableHeader"
        :customSettingShowList="customSettingShowList"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
      ></custom-setting>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import subReq from "./component/sub-req";
import AddDialog from "./component/dialog/add-dialog";
import scrapDialog from "./component/dialog/scrap-dialog";
import drawerDialog from "./component/dialog/drawer-dialog";

export default {
  name: "repairs-management",
  components: {
    subReq,
    AddDialog,
    scrapDialog,
    drawerDialog,
    ElImageViewer,
  },
  data() {
    return {
      // 工单状态;1待接修2维修中3待完工检验4待出厂5已出厂7已作废
      curChangeType: "add", //add添加  edit编辑  detail详情
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      state:'',
      formData:{},
      filedialogVisible: false,
      queryform: {}, //查询表单
      pressureVesselData: [], //列表
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      addDialogShow: false, //添加信息
      isShowDrawerDialog: false, //是否显示高级筛选
      customSettingVialogVisible: false,
      showViewer:false,
      dialogVisible:false,
      srcList: [],
      customSettingList: [
        {
          id: 1,
          label: "工单号码",
          prop: "work_code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true
        },
        {
          id: 2,
          label: "工单状态",
          prop: "state_name",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: true
        },
        // {
        //   id: 3,
        //   label: "大额审批单",
        //   prop: "limit_repair_flow_code",
        //   width: "130",
        //   align: "center",
        //   signIndex: 2,
        //   sortable: false
        // },
        // {
        //   id: 4,
        //   label: "大额审批状态",
        //   prop: "authorization_state",
        //   width: "120",
        //   align: "center",
        //   signIndex: 3,
        //   sortable: false
        // },
        {
          id: 3,
          label: "自编号",
          prop: "vehicle_number",
          width: "110",
          align: "center",
          signIndex: 2,
          sortable: true
        },
        {
          id: 4,
          label: "车牌号",
          prop: "vehicle_name",
          width: "110",
          align: "center",
          signIndex: 3,
          sortable: true
        },
        {
          id: 5,
          label: "所属组织",
          prop: "department_name",
          width: "100",
          align: "center",
          signIndex: 4,
          sortable: false
        },
        {
          id: 6,
          label: "车辆型号",
          prop: "vehicle_kind_name",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false
        },
        {
          id: 7,
          label: "报修时间",
          prop: "repair_time",
          width: "160",
          align: "center",
          signIndex: 6,
          sortable: true
        },
        {
          id: 8,
          label: "报修地点",
          prop: "repair_address",
          width: "90",
          align: "center",
          signIndex: 7,
          sortable: false
        },
        {
          id: 9,
          label: "报修类别",
          prop: "type_child_name",
          width: "100",
          align: "center",
          signIndex: 8,
          sortable: false
        },
        {
          id: 10,
          label: "报修描述",
          prop: "repair_describe",
          width: "100",
          align: "center",
          signIndex: 9,
          sortable: false
        },
        {
          id: 11,
          label: "相关图片",
          prop: "imgs",
          width: "100",
          align: "center",
          signIndex: 10,
          sortable: false
        },
        {
          id: 12,
          label: "驾驶员",
          prop: "driver_name",
          width: "90",
          align: "center",
          signIndex: 11,
          sortable: false
        },
        {
          id: 13,
          label: "报修人(电话)",
          prop: "repair_tel",
          width: "150",
          align: "center",
          signIndex: 12,
          sortable: false
        },
        // {
        //   id: 16,
        //   label: "施救车派工单",
        //   prop: "rescue_flow_code",
        //   width: "160",
        //   align: "center",
        //   signIndex: 15,
        //   sortable: false
        // },
        {
          id: 14,
          label: "进厂检验状态",
          prop: "check_state_name",
          width: "120",
          align: "center",
          signIndex: 13,
          sortable: false
        },
        {
          id: 15,
          label: "维修车间",
          prop: "maint_dept_name",
          width: "120",
          align: "center",
          signIndex: 14,
          sortable: false
        },
          {
          id: 16,
          label: "检验人",
          prop: "check_name",
          width: "90",
          align: "center",
          signIndex: 15,
          sortable: false
        },
          {
          id: 17,
          label: "检验时间",
          prop: "check_time",
          width: "160",
          align: "center",
          signIndex: 16,
          sortable: true
        },
          {
          id: 18,
          label: "检验备注",
          prop: "check_describe",
          width: "100",
          align: "center",
          signIndex: 17,
          sortable: false
        },
        {
          id: 19,
          label: "操作",
          prop: "operation",
          width: "200",
          align: "center",
          signIndex: 18,
          sortable: false
        }
      ],
      frontFixedNum: 2, //前几行固定
      backFixedNum: 1 , //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      iState: "", //压力容器状态 1使用中 2闲置 3已报废 4 修理中
      detailLoading: false,
      containerVehicleRecode: [], //使用历史记录
      containerLifeData: [], //生命周期
      selectedIds: [], //勾选中的ID
      printlist:[
        {vehicle_info:[{department_name:'',vehicle_name:''}]},
        {repair_user_name:''},{repair_time:''},{type_child_name:''},{repair_address:''},{repair_describe:''}
      ],
      titlesId:'', //当前表头的id
      menu_code:'',
      headerLoading: false,
      isAccidentDetail: false,
      isCheckout: false,
      isAccidentEdit: false
    };
  },
  activated() {
    let ids = this.$route.params.ids ? [this.$route.params.ids] : []
    if(!!ids && ids.length > 0) {
      console.log('1111111111111');
      
      this.reqSubmit({ids: ids})
    }
  },
  created() {
    this.menu_code = this.$route.meta.code
    this.reqTitleTable()
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize');
      let ids = this.$route.params.ids ? [this.$route.params.ids] : []
      if(!!ids && ids.length > 0) {
        this.reqSubmit({ids: ids})
      }else {
        this.$refs.head.onSubmit()
      }
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // 更新表头
    updateTableHeader(newestTableHeaderList) {
      this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {

        this.reqTitleTable()
      }).catch(err => {
      })
    },
    // 获取表头
    reqTitleTable() {
      this.headerLoading = true;
      this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingList).then(res => {
        this.titlesId = res.titlesId;
        this.canRendererTableHeader = res.canRendererTableHeader;
        this.customSettingList = res.customSettingList;
        this.customSettingShowList = res.customSettingShowList;
        this.$forceUpdate();
        setTimeout(() =>{
          this.headerLoading = false;
        },600)
      }).catch(err => {
        setTimeout(() =>{
          this.headerLoading = false;
        },600)
      })
    },

    jumpOrderPage(info){
      this.$router.push({
        name:'workorder-management',
        params:{
          orderId: info.work_code
        }
      })
    },
    jumpVehInfoPage(lp_num){
      this.$router.push({
        name:'vehinfo-manage',
        params:{
          numberId: lp_num
        }
      })
    },
    // 打开施救车派工单
    openRescueHandle(id) {
      let detail_id = 1650, title = '施救车派工单'
      this.$router.push({
        path: `/news-details/${id}/${title}/${detail_id}`
      })
    },
    print(){
      // console.log(this.selectedIds, '222222222');
      if(this.selectedIds.length && this.selectedIds.length<2){
        this.$client.exportTableMaintRepairRecord({id:this.selectedIds[0]}).then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
      }
      else{
         this.$message({
          message: '只能选中一个，进行打印',
          type: 'warning'
        });
      }

    },
    //查看图片
    showImage(path) {
      this.srcList = path;
      this.showViewer = true;
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false;
    },
     deleteCurRowInfo(row) {
      this.selectedIds = [];
      // debugger
      if(row.work_code&&row.state!=7){

        this.$message({showClose: true,message:"当前报修记录已生成工单，必须等工单作废后才能删除。",type: "warning"})
        return
      }
      if (this.selectedIds.length == 0) {
        this.selectedIds.push(row.id);
        // 删除
        this.onDelete();
      }
    },
     // 批量删除
      onDelete() {
      if (this.selectedIds.length == 0) {
        this.$message({
          showClose: true,
          message: "请勾选至少一条要移除的",
          type: "warning"
        });
        return;
      }

      let parmas = {
        context: this.selectedIds
      };
      this.$client.batchDeleteLostArticle(parmas).then(res => {
        if (res.head.result == "200") {
          this.selectedIds = [];
          // // 清除勾选
          // this.$refs.table.handleSelectionChange([]);
          this.loadData();
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success"
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success"
          });
        }
      });
    },
    // 导出Excel
    exportFile() {
      let params = Object.assign({}, this.queryform);
      let ids = [ ...this.selectedIds ]
      if (ids.length) {
        params.ids = ids
      }
      this.$client.exporMaintRepairRecord(params).then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },
    // 打开高级筛选弹窗
    onScreen() {
      this.isShowDrawerDialog = true;
    },
    // 批量删除
    onDelete() {
      if (this.selectedIds.length == 0) {
        this.$message({
          showClose: true,
          message: "请勾选至少一条删除",
          type: "warning"
        });
        return;
      }

      let parmas = {
        context: this.selectedIds
      };
      this.$client.deletecRepair(parmas).then(res => {
        if (res.head.result == "200") {
          this.selectedIds = [];
          // // 清除勾选
          // this.$refs.table.handleSelectionChange([]);
          this.loadData();
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success"
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success"
          });
        }
      });
    },
    // 添加信息
    addInfo() {
      this.addDialogShow = true;
      this.curChangeType = "add";
      this.isAccidentEdit = false
      // this.$refs["addDialog"].resetData();
    },
    addInfo1() {
      this.addDialogShow = true;
      this.curChangeType = "addtrue";
      this.isAccidentEdit = false
      // this.$refs["addDialog"].resetData();
    },
    // 打开自定义表格头部弹窗
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    // 表格选中一行 sub-req 上点击编辑时
    editSatff() {
      // let val = this.$refs['table'].curSelectedRowInfo
      // if(val){
      //   this.addDialogShow = true
      //   this.$refs['addDialog'].setData(val)
      // }else{
      //   this.$message({type: 'warning', message: '请先选择一条数据'})
      // }
    },
    // 表格上点击编辑时
    editInfo(val, type) {
      // console.log(val,type,'数据')
      this.iState = val.state;
      this.addDialogShow = true;
      if(val.type == 2) {
        if(type == 'detail') {
          this.isAccidentDetail = true
           this.isCheckout = false
            this.isAccidentEdit = false
        }else if(type == 'checkout') {
          this.isCheckout = true
          this.isAccidentDetail = false
           this.isAccidentEdit = true
        }else if(type == 'edit'){
          this.isAccidentDetail = false
           this.isCheckout = false
            this.isAccidentEdit = true
        }else{
          this.isCheckout = false
          this.isAccidentDetail = false
          this.isAccidentEdit = false
        }
        this.curChangeType = 'addtrue'
      }else{
        this.curChangeType = type;
        if(this.curChangeType == 'edit' || this.curChangeType == 'checkout') {
          this.isAccidentEdit = true
        }
      }
      this.$refs["addDialog"].setData(val);
      if (type == "detail") {
        let params = {
          tyre_id: val.id
        };
        this.$client.getTyreLifeTyreManage(params).then(res => {
          if (res.head.result == "200") {
            this.containerLifeData = res.context.list;
            this.detailLoading = false;
          } else {
            this.$message({ type: "error", message: res.head.describle });
          }
        });
      }
    },

    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.$refs["head"].onSubmit()
    },
    // 查询
    onSubmit(form) {
      // this.queryform = {};
      this.queryform = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    reqSubmit(form) {
      this.queryform = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 加载数据
    loadData() {
      this.loading = true;
      let params = {};
      params = Object.assign({}, this.queryform);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.getByPageMaintRepairRecord(params).then(res => {
        if (res.head.result == "200") {
          this.pressureVesselData = res.context.list;
          this.pageInfo.pageCount = res.context.total;
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
        this.loading = false;
      });
    },


    // 编辑、保存信息
    sureSaveInfo(context) {
      let params = {
        context: context
      };
      this.$client.addMaintRepairRecord(params).then(res => {
        if (res.head.result == "200") {
          // this.form = {};
          this.loadData();
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
    surecheckoutInfo(context, val) {
      context.installInfo.state = val
      if(context.installInfo.estimate_amount >= 2000 && val == 1) {
        let params = {
          object_id: 1660,
          form_data: context.installInfo,
          // user_id: userId,
        }
        this.$client.GetByFormDataFlowManage(params)
          .then(res => {
            if (res.head.result == '200') {
              let info = { context: {},}
              info.context = {
                form_data: context.installInfo,
                step_data : res.context
              }
              this.$client.checkFlowMaintRepairRecord(info).then(res => {
                if (res.head.result == "200") {
                  this.loadData();
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
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
          }).catch(err => {})
      } else {
        let params = {
          context: context.installInfo
        };
        this.$client.checkMaintRepairRecord(params).then(res => {
          if (res.head.result == "200") {
            // this.form = {};
            this.loadData();
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
      }
    },
    surecheckoutInfo1(context) {
      context.installInfo.state = 2
      let params = {
        context: context.installInfo
      };
      this.$client.checkMaintRepairRecord(params).then(res => {
        if (res.head.result == "200") {
          // this.form = {};
          this.loadData();
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
    sureEditInfo(context) {
      let params = {
        context: context
      };
      this.$client.editMaintRepairRecord(params).then(res => {
        if (res.head.result == "200") {
          // this.form = {};
          this.loadData();
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
    // 勾选中的
    selectedList(list) {
      this.selectedIds = [];
      this.printlist.repair_user_name = ''
      this.printlist.repair_time = ''
      this.printlist.type_child_name = ''
      this.printlist.repair_address = ''
      this.printlist.repair_describe = ''
      if(this.printlist.vehicle_info!=null){
      this.printlist.vehicle_info.department_name = ''
      this.printlist.vehicle_info.vehicle_name = ''
      }
      if (list && list.length > 0) {
        list.forEach((item, index) => {
          this.selectedIds.push(item.id);
        });
      }
      // console.log(this.selectedIds);
      if(list.length==1){
         list.forEach((item, index) => {
          this.printlist = JSON.parse(JSON.stringify(item));
        });
      }
    },
    // 打开大额维修审批单
    openDispatchHandle(id) {
      let detail_id = 1660, title = '大额维修审批单'
      this.$router.push({
        path: `/news-details/${id}/${title}/${detail_id}`
      })
    },
    // 计算表格高度
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
        // console.log(this.TableHeight);
      }, 60);
    }
  },
  watch: {
    addDialogShow() {
      if(!this.addDialogShow) {
        this.isAccidentDetail = false
        this.isCheckout = false
        this.isAccidentEdit = false
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.pressure-vessel-manage {
  width: 100%;
  height: 100%;
}
 .table{
    border-collapse: collapse;
    border-spacing: 0;
    background-color: transparent;
    display: table;
    width: 100%;
    max-width: 100%;
    width: 800px;
    margin:0 auto;
  }
  .table td{

    font-size: 17px;
    font-family: 'Arial Normal', 'Arial';
    color: #333333;
    padding: 8px 12px;
  }
  .table-bordered {
    border: 1px solid #ddd;
  }
  .column{
    width:30px;
    height:30px;
    border:1px solid #333;
  }
  .value{
    width:120px;
    height:30px;
    border:1px solid #333;
  }
   .mark {
        width: 5px;
        height: 5px;
        border-radius:20px;
        display: inline-block;
        margin-bottom: 2px

    }
</style>
