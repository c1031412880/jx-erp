<template>
  <div class="material-cost">
    <el-tabs v-model="activeName" type="border-card" @tab-click="onClickTab">
      <el-tab-pane label="按车辆汇总" name="first" lazy>
        <vehicle-statistics></vehicle-statistics>
      </el-tab-pane>
      <el-tab-pane label="按线路汇总" name="second" lazy>
        <line-statistics></line-statistics>
      </el-tab-pane>
      <el-tab-pane label="按供应商汇总" name="third" lazy>
        <supplier-statistics></supplier-statistics>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import vehicleStatistics from "./component/vehicle-statistics"
import lineStatistics from "./component/line-statistics"
import supplierStatistics from "./component/supplier-statistics"
export default {
  name: "material-cost",
  components: {
    vehicleStatistics,
    lineStatistics,
    supplierStatistics,
  },
  data() {
    return {
      activeName: "first",
    };
  },
  mounted() {
  },
  methods: {


    onClickTab(tab, event) {
      // console.log(tab, event);
    },
    

    // onSubmitReqheader(type) {
    //   // alert(type)
    //   // 1.按线路 2.按车辆
    //   this.reqTableHeader(this.activeName=='first'? 1: 2,type)
    // },
    // // 获取表格头部
    // reqTableHeader(summary_type,type) {
    //   // this.loading = true;
    //   let params = {
    //     summary_type: summary_type,
    //     type: type
    //   };
    //   this.$client.getTitleRepairMaterialFeeReport(params)
    //   .then(res => {
    //       if (res.head.result == "200") {
    //         if(summary_type == 2) {
    //           this.secondcanRendererTableHeader = res.context
    //           // console.log(this.canRendererTableHeader)
    //         }else{
    //           this.canRendererTableHeader = res.context
    //         }
            
    //       } else {
    //         this.$message({
    //           showClose: true,
    //           message: res.head.describle,
    //           type: "error",
    //         });
    //       }
    //       // this.loading = false;
    //     }).catch(err => {
    //       // this.loading = false;
    //        this.$message({
    //         showClose: true,
    //         message: err.body.message,
    //         type: "error",
    //       });
    //     })
    // },
    // onSubmit(form) {
    //   this.form = form;
    //   // this.pageInfo.pageIndex = 1;
    //   // this.pageInfo.pageCount = 0;
    //   this.loadData();
    // },
    // // 数据加载
    // loadData() {
    //   let params = Object.assign({}, this.form);
    //    if(this.activeName == 'second') { 
    //   this.$client.getDataByVehicleRepairMaterialFeeReport(params)
    //     .then(res => {
    //       if (res.head.result == "200") {
    //           this.expireVehicleData = res.context;
    //           this.secondLoading = false;
    //       } else {
    //         this.loading = false;
    //         this.secondLoading = false;
    //         this.$message({
    //           showClose: true,
    //           message: res.head.describle,
    //           type: "error",
    //         });
    //       }
    //     })
    //    }else{
    //      this.$client.getDataByLineRepairMaterialFeeReport(params)
    //     .then(res => {
    //       if (res.head.result == "200") {
    //           this.insuranceData = res.context;
    //           this.loading = false
    //       } else {
    //         this.loading = false;
    //         this.secondLoading = false;
    //         this.$message({
    //           showClose: true,
    //           message: res.head.describle,
    //           type: "error",
    //         });
    //       }
    //     })
    //    }
    // },

    // // 刷新列表
    // refreshTableList() {
    //   this.form = {};
    //   this.loadData();
    // },
    // // 打开自定义表头的弹窗
    // openSettingPageEvent() {
    //   this.customSettingVialogVisible = true;
    // },
    // // 导出
    // exportExcel() {
    //   let params = Object.assign({}, this.form);
    //   if(this.activeName == 'first') {
    //      this.$client.exportLineRepairMaterialFeeReport(params)
    //   .then(res => {
    //      if (res.head.result == "200") {
    //         window.location.href = res.context;
    //         this.$message({ message: "导出成功", type: "success" });
    //       } else {
    //         this.$message({
    //           showClose: true,
    //           message: res.head.describle,
    //           type: "error",
    //         });
    //       }
    //   }).catch(err => {
    //     this.$message({ message: "导出失败", type: "error" });
    //   })
    //   }else{
    //      this.$client.exportVehicleRepairMaterialFeeReport(params)
    //   .then(res => {
    //      if (res.head.result == "200") {
    //         window.location.href = res.context;
    //         this.$message({ message: "导出成功", type: "success" });
    //       } else {
    //         this.$message({
    //           showClose: true,
    //           message: res.head.describle,
    //           type: "error",
    //         });
    //       }
    //   }).catch(err => {
    //     this.$message({ message: "导出失败", type: "error" });
    //   })
    //   }
    // },
    

    // // 计算表格高度 和初始化表头
    // setHead() {
    //   setTimeout(() => {
    //     let maxh = this.$el.offsetHeight;
    //     // let th1 = this.$refs.secondHead.$el.offsetHeight;
    //     let th2 = this.$refs.firstHead.$el.offsetHeight;
    //     // this.firstTableHeight = maxh - th1 - 55;
    //     this.secondTableHeight = maxh - th2 - 55;
    //   }, 50);
    // },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.material-cost {
  width: 100%;
  height: 100%;
}
/deep/ .el-tabs {
  width: 100%;
  height: 100%;
}
/deep/ .el-tabs__content{
  height: calc(100% - 50px);
}
/deep/ .el-tab-pane {
  width: 100%;
  height: 100%;
}
</style>
