<template>
  <div class="vehicle-mileage-manage">
    <sub-req ref="head" @on-ok="onSubmit" @on-export="exportExcel"></sub-req>
    <div class="vehicle-mileage-manage-content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="明细" name="first">
          <div class="button-total show-flex-box-r" style="margin-bottom: 15px">
            <div class="show-flex-box-r">
              <el-button
                type="primary"
                size="mini"
                @click="openAdditionalRecordingMileagePop"
                v-if="$isPowerShow('add')"
                >补录车辆公里</el-button
              >
              <el-button type="primary" size="mini" style="margin-right:10px;" @click="openBatchExportPop" v-if="$isPowerShow('import')"
                >批量导入</el-button
              >
              <el-popconfirm
                @confirm="batchesDelete()"
                v-if="$isPowerShow('del')"
                title="确定要删除勾选的记录？">
                <el-button slot="reference" type="primary" size="mini">批量删除</el-button>
              </el-popconfirm>
            </div>
            <div class="button-total-right show-flex-box-r">
              <i
                class="el-icon-refresh"
                style="margin-right: 15px; cursor: pointer"
                @click="refreshTableList()"
              ></i>
              <!-- <i
                class="el-icon-s-tools"
                style="cursor: pointer"
                @click="openSettingPage()"
              ></i> -->
            </div>
          </div>
          <div class="table-content">
            <detail-table-data
              :data="mileDetailData"
              :activeName="activeName"
              :TabelHeight="detailTableHeight"
              :loading="loading"
              @edit-detail="editDetail"
              @selected-mile-detail-list="selectedMileDetailList"
              @delete-mileage-info="deleteMileageInfo"

            ></detail-table-data>
            <el-pagination
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
        </el-tab-pane>
        <el-tab-pane label="汇总" name="second">
          <div class="table-content">
            <summary-table-data
              :data="mileSummaryData"
              :TabelHeight="summaryTableHeight"
              :activeName="activeName"
              :loading="sumLoading"
            ></summary-table-data>
            <el-pagination
              @current-change="handleSecondCurrentChange"
              @size-change="handleSecondSizeChange"
              ref="paginationH"
              :current-page="summaryPageInfo.pageIndex"
              :page-sizes="[10, 20, 30, 40, 50, 100]"
              :page-size="summaryPageInfo.pageSize"
              layout="total,sizes, prev, pager, next, jumper"
              :total="summaryPageInfo.pageCount"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="vehicle-mileage-dialog">
      <file-dialog
        :dialogBool.sync="filedialogVisible"
        :fileData="FileData"
        :typeMessage="'相同车牌号'"
        @on-submit-excel="onSubmitExcel"
      ></file-dialog>
      <additional-recording-dialog
        ref="addEditVehicleMileage"
        :dialogBool.sync="isShowAdditionalRecordingDialog"
        :curType="curType"
        @save-add-edit-vehicle-mileage="saveAddEditVehicleMileage"
      ></additional-recording-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import detailTableData from "./component/detail-table";
import summaryTableData from "./component/summary-table";
import additionalRecordingDialog from "./component/additional-recording-dialog";
import fileDialog from "@/components/fileDialog/file-dialog.vue";

