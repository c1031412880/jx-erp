<template>
  <div class="vehicle-mobilization-summary">
    <sub-req ref="head" @on-ok="onSubmit" @on-btn-export="exportFile"></sub-req>
    <tr-table
      :indexShow="true"
      :selectionShow="false"
      :data="data"
      :tableHeaderList="customSettingList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading">
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
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
export default {
  name: "vehicle-mobilization-summary",
  components: {
    subReq,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      data: [],
      form: {},
      loading: false,
      TableHeight: 500,
      isShowSummary: true,
      customSettingList: [
        {
          id: 1,
          label: "调动日期",
          align: "center",
          prop: "date",
          width: '100',
          signIndex: 0,
        },
        {
          id: 2,
          label: "自编号",
          align: "center",
          prop: "vehicle_number",
          width: '120',
          signIndex: 1,
        },
        {
          id: 3,
          label: "车牌号",
          align: "center",
          prop: "plate_number",
          width: '120',
          signIndex: 2,
        },
        {
          id: 4,
          label: "原部门",
          align: "center",
          prop: "old_dept_name",
          width: '120',
          signIndex: 3,
        },
        {
          id: 5,
          label: "原线路",
          align: "center",
          prop: "old_line_name",
          width: '120',
          signIndex: 4,
        },
        {
          id: 6,
          label: "调入部门",
          align: "center",
          prop: "taget_dept_name",
          width: '150',
          signIndex: 5,
        },
        {
          id: 7,
          label: "调入线路",
          align: "center",
          prop: "target_line_name",
          width: '120',
          signIndex: 6,
        },
        {
          id: 8,
          label: "车辆类型",
          align: "center",
          prop: "vehicle_type_name",
          width: '120',
          signIndex: 7,
        },
        {
          id: 9,
          label: "厂牌型号",
          align: "center",
          prop: "vehicle_model_name",
          width: '120',
          signIndex: 8,
        },
        {
          id: 10,
          label: "车长(米)",
          align: "center",
          prop: "vehicle_length",
          width: '120',
          signIndex: 9,
        },
        {
          id: 11,
          label: "燃料类型",
          align: "center",
          prop: "vehicle_fuel_name",
          width: '120',
          signIndex: 10,
        },
      ],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData()
    },
    // 获取数据
    loadData() {
      this.loading = true
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetTransferSummaryReports(params).then(req => {
        this.loading = false
        if (req.head.result == "200") {
            this.data = req.context.list.data_list
            this.pageInfo.pageCount = req.context.total
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      })
    },
    // 导出Excel
    exportFile() {
      let params = Object.assign({}, this.form);
      this.$client.ExportTransferSummaryReport(params).then(res => {
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
    // 计算表格高度
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
.vehicle-mobilization-summary {
  height: 100%;
  width: 100%;
}
</style>
