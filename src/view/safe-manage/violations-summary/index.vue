<template>
  <div class="violations-summary">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="按组织汇总" name="1">
        <sub-req
          ref="firstHead"
          :activeName="'1'"
          @on-export="onExport"
          @on-ok="onSubmit"
        ></sub-req>
        <tr-table
          :selectionShow="false"
          :data="firstData"
          :tableHeaderList="firstcustomSettingList"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="1"
          :isShowSummary="true"
          :omitColumnIndex='[1,2]'
        >
        <template slot-scope="scope" slot="operation">
            <el-button type="text" size="mini" style="margin-left: 10px;" @click="checkDetail(scope.data)">查看明细</el-button>
          </template>
        </tr-table>
      </el-tab-pane>
      <el-tab-pane label="按线路汇总" name="2">
        <sub-req
          ref="secondHead"
          :activeName="'2'"
          @on-export="onExport"
          @on-ok="onSubmit"
        ></sub-req>
        <tr-table
          :selectionShow="false"
          :data="secondData"
          :tableHeaderList="secondcustomSettingList"
          :isShowBottomOptions="false"
          :TableHeight="secondTableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="1"
          :isShowSummary="true"
          :omitColumnIndex='[1,2,3]'
        >
          <template slot-scope="scope" slot="operation">
            <el-button type="text" size="mini" style="margin-left: 10px;" @click="checkDetail(scope.data)">查看明细</el-button>
          </template>
        </tr-table>
      </el-tab-pane>
      <el-tab-pane label="按驾驶员汇总" name="3">
        <sub-req
          ref="thirdHead"
          :activeName="'3'"
          @on-export="onExport"
          @on-ok="onSubmit"
        ></sub-req>
        <tr-table
          :selectionShow="false"
          :data="thirdData"
          :stripe="false"
          :tableHeaderList="thirdcustomSettingList"
          :isShowBottomOptions="false"
          :TableHeight="thirdTableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="1"
          :isShowSummary="true"
          :sumTotal="sumTotal"
          :sumColumnIndex="[4,5,6,7,8,9]"
          :summaryText="'合'"
        >
          <template slot-scope="scope" slot="operation">
            <el-button type="text" size="mini" style="margin-left: 10px;" @click="checkDetail(scope.data)">查看明细</el-button>
          </template>
        </tr-table>
        <el-pagination
          style="margin: 5px 0;display:flex; justify-content: flex-end;"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          ref="paginationH"
          :current-page="pageInfo.pageIndex"
          :page-sizes="[50, 100, 200, 500, 1000, 5000]"
          :page-size="pageInfo.pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="pageInfo.pageCount"
        >
        </el-pagination>
      </el-tab-pane>
      <!-- <el-tab-pane label="按驾驶员车辆汇总" name="4">
        <sub-req
          ref="fourthHead"
          :activeName="'4'"
          @on-export="onExport"
          @on-ok="onSubmit"
        ></sub-req>
        <tr-table
          :selectionShow="false"
          :data="fourthData"
          :stripe="false"
          :spanMethodType="['column']"
          :rowspanObj="fourthRowspanObj"
          :mergekeys="fourthMergekeys"
          :tableHeaderList="fourthcustomSettingList"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="1"
          :isShowSummary="true"
          :omitColumnIndex='[1,2,3,8]'>
          <template slot-scope="scope" slot="operation">
            <el-button type="text" size="mini" style="margin-left: 10px;" @click="checkDetail(scope.data)">查看明细</el-button>
          </template>
        </tr-table>
      </el-tab-pane> -->
    </el-tabs>
    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :title="'查看明细'"
    ></information-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
