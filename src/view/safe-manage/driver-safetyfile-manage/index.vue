<template>
  <div class="driver-management">
    <driver-management-data-center
      ref="driver"
      @detail-show="detailShow"
      @on-select="selectVehicle"
    >
      <template slot="事故信息">
        <accident-info ref="accidentInfo" :info="vehicleInfo" :key="key"></accident-info>
      </template>
      <template slot="违法信息">
        <violation-information
          ref="violationInformation"
          :info="vehicleInfo"
          :key="key"
        ></violation-information>
      </template>
      <template slot="违规信息">
        <illegal-info ref="illegalInfo" :info="vehicleInfo" :key="key"></illegal-info>
      </template>
      <template slot="好人好事">
        <good-deed ref="goodDeed" :info="vehicleInfo" :key="key"></good-deed>
      </template>
      <template slot="安全培训">
        <safety-training ref="safetyTraining" :info="vehicleInfo" :key="key"></safety-training>
      </template>
      <template slot="安全里程">
        <safety-distance ref="safetyDistance" :info="vehicleInfo" :key="key"></safety-distance>
      </template>
      <template slot="调动记录">
        <transfer-record ref="transferRecord" :info="vehicleInfo" :key="key"></transfer-record>
      </template>
    </driver-management-data-center>
  </div>
</template>
<script type="text/ecmascript-6">
import accidentInfo from './data-center-component/accident-info';
import violationInformation  from './data-center-component/violation-information';
import illegalInfo  from './data-center-component/illegal-info';
import goodDeed  from './data-center-component/good-deed';
import safetyTraining  from './data-center-component/safety-training';
import safetyDistance  from './data-center-component/safety-distance';
import transferRecord  from './data-center-component/transfer-record';
  export default {
    name: "driver-management",
    components: {
      accidentInfo,
      violationInformation,
      illegalInfo,
      goodDeed,
      safetyTraining,
      safetyDistance,
      transferRecord
    },
    data() {
      return {
        vehicleInfo: null,
        key: null,
      };
    },
    methods: {
      detailShow(info) {
        this.vehicleInfo = info
        this.key = new Date().getTime()
      },
      // 列表多选
      selectVehicle(rows) {
        // this.selectIDs = []
        // rows.forEach(item => {
        //   this.selectIDs.push(item.id)
        // })
      },
    }
  }
