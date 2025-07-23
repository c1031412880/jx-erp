<template>
  <div class="reward-punishment-rules-management">
    <div class="reward-punishment-rules-management-content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="奖惩种类" name="first">
          <div class="button-total show-flex-box-r" style="margin-bottom: 15px">
            <div class="show-flex-box-r">
              <el-button
                type="primary"
                size="mini"
                @click="openAdditionalRecordingMileagePop"
                v-if="$isPowerShow('add')"
                style="margin-right:10px;"
                >添加</el-button
              >
              <el-popconfirm
                @confirm="batchesDelete()"
                v-if="$isPowerShow('del')"
                title="确定要删除勾选的记录？">
                <el-button slot="reference" type="primary" size="mini">删除</el-button>
              </el-popconfirm>
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
        </el-tab-pane>
        <el-tab-pane label="奖惩情形" name="second">
          <div class="button-total show-flex-box-r" style="margin-bottom: 15px">
            <div class="show-flex-box-r">
              <el-button
                type="primary"
                size="mini"
                @click="openAdditionalRecordSecondPop"
                v-if="$isPowerShow('add')"
                style="margin-right:10px;"
                >添加</el-button
              >
              <el-popconfirm
                @confirm="batchesSecondDelete()"
                v-if="$isPowerShow('del')"
                title="确定要删除勾选的记录？">
                <el-button slot="reference" type="primary" size="mini">删除</el-button>
              </el-popconfirm>
            </div>
          </div>
          <div class="table-content">
            <summary-table-data
              :data="mileSummaryData"
              :TabelHeight="summaryTableHeight"
              :activeName="activeName"
              :loading="sumLoading"
              @edit-detail="editSecondDetail"
              @delete-mileage-info="deleteSecondRowInfo"
              @selected-mile-detail-list="selectedSelectedRowsList"
            ></summary-table-data>
            <el-pagination
              style="margin: 5px 0;display:flex; justify-content: flex-end;"
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
      <additional-recording-dialog
        ref="addEditVehicleMileage"
        :dialogBool.sync="isShowAdditionalRecordingDialog"
        :curType="curType"
        @save-add-edit-type="saveAddEditType"
      ></additional-recording-dialog>
      <rewards-punishments
        ref="rewardsPunishments"
        :dialogBool.sync="isShowRewardsPunishmentsDialog"
        :curType="curRewardsPunishmentsType"
        @save-add-edit-type="saveAddEditRewardsPunishments"
      ></rewards-punishments>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import detailTableData from "./component/detail-table";
import summaryTableData from "./component/summary-table";
import additionalRecordingDialog from "./component/additional-recording-dialog";
import rewardsPunishments from "./component/rewards-punishments";

