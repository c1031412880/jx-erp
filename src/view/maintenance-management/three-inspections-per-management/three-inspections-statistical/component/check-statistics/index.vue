<template>
  <div class="check-statistics">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-export="exportInfo"
      @on-setting="onSetting">
    </sub-req>
    <tr-table
      :data="data"
      :tableHeaderList="customSettingList"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :rowspanObj="rowspanObj"
      :mergekeys="mergekeys"
      :spanMethodType="['column']"
    >
      <template slot-scope="scope" slot="is_dispatch">
        {{ scope.data.is_dispatch ? '是' : '否' }}
      </template>
      <template slot-scope="scope" slot="handle_result">
        {{ scope.data.handle_result == 0 ? '' : scope.data.handle_result == 1 ? '继续行驶' : '停驶' }}
      </template>
      <template slot-scope="scope" slot="handle_state">
        {{ !scope.data.handle_state ? '' : scope.data.handle_state == 1 ? '待处理' : '已完成'}}
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" v-if="scope.data.handle_state == 1 && $isPowerShow('handle')" size="mini" @click="editRowInfo(scope.data)">处理</el-button>
        <el-button type="text" size="mini" @click="getDetails(scope.data)">详情</el-button>
      </template>
    </tr-table>

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

    <handle-dialog
      ref="handleDialog"
      :dialogBool.sync="handleDialogShow"
      @save-add="updateHandle"
    ></handle-dialog>

    <detail-dialog
      ref="detailDialog"
      :dialogBool.sync="detailDialogShow"
    ></detail-dialog>

    <setting-duty-type
      ref="settingDutyDialog"
      :dialogBool.sync="settingDutyShow"
      :vehicleTree="vehicleTree"
      :userTree="userTree"
    ></setting-duty-type>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import handleDialog from './component/handle-dialog'
import detailDialog from './component/detail-dialog'
import settingDutyType from './component/setting-duty-type'
export default {
  name: 'check-statistics',
  components: {
    subReq,
    handleDialog,
    settingDutyType,
    detailDialog
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 0, //前几行固定
      backFixedNum: 1, //后几行固定

      customSettingList: [
        {
          id: 1,
          label: "检查日期",
          prop: "check_date",
          width: "130",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "自编号",
          prop: "vehicle_code",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "车牌号",
          prop: "vehicle_name",
          width: "130",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "线路",
          prop: "line_name",
          width: "130",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "是否排版车辆",
          prop: "is_dispatch",
          width: "130",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "检查人",
          prop: "report_count",
          width: "130",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "检查类型",
          prop: "check_type",
          width: "130",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "风险等级",
          prop: "risk_level",
          width: "130",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "检查结果",
          prop: "check_result",
          width: "130",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "正常",
          prop: "normal",
          width: "130",
          align: "center",
          signIndex: 9,
        },
        {
          id: 11,
          label: "异常",
          prop: "unnormal",
          width: "130",
          align: "center",
          signIndex: 10,
        },
        {
          id: 12,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 11,
        },
        {
          id: 13,
          label: "检查时间",
          prop: "check_time",
          width: "130",
          align: "center",
          signIndex: 12,
        },
        {
          id: 14,
          label: "检查地点",
          prop: "check_address",
          width: "130",
          align: "center",
          signIndex: 13,
        },
        {
          id: 15,
          label: "处理结果",
          prop: "handle_result",
          width: "130",
          align: "center",
          signIndex: 14,
        },
        {
          id: 16,
          label: "处理备注",
          prop: "handle_remark",
          width: "130",
          align: "center",
          signIndex: 15,
        },
        {
          id: 17,
          label: "处理人",
          prop: "handle_user",
          width: "130",
          align: "center",
          signIndex: 16,
        },
        {
          id: 18,
          label: "处理时间",
          prop: "handle_time",
          width: "130",
          align: "center",
          signIndex: 17,
        },
        {
          id: 19,
          label: "处理状态",
          prop: "handle_state",
          width: "130",
          align: "center",
          signIndex: 18,
        },
        {
          id: 20,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 19,
        },
      ],

      handleDialogShow: false,
      settingDutyShow: false,
      detailDialogShow: false,
      vehicleTree: [],
      userTree: [],
      rowspanObj: {},
      mergekeys: ['check_date','vehicle_code','vehicle_name','line_name','is_dispatch','report_count','mergeKey'],
    }
  },
  created() {
    this.getVehicleTree()
    this.GetAllDeptEmpTree()
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetDayCheckTotalsWeb({context:params})
        .then(res => {
          // console.log(JSON.stringify(res));
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total;
            this.rowspanObj = this.$handleTableSpan(this.mergekeys, this.data,'mergeKey',true); 
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
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
    // 导出
    exportInfo() {
      let params = Object.assign({}, this.form);
      this.$client.DayCheckExport({context:params}).then(res => {
        if(res.head.result == "200") {
          window.location.href = res.context;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
          this.$message({
          showClose: true,
          message: err.body.message,
          type: "error",
        });
      })
    },
    // 获取详情
    getDetails(row) {
      this.$client.GetCheckDetailDayCheck({id:row.id}).then(res => {
        if(res.head.result == "200") {
          this.detailDialogShow = true
          this.$nextTick(() => {
            this.$refs.detailDialog.setData(res.context,row.check_type)
          })
        }else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 处理 
    editRowInfo(info) {
      this.handleDialogShow = true
      this.$nextTick(() => {
        this.$refs.handleDialog.form.id = info.id
      })
    },
    // 处理 
    updateHandle(form) {
      this.$client.UpdateHandleStateDayCheck({context:form}).then(res => {
        if(res.head.result == "200") {
          this.handleDialogShow = false
          this.loadData()
          this.$message({
            showClose: true,
            message: "处理完成",
            type: "success",
          });
        }else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 提醒设置 
    onSetting() {
      this.settingDutyShow = true
    },
    // 获取车辆树 
    getVehicleTree() {
      let params = {
        oil_type: 0
      }
      this.$client.getVehicleTree(params)
        .then((res) => {
          if (res.head.result === "200") {
            this.vehicleTree = res.context;
          }
        })
    },
    // 获取人员树 
    GetAllDeptEmpTree() {
      let params = {
        is_contain_emp: true,
        show_all: false
      };
      this.$client.GetAllDeptEmpTree(params)
        .then((res) => {
          if (res.head.result === "200") {
            this.userTree = res.context;
          }
        })
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th - 30;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.check-statistics
  height: 100%
  width: 100%
</style>