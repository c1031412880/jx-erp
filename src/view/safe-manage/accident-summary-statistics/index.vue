<template>
  <div class="accident-summary-statistics">
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
          >
          <!-- :omitColumnIndex='[1,2,3,4,5,9]' -->
        </tr-table>
      </el-tab-pane>
      <el-tab-pane label="按线路汇总" name="3">
        <sub-req
          ref="thirdHead"
          :activeName="'3'"
          @on-export="onExport"
          @on-ok="onSubmit"
        ></sub-req>
        <tr-table
          :selectionShow="false"
          :data="thirdData"
          :tableHeaderList="thirdcustomSettingList"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="0"
          :isShowSummary="true"
          >
          <!-- :omitColumnIndex='[1,2,3,4,5,6]' -->
          <!-- <template slot-scope="scope" slot="operation">
            <el-button type="text" size="mini" style="margin-left: 10px;" @click="checkDetail(scope.data)">查看明细</el-button>
          </template> -->
        </tr-table>
      </el-tab-pane>
      <el-tab-pane label="按车辆驾驶员汇总" name="2">
        <sub-req
          ref="secondHead"
          :activeName="'2'"
          @on-export="onExport"
          @on-ok="onSubmit"
        ></sub-req>
        <tr-table
          :selectionShow="false"
          :data="secondData"
          :stripe="false"
          :spanMethodType="['column']"
          :rowspanObj="secondRowspanObj"
          :mergekeys="secondMergekeys"
          :tableHeaderList="secondcustomSettingList"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="1"
          :isShowSummary="true"
          >
          <!-- :omitColumnIndex='[1,2,3,4,5,6,7,8,9,13]' -->
          <template slot-scope="scope" slot="operation">
            <el-button type="text" size="mini" style="margin-left: 10px;" @click="checkDetail(scope.data)">查看明细</el-button>
          </template>
        </tr-table>
      </el-tab-pane>
      <el-tab-pane label="按驾驶员车辆汇总" name="4">
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
          >
          <!-- :omitColumnIndex='[1,2,3,4,5,6,7,8,9,13]' -->
          <template slot-scope="scope" slot="operation">
            <el-button type="text" size="mini" style="margin-left: 10px;" @click="checkDetail(scope.data)">查看明细</el-button>
          </template>
        </tr-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
export default {
  name: "accident-summary-statistics",
  components: {
    subReq,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
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
      firstcustomSettingList: [
        {
          id: 1,
          label: "车辆组织",
          prop: "department_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "事故数量",
          prop: "accident_total",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "有责事故",
          prop: "duty_total",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "无责事故",
          prop: "unduty_total",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "事故总额",
          prop: "accident_total_fee",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "保险赔付",
          prop: "n_insurance_pay_fee",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "他人赔付",
          prop: "n_personal_fee",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "事故净损失",
          prop: "n_loss_fee",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        }
      ],
      secondcustomSettingList: [
        {
          id: 1,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "lincense_plate_number",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "department_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "线路",
          prop: "line",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "事故数量",
          prop: "accident_total",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "驾驶员",
          prop: "driver_name",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "有责事故",
          prop: "duty_total",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "无责事故",
          prop: "unduty_total",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "事故总额",
          prop: "accident_total_fee",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "保险赔付",
          prop: "n_insurance_pay_fee",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
        {
          id: 11,
          label: "他人赔付",
          prop: "n_personal_fee",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
        {
          id: 12,
          label: "事故净损失",
          prop: "n_loss_fee",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: true,
        },
        {
          id: 13,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        }

      ],
      thirdcustomSettingList: [
        {
          id: 1,
          label: "线路",
          prop: "line",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "所属组织",
          prop: "department_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "事故数量",
          prop: "accident_total",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "有责事故",
          prop: "duty_total",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "无责事故",
          prop: "unduty_total",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "事故总额",
          prop: "accident_total_fee",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "保险赔付",
          prop: "n_insurance_pay_fee",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "他人赔付",
          prop: "n_personal_fee",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "事故净损失",
          prop: "n_loss_fee",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        // {
        //   id: 10,
        //   label: "操作",
        //   prop: "operation",
        //   width: "130",
        //   align: "center",
        //   signIndex: 9,
        //   sortable: false,
        // }
      ],
      fourthcustomSettingList: [
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
          prop: "department_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "线路",
          prop: "line",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "事故数量",
          prop: "accident_total",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "车牌号",
          prop: "lincense_plate_number",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "有责事故",
          prop: "duty_total",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "无责事故",
          prop: "unduty_total",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "事故总额",
          prop: "accident_total_fee",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "保险赔付",
          prop: "n_insurance_pay_fee",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
        {
          id: 11,
          label: "他人赔付",
          prop: "n_personal_fee",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
        {
          id: 12,
          label: "事故净损失",
          prop: "n_loss_fee",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: true,
        },
        {
          id: 13,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      secondRowspanObj:{}, //获取要合并的按车辆驾驶员行的数量及标记位
      secondMergekeys:['vehicle_number', 'lincense_plate_number'], // 要纵向合并按车辆驾驶员的列单元格的key数组
      fourthRowspanObj:{}, //获取要合并的按驾驶员车辆行的数量及标记位
      fourthMergekeys:['driver_name'], // 要纵向合并按驾驶员车辆的列单元格的key数组
    };
  },
  mounted() {
    // this.loadData();
    this.$refs.firstHead.onSubmit();
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
      switch (tab.name) {
        case '1':
          this.$refs.firstHead.onSubmit();
          break;
        case '2':
          this.$refs.secondHead.onSubmit();
          break;
        case '3':
          this.$refs.thirdHead.onSubmit();
          break;
        case '4':
          this.$refs.fourthHead.onSubmit();
          break;
      }
    },
    onSubmit(form) {
      this.form = form
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.type = this.activeName;
      this.$client.AccidentSummaryAccidentReport(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            switch (this.activeName) {
              case '1':
                this.firstData = res.context;
                break;
              case '2':
                this.secondData = res.context;
                this.secondRowspanObj = this.$handleTableSpan(this.secondMergekeys, this.secondData)
                break;
              case '3':
                this.thirdData = res.context;
                break;
              case '4':
                this.fourthData = res.context;
                this.fourthRowspanObj = this.$handleTableSpan(this.fourthMergekeys, this.fourthData)
                break;
            }
            // this.data = res.context;
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
    // 导出
    onExport() {
      // let params = {}
      // params = {
      //   context: [val.id]
      // }
      let params = Object.assign({}, this.form);
      params.type = this.activeName;
      this.$client.ExportSumamryAccidentReport(params).then(res => {
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
      let query = {
          date: [this.form.begin, this.form.end]
        }
      switch (this.activeName) {
          // 车辆
        case '2':
         query.i_vehicle_id = [row.vehicle_id]
          break;
          // 驾驶员
        case '4':
          query.i_driver_id = [row.driver_id]
          break;
      }
      this.$router.push({
        name:'accident-manage',
        params: query
      })
    },

    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.firstHead.$el.offsetHeight;
        this.TableHeight = maxh - th - 50;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.accident-summary-statistics {
  width: 100%;
  height: 100%;
}

.accident-summary-statistics /deep/ .el-tabs__item {
  width: 160px;
  text-align: center;
}

.accident-summary-statistics /deep/ .el-tabs__nav-wrap::after {
  height: 0px;
}
</style>