export default {
  name: "reward-punishment-rules-management",
  components: {
    detailTableData,
    summaryTableData,
    additionalRecordingDialog,
    rewardsPunishments
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },//奖惩种类
      summaryPageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },//奖惩情形
      detailTableHeight: 500,
      summaryTableHeight: 500,
      form:{},
      activeName: "first",
      mileDetailData: [], //奖惩种类
      mileSummaryData: [], //奖惩情形
      loading: false,
      sumLoading: false,
      mileRecodeId:[],
      selectedIds:[],
      isShowAdditionalRecordingDialog: false, 
      curType: "add", //编辑还是添加
      curRewardsPunishmentsType:"add",
      isShowRewardsPunishmentsDialog: false
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
      if(tab.name == "second") {
        this.refreshSecondTableList()
      }else{
        this.refreshTableList()
      }
    },
    onSubmit(form) {
      this.form = form;
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
    // 奖惩种类
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetKindByPageReward(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.mileDetailData = res.context.list;
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
    // 奖惩情形数据
    loadSumData() {
      this.sumLoading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.summaryPageInfo.pageIndex;
      params.page_size = this.summaryPageInfo.pageSize;
      this.$client.GetCaseByPageReward(params)
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
    // 添加奖惩种类
    openAdditionalRecordingMileagePop() {
      this.curType = "add";
      this.isShowAdditionalRecordingDialog = true;
    },
    // 编辑奖惩种类
    editDetail(val) {
      let form = JSON.parse(JSON.stringify(val))
      this.curType = "edit";
      this.$refs.addEditVehicleMileage.ruleForm.id = form.id;
      this.$refs.addEditVehicleMileage.ruleForm.type = form.type;
      this.$refs.addEditVehicleMileage.ruleForm.type_child = form.type_child;
      this.$refs.addEditVehicleMileage.ruleForm.content = form.content;
      this.$refs.addEditVehicleMileage.ruleForm.pact = form.pact;
      this.isShowAdditionalRecordingDialog = true;
    },
    // 添加编辑奖惩种类
    saveAddEditType(form) {
      let successrMessage = "";
      let parmas = {
        context: form,
      };
      if (this.curType == "add") {
        delete parmas.context.id;
        successrMessage = "添加成功";
        this.$client
          .CreateKindReward(parmas)
          .then((res) => {
            if (res.head.result == "200") {
              this.pageInfo.pageIndex = 1;
              this.pageInfo.pageCount = 0;
              this.loadData();
  
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
      } else {
        successrMessage = "编辑成功";
        this.$client
          .UpdateKindReward(parmas)
          .then((res) => {
            if (res.head.result == "200") {
              this.loadData();
  
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
      }

    },
    // 打开奖惩情形添加弹窗
    openAdditionalRecordSecondPop(){
      this.curRewardsPunishmentsType = 'add'
      this.isShowRewardsPunishmentsDialog = true
    },
    // 编辑奖惩情形
    editSecondDetail(val) {
      let form = JSON.parse(JSON.stringify(val))
      this.curRewardsPunishmentsType = "edit";
      this.$refs.rewardsPunishments.ruleForm.id = form.id;
      this.$refs.rewardsPunishments.ruleForm.type = form.type;
      this.$refs.rewardsPunishments.selectedType(form.type)
      this.$refs.rewardsPunishments.ruleForm.title = form.title;
      this.$refs.rewardsPunishments.ruleForm.pact = form.pact;
      if(!!form.kinds && form.kinds.length) {
        this.$refs.rewardsPunishments.ruleForm.kind_ids = form.kinds.map(item => item.id)
      }
      this.isShowRewardsPunishmentsDialog = true;
    },
    // 添加编辑奖惩情形
    saveAddEditRewardsPunishments(form) {
       let successrMessage = "";
      let parmas = {
        context: form,
      };
      if (this.curRewardsPunishmentsType == "add") {
        delete parmas.context.id;
        successrMessage = "添加成功";
        this.$client
          .CreateKindRewardReward(parmas)
          .then((res) => {
            if (res.head.result == "200") {
              this.pageInfo.pageIndex = 1;
              this.pageInfo.pageCount = 0;
              this.loadSumData();
  
              this.isShowRewardsPunishmentsDialog = false;
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
      } else {
        successrMessage = "编辑成功";
        this.$client
          .UpdateCaseReward(parmas)
          .then((res) => {
            if (res.head.result == "200") {
              this.loadSumData();
  
              this.isShowRewardsPunishmentsDialog = false;
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
      }
    },

    // 勾选奖惩种类
    selectedMileDetailList(mileDetailList) {
      this.mileRecodeId = [];
      mileDetailList.forEach((item,index) => {
        this.mileRecodeId.push(item.id)
      });
    },
    // 勾选奖惩情形
    selectedSelectedRowsList(mileDetailList) {
      this.selectedIds = [];
      mileDetailList.forEach((item,index) => {
        this.selectedIds.push(item.id)
      });
    },

    // 批量奖惩种类删除
    batchesDelete() {
      if(this.mileRecodeId.length > 0) {
        this.deleteMileageInfo(null);
      }else{
        this.$message({
          message: '请勾选要删除的奖惩种类记录',
          type: 'warning'
        });
      }
    },

    // 数据奖惩种类删除
    deleteMileageInfo(form) {
      let parmas = {
        context:[]
      };
      if(!!form) {
        parmas.context[0] =form.id
      }else{
        parmas.context = this.mileRecodeId;
      }

      this.$client
      .DeleteKindReward(parmas)
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

    },

    // 批量奖惩情形删除
    batchesSecondDelete() {
      if(this.selectedIds.length > 0) {
        this.deleteSecondRowInfo(null);
      }else{
        this.$message({
          message: '请勾选要删除的奖惩情形记录',
          type: 'warning'
        });
      }
    },

     // 数据奖惩情形删除
    deleteSecondRowInfo(form) {
      let parmas = {
        context:[]
      };
      if(!!form) {
        parmas.context[0] =form.id
      }else{
        parmas.context = this.selectedIds;
      }

      this.$client
      .DeleteCaseReward(parmas)
      .then((res) => {
        if (res.head.result == "200") {
          this.loadSumData();
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

    },

    // 重置明细
    refreshTableList() {
      // this.form = {};
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = 20;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 重置汇总
    refreshSecondTableList() {
      // this.form = {};
      this.summaryPageInfo.pageIndex = 1;
      this.summaryPageInfo.pageSize = 20;
      this.summaryPageInfo.pageCount = 0;
      this.loadSumData();
    },

    // 奖惩种类切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData();
    },
    // 奖惩种类切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },

    // 奖惩情形分页切换事件
    handleSecondCurrentChange(idx) {
      this.summaryPageInfo.pageIndex = idx;
      this.loadSumData();
    },
    // 奖惩情形切换每页条数
    handleSecondSizeChange(sizes) {
      this.summaryPageInfo.pageIndex = 1;
      this.summaryPageInfo.pageSize = sizes;
      this.summaryPageInfo.pageCount = 0;
      this.loadSumData();
    },

    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        this.detailTableHeight = maxh  - 135;
        this.summaryTableHeight = maxh  - 135;
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.reward-punishment-rules-management {
  width: 100%;
  height: 100%;
}

.reward-punishment-rules-management-content /deep/ .el-tabs__item {
  width: 160px;
  // display flex
  // flex-direction row
  // justify-content center
  text-align: center;
}

.reward-punishment-rules-management-content /deep/ .el-tabs__nav-wrap::after {
  // content: "";
  // position: absolute;
  // left: 0;
  // bottom: 0;
  // width: 100%;
  height: 0px;
  // background-color: #E4E7ED;
  // z-index: 1;
}

// .vehicle-mileage-manage /deep/ .el-pagination {
//   margin-top: 5px;
//   display: flex;
//   justify-content: flex-end;
// }

// .button-total{
//   justify-content space-between
// }
// .button-total-right{
//   align-items center
// }
</style>
