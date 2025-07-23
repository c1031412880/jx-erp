<template>
  <div class="driver-salary-accounting">
    <div class="driver-salary-accounting-content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="按人员核算" name="first">
          <sub-req ref="head" @on-add="onAdd"  @on-ok="onSubmit" @on-addRules="onAddRules" @on-export="exportExcel"  @on-issue="paySlip"></sub-req>
          <div class="table-content">
            <tr-table
              ref="table"
              :selectionShow="false"
              :data="mileDetailData"
              :tableHeaderList="customSettingList"
              :TableHeight="detailTableHeight"
              :loading="loading"
              :frontFixedNum="1"
              :backFixedNum="1"
              @on-select-row="openSelectRowPage"
              :isShowSummary="true"
              :sumTotal="sumTotal"
              :sumColumnIndex="[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]"
            >
            </tr-table>
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
        <el-tab-pane label="按线路核算" name="second">
          <div class="table-content-second show-flex-box-r">
           <el-card class="box-card left-box" >
              <div
                slot="header"
                class="clearfix show-flex-box-r"
                style="height: 37px; flex-wrap: nowrap; align-items: center"
              >
                <span style="white-space: nowrap">线路选择</span>
              </div>
              <div class="show-flex-box-c" :style="`height: ${summaryTableHeight+10}px`">
                <line-tree
                  ref="lineTree"
                  :isShowCheckbox="false"
                  :isNodeExpanded="false"
                  :placeholder="'请输入关键词'"
                  @on-check="selectLineInfo"
                ></line-tree>
              </div>
            </el-card>
            <el-card class="box-card center-box" ref="centerBox">
              <div>
                <sub-req-second ref="secondHead" @on-ok="onSubmit" @on-export="exportExcel"></sub-req-second>
              </div>
              <div class="show-flex-box-c">
                <tr-table
                  ref="secondTable"
                  :selectionShow="false"
                  :data="mileSummaryData"
                  :tableHeaderList="customSettingList"
                  :TableHeight="summaryTableHeight"
                  :loading="sumLoading"
                  :frontFixedNum="1"
                  :backFixedNum="1"
                  @on-select-row="openSelectRowPage"
                  :isShowSummary="true"
                  :sumTotal="sumTotal"
                  :sumColumnIndex="[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]"
                >
                </tr-table>
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
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="add-bonus-dialog">
      <!-- 添加奖金 -->
      <add-bonus-dialog
        ref="addBonusDialog"
        :dialogBool.sync="isShowAddBonusDialog"
        :curType="curType"
        @save-add-edit="saveAddEdit"
      ></add-bonus-dialog>
      <!-- 薪资规则设定 -->
      <salary-rule-setting
        ref="salarRuleSetting"
        :dialogBool.sync="isShowSalarRuleSettingDialog"
        @save-add-edit="saveAddEdit"
      ></salary-rule-setting>
      <!-- 薪资详情 -->
      <driver-salary-detail
        ref="driverSalaryDetail"
        :dialogBool.sync="isShowDriverSalaryDetailDialog"
        :curDriverId="curDriverId"
      ></driver-salary-detail>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import subReqSecond from "./component/sub-req-second";
import lineTree from "./component/line-tree";
import addBonusDialog from "./component/add-bonus-dialog";
import salaryRuleSetting from "./component/salary-rule-setting";
import driverSalaryDetail from "./component/driver-salary-detail";

