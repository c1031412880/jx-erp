<template>
  <div class="vehicle-yearly-inspection">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-batch-set="onBatchSetShow"
      @on-export="exportExcel"
      @on-patch="onBatchShow"
    ></sub-req>
    <tr-table
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading || headerLoading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectChange"
    >
      <template slot-scope="scope" slot="operation">
        <el-button
          v-if="scope.data.check_state != 1 && $isPowerShow('submit')"
          type="primary"
          size="mini"
          @click="submitExamineShow(scope.data)"
        >
          提交
        </el-button>
        <el-button
          v-if="scope.data.check_state == 1"
          type="primary"
          size="mini"
          @click="examineDialogShow(scope.data)"
        >
          年检详情
        </el-button>
        <el-button type="primary" size="mini" @click="historyRecordDialogShow(scope.data)">
          年检历史记录
        </el-button>
      </template>
      <template slot-scope="scope" slot="check_state">
        <span>
          {{
            scope.data.check_state == 0
              ? '无状态'
              : scope.data.check_state == 1
              ? '已年检'
              : scope.data.check_state == 2
              ? '未年检'
              : scope.data.check_state == 3
              ? '已超期'
              : '无状态'
          }}
        </span>
      </template>
      <!--      <template slot-scope="scope" slot="abort_state">-->
      <!--        <span>-->
      <!--          {{scope.data.abort_state == 0 ? '已超期' : `剩余${scope.data.abort_state}天`}}-->
      <!--        </span>-->
      <!--      </template>-->
      <template slot-scope="scope" slot="check_cycle">
        <span>
          {{ scope.data.check_cycle == 0 ? '半年一次' : `${scope.data.check_cycle}年一次` }}
        </span>
      </template>
      <template slot-scope="scope" slot="lp_num">
        <el-link type="primary" @click="jumpVehicleManage(scope.data.lp_num)">
          {{ scope.data.lp_num }}
        </el-link>
      </template>
    </tr-table>

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

    <!--    提交审核-->
    <submit-examine-dialog
      :dialogBool.sync="submitExamineDialog"
      ref="submitExamineDialog"
      @on-ok="submitExamineOk"
    ></submit-examine-dialog>
    <!--    审核-->
    <examine-dialog
      :dialogBool.sync="examineDialog"
      ref="examineDialog"
      @on-ok="examineDialogOk"
    ></examine-dialog>
    <!-- 年检历史记录   -->
    <history-record-dialog
      :dialogBool.sync="historyRecordDialog"
      ref="historyRecordDialog"
    ></history-record-dialog>
    <batch-set-dialog
      :dialogBool.sync="batchSetDialog"
      ref="batchSetDialog"
      @on-ok="batchSetDialogOk"
    ></batch-set-dialog>

    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :isParentUse="isParentUse"
      @update-table-header="updateTableHeader"
    ></custom-setting>

    <drawer-dialog :drawer.sync="drawerdialogVisible" @on-ok="onSubmit"></drawer-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import drawerDialog from "./component/drawer-dialog";

