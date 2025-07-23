<template>
    <div class="driver-management">
      <!-- <staff-overview-info
        ref="staffOverviewInfo"
        @open-leave-office-user="openLeaveOfficeUser"
      ></staff-overview-info>
      <el-radio-group ref="elRadioGroup" v-model="showCollapse" style="margin-bottom: 20px;" size="mini">
        <el-radio-button :label="'first'">普通员工</el-radio-button>
        <el-radio-button :label="'second'">驾驶员</el-radio-button>
      </el-radio-group> -->
      <div class="" v-show="showCollapse == 'first'">
        <sub-req-first ref="head"
          @on-add="addStaffInfo"
          @on-ok="onSubmit"
          @on-edit="editSatff"
          @on-import="openfiledialog"
          @on-export="exportFile"
        ></sub-req-first>

        <tr-table
          ref="table"
          :selectionShow="true"
          :data="generalStaffData"
          :tableHeaderList="canRendererTableHeader"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          @on-select-change-row="selectedGeneralStaffList"
        >
          <template slot-scope="scope" slot="labor_contract_time">
            <span v-if="scope.data.labor_contract_time.length > 1">{{scope.data.labor_contract_time[0]}}-{{scope.data.labor_contract_time[1]}}</span>
            <span v-else>--</span>
          </template>

          <template slot-scope="scope" slot="c_state">
            <span v-if="scope.data.c_state">{{scope.data.c_state == '1'? '永久': scope.data.c_state == '2'?'临时': '停用'}}</span>
          </template>

          <template slot-scope="scope" slot="operation">
            <el-button type="primary" size="mini" @click="staffRowInfo(scope.data)">详情</el-button>
            <el-button type="primary" size="mini" @click="editStaffInfo(scope.data)" v-if="$isPowerShow('edit')">编辑</el-button>
            <!-- <el-popconfirm
              @confirm="tableDel(scope.data.i_id)"
              title="是否确认员工离职？">
              <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;" v-if="$isPowerShow('leave')">离职</el-button>
            </el-popconfirm> -->
          </template>
        </tr-table>

        <el-pagination
          style="margin: 5px 0;display:flex; justify-content: flex-end;"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          ref="paginationH"
          :current-page="pageInfoFirst.pageIndex"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="pageInfoFirst.pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="pageInfoFirst.pageCount">
        </el-pagination>

      </div>

      <div class="" v-show="showCollapse == 'second'">
        <sub-req-second
          ref="headSecond"
          @on-add="addStaffInfo"
          @on-ok="onSubmit"
          @on-edit="editSatff"
          @on-import="openfiledialog"
          @on-export="exportFile"
        ></sub-req-second>
         <tr-table
          ref="table"
          :selectionShow="true"
          :data="driverData"
          :tableHeaderList="canRendererTableHeaderSecond"
          :TableHeight="TableHeight"
          :loading="loadingSecond || headerLoading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          @on-select-change-row="selectedDriverList"
        >
          <template slot-scope="scope" slot="labor_contract_time">
            <span v-if="scope.data.labor_contract_time.length > 1">{{scope.data.labor_contract_time[0]}}-{{scope.data.labor_contract_time[1]}}</span>
            <span v-else>--</span>
          </template>

          <!-- <template slot-scope="scope" slot="begin" >
            <span v-if="scope.data.begin">{{`${scope.data.begin? scope.data.begin:''}-${scope.data.end?scope.data.end : ''}`}}</span>
          </template> -->

          <template slot-scope="scope" slot="operation">
            <el-button type="primary" size="mini" @click="staffRowInfo(scope.data)">详情</el-button>
            <el-button type="primary" size="mini" @click="editStaffInfo(scope.data)">编辑</el-button>
            <!-- <el-button type="primary" size="mini" @click="openRouteAllocationPop(scope.data)">路线分配</el-button>
            <el-popconfirm
              @confirm="tableDel(scope.data.i_id)"
              title="确定此员工离职吗？">
              <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;">离职</el-button>
            </el-popconfirm> -->
          </template>
        </tr-table>

        <el-pagination
          ref="paginationH"
          style="margin: 5px 0;display:flex; justify-content: flex-end;"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="pageInfoSecond.pageIndex"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="pageInfoSecond.pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="pageInfoSecond.pageCount">
        </el-pagination>
      </div>

      <div class="dialog-box">
        <!-- 添加普通员工、驾驶员信息 -->
         <add-staff-dialog
           ref="addStaffDialog"
           :dialogBool.sync="addStaffDialogShow"
           :showCollapse="showCollapse"
           :curChangeType="curChangeType"
           @sure-save-staff-info="sureSaveStaffInfo"
          ></add-staff-dialog>
          <!-- 添加线路车辆弹窗 -->
          <circuit-allocation-dialog
            ref="circuitAllocationDialog"
            :dialogBool.sync="circuitAllocationDialogShow"
          ></circuit-allocation-dialog>
          <!-- 上传文件 导出文件弹窗组件 -->
          <file-dialog
            :dialogBool.sync="filedialogVisible"
            :fileData="FileData"
            :typeMessage ="typeMessage"
            @on-submit-excel ="importStaffInfoExcel"
          ></file-dialog>
          <!-- 表格自定义组件 -->
          <custom-setting
            :dialogBool.sync="customSettingVialogVisible"
            :customSettingList="showCollapse == 'first'?customSettingFirstList:customSettingSecondList"
            :canRendererTableHeader="showCollapse == 'first'?canRendererTableHeader:canRendererTableHeaderSecond"
            :customSettingShowList="customSettingShowList"
            :frontFixedNum="frontFixedNum"
            :backFixedNum="backFixedNum"
          ></custom-setting>
          <!-- 离职人员弹窗 -->
          <leave-staff-dialog
            :dialogBool.sync="leaveStaffDialogShow"
          ></leave-staff-dialog>
      </div>

    </div>
