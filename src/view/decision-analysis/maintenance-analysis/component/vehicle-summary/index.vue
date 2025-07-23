<template>
  <div class="vehicle-summary">
    <sub-req ref="head" @on-ok="onSubmit" @on-dow="exportTableData"></sub-req>
    <tr-table
      ref="table"
      :selectionShow="false"
      :data="data"
      :tableHeaderList="customSettingList"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum">
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
import subReq from "./sub-req";
export default {
  name: "vehicle-summary",
  components: {subReq},
  mounted() {
    this.$nextTick(() => {
      this.setHead()
      // this.loadData();
    })
  },
  data() {
    //这里存放数据",
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      customSettingList:[
        {
          id: 1,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable:true
        },
        {
          id: 2,
          label: "车牌号",
          prop: "lincense_plate_number",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable:true
        },
        {
          id: 3,
          label: "所属组织",
          prop: "department_name",
          width: "160",
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
          sortable:true
        },
        {
          id: 5,
          label: "车辆型号",
          prop: "vehicle_type",
          width: "145",
          align: "center",
          signIndex: 4,
          sortable:true
        },
        {
          id: 6,
          label: "燃料类别",
          prop: "oil_type",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable:false
        },
        {
          id: 7,
          label: "燃料标准值(L/100km或度/100km)",
          prop: "per_oil_consume",
          width: "150",
          align: "center",
          signIndex: 6,
          sortable:false
        },
        {
          id: 8,
          label: "GPS里程(KM)",
          prop: "gps_kilometre",
          width: "100",
          align: "center",
          signIndex: 7,
          sortable:false
        },
        {
          id: 9,
          label: "实际燃料消耗值",
          prop: "line_consume",
          width: "240",
          align: "center",
          signIndex: 8,
          sortable:false,
          nestedTablesHeader: [
            {
              label: "LNG(公斤)",
              prop: "lng",
              width: "120",
              align: "center",
              signIndex: 1,
              sortable:false,
            },
            {
              label: "LNG电混动(电)(千瓦时)",
              prop: "lng_eletric",
              width: "120",
              align: "center",
              signIndex: 2,
              sortable:false,
            },
            {
              label: "LNG电混动(LNG)(公斤)",
              prop: "lng_lng",
              width: "120",
              align: "center",
              signIndex: 3,
              sortable:false,
            },
            {
              label: "纯电_慢充(千瓦时)",
              prop: "eletric_slow",
              width: "120",
              align: "center",
              signIndex: 4,
              sortable:false,
            },
            {
              label: "纯电_快充(千瓦时)",
              prop: "eletric_fast",
              width: "120",
              align: "center",
              signIndex: 5,
              sortable:false,
            },
            {
              label: "氢电混动(电)(千瓦时)",
              prop: "h_eletric",
              width: "120",
              align: "center",
              signIndex: 6,
              sortable:false,
            },
            {
              label: "氢电混动(氢)(公斤)",
              prop: "h_hydrogen",
              width: "120",
              align: "center",
              signIndex: 7,
              sortable:false,
            },
          ]
        },
        {
          id: 10,
          label: "实际百公里燃料消耗值",
          prop: "persum_consume",
          width: "240",
          align: "center",
          signIndex: 9,
          sortable:false,
          nestedTablesHeader: [
            {
              label: "百公里 LNG(公斤) ",
              prop: "lng_consume",
              width: "120",
              align: "center",
              sortable:false,
            },
            {
              label: "百公里LNG电混动(电)(千瓦时)",
              prop: "lng_eletric_consume",
              width: "120",
              align: "center",
              sortable:false,
            },
            {
              label: "百公里LNG电混动(LNG)(公斤)",
              prop: "lng_lng_consume",
              width: "120",
              align: "center",
              sortable:false,
            },
            {
              label: "百公里纯电_慢充(千瓦时)",
              prop: "eletric_slow_consume",
              width: "120",
              align: "center",
              sortable:false,
            },
            {
              label: "百公里纯电_快充(千瓦时)",
              prop: "eletric_fast_consume",
              width: "120",
              align: "center",
              sortable:false,
            },
            {
              label: "百公里氢电混动(电)(千瓦时)",
              prop: "h_eletric_consume",
              width: "120",
              align: "center",
              sortable:false,
            },
            {
              label: "百公里氢电混动(氢)(公斤)",
              prop: "h_hydrogen_consume",
              width: "120",
              align: "center",
              sortable:false,
            },
          ]
        },
        // {
        //   id: 11,
        //   label: '节油(电)',
        //   prop: "fuel_prudent",
        //   width: "130",
        //   align: "center",
        //   signIndex: 10,
        //   sortable:false,
        // },
      ],
      frontFixedNum:1, //前几行固定
      backFixedNum:0, //后几行固定
      loading: false,
      TableHeight: 500,
      data: [],
      form: {}
    }
  },
  //方法集合",
  methods: {
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 查询
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    loadData() {
      this.loading = true
      this.form.page_index = this.pageInfo.pageIndex
      this.form.page_size = this.pageInfo.pageSize
      this.$client.MaintSummaryByVehicleMaintManageAnalysis(this.form).then(req => {
        this.loading = false
        if (req.head.result === '200') {
          this.data = req.context.list
          this.pageInfo.pageCount = req.context.total
        } else {
          this.data = []
        }
      })
    },
    exportTableData() {
      this.$client.ExportByVehicleMaintManageAnalysis(this.form).then(req => {
        if (req.head.result === '200') {
          window.open(req.context)
          this.$message.success('导出成功')
        }
      })
    },
    // 计算表格高度
    setHead() {
      this.canRendererTableHeader = this.customSettingList;
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH - 10;
        console.log(this.TableHeight)
      }, 60)
    }
  },
}
</script>

<style lang="scss" scoped>
.vehicle-summary{
  width: 100%;
  height: 100%;
}
</style>