</script>
<style lang="scss" scoped>
.driver-management {
  width: 100%;
  height: 100%;
}
</style>
<!--
<template>
  <div class="driver-safetyfile-manage-box">
    <div class="driver-safetyfile-manage">
      <el-card class="box-card left-box">
        <div v-if="!!dirverSlimInfo">
          <h4 style="text-align: center; margin-bottom: 25px; ">考勤照片</h4>
          <div class="driver-image show-flex-box-r show-flex-center">
            <el-image
              style="height: 240px; width: 180px; background: #3333332e;"
              :src="dirverSlimInfo.c_photo"
              fit="'contain'"
              v-if="!!dirverSlimInfo.c_photo"
              :preview-src-list="[dirverSlimInfo.c_photo]">
              <div slot="error" class="image-slot" style="height: 240px; width: 180px;text-align: center; line-height: 240px;">
                暂无图片
              </div>
              </el-image>
              <span style="height: 240px; width: 180px; background: #3333332e;text-align: center; line-height: 240px;" v-else>
                  暂无图片
              </span>
          </div>
          <div class="show-flex-box-r show-flex-center" style="margin: 20px 0">
            <el-button type="primary" size="mini" @click="uploadFile" v-if="$isPowerShow('upload_pic')">上传</el-button>
            <el-button type="danger" size="mini" @click="deleteDriverImage" v-if="$isPowerShow('del_pic')">删除</el-button>
          </div>
          <ul class="show-flex-box-c show-flex-center">
            <li class="show-flex-box-r" style="width: 180px; margin-bottom: 15px;">
              <span style="white-space: nowrap;">姓名：{{dirverSlimInfo.c_name}}</span>
              <div class="show-flex-box-r show-flex-center" style="margin-left: 10px;white-space: nowrap;">
                <i style="width: 7px; height: 7px; border-radius: 100%; background: #95F204;margin-right: 5px" :style="`background:${!dirverSlimInfo.i_emp_state? '#606266': dirverSlimInfo.i_emp_state == 2?'#E6A23C':dirverSlimInfo.i_emp_state == 3?'#000000':''}`"></i>
                <span style="color:#0000006d; font-size: 12px;">{{dirverSlimInfo.emp_state}}</span>
              </div>
            </li>
            <li class="show-flex-box-r" style="width: 180px; margin-bottom: 15px;">
              <span>工号：{{dirverSlimInfo.c_worker_id}}</span>
            </li>
            <li class="show-flex-box-r" style="width: 180px; margin-bottom: 15px;">
              <span>年龄：{{dirverSlimInfo.age}}</span>
            </li>
            <li class="show-flex-box-r" style="width: 180px; margin-bottom: 15px;">
              <span>驾龄：{{dirverSlimInfo.driving_year}}年</span>
            </li>
            <li class="show-flex-box-r" style="width: 180px; margin-bottom: 15px;">
              <span>工龄：{{dirverSlimInfo.work_year}}年</span>
            </li>
            <li class="show-flex-box-r" style="width: 180px; margin-bottom: 15px;">
              <span>星级：</span>
              <el-rate v-model="dirverSlimInfo.i_star" :max="dirverSlimInfo.i_star" :disabled="true" :colors="['#F56C6C','#F56C6C','#F56C6C']" v-if="dirverSlimInfo.i_star"></el-rate>
              <span v-else>无</span>
            </li>
            <li class="show-flex-box-r" style="width: 180px; margin-bottom: 15px;">
              <span>持续: {{dirverSlimInfo.i_keep? dirverSlimInfo.i_keep : 0}}个季度</span>
            </li>
          </ul>
        </div>
        <div v-else>
          <el-empty description="请选择右侧驾驶员"></el-empty>
        </div>

      </el-card>
      <el-card class="box-card center-box" ref="centerBox">
        <div class="department-detail show-flex-box-c">
          <sub-req
            ref="head"
            @on-export="exportExcel"
            @on-import="openImportPop"
            @on-ok="onSubmit"
            @on-add ="openAddPop"
            @open-setting-Page="openSettingPageEvent"
          ></sub-req>
          <div>
            <tr-table
              ref="trTable"
              :selectionShow="true"
              :data="data"
              :tableHeaderList="canRendererTableHeader"
              :isShowBottomOptions="false"
              :TableHeight="TableHeight"
              :loading="loading ||　headerLoading"
              :frontFixedNum="frontFixedNum"
              :backFixedNum="backFixedNum"
              @on-select-row="onSelectRow"
              @on-select-change-row="selectedList"
            >
              <template slot-scope="scope" slot="i_star">
                <el-rate v-model="scope.data.i_star" :max="scope.data.i_star" :disabled="true" :colors="['#F56C6C','#F56C6C','#F56C6C']" v-if="scope.data.i_star"></el-rate>
                <span v-else>无</span>
              </template>
              <template slot-scope="scope" slot="operation">
                <el-button type="primary" size="mini" style="margin-left: 10px;" @click="editRowInfo(scope.data,'edit')" v-if="$isPowerShow('edit')">编辑</el-button>
                <el-button type="primary" size="mini" style="margin-left: 10px;" @click="editRowInfo(scope.data,'detail')">查看</el-button>
                <el-button type="primary" size="mini" style="margin-left: 10px;" v-if="$isPowerShow('transfer')" @click="openTransferDriverPop(scope.data)">调动</el-button>
              </template>
            </tr-table>
          </div>
          <el-pagination
            style="margin: 5px 0;display:flex; justify-content: flex-end;"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            ref="paginationH"
            :current-page="pageInfo.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            :page-size="pageInfo.pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="pageInfo.pageCount"
          >
          </el-pagination>
        </div>
      </el-card>
    </div>
    <div class="organization-project-dialog">
      <set-info-dialog
        ref="setOrganizationInfo"
        :dialogBool.sync="isShowSetInfoDialog"
        :curSelecedType="curSelecedType"
        @sure-save-info="saveAddEdit"
      ></set-info-dialog>
      <custom-setting
        :dialogBool.sync="customSettingVialogVisible"
        :customSettingList="customSettingList"
        :canRendererTableHeader="canRendererTableHeader"
        :customSettingShowList="customSettingShowList"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
      ></custom-setting>
      <file-dialog
        :dialogBool.sync="filedialogVisible"
        :fileData="FileData"
        :typeMessage="'相同档案编号驾驶员'"
        @on-submit-excel="onSubmitExcel"
      ></file-dialog>
      <transfer-dirver-dialog
        ref="transferDirverDialog"
        :dialogBool.sync="isShowTransferDirverDialog"
        @sure-transfer-dirver="sureTransferDirver"
      ></transfer-dirver-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import setInfoDialog from "./component/info-dialog"