</template>

<script type="text/ecmascript-6">
  import staffOverviewInfo from './component/staff-overview-info'
  import subReqFirst from './component/sub-req-first'
   import subReqSecond from './component/sub-req-second'
  import fileDialog from '@/components/fileDialog/file-dialog'
  import AddStaffDialog from './component/dialog/add-staff-dialog'
  import circuitAllocationDialog from './component/dialog/circuit-allocation-dialog'
  // import leaveStaffDialog from './component/dialog/leave-staff-dialog'
  import leaveStaffDialog from '../leave-staff-management/component/leave-staff-dialog.vue'

  export default {
    name: "driver-management",
    components: {
      subReqFirst,subReqSecond,fileDialog,
      staffOverviewInfo,AddStaffDialog,circuitAllocationDialog,leaveStaffDialog
    },
    data() {
      return {
        showCollapse: 'second', // first普通员工 second驾驶员
        curChangeType: 'add', //add添加  edit编辑  detail详情
        typeMessage: '人员',
        pageInfoFirst: { //普通员工列表分页
          pageIndex: 1,
          pageSize: 20,
          pageCount: 0
        },
        pageInfoSecond: { //驾驶员工列表分页
          pageIndex: 1,
          pageSize: 20,
          pageCount: 0
        },
        filedialogVisible: false,
        FileData: {
          url: window.newHttpConfig.URL_EASYMOCK +  "/Files/TempFiles/人员记录模板.xlsx",
        },
        form: {},
        firstQueryform: {},
        secondQueryform: {},
        generalStaffData: [], //普通员工列表
        driverData:[], //驾驶员列表
        selectedGeneralStaffIds:[], //勾选普通员工id
        selectedDriverIds:[], //勾选驾驶员id
        loading: false,
        loadingSecond: false,
        TableHeight: 500,
        informationDialogShow: false,
        addStaffDialogShow: false, //添加员工信息
        circuitAllocationDialogShow: false, //添加车辆 线路
        leaveStaffDialogShow: false, //离职人员

        customSettingVialogVisible: false,
        customSettingFirstList:[
          {
            id: 1,
            label: "姓名",
            prop: "c_name",
            width: "120",
            align: "center",
            signIndex:0,
            sortable:true
          },
          {
            id: 2,
            label: "工号",
            prop: "c_worker_id",
            width: "120",
            align: "center",
            signIndex:1,
            sortable:true
          },
          {
            id: 3,
            label: "部门",
            prop: "department_name",
            width: "130",
            align: "center",
            signIndex:2,
            sortable:false
          },
          {
            id: 4,
            label: "职务",
            prop: "position_name",
            width: "120",
            align: "center",
            signIndex:3,
            sortable:false
          },
          {
            id: 5,
            label: "状态",
            prop: "c_job_type",
            width: "130",
            align: "center",
            signIndex:4,
            sortable:true
          },
          {
            id: 6,
            label: "性别",
            prop: "c_gender",
            width: "120",
            align: "center",
            signIndex:5,
            sortable:false
          },
          {
            id: 7,
            label: "民族",
            prop: "c_nation",
            width: "150",
            align: "center",
            signIndex:6,
            sortable:false
          },
          {
            id: 8,
            label: "文化程度",
            prop: "c_degree_of_education",
            width: "100",
            align: "center",
            signIndex:7,
            sortable:false
          },
          {
            id: 9,
            label: "年龄",
            prop: "age",
            width: "80",
            align: "center",
            signIndex:8,
            sortable:true
          },
          {
            id: 10,
            label: "婚姻",
            prop: "c_marry",
            width: "100",
            align: "center",
            signIndex:9,
            sortable:false
          },
          {
            id: 11,
            label: "政治面貌",
            prop: "c_political",
            width: "135",
            align: "center",
            signIndex:10,
            sortable:false
          },
          {
            id: 12,
            label: "入党/团时间",
            prop: "d_join_party",
            width: "140",
            align: "center",
            signIndex:11,
            sortable:true
          },
          {
            id: 13,
            label: "党员备注",
            prop: "c_party_remark",
            width: "150",
            align: "center",
            signIndex:12,
            sortable:false
          },
          {
            id: 14,
            label: "是否当兵",
            prop: "is_join_army",
            width: "90",
            align: "center",
            signIndex:13,
            sortable:false
          },
          {
            id: 15,
            label: "出生日期",
            prop: "d_birthday",
            width: "150",
            align: "center",
            signIndex:14,
            sortable:true
          },
          {
            id: 16,
            label: "身份证号",
            prop: "c_idcord",
            width: "150",
            align: "center",
            signIndex:15,
            sortable:true
          },
          {
            id: 17,
            label: "城镇",
            prop: "c_city",
            width: "120",
            align: "center",
            signIndex:16,
            sortable:false
          },
          {
            id: 18,
            label: "户口性质",
            prop: "c_account_type",
            width: "120",
            align: "center",
            signIndex:17,
            sortable:false
          },
          {
            id: 19,
            label: "户籍所在地",
            prop: "c_account_area",
            width: "120",
            align: "center",
            signIndex:18,
            sortable:false
          },
          {
            id: 20,
            label: "现住地址",
            prop: "c_home_address",
            width: "120",
            align: "center",
            signIndex:19,
            sortable:false
          },
          {
            id: 21,
            label: "联系方式",
            prop: "c_phone",
            width: "120",
            align: "center",
            signIndex:20,
            sortable:true
          },
          {
            id: 22,
            label: "工种属性",
            prop: "c_work_kind",
            width: "120",
            align: "center",
            signIndex:21,
            sortable:false
          },
          {
            id: 23,
            label: "用工形式",
            prop: "c_employee_type",
            width: "120",
            align: "center",
            signIndex:22,
            sortable:false
          },
          // {
          //   id: 24,
          //   label: "本人用工起始",
          //   prop: "d_begin_work",
          //   width: "150",
          //   align: "center",
          //   signIndex:23,
          //   sortable:true
          // },
          {
            id: 24,
            label: "进单位时间",
            prop: "d_join_company",
            width: "150",
            align: "center",
            signIndex:23,
            sortable:true
          },
          // {
          //   id: 26,
          //   label: "本单位用工起始",
          //   prop: "d_begin_company_word",
          //   width: "160",
          //   align: "center",
          //   signIndex:25,
          //   sortable:true
          // },
          {
            id: 25,
            label: "劳务合同期限",
            prop: "labor_contract_time",
            width: "180",
            align: "center",
            signIndex:24,
            sortable:true
          },
          // {
          //   id: 28,
          //   label: "合同到期月份",
          //   prop: "d_contract",
          //   width: "150",
          //   align: "center",
          //   signIndex:27,
          //   sortable:true
          // },
          {
            id: 26,
            label: "职称",
            prop: "c_title",
            width: "120",
            align: "center",
            signIndex:25,
            sortable:false
          },
          {
            id: 27,
            label: "具有国家评定的专业技术等级",
            prop: "c_national_title_level",
            width: "260",
            align: "center",
            signIndex:26,
            sortable:true
          },
          {
            id: 28,
            label: "备注",
            prop: "c_da_remark",
            width: "120",
            align: "center",
            signIndex:27,
            sortable:false
          },
          {
            id: 29,
            label: "操作",
            prop: "operation",
            width: "160",
            align: "center",
            signIndex:28,
            sortable:false
          }
        ],
        customSettingSecondList:[
          {
            id: 1,
            label: "姓名",
            prop: "c_name",
            width: "120",
            align: "center",
            signIndex:0,
            sortable:true
          },
          {
            id: 2,
            label: "工号",
            prop: "c_worker_id",
            width: "120",
            align: "center",
            signIndex:1,
            sortable:true
          },
          {
            id: 3,
            label: "部门",
            prop: "department_name",
            width: "130",
            align: "center",
            signIndex:2,
            sortable:false
          },
          {
            id: 4,
            label: "职务",
            prop: "position_name",
            width: "120",
            align: "center",
            signIndex:3,
            sortable:false
          },
          {
            id: 5,
            label: "线路",
            prop: "line_names",
            width: "130",
            align: "center",
            signIndex:4,
            sortable:true
          },
          {
            id: 6,
            label: "车辆",
            prop: "vehicle_names",
            width: "120",
            align: "center",
            signIndex:5,
            sortable:true
          },
          {
            id: 7,
            label: "职级",
            prop: "job_level",
            width: "120",
            align: "center",
            signIndex: 6,
            sortable:false
          },
          {
            id: 8,
            label: "联系方式",
            prop: "c_phone",
            width: "120",
            align: "center",
            signIndex:7,
            sortable:true
          },
          {
            id: 9,
            label: "性别",
            prop: "c_gender",
            width: "120",
            align: "center",
            signIndex: 8,
            sortable:false
          },
          {
            id: 10,
            label: "身份证号",
            prop: "c_idcord",
            width: "150",
            align: "center",
            signIndex: 9,
            sortable:true
          },
           {
            id: 11,
            label: "出生日期",
            prop: "d_birthday",
            width: "150",
            align: "center",
            signIndex:10,
            sortable:true
          },
          {
            id: 12,
            label: "年龄",
            prop: "age",
            width: "80",
            align: "center",
            signIndex:11,
            sortable:true
          },
          {
            id: 13,
            label: "状态",
            prop: "job_state",
            width: "130",
            align: "center",
            signIndex: 12,
            sortable:true
          },
          {
            id: 14,
            label: "用工形式",
            prop: "employee_type_name",
            width: "120",
            align: "center",
            signIndex: 13,
            sortable:false
          },
          {
            id: 15,
            label: "进单位时间",
            prop: "d_join_company",
            width: "150",
            align: "center",
            signIndex: 14,
            sortable:true
          },
          {
            id: 16,
            label: "司龄",
            prop: "join_company_age",
            width: "150",
            align: "center",
            signIndex: 15,
            sortable:true
          },
          {
            id: 17,
            label: "劳务合同期限",
            prop: "labor_contract_time",
            width: "180",
            align: "center",
            signIndex: 16,
            sortable:true
          },
          {
            id: 18,
            label: "政治面貌",
            prop: "c_political",
            width: "135",
            align: "center",
            signIndex: 17,
            sortable:false
          },
          {
            id: 19,
            label: "入党/团时间",
            prop: "d_join_party",
            width: "140",
            align: "center",
            signIndex: 18,
            sortable:true
          },
          {
            id: 20,
            label: "学历",
            prop: "c_top_education",
            width: "160",
            align: "center",
            signIndex: 19,
            sortable:true
          },
          {
            id: 21,
            label: "民族",
            prop: "c_nation",
            width: "160",
            align: "center",
            signIndex: 20,
            sortable:true
          },
          {
            id: 22,
            label: "户籍所在地",
            prop: "c_account_area",
            width: "120",
            align: "center",
            signIndex: 21,
            sortable:false
          },
          // {
          //   id: 7,
          //   label: "驾驶证到期日期",
          //   prop: "d_latest_get_licence",
          //   width: "180",
          //   align: "center",
          //   signIndex:6,
          //   sortable:true
          // },
          {
            id: 23,
            label: "现住地址",
            prop: "c_home_address",
            width: "120",
            align: "center",
            signIndex: 22,
            sortable:false
          },
          {
            id: 24,
            label: "操作",
            prop: "operation",
            width: "160",
            align: "center",
            signIndex: 23,
            sortable:false
          }
        ],
        frontFixedNum:1, //前几行固定
        backFixedNum:1, //后几行固定
        canRendererTableHeader: null,
        canRendererTableHeaderSecond: null,
        customSettingShowList: null,
        titlesId:'', //当前表头的id
        menu_code:'',
        headerLoading: false
      }
    },
    created() {
      this.menu_code = this.$route.meta.code
      this.reqTitleTable()
    },
    mounted() {
      this.$nextTick(() => {
        this.setHead('initialize')
        this.loadDataGeneralStaff();
        this.loadDataDriver();
        window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
          this.setHead()
        })
      })
    },
    methods: {
      updateTableHeader(newestTableHeaderList) {
        this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {
          this.canRendererTableHeaderSecond = null;
          this.customSettingShowList = null;
          this.reqTitleTable()
        }).catch(err => {
          
        })
      },
      // 获取表头
      reqTitleTable() {
        this.headerLoading = true;
        this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingSecondList).then(res => {
          this.titlesId = res.titlesId;
          this.canRendererTableHeaderSecond = res.canRendererTableHeader;
          this.customSettingSecondList = res.customSettingList;
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
      // 导入员工信息Excel
      importStaffInfoExcel(val){
        // alert(JSON.stringify(val))
        let formData = new FormData();
        formData.append("file", val.file);
        formData.append("type", val.radio);
        formData.append("i_is_driver", this.showCollapse == 'first'? 0 : 1);
        let params = formData;
        // console.log(params)
        this.$client.importStaffInfo(params)
        .then(res => {
          if(res.head.result == "200") {
            // this.form = {};
            if(this.showCollapse == 'first') {
              this.firstQueryform = {};
              this.pageInfoFirst.pageIndex = 1;
              this.pageInfoFirst.pageCount = 0;
              this.loadDataGeneralStaff();
            }else{
              this.secondQueryform = {};
              this.pageInfoSecond.pageIndex = 1;
              this.pageInfoSecond.pageCount = 0;
              this.loadDataDriver();
            }
            this.filedialogVisible = false;
            this.$message({ message: res.head.describle, type: "success" });
          }else{
            this.filedialogVisible = false;
            let errorData = [];
            const h = this.$createElement;
            errorData.push(h('p',null,res.head.describle));
            this.$msgbox({
              title: '提示',
              message: h('div',null, errorData),
              confirmButtonText: '确定',
            })

            // this.$message({ message: res.head.describle, type: "error" });
          }
        })
      },
      // 导出Excel普通员工和驾驶员信息
      exportFile(){
        let params = Object.assign({}, this.showCollapse == 'first'? this.firstQueryform : this.secondQueryform);
        params.i_is_driver = this.showCollapse == 'first'? 0 : 1;
        let ids = this.showCollapse == 'first'? [...this.selectedGeneralStaffIds] : [...this.selectedDriverIds];
        if(ids.length) {
          params.ids = ids.toString()
        }
        this.$client.exportStaffInfo(params)
        .then(res => {
          if(res.head.result == '200') {
            window.location.href = res.context
            this.$message({type: 'success', message: '导出成功'})
          }else{
            this.$message({type: 'error', message: '导出失败'})
          }
        })

      },
      // 添加员工信息
      addStaffInfo(){
        this.addStaffDialogShow = true
        this.curChangeType = 'add'
        this.$refs['addStaffDialog'].resetData()
      },
      // 更新表格头部
      // updateTableHeader(newestTableHeaderList) {
      //   if(this.showCollapse == 'first') {
      //     this.canRendererTableHeader = null;
      //     this.canRendererTableHeader = newestTableHeaderList;
      //   }else{
      //     this.canRendererTableHeaderSecond = null;
      //     this.canRendererTableHeaderSecond = newestTableHeaderList;
      //   }
      //   this.$forceUpdate()
      // },
      // 打开自定义表格头部弹窗
      openSettingPageEvent() {
        this.customSettingVialogVisible = true;
      },
      // 表格选中一行 sub-req 上点击编辑时
      editSatff(){
        // let val = this.$refs['table'].curSelectedRowInfo
        // if(val){
        //   this.addStaffDialogShow = true
        //   this.$refs['addStaffDialog'].setData(val)
        // }else{
        //   this.$message({type: 'warning', message: '请先选择一条数据'})
        // }
      },
      // 表格上点击编辑时
      editStaffInfo(val){
        this.addStaffDialogShow = true
        this.curChangeType = 'edit'
        this.$refs['addStaffDialog'].setData(val)
      },
      // 员工详情
      staffRowInfo(val) {
        this.addStaffDialogShow = true
        this.curChangeType = 'detail'
        this.$refs['addStaffDialog'].setData(val)
      },
      //路线分配
      openRouteAllocationPop(staffInfo) {
        this.circuitAllocationDialogShow = true;
        this.$refs.circuitAllocationDialog.ruleForm.c_name = staffInfo.c_name;
        this.$refs.circuitAllocationDialog.ruleForm.department = staffInfo.department;
        this.$refs.circuitAllocationDialog.department_name = staffInfo.department_name;
      },
      // 打开导入文件弹窗
      openfiledialog(){
        this.filedialogVisible = true
      },
      // 分页切换事件
      handleCurrentChange(idx) {
        if(this.showCollapse == 'first') {
          this.pageInfoFirst.pageIndex = idx
          this.loadDataGeneralStaff()
        }else{
          this.pageInfoSecond.pageIndex = idx;
          this.loadDataDriver();
        }
      },
      // 切换每页条数
      handleSizeChange(sizes) {
        if(this.showCollapse == 'first') {
          this.pageInfoFirst.pageIndex = 1;
          this.pageInfoFirst.pageSize = sizes;
          this.pageInfoFirst.pageCount = 0;
          this.loadDataGeneralStaff()
        }else{
          this.pageInfoSecond.pageIndex = 1;
          this.pageInfoSecond.pageSize = sizes;
          this.pageInfoSecond.pageCount = 0;
          this.loadDataDriver();
        }
      },
      // 查询
      onSubmit(form) {
        this.firstQueryform = {};
        this.secondQueryform = {}
        if(this.showCollapse == 'first') {
          this.firstQueryform = form;
          this.pageInfoFirst.pageIndex = 1;
          this.pageInfoFirst.pageCount = 0;
          this.loadDataGeneralStaff();
        }else{
          this.secondQueryform = form;
          this.pageInfoSecond.pageIndex = 1;
          this.pageInfoSecond.pageCount = 0;
          this.loadDataDriver();
        }
      },
      // 加载普通员工
      loadDataGeneralStaff() {
        this.loading = true
        let params = {};
        if(this.showCollapse == 'first') {
          params = Object.assign({},this.firstQueryform);
        }
        params.page_index = this.pageInfoFirst.pageIndex;
        params.page_size = this.pageInfoFirst.pageSize;
        params.i_is_driver = 0;
        this.$client.getEmployeeManageList(params)
          .then(res => {
            if (res.head.result == "200") {
              this.generalStaffData = res.context.list;
              this.pageInfoFirst.pageCount = res.context.total
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            };
            this.loading = false;
          })
      },
      // 加载驾驶员列表
      loadDataDriver() {
        this.loadingSecond = true
        let params = {};
        if(this.showCollapse == 'second') {
          params = Object.assign({},this.secondQueryform);
        }
        params.page_index = this.pageInfoSecond.pageIndex;
        params.page_size = this.pageInfoSecond.pageSize;
        params.i_is_driver = 1;
        this.$client.getEmployeeManageList(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loadingSecond = false;
            this.driverData = res.context.list;
            this.pageInfoSecond.pageCount = res.context.total
          } else {
            this.loadingSecond = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
      },
      // 确定离职
      tableDel(id) {
        let parmas = {
          context: [id],
        };
        this.$client.sureMployeeDimission(parmas)
        .then(res => {
          if(res.head.result == '200') {
            if(this.showCollapse == 'first') {
              this.loadDataGeneralStaff();
            }else{
              this.loadDataDriver();
            }
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
      // 编辑、保存 员工、驾驶员信息
      sureSaveStaffInfo(context){
        context.i_is_driver = this.showCollapse == 'first'? 0 : 1;
        let params = {
          context: context
        };
        this.$client.addMployeeInfo(params)
        .then(res => {
          if(res.head.result == '200') {
            // this.form = {};
            if(this.showCollapse == 'first') {
              if(this.curChangeType == 'add') {
                this.firstQueryform = {};
                this.pageInfoFirst.pageCount = 0;
                this.pageInfoFirst.pageIndex = 1;
              }
              this.loadDataGeneralStaff();
            }else{
              if(this.curChangeType == 'add') {
                this.secondQueryform = {};
                this.pageInfoSecond.pageCount = 0;
                this.pageInfoSecond.pageIndex = 1;
              }
              this.loadDataDriver();
            };
            this.addStaffDialogShow = false;
            this.$message({
              showClose: true,
              type: 'success',
              message: '保存成功'
            })
          }else{
            this.$message({
              showClose: true,
              type: "error",
              message: res.head.describle
            })
          }
        })
      },
      // 打开已离职人员列表
      openLeaveOfficeUser() {
        this.leaveStaffDialogShow = true;
      },
      // 选中普通员工ID
      selectedGeneralStaffList(list) {
        this.selectedGeneralStaffIds = [];
        if(list && list.length > 0) {
          list.forEach((item,index) => {
            this.selectedGeneralStaffIds.push(item.i_id)
          });
        }
      },
      // 选中驾驶员ID
      selectedDriverList(list) {
        this.selectedDriverIds = [];
        if(list && list.length > 0) {
          list.forEach((item,index) => {
            this.selectedDriverIds.push(item.i_id)
          });
        }
      },
      // 计算表格高度
      setHead(type) {
        if(type == 'initialize') {
          this.canRendererTableHeader = this.customSettingFirstList;
          this.canRendererTableHeaderSecond = this.customSettingSecondList;
        }
        setTimeout(() => {
          let maxh = this.$el.offsetHeight
          let th = this.$refs.head.$el.offsetHeight
          // let staffOverviewInfo = this.$refs.staffOverviewInfo.$el.offsetHeight;
          // let elRadioGroup = this.$refs.elRadioGroup.$el.offsetHeight;
          let paginationH = this.$refs.paginationH.$el.offsetHeight;
          this.TableHeight = maxh - th - paginationH - 100;
          console.log(this.TableHeight)
        }, 60)
      }
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .driver-management
    width 100%
    height 100%
</style>
