<template>
  <div class="line-statistics">
    <sub-req
      ref="head"
      :curType="false"
      @on-ok="onSubmit"
      @on-export="exportFile"
    >
    </sub-req>
    <div class="content-box">
      <div class="table-left">
        <tr-table
          :data="data"
          :loading="loading"
          :TableHeight="TableHeight"
          @on-select-row="clickLineSelectRow"
          :tableHeaderList="canRendererTableHeader"
        >
          <!-- :isShowSummary="true"
          :omitColumnIndex="[1]" -->
        </tr-table>
      </div>
      <div class="table-center">
        <tr-table
          :data="vehData"
          :loading="vehLoading"
          :isShowSummary="true"
          :omitColumnIndex="[1, 2]"
          :TableHeight="TableHeight"
          @on-select-row="clickVehSelectRow"
          :tableHeaderList="vehCanRendererTableHeader"
        >
        </tr-table>
      </div>
      <div class="table-right">
        <tr-table
          :data="detailData"
          :loading="detailLoading"
          :isShowSummary="true"
          :omitColumnIndex="[1, 2, 3, 6, 7, 8, 9, 10, 11, 12]"
          :TableHeight="TableHeight"
          :tableHeaderList="detailCanRendererTableHeader"
        >
        </tr-table>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./sub-req";
export default {
  components: {
    subReq,
  },
  data() {
    return {
      form: {},
      data: [],
      loading: false,
      vehForm: {},
      vehData: [],
      vehLoading: false,
      detailForm: {},
      detailData: [],
      detailLoading: false,
      TableHeight: 500,
      conLoading: false,
      canRendererTableHeader: [
        {
          id: 1,
          label: "线路",
          prop: "line_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "现金收入",
          prop: "total_fee",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
      ],
      vehCanRendererTableHeader: [
        {
          id: 1,
          label: "自编号",
          prop: "v_num",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "lp_num",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "物料费用合计",
          prop: "total_fee",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
      ],
      detailCanRendererTableHeader: [
        {
          id: 1,
          label: "日期",
          prop: "leave_Date",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "配件名称",
          prop: "material_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "规格型号",
          prop: "specification",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "价格",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "数量",
          prop: "count",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "总金额",
          prop: "total_price",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "当前所在线路",
          prop: "line_name",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "自编号",
          prop: "v_num",
          width: "140",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "车牌号",
          prop: "lp_num",
          width: "140",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "出库单号",
          prop: "leave_num",
          width: "140",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "单位",
          prop: "measure_unit_name",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "类别",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
      ],
    };
  },
  mounted() {
    this.conLoading = true;
    this.$nextTick(() => {
      this.setHead();
    });
  },
  methods: {
    // 查询
    onSubmit(form) {
      this.vehData = [];
      this.vehForm = {};
      this.detailData = [];
      this.detailForm = {};
      this.form = form;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      this.$client
        .getDataByLineRepairMaterialFeeReport(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context;
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    // 点击线路
    clickLineSelectRow(row) {
      if (row.line_name === "公摊类型合计" || row.line_name === "金额合计") {
        return false;
      }
      this.vehLoading = true;
      this.vehData = [];
      this.vehForm = Object.assign({}, row);
      let params = Object.assign({}, this.form);
      params.line_id = row.line_id ? row.line_id : "";
      this.$client
        .getDataByVehicleRepairMaterialFeeReport(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.vehLoading = false;
            this.vehData = res.context;
          } else {
            this.vehLoading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    // 点击车辆表
    clickVehSelectRow(row) {
      this.detailLoading = true;
      this.detailData = [];
      this.detailForm = Object.assign({}, row);
      let params = { context: {} };
      params.context = Object.assign({}, this.form);
      params.context.start_time = this.form.leave_start;
      params.context.end_time = this.form.leave_end;
      params.context.page_index = 1;
      params.context.page_size = 9999;
      (params.context.vehicle_ids = row.vehicle_id ? [row.vehicle_id] : []),
        this.$client
          .GetLeaveDetailStatic(params)
          .then((res) => {
            if (res.head.result == "200") {
              this.detailLoading = false;
              this.detailData = res.context.list;
            } else {
              this.detailLoading = false;
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
          })
          .catch((err) => {
            this.$message({
              showClose: true,
              message: err.body.message,
              type: "error",
            });
          });
    },
    // 导出
    exportFile(type) {
      if (type == "1" && !this.data.length) {
        this.$message.error("暂无导出数据");
        return false;
      }
      if (type == "2" && !this.vehData.length) {
        this.$message.error("暂无导出数据");
        return false;
      }
      if (type == "3" && !this.detailData.length) {
        this.$message.error("暂无导出数据");
        return false;
      }
      let obj = {
        1: "exportLineRepairMaterialFeeReport",
        2: "exportVehicleRepairMaterialFeeReport",
        3: "LeaveDetailExport",
      };
      let params = {};
      switch (type) {
        case "1":
          params = Object.assign({}, this.form);
          break;
        case "2":
          params = Object.assign({}, this.form);
          params.line_id = this.vehForm.line_id ? this.vehForm.line_id : "";
          break;
        case "3":
          params.context = {};
          params.context = Object.assign({}, this.form);
          params.context.start_time = this.form.leave_start;
          params.context.end_time = this.form.leave_end;
          params.context.page_index = 1;
          params.context.page_size = 9999;
          params.context.vehicle_ids = this.detailForm.vehicle_id
            ? [this.detailForm.vehicle_id]
            : [];
          break;

        default:
          break;
      }
      this.$client[obj[type]](params)
        .then((res) => {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ message: "导出成功", type: "success" });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({ message: "导出失败", type: "error" });
        });
    },
    setHead() {
      let maxh = this.$el.offsetHeight;
      let head = this.$refs.head.$el.offsetHeight;
      this.TableHeight = maxh - head - 1;
      // console.log(maxh,head, this.TableHeight);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.line-statistics {
  height: 100%;
  width: 100%;

  .content-box {
    display: flex;
    width: 100%;

    .table-left {
      width: 340px;
      margin-right: 10px;
    }

    .table-center {
      width: 460px;
      margin-right: 10px;
    }

    .table-right {
      width: calc(100% - 800px);
      flex: 1;
    }
  }
}
</style>