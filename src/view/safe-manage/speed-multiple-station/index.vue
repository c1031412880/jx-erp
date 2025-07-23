<template>
  <div class="speed-multiple-station">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-export="onExport"
    ></sub-req>
    <el-card shadow="hover" style="margin-bottom: 10px" v-loading="chartLoading">
      <div class="div-card-body">
        <bar-chart ref="barChart"></bar-chart>
      </div>
    </el-card>
    <tr-table
      :backFixedNum="1"
      :data="data"
      :frontFixedNum="2"
      :loading="loading"
      :selectionShow="false"
      :TableHeight="TableHeight"
      :isShowBottomOptions="false"
      :tableHeaderList="customSettingList">
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" @click="onClickDetails(scope.data)">查看明细</el-button>
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
      :total="pageInfo.pageCount"></el-pagination>
    <div>
      <information-dialog 
        ref="infoDialog"
        :begin="info.begin"
        :end="info.end"
        :station="info.station"
        :stationId="info.stationId"
        @on-export="onExportDetails"
        :dialogBool.sync="isShowDialog"></information-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import barChart from "./component/bar-chart";
import informationDialog from './component/information-dialog'
export default {
  name: "speed-multiple-station",
  components: {
    subReq,
    barChart,
    informationDialog
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
      info: {
        begin: '',
        end: '',
        station: '',
        stationId: 0
      },
      loading: false,
      chartLoading: false,
      isShowDialog: false,
      TableHeight: 400,
      customSettingList: [
        {
          id: 1,
          label: "站点",
          prop: "stationName",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "线路",
          prop: "linename",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "上下行",
          prop: "direct_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "超速次数",
          prop: "count",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "超速平均速度(km/h)",
          prop: "avr_speed",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        }
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize');
      this.$refs.head.onSubmit()
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    // 加载数据
    loadData() {
      this.loading = true
      this.chartLoading = true
      let params = Object.assign({}, this.form)
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetOverSpeedReportOverSpeed(params).then(res => {
        this.loading = false
        this.chartLoading = false
        if (res.head.result == "200") {
          this.data = res.context.list
          this.pageInfo.pageCount = res.context.total
          let list = res.context.list
          let label = []
          let data = []
          list.forEach(item => {
            label.push(item.stationName)
            data.push(item.count)
          })
          this.$refs.barChart.setOptions(label, data)
        } else {
          this.$refs.barChart.setOptions([], [])
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
        this.loading = false
        this.chartLoading = false
        this.$message({
          showClose: true,
          message: err.body.message,
          type: "error",
        })
      })
    },
    // 导出
    onExport() {
      let info = Object.assign({}, this.form)
      info.page_index = this.pageInfo.pageIndex;
      info.page_size = this.pageInfo.pageSize;
      let params = {
        data: info,
        export_type: 3
      }
      this.$client.ExportOverSpeedStatistics(params).then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },
    // 点击明细详情
    onClickDetails(val, type) {   
      console.log(val);
      this.isShowDialog = true
      this.info.end = this.form.end_time  ? this.form.end_time.slice(0, 10) : ''
      this.info.begin = this.form.begin_time ? this.form.begin_time.slice(0, 10) : ''
      this.info.station = val.stationName
      this.info.stationId = val.stationID
      let data = val.details ? val.details : []     
      this.$refs.infoDialog.setTableData(data, val)
    },
    // 导出明细
    onExportDetails(val) {
      console.log(val);
      let info = Object.assign({}, this.form)
      info.page_index = val.pageIndex;
      info.page_size = val.pageSize;
      info.stationID = val.stationID;
      let params = {
        data: info,
        export_type: 0
      }
      console.log(params);
      this.$client.ExportOverSpeedStatistics(params).then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
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
    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let bh = this.$refs.barChart.$el.offsetHeight;
        let ph = this.$refs.paginationH.$el.offsetHeight;
        // console.log(maxh,th,bh,ph);
        this.TableHeight = maxh - th - bh - ph - 50;
      }, 60);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
.speed-multiple-station {
  width: 100%;
  height: 100%;

$NumWidth: 100vw / 1920px;
  .div-card-body {
    height: 300px * $NumWidth;
  }
}
</style>