export default {
  name: "vehicle-mileage-manage",
  components: {
    subReq,
    detailTableData,
    summaryTableData,
    additionalRecordingDialog,
    fileDialog,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },//明细
      summaryPageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },//汇总
      detailTableHeight: 500,
      summaryTableHeight: 500,
      form:{},
      activeName: "first",
      mileDetailData: [], //明细
      mileSummaryData: [], //汇总
      loading: false,
      sumLoading: false,
      mileRecodeId:[],
      filedialogVisible: false, //打开导入弹窗
      isShowAdditionalRecordingDialog: false, //补录车辆公里
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/里程记录模板.xlsx`,
      },
      curType: "add", //编辑还是添加
    };
  },
  mounted() {
    this.loadData();
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
      if(tab.name == "second") {
        this.refreshSecondTableList()
      }else{
        this.refreshTableList()
        // this.loadData();
      }
    },
    onSubmit(form) {
      this.form = form;
      console.log(this.form);
      if(this.activeName == 'first') {
        this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
        this.loadData();
      }else{
        this.summaryPageInfo.pageIndex = 1;
        this.summaryPageInfo.pageCount = 0;
        this.loadSumData();
      }

    },
    // 数据明细加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.getVehicleMileManage(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.mileDetailData = res.context.list;
            this.mileSummaryData = res.context.list;
            this.pageInfo.pageCount = res.context.total
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 加载汇总数据
    loadSumData() {
      this.sumLoading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.summaryPageInfo.pageIndex;
      params.page_size = this.summaryPageInfo.pageSize;
      this.$client.getVehicleMileTotalVehicleMileManage(params)
        .then(res => {
          if (res.head.result == "200") {
            this.mileSummaryData = res.context.list;
            this.summaryPageInfo.pageCount = res.context.total
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
          this.sumLoading = false;
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 添加补录公里
    openAdditionalRecordingMileagePop() {
      this.curType = "add";
      this.isShowAdditionalRecordingDialog = true;
    },
    // 编辑添加补录公里
    editDetail(form) {
      console.log(form);
      this.curType = "edit";
      this.$refs.addEditVehicleMileage.ruleForm.id = form.id;
      this.$refs.addEditVehicleMileage.ruleForm.vehicle_id = form.vehicle_id;
      this.$refs.addEditVehicleMileage.ruleForm.date = form.date;
      this.$refs.addEditVehicleMileage.ruleForm.mile = form.mile;
      this.$refs.addEditVehicleMileage.ruleForm.remark = form.remark;
      this.isShowAdditionalRecordingDialog = true;
    },

    saveAddEditVehicleMileage(form) {
      let successrMessage = "";
      let parmas = {
        context: form,
      };
      if (this.curType == "add") {
        delete parmas.context.id;
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }

      this.$client
        .additionVehicleMile(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            if(this.curType == "add") {
              this.pageInfo.pageIndex = 1;
              this.pageInfo.pageCount = 0;
              this.form = {}
              this.$refs.head.resetForm('refresh')
            }else{
              this.loadData();
            }

            this.isShowAdditionalRecordingDialog = false;
            this.$message({
              showClose: true,
              message: successrMessage,
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {});
    },

    selectedMileDetailList(mileDetailList) {
      this.mileRecodeId = [];
      mileDetailList.forEach((item,index) => {
        this.mileRecodeId.push(item.id)
      });
      console.log(JSON.stringify(this.mileRecodeId))
    },

    // 批量删除
    batchesDelete() {
      if(this.mileRecodeId.length > 0) {
        this.deleteMileageInfo(null);
      }
    },

    // 数据删除
    deleteMileageInfo(form) {
      let parmas = {
        context:[]
      };
      if(!!form) {
        parmas.context[0] =form.id
      }else{
        parmas.context = this.mileRecodeId;
      }
      // alert(JSON.stringify(parmas))
      // return

      this.$client
      .deleteVehicleMile(parmas)
      .then((res) => {
        if (res.head.result == "200") {
          this.loadData();
          this.$message({
            showClose: true,
            message: '删除成功',
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
      .catch((err) => {});

    },
    // 重置明细
    refreshTableList() {
      // this.form = {};
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = 20;
      this.pageInfo.pageCount = 0;
      this.$refs.head.resetForm('refresh');
      // this.loadData();
    },
    // 重置汇总
    refreshSecondTableList() {
      // this.form = {};
      this.summaryPageInfo.pageIndex = 1;
      this.summaryPageInfo.pageSize = 20;
      this.summaryPageInfo.pageCount = 0;
      this.$refs.head.resetForm('refresh');
      // this.loadSumData();
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },

    openBatchExportPop() {
      this.filedialogVisible = true;
    },

    // 明细分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData();
    },
    // 明细切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },

    // 汇总分页切换事件
    handleSecondCurrentChange(idx) {
      this.summaryPageInfo.pageIndex = idx;
      this.loadSumData();
    },
    // 汇总切换每页条数
    handleSecondSizeChange(sizes) {
      this.summaryPageInfo.pageIndex = 1;
      this.summaryPageInfo.pageSize = sizes;
      this.summaryPageInfo.pageCount = 0;
      this.loadSumData();
    },

    onSubmitExcel(exportInfo) {
      // console.log(JSON.stringify(exportInfo))
      let formData = new FormData();
      formData.append("file", exportInfo.file);
      formData.append("type", exportInfo.radio);
      this.$client.importVehicleMile(formData)
      .then(res => {
        console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.refreshTableList();
          this.$message({ message: "导入成功", type: "success" });
          this.filedialogVisible = false;
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
          // this.$message({ message: "导入失败", type: "error" });
        }
      }).catch(err => {
        this.$message({ message: "导入失败", type: "error" });
      })

    },
    // 导出
    exportExcel() {
      const clineMap = {
        'first': 'exportVehicleMile',
        'second': 'ExportTotalVehicleMileManage'
      }
      let params = Object.assign({},this.form);
      if(this.activeName === 'first') {
        let ids = [ ...this.mileRecodeId ]
        if (ids.length) {
          params.ids = ids.toString()
        }
      }
      this.$client[clineMap[this.activeName]](params)
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

    // 计算表格高度 和初始化表头
    setHead(type) {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.detailTableHeight = maxh - th - 135;
        // console.log(this.detailTableHeight);
        this.summaryTableHeight = maxh - th - 92;
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.vehicle-mileage-manage {
  width: 100%;
  height: 100%;
}

.vehicle-mileage-manage-content /deep/ .el-tabs__item {
  width: 160px;
  // display flex
  // flex-direction row
  // justify-content center
  text-align: center;
}

.vehicle-mileage-manage-content /deep/ .el-tabs__nav-wrap::after {
  // content: "";
  // position: absolute;
  // left: 0;
  // bottom: 0;
  // width: 100%;
  height: 0px;
  // background-color: #E4E7ED;
  // z-index: 1;
}

.vehicle-mileage-manage /deep/ .el-pagination {
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
