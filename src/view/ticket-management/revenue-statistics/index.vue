<template>
  <div class="revenue-statistics">
    <div class="revenue-statistics-content">
      <el-tabs v-model="activeName">
        <el-tab-pane label="按线路汇总" name="first">
          <sub-req
            ref="head"
            :activeName="activeName"
            @on-ok="onSubmit"
            @on-submit-reqheader="onSubmitReqheader"
            @on-export="exportExcel"
            @open-setting-Page="openSettingPageEvent"
          ></sub-req>
          <div v-if="activeName == 'first'">
            <tr-table
              :selectionShow="false"
              :data="insuranceData"
              :tableHeaderList="canRendererTableHeader"
              :isShowBottomOptions="false"
              :TableHeight="firstTableHeight"
              :loading="loading"
              :frontFixedNum="frontFixedNum"
              :backFixedNum="backFixedNum">
            </tr-table>
          </div>
          <el-pagination
            style="margin: 5px 0;display:flex; justify-content: flex-end;"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            ref="paginationH"
            :current-page="insurancePageInfo.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            :page-size="insurancePageInfo.pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="insurancePageInfo.pageCount"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="按车辆汇总" name="second">
          <sub-req
            ref="firstHead"
            :activeName="activeName"
            @on-ok="onSubmit"
            @on-submit-reqheader="onSubmitReqheader"
            @on-export="exportExcel"
            @open-setting-Page="openSettingPageEvent"
          ></sub-req>
          <div v-if="activeName == 'second'">
            <tr-table
              :selectionShow="false"
              :data="expireVehicleData"
              :tableHeaderList="secondcanRendererTableHeader"
              :isShowBottomOptions="false"
              :TableHeight="secondTableHeight"
              :loading="secondLoading"
              :frontFixedNum="frontFixedNum"
              :backFixedNum="backFixedNum"
            >
            </tr-table>
          </div>
          <el-pagination
            style="margin: 5px 0;display:flex; justify-content: flex-end;"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            ref="paginationH"
            :current-page="expireVehiclePageInfo.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            :page-size="expireVehiclePageInfo.pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="expireVehiclePageInfo.pageCount"
          >
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="vehicle-mileage-dialog">
      <!-- <custom-setting
        :dialogBool.sync="customSettingVialogVisible"
        :customSettingList="customSettingList"
        :canRendererTableHeader="canRendererTableHeader"
        :customSettingShowList="customSettingShowList"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
      ></custom-setting> -->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";

export default {
  name: "revenue-statistics",
  components: {
    subReq,
  },
  data() {
    return {
      firstTableHeight: 500,
      secondTableHeight: 500,
      form:{},
      activeName: "first",
      insuranceData: [], //线路汇总统计
      insurancePageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      expireVehicleData: [], //车辆汇总统计
      expireVehiclePageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      frontFixedNum: 1, //前几行固定
      backFixedNum: 0, //后几行固定
      customSettingList: [],
      canRendererTableHeader: null,
      customSettingShowList: null,
      customSettingVialogVisible:false,
      loading: false,
      secondLoading: false,
      secondcanRendererTableHeader:null

    };
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
    onSubmitReqheader(type) {
      // alert(type)
      // 1.按线路 2.按车辆
      this.reqTableHeader(this.activeName=='first'? 1: 2,type)
    },
    // 获取表格头部
    reqTableHeader(summary_type,card_type) {
      // this.loading = true;
      let params = {
        summary_type: summary_type,
        card_type: card_type
      };
      this.$client.getTitleRevenueSummary(params)
      .then(res => {
          if (res.head.result == "200") {
            if(summary_type == 1) {
              this.canRendererTableHeader = res.context
              // console.log(this.canRendererTableHeader)
            }else{
              this.secondcanRendererTableHeader = res.context
            }

          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
          // this.loading = false;
        }).catch(err => {
          // this.loading = false;
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    onSubmit(form) {
      this.form = form;
      // this.pageInfo.pageIndex = 1;
      // this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {

      let params = Object.assign({}, this.form);
      if(this.activeName == 'first') {
        this.loading = true;
        params.table_type = 1;
        params.page_size = this.insurancePageInfo.pageSize
        params.page_index = this.insurancePageInfo.pageIndex
      }else{
        this.secondLoading = true;
        params.table_type = 2;
        params.page_size = this.expireVehiclePageInfo.pageSize
        params.page_index = this.expireVehiclePageInfo.pageIndex
      }
      console.log(1,this.loading, this.secondLoading)
      this.$client.getRevenueList(params)
        .then(res => {
          console.log(2,res)
          if (res.head.result == "200") {

            if(this.activeName == 'first') {
              this.insuranceData = res.context.list;
              this.insurancePageInfo.pageCount = res.context.total
              this.loading = false;
            }else{
              this.expireVehicleData = res.context.list;
              this.expireVehiclePageInfo.pageCount = res.context.total
              this.secondLoading = false;
            }
          } else {
            this.loading = false;
            this.secondLoading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },

    // 刷新列表
    refreshTableList() {
      this.form = {};
      this.loadData();
    },
    // 打开自定义表头的弹窗
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    // 导出
    exportExcel() {
      let params = this.form;
      if(this.activeName == 'first') {
        params.table_type = 1;
      }else{
        params.table_type = 2;
      }
      this.$client.exportRevenueSummary(params)
      .then(res => {
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
      }).catch(err => {
        this.$message({ message: "导出失败", type: "error" });
      })
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      if(this.activeName == 'first') {
        this.insurancePageInfo.pageIndex = idx
      }else{
        this.expireVehiclePageInfo.pageIndex = idx
      }
      this.loadData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      if(this.activeName == 'first') {
        this.insurancePageInfo.pageIndex = 1
        this.insurancePageInfo.pageSize = sizes;
        this.insurancePageInfo.pageCount = 0;
      }else{
        this.expireVehiclePageInfo.pageIndex = 1
        this.expireVehiclePageInfo.pageSize = sizes;
        this.expireVehiclePageInfo.pageCount = 0;
      }
      this.loadData();
    },
    // 计算表格高度 和初始化表头
    setHead(type) {
      // if(type == 'initialize') {
      //   this.canRendererTableHeader = this.customSettingList;
      // }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let thfirstHead = this.$refs.firstHead.$el.offsetHeight;
        this.firstTableHeight = maxh - th - 86;
        this.secondTableHeight = maxh - thfirstHead - 86;
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.revenue-statistics {
  width: 100%;
  height: 100%;
}

.revenue-statistics-content /deep/ .el-tabs__item {
  width: 160px;
  // display flex
  // flex-direction row
  // justify-content center
  text-align: center;
}

.revenue-statistics-content /deep/ .el-tabs__nav-wrap::after {
  // content: "";
  // position: absolute;
  // left: 0;
  // bottom: 0;
  // width: 100%;
  height: 0px;
  // background-color: #E4E7ED;
  // z-index: 1;
}

.revenue-statistics /deep/ .el-pagination {
  margin-top: 5px;
  display: flex;
  justify-content: flex-end;
}

.button-total{
  justify-content space-between
}
.button-total-right{
  align-items center
}
</style>
