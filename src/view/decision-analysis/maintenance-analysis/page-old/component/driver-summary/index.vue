<template>
  <div class="driver-summary">
    <sub-req ref="head"></sub-req>
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
  name: "driver-summary",
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
          label: "驾驶员",
          prop: "c_accident_code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable:true
        },
        {
          id: 2,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable:true
        },
        {
          id: 3,
          label: "车牌号",
          prop: "lincense_plate_number",
          width: "120",
          align: "center",
          signIndex: 2,
          sortable:true
        },
        {
          id: 4,
          label: "所属组织",
          prop: "department_name",
          width: "160",
          align: "center",
          signIndex: 3,
          sortable:false
        },
        {
          id: 5,
          label: "线路",
          prop: "line",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable:true
        },
        {
          id: 6,
          label: "车辆型号",
          prop: "d_accident_date",
          width: "145",
          align: "center",
          signIndex: 5,
          sortable:true
        },
        {
          id: 7,
          label: "燃料类别",
          prop: "driver_name",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable:false
        },
        {
          id: 8,
          label: "燃料标准值(L/100km或度/100km)",
          prop: "accident_reason",
          width: "150",
          align: "center",
          signIndex: 7,
          sortable:false
        },
        {
          id: 9,
          label: "GPS里程(KM)",
          prop: "c_accident_address",
          width: "100",
          align: "center",
          signIndex: 8,
          sortable:false
        },
      ],
      frontFixedNum:1, //前几行固定
      backFixedNum:1, //后几行固定
      loading: false,
      TableHeight: 500,
      data: []
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
      this.queryform = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    loadData() {

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
.driver-summary{
  width: 100%;
  height: 100%;
}
</style>