import submitExamineDialog from './component/submit-examine-dialog'
import examineDialog from './component/examine-dialog'
import historyRecordDialog from './component/history-record-dialog'
import batchSetDialog from './component/batch-set-dialog'
export default {
  name: "vehicle-yearly-inspection",
  components: {
    subReq,
    drawerDialog,
    submitExamineDialog,
    examineDialog,
    historyRecordDialog,
    batchSetDialog
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      selectList: [],
      submitExamineDialog: false,
      examineDialog: false,
      historyRecordDialog: false,
      batchSetDialog:false,
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      customSettingVialogVisible: false,
      drawerdialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "自编号",
          prop: "v_num",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "lp_num",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "分公司",
          prop: "group",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "发动机号",
          prop: "engin_num",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "登记证书日期",
          prop: "reg_date",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "上次年检日期",
          prop: "last_check_date",
          width: "160",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "车检周期",
          prop: "check_cycle",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "本次年检截止日期",
          prop: "check_endate",
          width: "180",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "距离年检时间",
          prop: "abort_state",
          width: "150",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "车龄",
          prop: "vheicle_age",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
        {
          id: 11,
          label: "车辆型号",
          prop: "name",
          width: "160",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "本次年检日期",
          prop: "current_date",
          width: "160",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "车检状态",
          prop: "check_state",
          width: "150",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "提交人",
          prop: "submit_person",
          width: "150",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        // {
        //   id: 15,
        //   label: "提交审核时间",
        //   prop: "submit_date",
        //   width: "150",
        //   align: "center",
        //   signIndex: 14,
        //   sortable: false,
        // },
        {
          id: 15,
          label: "备注",
          prop: "submit_remark",
          width: "150",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        // {
        //   id: 17,
        //   label: "审核人",
        //   prop: "check_person",
        //   width: "150",
        //   align: "center",
        //   signIndex: 16,
        //   sortable: false,
        // },
        // {
        //   id: 18,
        //   label: "审核时间",
        //   prop: "check_date",
        //   width: "150",
        //   align: "center",
        //   signIndex: 17,
        //   sortable: false,
        // },
        // {
        //   id: 19,
        //   label: "审核备注",
        //   prop: "check_remark",
        //   width: "150",
        //   align: "center",
        //   signIndex: 18,
        //   sortable: false,
        // },
        {
          id: 16,
          label: "操作",
          prop: "operation",
          width: "260",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      titlesId:'', //当前表头的id
      menu_code:'',
      isParentUse: false,
      headerLoading: false
    };
  },
  created() {
    this.menu_code = this.$route.meta.code
    this.reqTitleTable()
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize')
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
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
    // 选中行赋值
    selectChange(list) {
      this.selectList = list
    },
    // 跳转到车辆信息管理
    jumpVehicleManage(lp_num) {
       this.$router.push({
        name:'vehinfo-manage',
        params:{
          numberId: lp_num
        }
      })
    },
    // 提交审核初始化
    submitExamineShow(item) {
      console.log(item)
      this.$refs.submitExamineDialog.form.id = item.id
      this.$refs.submitExamineDialog.form.checkers = item.checker_id
      this.$refs.submitExamineDialog.form.v_num = item.v_num
      this.$refs.submitExamineDialog.form.lp_num = item.lp_num
      this.$refs.submitExamineDialog.form.last_check_date = item.last_check_date
      this.$refs.submitExamineDialog.form.check_person = item.check_person
      this.submitExamineDialog = true
    },
    // 提交审核表单提交
    submitExamineOk(form) {
      this.$client.SubmitVoucherCheckPlan({context: form}).then(req => {
        this.submitExamineDialog = false
        this.loadData()
        if (req.head.result === "200") {
          this.$message.success(req.head.describle);
        } else {
          this.$message.error(req.head.describle);
        }
      })
    },
    // 审核初始化
    examineDialogShow(item) {
      this.examineDialog = true
      this.$refs.examineDialog.vehicle_list = [item]
      this.$refs.examineDialog.form.main_id = item.id
      this.$refs.examineDialog.check_endate = item.check_endate
      this.$refs.examineDialog.current_date = item.current_date
      this.$refs.examineDialog.images = item.image_urls.split(',')
      //checkers
      this.$refs.examineDialog.checkers = item.checkers
      console.log(item)
    },
    // 审核提交
    examineDialogOk(form) {
      this.$client.checkRecord(form).then(req => {
        this.examineDialog = false
        this.loadData()
        if (req.head.result === "200") {
          this.$message.success(req.head.describle);
        } else {
          this.$message.error(req.head.describle);
        }
      })
    },
    // 年检历史记录初始化
    historyRecordDialogShow(item) {
      console.log(item)
      this.$refs.historyRecordDialog.vehicle_id = item.vehicle_id
      this.$refs.historyRecordDialog.vehicle_name = item.lp_num
      this.$refs.historyRecordDialog.loadData()
      this.historyRecordDialog = true
    },
    // 批量年检初始化
    onBatchSetShow() {
      if(!this.selectList.length) {
        this.$message.warning('请选择需要批量操作的车辆');
        return false
      }
      let ids = []
      this.selectList.forEach(item => {
        ids.push(item.id)
      })
      this.$refs.batchSetDialog.form.ids = ids.toString()
      this.$refs.batchSetDialog.veh_count = ids.length
      this.batchSetDialog = true
    },
    // 生成年检计划
    onBatchShow() {
      this.$client.MakePlanTestCheckPlan().then(req => {
        this.loadData()
        if (req.head.result === "200") {
          this.$message.success(req.head.describle);
        } else {
          this.$message.error(req.head.describle);
        }
      })
    },
    // 批量年检提交
    batchSetDialogOk(form) {
      this.$client.submitMangCheck(form).then(req => {
        this.batchSetDialog = false
        this.loadData()
        if (req.head.result === "200") {
          this.$message.success(req.head.describle);
        } else {
          this.$message.error(req.head.describle);
        }
      })
    },

    onSubmit(form) {
      this.form = form;
      Object.assign(this.form, form)
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let content = this.form;
      content.page_index = this.pageInfo.pageIndex;
      content.page_size = this.pageInfo.pageSize;
      this.$client.getCheckPlan(content).then(req => {
        console.log(req);
        this.loading = false;
        if (req.head.result === "200") {
          this.data = req.context.list;
          this.pageInfo.pageCount = req.context.total;
        } else {
          this.data = [];
          this.pageInfo.pageCount = 0;
        }
      }).catch()
    },
    // 打开高级筛选
    openAdvancedFilterPage() {
      this.drawerdialogVisible = true
    },
    // 打开自定义表头
    openSettingPageEvent() {
      this.customSettingVialogVisible = true
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

    exportExcel() {
      let params = Object.assign({}, this.form);
      let ids = []
      this.selectList.forEach(item => {
        ids.push(item.id)
      })
      if (ids.length) {
        params.ids = ids
      }
      this.$client.ExportCheckPlan(params).then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.vehicle-yearly-inspection {
  width: 100%;
  height: 100%;
}
</style>
