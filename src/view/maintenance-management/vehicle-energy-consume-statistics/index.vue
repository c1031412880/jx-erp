<template>
  <div class="vehicle-energy-consume-statistics">
    <sub-req ref="head" @on-ok="onSubmit" @on-btn-export="exportFile"></sub-req>
    <tr-table
      :indexShow="true"
      :selectionShow="false"
      :data="data"
      :isShowSummary="isShowSummary"
      :omitColumnIndex="[ 1, 2, 3, 4, 5]"
      :tableHeaderList="canRendererTableHeader"
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
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 100,
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
          id: 3,
          label: "所属组织",
          prop: "department_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable:false
        },
        {
          id: 4,
          label: "线路",
          prop: "line_name",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable:false
        },
        {
          id: 5,
          label: "燃料类别",
          prop: "type",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable:false
        },
        {
          id: 6,
          label: "车辆型号",
          prop: "type_name",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable:false
        },
        {
          id: 7,
          label: "GPS里程(KM)",
          prop: "n_total_mile",
          width: "145",
          align: "center",
          signIndex: 6,
          sortable:false
        },
        {
          id: 8,
          label: "能源消耗",
          align: "center",
          nestedTablesHeader: [
            {
              label: "油耗(L)",
              prop: "oil_consume",
              width: "120",
              align: "center",
              signIndex: 7,
              sortable:false,
            },
            {
              label: "电耗(KWH)",
              prop: "eletric_consume",
              width: "120",
              align: "center",
              signIndex: 7,
              sortable:false,
            },
          ]
        },
        {
          id: 9,
          label: "百公里能源消耗",
          align: "center",
          nestedTablesHeader: [
            {
              label: "百公里油耗(L/百公里)",
              prop: "per_oil_consume",
              width: "180",
              align: "center",
              signIndex: 8,
              sortable:false,
            },
            {
              label: "电耗(KWH/百公里)",
              prop: "per_eletric_consume",
              width: "160",
              align: "center",
              signIndex: 8,
              sortable:false,
            },
          ]
        }
      ],
      canRendererTableHeader: null
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
      this.$client.VehicleOilSummatyVehicleOilRecordSummary(params).then(req => {
        this.loading = false
        if (req.head.result == "200") {
            this.data = req.context.list;
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
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      this.$client.ExportVehicleOilRecordSummary(params).then(res => {
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
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.vehicle-energy-consume-statistics {
  height: 100%;
  width: 100%;
}
</style>
