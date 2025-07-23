<template>
  <div class="vehicle-energy-consume-statistics">
    <sub-req ref="head" @on-ok="onSubmit" @on-btn-export="exportFile"></sub-req>
    <tr-table
      :indexShow="true"
      :selectionShow="false"
      :data="data"
      :isShowSummary="isShowSummary"
      :sumColumnIndex="[6,7,8,9,10]"
      :sumTotal="sumTotal"
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
      :total="pageInfo.pageCount">
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
export default {
  name: "vehicle-energy-consume-statistics",
  components: {
    subReq
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
      // window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
      //   this.setHead()
      // })
    });
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
          id: 7,
          label: "月份",
          prop: "month",
          width: "145",
          align: "center",
          signIndex: 6,
          sortable:false
        },
        {
          id: 3,
          label: "所属组织",
          prop: "department_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable:false
        },
        {
          id: 1,
          label: "线路",
          prop: "line_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable:false
        },
        {
          id: 1,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable:false
        },
        {
          id: 2,
          label: "车牌号",
          prop: "lincense_plate_number",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable:false
        },
        {
          label: "电耗(kwh)",
          prop: "ele_consume",
          width: "120",
          align: "center",
          signIndex: 7,
          sortable:false,
        },
        {
          label: "充电服务费（元)",
          prop: "service_fee",
          width: "120",
          align: "center",
          signIndex: 7,
          sortable:false,
        },
        {
          label: "电费（元）",
          prop: "electric_fee",
          width: "120",
          align: "center",
          signIndex: 7,
          sortable:false,
        },
        {
          label: "充电费用合计（元）",
          prop: "total_fee",
          width: "120",
          align: "center",
          signIndex: 7,
          sortable:false,
        },
        {
          label: "行驶里程（公里）",
          prop: "n_total_mile",
          width: "180",
          align: "center",
          signIndex: 8,
          sortable:false,
        },
        {
          label: "百公里电耗",
          prop: "per_ele_consume",
          width: "180",
          align: "center",
          signIndex: 8,
          sortable:false,
        },
      ],
      sumTotal: {
        6: '',
        7: '',
        8: '',
        9: '',
        10: '',
      }
    }
  },
  methods: {
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    // 获取数据
    loadData() {
      this.loading = true
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      this.$client.ElectricSummayVehicleOilRecordSummary(params).then(req => {
        this.loading = false
        if (req.head.result == "200") {
            this.data = req.context.list;
            this.pageInfo.pageCount = req.context.total
            this.sumTotal = {
              6: req.context.summary['ele_consume'],
              7: req.context.summary['service_fee'],
              8: req.context.summary['electric_fee'],
              9: req.context.summary['total_fee'],
              10: req.context.summary['n_total_mile'],
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
    // 导出Excel
    exportFile() {
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      this.$client.EleOilExportVehicleOilRecordSummary(params).then(res => {
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
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData()
    },
    // 计算表格高度
    setHead(type) {
      // if(type == 'initialize') {
      //   this.canRendererTableHeader = this.customSettingList;
      // }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.vehicle-energy-consume-statistics {
  height: 100%;
  width: 100%;
}
</style>
