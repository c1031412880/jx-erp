<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="1250px"
  >
    <div class="check">
      <div class="top-time">
        <span>
          当前日期：{{formData.txndate}}
          当前车辆：{{formData.busid}}
        </span>
      </div>
      <tr-table
        ref="table"
        :selectionShow="true"
        :data="accidentData"
        :tableHeaderList="canRendererTableHeader"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
      ></tr-table>
        <!-- <tr-table
        ref="table"
        :selectionShow="true"
        :data="accidentData.slice((currentPage-1)*PageSize,currentPage*PageSize)"
        :tableHeaderList="canRendererTableHeader"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
      ></tr-table> -->
      <div style="display:flex;">
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
      ></el-pagination>
       <!-- <el-pagination
        ref="paginationH"
        @size-change="handleSizeChange" 
        style="margin: 5px 0;display:flex; justify-content: flex-end;"
        @current-change="handleCurrentChange" 
        :current-page="currentPage" 
        :page-sizes="pageSizes" 
        :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper" 
        :total="totalCount">
        </el-pagination> -->
        <el-button @click="exportFile()" type="primary" icon="el-icon-download">导出</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
  // 总数据
      tableData:[],
      // 默认显示第几页
      currentPage:1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount:1,
      // 个数选择器（可修改）
      pageSizes:[20,50,100],
      // 默认每页显示的条数（可修改）
      PageSize:100,
      data: [],
      pageInfo: {
        pageIndex: 1,
        pageSize: 100,
        pageCount: 0
      },
      queryform: {
        vehicle_id:'',
        txndate:'',
      }, //查询表单
      accidentData: [], //列表
      loading: false,
      TableHeight: 500,
      customSettingList: [
        {
          id: 1,
          label: "刷卡时间",
          prop: "swip_time",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: "车牌号",
          prop: "busid",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false
        },
        {
          id: 4,
          label: "线路",
          prop: "line_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false
        },
        {
          id: 5,
          label: "驾驶员",
          prop: "driver_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false
        },
        {
          id: 6,
          label: "刷卡金额",
          prop: "txnamtreal",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false
        },
        {
          id: 7,
          label: "卡类型",
          prop: "card_ori_type",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false
        },
        {
          id: 8,
          label: "刷卡站点",
          prop: "station_name",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false
        },
      ],
      frontFixedNum: 2, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      detailLoading: false,
      curSelectedId: "", // 当前选中的ID
      selectedIds: [], //勾选的ID
      tableForm: {},
      summary: {
        txndate: "",
        vehicle_id: ""
      }
    };
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "乘客刷卡明细"
    },
    cz: {
      type: Object,
    },
     formData: {
              type: Object,
              default: () => {
                  return {}
              }
          }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
      // this.loadData();
    });
  },
  methods: {
    // handleSizeChange(val) {
    //        // 改变每页显示的条数 
    //        this.PageSize=val
    //        // 注意：在改变每页显示的条数时，要将页码显示到第一页
    //        this.currentPage=1
    //    },
    //      // 显示第几页
    //    handleCurrentChange(val) {
    //        // 改变默认的页数
    //        this.currentPage=val
    //    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },

    // 导出Excel
    exportFile() {
      let params = Object.assign({}, this.queryform);
      this.$client.CreditCreditCardConsumptionSummary(params).then(res => {
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
    // 更新表格头部
    updateTableHeader(newestTableHeaderList) {
      this.canRendererTableHeader = null;
      this.canRendererTableHeader = newestTableHeaderList;
      this.$forceUpdate();
    },
    // 加载数据
    loadData() {
      this.queryform.vehicle_id = this.formData.vehicle_id
      this.queryform.txndate = this.formData.txndate
      this.loading = true;
      let params = {};
      params = Object.assign({}, this.queryform);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetCreditCardConsumptionDetl(params).then(res => {
        if (res.head.result == "200") {
          this.accidentData = res.context.list;
          this.pageInfo.pageCount = res.context.total;
          // this.totalCount=res.context.length
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
        this.loading = false;
      });
    },

    // 计算表格高度
    setHead() {
      this.canRendererTableHeader = this.customSettingList;
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
        console.log(this.TableHeight);
      }, 60);
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.check {
  width: 1210px;
}

.top-time {
  font-size: 16px;
  position: absolute;
  top: 25px;
  left: 170px;
}
</style>
