<template>
  <div class="driver-mileage-statistics">
    <el-card class="box-card left-box" >
      <div
        slot="header"
        class="clearfix show-flex-box-r"
        style="height: 37px; flex-wrap: nowrap; align-items: center"
      >
        <span style="white-space: nowrap">线路选择</span>
      </div>
      <div class="show-flex-box-c" :style="`height: ${treeBoxHeight}px`">
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
      <sub-req ref="head" 
        @on-ok="onSubmit" 
        @on-export1="exportFirstFile"
        @on-export2="exportSecondFile"
      ></sub-req>
      <el-row :gutter="10">
        <el-col :span="10">
          <tr-table
            :indexShow="true"
            :selectionShow="false"
            :data="firstData"
            :isShowSummary="true"
            :sumColumnIndex="[3,4,5,6,7]"
            :sumTotal="firstSumTotal"
            :tableHeaderList="firstCustomSettingList"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :loading="firstLoading"
            @on-select-row="selectedRowInfo">
          </tr-table>
          <el-pagination
            style="margin: 5px 0;display:flex; justify-content: flex-end;"
            @current-change="firstHandleCurrentChange"
            @size-change="firstHandleSizeChange"
            ref="paginationH"
            :current-page="firstPageInfo.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            :page-size="firstPageInfo.pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="firstPageInfo.pageCount">
          </el-pagination>
        </el-col>


        <el-col :span="14">
          <tr-table
            :indexShow="true"
            :selectionShow="false"
            :data="secondData"
            :isShowSummary="true"
            :tableHeaderList="secondCustomSettingList"
            :isShowBottomOptions="false"
            :omitColumnIndex="[ 4 ]"
            :TableHeight="TableHeight"
            :loading="secondLoading">
            <!-- <template slot-scope="scope" slot="AdditionMile">
              <el-input-number v-model="scope.data.AdditionMile" style="width: 100%" :min="0" :controls="false" v-if="type == 'edit' && scope.index == rowIndex"></el-input-number>
              <span v-else>{{scope.data.AdditionMile}}</span>
            </template>
            <template slot-scope="scope" slot="operation">
              <el-button type="text" style="color:#67c23a;padding:0" v-if="type == 'edit' && rowIndex == scope.index" @click="save(scope.data)">保存</el-button>
              <el-button style="padding:0" type="text" v-else @click="edit(scope.index)">编辑</el-button>
            </template> -->
          </tr-table>

        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import lineTree from "@/components/base/formModel/tree/line-tree";

