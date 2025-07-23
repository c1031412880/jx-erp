<template>
  <div class="revenue-statistics">
    <div class="revenue-statistics-content">
      <el-tabs v-model="activeName" @tab-click="onClickTab">
        <el-tab-pane label="按车辆汇总" name="second">
          <sub-req
            ref="firstHead"
            :activeName="activeName"
            @on-ok="onSubmit"
            @on-submit-reqheader="onSubmitReqheader"
            @on-export="exportExcel"
            @open-setting-Page="openSettingPageEvent"
          ></sub-req>
          <div>
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
        </el-tab-pane>
          <el-tab-pane label="按线路汇总" name="first">
          <sub-req
            ref="secondHead"
            :activeName="activeName"
            @on-ok="onSubmit"
            @on-submit-reqheader="onSubmitReqheader"
            @on-export="exportExcel"
            @open-setting-Page="openSettingPageEvent"
          ></sub-req>
          <div>
            <tr-table
              :selectionShow="false"
              :data="insuranceData"
              :tableHeaderList="canRendererTableHeader"
              :isShowBottomOptions="false"
              :TableHeight="firstTableHeight"
              :loading="loading"
              :frontFixedNum="frontFixedNum"
              :backFixedNum="backFixedNum"
            >
            </tr-table>
          </div>
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
  name: "material-cost",
  components: {
    subReq,
  },
  data() {
    return {
      firstTableHeight: 500,
      secondTableHeight: 500,
      form:{},
      activeName: "second",
      insuranceData: [], //线路汇总统计
      expireVehicleData: [], //车辆汇总统计
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
    reqTableHeader(summary_type,type) {
      // this.loading = true;
      let params = {
        summary_type: summary_type,
        type: type
      };
      this.$client.getTitleRepairMaterialFeeReport(params)
      .then(res => {
          if (res.head.result == "200") {
            if(summary_type == 2) {
              this.secondcanRendererTableHeader = res.context
              // console.log(this.canRendererTableHeader)
            }else{
              this.canRendererTableHeader = res.context
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
       if(this.activeName == 'second') { 
      this.$client.getDataByVehicleRepairMaterialFeeReport(params)
        .then(res => {
          if (res.head.result == "200") {
              this.expireVehicleData = res.context;
              this.secondLoading = false;
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
       }else{
         this.$client.getDataByLineRepairMaterialFeeReport(params)
        .then(res => {
          if (res.head.result == "200") {
              this.insuranceData = res.context;
              this.loading = false
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
       }
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
      let params = Object.assign({}, this.form);
      if(this.activeName == 'first') {
         this.$client.exportLineRepairMaterialFeeReport(params)
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
      }else{
         this.$client.exportVehicleRepairMaterialFeeReport(params)
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
      }
    },
    onClickTab(val) {
      if(val.name === 'first') {
        setTimeout(() => {
          let maxh = this.$el.offsetHeight;
          let th1 = this.$refs.secondHead.$el.offsetHeight;
          this.firstTableHeight = maxh - th1 - 55;
        }, 100);
      }
    },

    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        // let th1 = this.$refs.secondHead.$el.offsetHeight;
        let th2 = this.$refs.firstHead.$el.offsetHeight;
        // this.firstTableHeight = maxh - th1 - 55;
        this.secondTableHeight = maxh - th2 - 55;
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