import fileDialog from "@/components/fileDialog/file-dialog.vue";
import transferDirverDialog from "./component/transfer-dirver-dialog"

export default {
  name: "driver-safetyfile-manage",
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      filedialogVisible: false,
      FileData: {
        url: window.newHttpConfig.URL_EASYMOCK +  "/Files/TempFiles/驾驶员安全档案模板.xlsx",
      },
      curSelecedType: 'add', //添加
      customSettingVialogVisible: false,
      isShowSetInfoDialog: false,
      data:[], //列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      customSettingList: [
        {
          id: 1,
          label: "姓名",
          prop: "c_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "工号",
          prop: "c_worker_id",
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
          label: "性别",
          prop: "c_gender",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "出生日期",
          prop: "d_birthday",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "身份证号",
          prop: "c_idcord",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "联系方式",
          prop: "c_phone",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "档案编号",
          prop: "c_da_code",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "进单位时间",
          prop: "d_join_company",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "驾驶证类型",
          prop: "c_licence_grade",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
        {
          id: 11,
          label: "驾驶证号",
          prop: "c_driving_licence",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
        {
          id: 12,
          label: "驾驶证日期",
          prop: "d_first_get_licence",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: true,
        },
        {
          id: 13,
          label: "驾驶证到期日期",
          prop: "d_latest_get_licence",
          width: "160",
          align: "center",
          signIndex: 12,
          sortable: true,
        },
        {
          id: 14,
          label: "发证机构",
          prop: "c_certificate",
          width: "160",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "从业资格证号",
          prop: "c_qualification_code",
          width: "150",
          align: "center",
          signIndex: 14,
          sortable: true,
        },
        {
          id: 16,
          label: "从业资格证日期",
          prop: "d_qualification",
          width: "160",
          align: "center",
          signIndex: 15,
          sortable: true,
        },
        {
          id: 17,
          label: "从业资格证到期日期",
          prop: "d_qualification_end",
          width: "190",
          align: "center",
          signIndex: 16,
          sortable: true,
        },
        {
          id: 18,
          label: "劳动合同日期",
          prop: "d_labor_contract_begin",
          width: "160",
          align: "center",
          signIndex: 17,
          sortable: true,
        },
        {
          id: 19,
          label: "劳动合同到期日期",
          prop: "d_labor_contract_begin",
          width: "180",
          align: "center",
          signIndex: 18,
          sortable: true,
        },
        {
          id: 20,
          label: "安全责任书日期",
          prop: "d_safe_duty_start",
          width: "160",
          align: "center",
          signIndex: 19,
          sortable: true,
        },
        {
          id: 21,
          label: "安全责任书到期日期",
          prop: "d_safe_duty_end",
          width: "190",
          align: "center",
          signIndex: 20,
          sortable: true,
        },
        {
          id: 22,
          label: "用工形式",
          prop: "c_employee_type",
          width: "160",
          align: "center",
          signIndex: 21,
          sortable: false,
        },
        {
          id: 23,
          label: "累积安全里程",
          prop: "safe_total_mile",
          width: "150",
          align: "center",
          signIndex: 22,
          sortable: true,
        },
        {
          id: 24,
          label: "离职日期",
          prop: "dimission_date",
          width: "130",
          align: "center",
          signIndex: 23,
          sortable: true,
        },
        {
          id: 25,
          label: "当前星级",
          prop: "i_star",
          width: "130",
          align: "center",
          signIndex: 24,
          sortable: true,
        },
        {
          id: 26,
          label: "持续季度",
          prop: "i_keep",
          width: "160",
          align: "center",
          signIndex: 25,
          sortable: true,
        },
        {
          id: 27,
          label: "住址",
          prop: "c_home_address",
          width: "130",
          align: "center",
          signIndex: 26,
          sortable: false,
        },
        {
          id: 28,
          label: "操作",
          prop: "operation",
          width: "260",
          align: "center",
          signIndex: 27,
          sortable: false,
        },
      ],
      canRendererTableHeader: null,
      customSettingShowList: null,
      loading: false,
      TableHeight: 500,
      form: {}, //查询表单数据
      selectedIds:[], //勾选的ID
      url: '',
      driverId: '', //驾驶员ID
      dirverSlimInfo: null,
      isShowTransferDirverDialog: false,
      titlesId:'', //当前表头的id
      menu_code:'',
      headerLoading: false
    };
  },
  components: {
    subReq,
    setInfoDialog,
    fileDialog,
    transferDirverDialog
  },
  created() {
    this.menu_code = this.$route.meta.code
    this.reqTitleTable()
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
        window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
          this.setHead()
        })
    })
  },
  methods: {
    // 计算高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH - 55;
      }, 60);
    },
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
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    // 打开导入弹窗
    openImportPop() {
      this.filedialogVisible = true;
    },
    // 导入
    onSubmitExcel(exportInfo) {
      let formData = new FormData();
      formData.append("file", exportInfo.file);
      formData.append("type", exportInfo.radio);
      let params = formData;
      this.$client.ImportDriverSafeArchives(params)
      .then(res => {
        if(res.head.result == "200") {
          this.form = {};
          this.pageInfo.pageIndex = 1;
          this.pageInfo.pageCount = 0;
          this.loadData();
          this.filedialogVisible = false;
          this.$message({ message: res.head.describle, type: "success" });
        }else if(res.head.result == "205") {
          this.filedialogVisible = false;
          if(!!res.context && res.context.length > 0) {
            let errorData = [];
            let list = [];
            if(res.context.length > 20) {
              list = res.context.slice(0, 20);
            }else{
              list = res.context
            }
            let h = this.$createElement;
            list.forEach(element => {
              errorData.push(h('p',null,element));
            });
            this.$msgbox({
              title: `导入错误提示(共${list.length}条)`,
              message: h('div',null, errorData),
              confirmButtonText: '确定',
            })
          }
        } else{
          this.filedialogVisible = false;
          // let errorData = [];
          // const h = this.$createElement;
          // errorData.push(h('p',null,res.head.describle));
          // this.$msgbox({
          //   title: '提示',
          //   message: h('div',null, errorData),
          //   confirmButtonText: '确定',
          // })

          this.$message({ message: res.head.describle, type: "error" });
        }
      })
    },
    // 查询
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData()
    },
    // 加载列表数据
    loadData() {
      this.loading = true
      let params = {};
      params = Object.assign({},this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.getListDriverSafeArchives(params)
      .then(res => {
        if (res.head.result == "200") {
          this.data = res.context.list;
          this.pageInfo.pageCount = res.context.total
          if(this.data && this.data.length > 0) {
            this.driverId = this.data[0].i_id
            this.reqDriverSafeArchives()
            // 设置第一行高亮
            this.$refs.trTable.$refs.table.setCurrentRow(this.data[0])
          }
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
    openAddPop() {
      this.curSelecedType = 'add';
      this.isShowSetInfoDialog = true;
    },
    // 编辑
    editRowInfo(info,type) {
      this.curSelecedType = type;
      if(!!info) {
        this.$refs.setOrganizationInfo.setData(info)
      }
      this.isShowSetInfoDialog = true;
    },
    // 添加、编辑
    saveAddEdit(form) {
      let successrMessage = '';
      let params = {
        context: form
      }
      if(this.curSelecedType == 'add') {
        successrMessage = '添加成功'
        delete form.i_id
        this.$client.AddDriverInfoDriverSafeArchives(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.isShowSetInfoDialog = false;
            this.$message({
              showClose: true,
              message: successrMessage,
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
      }
      if(this.curSelecedType == 'edit') {
        successrMessage = '编辑成功'
        this.$client.editDriverInfoDriverSafeArchives(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.isShowSetInfoDialog = false;
            this.$message({
              showClose: true,
              message: successrMessage,
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {});
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
      this.loadData();
    },
    // 当前选中的驾驶员
    onSelectRow(row) {
      if(!!row.i_id) {
        // 获取驾驶员简讯
        this.driverId = row.i_id;
        this.reqDriverSafeArchives()
      }
    },
    // 获取驾驶员简讯
    reqDriverSafeArchives() {
      let params = {
        id: this.driverId
      }
      this.$client.getDirverSlimDriverSafeArchives(params).then(res=> {
        if(res.head.result == '200') {
          this.dirverSlimInfo = res.context
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 导出Excel
    exportExcel(){
      let params = Object.assign({}, this.form);
      let ids = [ ...this.selectedIds ]
      if(ids.length) {
        params.ids = ids
      }
      this.$client.exportDriverSafeArchives(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })

    },
    // 自定义上传文件方法
    // :http-request="uploadFile"
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        console.log(input.files);
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        reader.onload = (ev) => {
          input = undefined;
        };
        let formData = new FormData();
        formData.append("file", file);
        let params = {
          file: formData,
        };
        this.$client.uploadPicture(params, '/api/ERPWeb/EmployeeManage/UploadPicture')
        .then(res => {
          if(res.head.result == '200') {
            // this.dirverSlimInfo.c_photo = res.context;
            // this.$message({
            //   showClose: true,
            //   message: "上传成功",
            //   type: "success"
            // });
            // 保存司机考勤照片
            this.saveDirverImage(res.context)
          }else{
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })

      };
      input.click();
    },
    // 保存司机考勤照片
    saveDirverImage(c_photo) {
      let params =  {
        context:{
          i_id: this.driverId,
          c_photo: c_photo
        }
      }
      this.$client.UploadDriverImgdriverSafeArchives(params).then(res => {
        if(res.head.result == '200') {
          this.dirverSlimInfo.c_photo = c_photo;
          this.$message({
            showClose: true,
            message: '上传成功',
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
    },
    // 删除司机图片
    deleteDriverImage() {
      let params = {
        id: this.driverId,
      }
      this.$client.deleteDriverImgDriverSafeArchives(params).then(res => {
        if(res.head.result == '200') {
          this.dirverSlimInfo.c_photo = '';
          this.$message({
            showClose: true,
            message: '删除成功',
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
    },
    // 打开驾驶员调动弹窗
    openTransferDriverPop(row) {
      this.$refs.transferDirverDialog.form.user_id = row.i_id
      this.$refs.transferDirverDialog.form.ex_driver_name = row.c_name
      this.$refs.transferDirverDialog.form.old_dept_id = row.i_department_base
      this.isShowTransferDirverDialog = true
    },
    //确定调动驾驶员 
    sureTransferDirver(form) {
      let params = {
        context: form
      }
      this.$client
        .AddOrEditDriverSafeArchives(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.isShowTransferDirverDialog = false;
            this.$message({
              showClose: true,
              message: '调动成功',
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    // 勾选中的
    selectedList(list) {
      this.selectedIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedIds.push(item.i_id)
        });
      }
    },

  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.driver-safetyfile-manage-box{
  width: 100%;
  height: 100%;
}
.driver-safetyfile-manage {
  width: 100%;
  height: 100%;
  display: flex;

  .box-card {
    height: 100%;
    overflow: auto;
  }

  .left-box {
    flex: 0 0 15vw;
    margin: 0 5px 0 0;
    width: 15vw;
    height: 100%;
    background: #f9f9f9;
  }

  .center-box {
    flex: 1;
    height: 100%;
  }
}
.department-detail {

}
.department-detail /deep/ .el-input{
  // width: 250px;
}

.driver-safetyfile-manage /deep/ .el-card__header {
  background-color: #F5F5F5;
  padding: 12px 20px;
}

.superior-department-content {
  margin-bottom: 30px;
}
</style>
-->