export default {
  name: "violations-summary",
  components: {
    subReq,
    informationDialog
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 100,
        pageCount: 0,
      },
      activeName: "1",
      form: {},
      firstData: [],
      secondData: [],
      thirdData: [],
      fourthData: [],
      loading: false,
      TableHeight: 500,
      secondTableHeight:500,
      thirdTableHeight: 500,
      firstcustomSettingList: [
        {
          id: 1,
          label: "组织",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "日期",
          prop: "date",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "违规次数",
          prop: "violation_count",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "日常检查",
          prop: "daily_count",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "视频监控抽查",
          prop: "vedio_count",
          width: "150",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "信访投诉",
          prop: "report_count",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "电话投诉",
          prop: "phone_count",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "有责投诉",
          prop: "duty_count",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        }
      ],
      secondcustomSettingList: [
        {
          id: 1,
          label: "线路",
          prop: "line_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "所属组织",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "日期",
          prop: "date",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "违规次数",
          prop: "violation_count",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "日常检查",
          prop: "daily_count",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "视频监控抽查",
          prop: "vedio_count",
          width: "150",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "信访投诉",
          prop: "report_count",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "电话投诉",
          prop: "phone_count",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "有责投诉",
          prop: "duty_count",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        }
      ],
      thirdcustomSettingList: [
        {
          id: 1,
          label: "驾驶员",
          prop: "driver_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "所属组织",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "日期",
          prop: "date",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "违规次数",
          prop: "violation_count",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "日常检查",
          prop: "daily_count",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "视频监控抽查",
          prop: "vedio_count",
          width: "150",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "信访投诉",
          prop: "report_count",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "电话投诉",
          prop: "phone_count",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "有责投诉",
          prop: "duty_count",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        }
      ],
      // fourthcustomSettingList: [
      //   {
      //     id: 1,
      //     label: "驾驶员",
      //     prop: "driver_name",
      //     width: "130",
      //     align: "center",
      //     signIndex: 0,
      //     sortable: false,
      //   },
      //   {
      //     id: 2,
      //     label: "所属组织",
      //     prop: "department_name",
      //     width: "130",
      //     align: "center",
      //     signIndex: 1,
      //     sortable: false,
      //   },
      //   {
      //     id: 3,
      //     label: "线路",
      //     prop: "line_name",
      //     width: "130",
      //     align: "center",
      //     signIndex: 2,
      //     sortable: false,
      //   },
      //   {
      //     id: 4,
      //     label: "违法数量",
      //     prop: "total_violation",
      //     width: "130",
      //     align: "center",
      //     signIndex: 3,
      //     sortable: true,
      //   },
      //   {
      //     id: 5,
      //     label: "未处理",
      //     prop: "total_undispose",
      //     width: "130",
      //     align: "center",
      //     signIndex: 4,
      //     sortable: true,
      //   },
      //   {
      //     id: 6,
      //     label: "扣分",
      //     prop: "total_score",
      //     width: "130",
      //     align: "center",
      //     signIndex: 5,
      //     sortable: true,
      //   },
      //   {
      //     id: 7,
      //     label: "罚款",
      //     prop: "total_money",
      //     width: "130",
      //     align: "center",
      //     signIndex: 6,
      //     sortable: true,
      //   },
      //   {
      //     id: 8,
      //     label: "操作",
      //     prop: "operation",
      //     width: "130",
      //     align: "center",
      //     signIndex: 7,
      //     sortable: false,
      //   }
      // ],
      frontFixedNum: 1, //前几行固定
      sumTotal:{ //约定某一列汇总合计自定义数据
        4:'',
        5: '',
        6:'',
        7: '',
        8:'',
        9: '',
      },
      informationDialogShow: false
    };
  },
  mounted() {
    // this.loadData();
    this.$refs.firstHead.onSubmit('1');
    this.$refs.secondHead.onSubmit('2');
    this.$refs.thirdHead.onSubmit('3');
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
      // switch (tab.name) {
      //   case '1':
      //     this.$refs.firstHead.resetForm();
      //     break;
      //   case '2':
      //     this.$refs.secondHead.resetForm();
      //     break;
      //   case '3':
      //     this.$refs.thirdHead.resetForm();
      //     break;
      //   // case '4':
      //   //   this.$refs.fourthHead.onSubmit();
      //   //   break;
      // }
      this.setHead();
    },
    onSubmit(form) {
      this.form = form
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      if(this.activeName == '3') {
        params.page_index = this.pageInfo.pageIndex;
        params.page_size = this.pageInfo.pageSize;
      }
      this.$client.GetDataViolationSummary(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            switch (params.data_type) {
              case '1':
                this.firstData = res.context.data;
                break;
              case '2':
                this.secondData = res.context.data;
                break;
              case '3':
                this.thirdData = res.context.data;
                this.pageInfo.pageCount = res.context.total;
                this.sumTotal = {
                  4 : res.context.total_violation_count || 0,
                  5 : res.context.total_daily_count || 0,
                  6 : res.context.total_vedio_count || 0,
                  7 : res.context.total_report_count || 0,
                  8 : res.context.total_report_count || 0,
                  9 : res.context.total_duty_count || 0,
                }
                break;
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
    // 导出
    onExport() {
      let params = Object.assign({}, this.form);
      params.data_type = this.activeName;
      this.$client.ExportViolationSummary(params).then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },
    // 查看明细
    checkDetail(row) {
      this.$refs.informationDialog.form.date_type = this.form.date_type
      this.$refs.informationDialog.form.day = row.day
      this.$refs.informationDialog.form.month = row.month
      this.$refs.informationDialog.form.year = row.year
      this.$refs.informationDialog.form.quarter = row.quarter
      this.$refs.informationDialog.form.group_id = row.group_id
      this.$refs.informationDialog.form.line_id = row.line_id
      this.$refs.informationDialog.form.driver_id = row.driver_id
      this.$refs.informationDialog.form.data_type = this.activeName
      this.informationDialogShow = true
    },

    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        if(this.activeName == '1') {
          let th = this.$refs.firstHead.$el.offsetHeight;
          this.TableHeight = maxh - th - 50;
        }
        if(this.activeName == '2') {
          let th = this.$refs.secondHead.$el.offsetHeight;
          this.secondTableHeight = maxh - th - 50;
        }
        if(this.activeName == '3') {
          let th = this.$refs.thirdHead.$el.offsetHeight;
          let paginationH = this.$refs.paginationH.$el.offsetHeight;
          this.thirdTableHeight = maxh - th - 60 -paginationH;
        }
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.violations-summary {
  width: 100%;
  height: 100%;
}

.violations-summary /deep/ .el-tabs__item {
  width: 160px;
  text-align: center;
}

.violations-summary /deep/ .el-tabs__nav-wrap::after {
  height: 0px;
}
</style>