export default {
  name: "driver-salary-accounting",
  components: {
    subReq,
    subReqSecond,
    lineTree,
    addBonusDialog,
    salaryRuleSetting,
    driverSalaryDetail
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },//按人员核算
      summaryPageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },//按线路核算
      detailTableHeight: 500,
      summaryTableHeight: 500,
      form:{},
      secondForm:{
        tree_id:''
      },
      activeName: "first",
      mileDetailData: [], //按人员核算
      mileSummaryData: [], //按线路核算
      loading: false,
      sumLoading: false,
      customSettingList:[
        {
          id: 1,
          label: "姓名",
          prop: "driver_name",
          width: "100",
          align: "center",
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: "出勤天数（天）",
          prop: "totla_day",
          width: "160",
          align: "center",
          signIndex: 1,
          sortable:true
        },
        {
          id: 3,
          label: "日基础薪资总和（元）",
          prop: "total_day_base",
          width: "210",
          align: "center",
          signIndex: 2,
          sortable:true
        },
        {
          id: 4,
          label: "综合奖（元）",
          prop: "total_synthesize",
          width: "150",
          align: "center",
          signIndex: 3,
          sortable:true
        },
        {
          id: 5,
          label: "餐费补贴（元）",
          prop: "total_meals",
          width: "170",
          align: "center",
          signIndex: 4,
          sortable:true
        },
        {
          id: 6,
          label: "加班费（元）",
          prop: "total_overtime",
          width: "160",
          align: "center",
          signIndex: 5,
          sortable:true
        },
        {
          id: 7,
          label: "质量考核奖（元）",
          prop: "total_quality_check",
          width: "180",
          align: "center",
          signIndex: 6,
          sortable:true
        },
        {
          id: 8,
          label: "安全里程奖（元 ）",
          prop: "total_safe_mile",
          width: "180",
          align: "center",
          signIndex: 7,
          sortable:true
        },
        {
          id: 9,
          label: "精品线路考核奖（元）",
          prop: "total_line_check",
          width: "220",
          align: "center",
          signIndex: 8,
          sortable:true
        },
        {
          id: 10,
          label: "合计（元）",
          prop: "total",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable:true
        },
        {
          id: 11,
          label: "请假（班次数）",
          prop: "total_leave",
          width: "165",
          align: "center",
          signIndex: 10,
          sortable:true
        },
        {
          id: 12,
          label: "临时请假（班次数）",
          prop: "ls_leave",
          width: "190",
          align: "center",
          signIndex: 11,
          sortable:true
        },
        {
          id: 13,
          label: "请假应扣工资（元）",
          prop: "deducted_fee",
          width: "190",
          align: "center",
          signIndex: 12,
          sortable:true
        },
        {
          id: 14,
          label: "大班天数（天）",
          prop: "top_day",
          width: "160",
          align: "center",
          signIndex: 13,
          sortable:true
        },
        {
          id: 15,
          label: "小班天数（天）",
          prop: "small_day",
          width: "160",
          align: "center",
          signIndex: 14,
          sortable:true
        },
        {
          id: 16,
          label: "实发工资",
          prop: "total_actual",
          width: "150",
          align: "center",
          signIndex: 15,
          sortable:true
        }
      ],
      isShowAddBonusDialog: false,
      curType: "add", //编辑还是添加,
      isShowSalarRuleSettingDialog: false,
      isShowDriverSalaryDetailDialog: false,
      sumTotal:{ //约定某一列汇总合计自定义数据
        2:'',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: '',
        10: '',
        11: '',
        12: '',
        13: '',
        14: '',
        15: '',
        16: ''
      },
      curDriverId: 0, //当前选中的司机id
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
    handleClick(tab, event) {
      if(tab.name == "second") {
        let lineList = this.$refs.lineTree.data
        if(!!lineList && lineList.length > 0) {
          this.refreshSecondTableList();
          this.secondForm.tree_id = lineList[0].i_id;
          this.$refs.lineTree.setSelectCheckedKeys(this.secondForm.tree_id)
        }
      }else{
        this.refreshTableList()
      }
    },
    onSubmit(form) {
      if(this.activeName == 'first') {
        this.form = form;
        this.pageInfo.pageIndex = 1;
        this.pageInfo.pageCount = 0;
        this.$refs.driverSalaryDetail.form.date = this.form.date;
        this.loadData();
      }else{
        this.secondForm = Object.assign(this.secondForm, form);
        if(!form.date) {
          delete this.secondForm.date
        }
        if(!form.driver_id || form.driver_id.length == 0) {
          delete this.secondForm.driver_id
        }
        this.summaryPageInfo.pageIndex = 1;
        this.summaryPageInfo.pageCount = 0;
        this.$refs.driverSalaryDetail.form.date = this.secondForm.date;
        this.$refs.driverSalaryDetail.form.tree_id = this.secondForm.tree_id;
        this.loadSumData();
      }
    },
    // 数据按人员核算
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.QuerySalaryByEmpSalaryList(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.mileDetailData = res.context.list;
            this.pageInfo.pageCount = res.context.total;
            this.sumTotal = {
              2 : res.context.summary.totla_day,
              3 : res.context.summary.total_day_base,
              4 : res.context.summary.total_synthesize,
              5 : res.context.summary.total_meals,
              6 : res.context.summary.total_overtime,
              7 : res.context.summary.total_quality_check,
              8 : res.context.summary.total_safe_mile,
              9 : res.context.summary.total_line_check,
              10 : res.context.summary.total_total,
              11 : res.context.summary.total_leave,
              12: res.context.summary.total_ls_leave,
              13 : res.context.summary.deducted_fee,
              14 : res.context.summary.top_day,
              15 : res.context.summary.small_day,
              16 : res.context.summary.total_actual,
            }
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
    // 选择中的线路
    selectLineInfo(lineInfo) {
      console.log(lineInfo)
      this.secondForm.tree_id = lineInfo[0].i_id
      this.$refs.secondHead.onSubmit()
    },

    // 加载按线路核算
    loadSumData() {
      this.sumLoading = true;
      console.log(this.secondForm)
      let params = Object.assign({}, this.secondForm);
      params.page_index = this.summaryPageInfo.pageIndex;
      params.page_size = this.summaryPageInfo.pageSize;
      this.$client.QuerySalaryByEmpSalaryList(params)
        .then(res => {
          if (res.head.result == "200") {
            this.mileSummaryData = res.context.list;
            this.summaryPageInfo.pageCount = res.context.total;
            this.sumTotal = {
              2 : res.context.summary.totla_day,
              3 : res.context.summary.total_day_base,
              4 : res.context.summary.total_synthesize,
              5 : res.context.summary.total_meals,
              6 : res.context.summary.total_overtime,
              7 : res.context.summary.total_quality_check,
              8 : res.context.summary.total_safe_mile,
              9 : res.context.summary.total_line_check,
              10 : res.context.summary.total_total,
              11 : res.context.summary.total_leave,
              12: res.context.summary.total_ls_leave,
              13 : res.context.summary.deducted_fee,
              14 : res.context.summary.top_day,
              15 : res.context.summary.small_day,
              16 : res.context.summary.total_actual,
            }
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

    // 添加
    onAdd() {
      this.curType = "add";
      this.isShowAddBonusDialog = true;
    },
    // 保存
    saveAddEdit(form) {
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
        .AddSalarySalaryList(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            if(this.curType == "add") {
              this.pageInfo.pageIndex = 1;
              this.pageInfo.pageCount = 0;
              this.loadData();
            }else{
              this.loadData();
            }

            this.isShowAddBonusDialog = false;
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
    // 打开薪资规则设定
    onAddRules() {
      this.isShowSalarRuleSettingDialog = true
    },
    // 重置按人员核算
    refreshTableList() {
      // this.form = {};
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = 20;
      this.pageInfo.pageCount = 0;
      this.$refs.head.resetForm('refresh');
    },
    // 重置按线路核算
    refreshSecondTableList() {
      // this.form = {};
      this.summaryPageInfo.pageIndex = 1;
      this.summaryPageInfo.pageSize = 20;
      this.summaryPageInfo.pageCount = 0;
      // this.$refs.secondHead.resetForm('refresh');
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },

    // 按人员核算分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData();
    },
    // 按人员核算切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },

    // 按线路核算分页切换事件
    handleSecondCurrentChange(idx) {
      this.summaryPageInfo.pageIndex = idx;
      this.loadSumData();
    },
    // 按线路核算切换每页条数
    handleSecondSizeChange(sizes) {
      this.summaryPageInfo.pageIndex = 1;
      this.summaryPageInfo.pageSize = sizes;
      this.summaryPageInfo.pageCount = 0;
      this.loadSumData();
    },
    // 导出
    exportExcel() {
      let parmas = this.activeName == 'first'? this.form: this.secondForm;
      this.$client.ExportSalaryList(parmas)
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
    // 打开工资条明细
    openSelectRowPage(row) {
      this.curDriverId = row.driver_id || 0
       if(this.activeName == 'first') {
         this.$refs.driverSalaryDetail.form.date = this.form.date;
      }else{
        this.$refs.driverSalaryDetail.form.date = this.secondForm.date;
        this.$refs.driverSalaryDetail.form.tree_id = this.secondForm.tree_id;
      }
      this.isShowDriverSalaryDetailDialog = true
    },
    // 下发工资条
    paySlip() {
      this.$confirm('是否确认下发', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          setTimeout(() => {
            this.$message.success('下发成功，请在APP中查看')
          }, 1000);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    },
    // 计算表格高度 和初始化表头
    setHead(type) {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.detailTableHeight = maxh - th - 115;
        let thSecond = this.$refs.secondHead.$el.offsetHeight;
        // console.log(this.detailTableHeight);
        this.summaryTableHeight = maxh - thSecond - 152;
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.driver-salary-accounting {
  width: 100%;
  height: 100%;
}

.driver-salary-accounting-content /deep/ .el-tabs__item {
  width: 160px;
  // display flex
  // flex-direction row
  // justify-content center
  text-align: center;
}

.driver-salary-accounting-content /deep/ .el-tabs__nav-wrap::after {
  // content: "";
  // position: absolute;
  // left: 0;
  // bottom: 0;
  // width: 100%;
  height: 0px;
  // background-color: #E4E7ED;
  // z-index: 1;
}

.driver-salary-accounting /deep/ .el-pagination {
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

.table-content-second {
  width: 100%;
  height: 100%;
  display: flex;

  .box-card {
    height: 100%;
    overflow: auto;
  }

  .left-box {
    // flex: 0 0 23vw;
    margin: 0 5px 0 0;
    width: 240px;
    height: 100%;
  }

  .center-box {
    flex: 1;
    height: 100%;
  }
}
</style>