export default {
  name: "driver-mileage-statistics",
  components: {
    subReq,
    lineTree
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
    });
  },
  data() {
    return {
      firstPageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      firstData: [],
      firstForm: {},
      firstLoading: false,
      TableHeight: 500,
      treeBoxHeight: 500,
      firstCustomSettingList: [
        {
          id: 2,
          label: "线路",
          prop: "LineName",
          width: "80",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 2,
          label: "驾驶员",
          prop: "DriverName",
          width: "80",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "总趟数",
          prop: "Count",
          width: "80",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "理论里程",
          prop: "DispatchMile",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "额外里程",
          prop: "AdditionMile",
          width: "100",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "总里程",
          prop: "TotalMile",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "总用时",
          prop: "TotalCostTime",
          width: "80",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
      ],
      firstSumTotal: {
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
      },


      secondLoading:false,
      secondData: [],
      secondForm: {
        driver_name: '',
        start_time: '',
        end_time: '',
      },
      secondCustomSettingList: [
        {
          id: 1,
          label: "日期",
          prop: "Date",
          width: "100",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "线路",
          prop: "LineName",
          width: "80",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "车牌号",
          prop: "VehicleGrantCode",
          width: "120",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "自编号",
          prop: "VehicleCode",
          width: "100",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "总里程",
          prop: "TotalMile",
          width: "90",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "总用时(h)",
          prop: "TotalCostTime",
          width: "100",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "趟次",
          prop: "Count",
          width: "60",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "每趟里程",
          prop: "AvgMile",
          width: "100",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "理论里程",
          prop: "DispatchMile",
          width: "100",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "理论用时",
          prop: "DispatchTotalCostTime",
          width: "100",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "额外里程",
          prop: "AdditionMile",
          width: "100",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "额外用时",
          prop: "AdditionTime",
          width: "100",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        // {
        //   id: 11,
        //   label: "操作",
        //   prop: "operation",
        //   width: "80",
        //   align: "center",
        //   signIndex: 10,
        // },
      ],
      rowIndex: null,
      type: 'detail'
    }
  },
  methods: {
    // 线路树点击
    selectLineInfo(lineInfo) {
      if (lineInfo[0].type == 1) {
        this.firstForm.dept_id = lineInfo[0].i_id
        this.firstForm.line_id = ''
        // 最上层 主集团
        if (lineInfo[0].parent_id == 0) {
          this.firstForm.dept_id = 0
        }
      } else if (lineInfo[0].type == 2) {
        this.firstForm.dept_id = ''
        this.firstForm.line_id = lineInfo[0].i_id
      }
      this.loadData()
    },
    // 行点击
    selectedRowInfo(row) {
      this.secondForm.driver_name = row.DriverName
      this.secondForm.start_time = this.firstForm.start_time
      this.secondForm.end_time = this.firstForm.end_time
      this.secondForm.line_id = this.firstForm.line_id
      this.secondForm.dept_id = this.firstForm.dept_id

      this.secondLoadData()
    },
    onSubmit(form) {
      this.firstForm = form
      this.firstPageInfo.pageIndex = 1
      this.loadData()
    },
    // 获取数据
    loadData() {
      this.firstLoading = true
      let params = Object.assign({}, this.firstForm);
      params.page_index = this.firstPageInfo.pageIndex
      params.page_size = this.firstPageInfo.pageSize
      this.$client.DriverMileSummayVehicleOilRecordSummary(params).then(res => {
        this.firstLoading = false
        if (res.head.result == "200") {
            this.firstData = res.context.list
            this.firstPageInfo.pageCount = res.context.total
            this.firstSumTotal = {
              3: res.context.summary['Count'],
              4: res.context.summary['DispatchMile'],
              5: res.context.summary['AdditionMile'],
              6: res.context.summary['TotalMile'],
              7: res.context.summary['TotalCostTime'],
            }
            // 清空明细数据
            this.secondData = []
            this.secondPageInfo = {
              pageIndex: 1,
              pageSize: 20,
              pageCount: 0,
            }
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      })
    },
    // 导出Excel
    exportFirstFile() {
      let params = Object.assign({}, this.firstForm);
      this.$client.DriverMileExportVehicleOilRecordSummary(params).then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },
    // 导出Excel
    exportSecondFile() {
      let params = Object.assign({}, this.secondForm);
      this.$client.DriverMileDetailExportVehicleOilRecordSummary(params).then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },
    // 分页切换事件
    firstHandleCurrentChange(val) {
      this.firstPageInfo.pageIndex = val
      this.loadData()
    },
    // 切换每页条数
    firstHandleSizeChange(val) {
      this.firstPageInfo.pageSize = val
      this.firstPageInfo.pageIndex = 1
      this.firstPageInfo.pageCount = 0;
      this.loadData()
    },

    // 获取明细 
    secondLoadData() {
      this.secondLoading = true
      let params = Object.assign({}, this.secondForm);
      params.page_index = 1;
      params.page_size = 1000;
      this.$client.DriverDetailMileSummayVehicleOilRecordSummary(params).then(res => {
        this.secondLoading = false
        if (res.head.result == "200") {
            this.secondData = res.context.list
            this.secondPageInfo.pageCount = res.context.total
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      })
    },
    edit(index) {
      this.type = 'edit'
      this.rowIndex = index
    },
    save(row) {
      this.$client.UpdateMileDetailVehicleOilRecordSummary({context: row}).then(res => {
        if (res.head.result == "200") {
          this.type = "detail"
          this.rowIndex = null
          this.secondLoadData()
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },

    // 计算表格高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH - 30;
        this.treeBoxHeight = maxh - 125
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.driver-mileage-statistics {
  height: 100%;
  width: 100%;
  display: flex;
  .box-card {
    height: 100%;
    overflow: auto;
  }
  .left-box {
    // flex: 0 0 23vw;
    margin: 0 5px 0 0;
    width: 210px;
    height: 100%;
  }

  .center-box {
    flex: 1;
    height: 100%;
  }
}
.driver-mileage-statistics /deep/ .el-card__header {
  background-color: #F5F5F5;
  padding: 12px 20px;
}

.driver-mileage-statistics /deep/ .el-card__body {
  padding: 5px 10px;
}
</style>
