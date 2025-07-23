<template>
  <div class="illegal-summary-statistics">
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
          :backFixedNum="0"
          :isShowSummary="true"
          :omitColumnIndex="[1, 2, 3]"
        >
          <template slot-scope="scope" slot="operation">
            <el-button
              type="text"
              size="mini"
              style="margin-left: 10px"
              @click="checkDetail(scope.data)"
            >
              查看明细
            </el-button>
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
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="0"
          :isShowSummary="true"
          :omitColumnIndex="[1, 2, 3, 4]"
        >
          <template slot-scope="scope" slot="operation">
            <el-button
              type="text"
              size="mini"
              style="margin-left: 10px"
              @click="checkDetail(scope.data)"
            >
              查看明细
            </el-button>
          </template>
        </tr-table>
      </el-tab-pane>
      <el-tab-pane label="按车辆汇总" name="3">
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
          :spanMethodType="['column']"
          :rowspanObj="thirdRowspanObj"
          :mergekeys="thirdMergekeys"
          :tableHeaderList="thirdcustomSettingList"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="1"
          :isShowSummary="true"
          :omitColumnIndex="[1, 2, 3, 4, 6, 7, 8, 9]"
        >
          <template slot-scope="scope" slot="operation">
            <el-button
              type="text"
              size="mini"
              style="margin-left: 10px"
              @click="checkDetail(scope.data)"
            >
              查看明细
            </el-button>
          </template>
        </tr-table>
      </el-tab-pane>
      <el-tab-pane label="按驾驶员汇总" name="4">
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
          :omitColumnIndex="[1, 2, 3, 8]"
        >
          <template slot-scope="scope" slot="operation">
            <el-button
              type="text"
              size="mini"
              style="margin-left: 10px"
              @click="checkDetail(scope.data)"
            >
              查看明细
            </el-button>
          </template>
        </tr-table>
      </el-tab-pane>
    </el-tabs>
    <detail-dialog ref="detailDialog" :dialogVisible.sync="detailDialogShow" />
  </div>
</template>

<script>
import subReq from './component/sub-req'
import detailDialog from './component/detail-dialog'
export default {
  name: 'illegal-summary-statistics',
  components: {
    subReq,
    detailDialog
  },
  data() {
    return {
      detailDialogShow: false,
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      activeName: '1',
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
          label: '车辆组织',
          prop: 'department_name',
          width: '130',
          align: 'center',
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: '违法数量',
          prop: 'total_violation',
          width: '130',
          align: 'center',
          signIndex: 1,
          sortable: true
        },
        {
          id: 3,
          label: '未处理',
          prop: 'total_undispose',
          width: '130',
          align: 'center',
          signIndex: 2,
          sortable: true
        },
        {
          id: 4,
          label: '扣分',
          prop: 'total_score',
          width: '130',
          align: 'center',
          signIndex: 3,
          sortable: true
        },
        {
          id: 5,
          label: '罚款',
          prop: 'total_money',
          width: '130',
          align: 'center',
          signIndex: 4,
          sortable: true
        },
        {
          id: 6,
          label: '操作',
          prop: 'operation',
          width: '130',
          align: 'center',
          signIndex: 5,
          sortable: false
        }
      ],
      secondcustomSettingList: [
        {
          id: 1,
          label: '线路',
          prop: 'line_name',
          width: '130',
          align: 'center',
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: '所属组织',
          prop: 'department_name',
          width: '130',
          align: 'center',
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: '违法数量',
          prop: 'total_violation',
          width: '130',
          align: 'center',
          signIndex: 2,
          sortable: true
        },
        {
          id: 4,
          label: '未处理',
          prop: 'total_undispose',
          width: '130',
          align: 'center',
          signIndex: 3,
          sortable: true
        },
        {
          id: 5,
          label: '扣分',
          prop: 'total_score',
          width: '130',
          align: 'center',
          signIndex: 4,
          sortable: true
        },
        {
          id: 6,
          label: '罚款',
          prop: 'total_money',
          width: '130',
          align: 'center',
          signIndex: 5,
          sortable: true
        },
        {
          id: 7,
          label: '操作',
          prop: 'operation',
          width: '130',
          align: 'center',
          signIndex: 6,
          sortable: false
        }
      ],
      thirdcustomSettingList: [
        {
          id: 1,
          label: '自编号',
          prop: 'vehicle_number',
          width: '130',
          align: 'center',
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: '车牌号',
          prop: 'lincense_plate_number',
          width: '130',
          align: 'center',
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: '所属组织',
          prop: 'department_name',
          width: '130',
          align: 'center',
          signIndex: 2,
          sortable: false
        },
        {
          id: 4,
          label: '线路',
          prop: 'line_name',
          width: '130',
          align: 'center',
          signIndex: 3,
          sortable: false
        },
        {
          id: 5,
          label: '违法数量',
          prop: 'total_violation',
          width: '130',
          align: 'center',
          signIndex: 4,
          sortable: true
        },
        {
          id: 6,
          label: '未处理',
          prop: 'total_undispose',
          width: '130',
          align: 'center',
          signIndex: 5,
          sortable: true
        },
        {
          id: 7,
          label: '扣分',
          prop: 'total_score',
          width: '130',
          align: 'center',
          signIndex: 6,
          sortable: true
        },
        {
          id: 8,
          label: '罚款',
          prop: 'total_money',
          width: '130',
          align: 'center',
          signIndex: 7,
          sortable: true
        },
        {
          id: 9,
          label: '操作',
          prop: 'operation',
          width: '130',
          align: 'center',
          signIndex: 8,
          sortable: false
        }
      ],
      fourthcustomSettingList: [
        {
          id: 1,
          label: '驾驶员',
          prop: 'driver_name',
          width: '130',
          align: 'center',
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: '所属组织',
          prop: 'department_name',
          width: '130',
          align: 'center',
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: '线路',
          prop: 'line_name',
          width: '130',
          align: 'center',
          signIndex: 2,
          sortable: false
        },
        {
          id: 4,
          label: '违法数量',
          prop: 'total_violation',
          width: '130',
          align: 'center',
          signIndex: 3,
          sortable: true
        },
        {
          id: 5,
          label: '未处理',
          prop: 'total_undispose',
          width: '130',
          align: 'center',
          signIndex: 4,
          sortable: true
        },
        {
          id: 6,
          label: '扣分',
          prop: 'total_score',
          width: '130',
          align: 'center',
          signIndex: 5,
          sortable: true
        },
        {
          id: 7,
          label: '罚款',
          prop: 'total_money',
          width: '130',
          align: 'center',
          signIndex: 6,
          sortable: true
        },
        {
          id: 8,
          label: '操作',
          prop: 'operation',
          width: '130',
          align: 'center',
          signIndex: 7,
          sortable: false
        }
      ],
      frontFixedNum: 1, //前几行固定
      thirdRowspanObj: {}, //获取要合并的按车辆驾驶员行的数量及标记位
      thirdMergekeys: ['vehicle_number', 'lincense_plate_number'], // 要纵向合并按车辆驾驶员的列单元格的key数组
      fourthRowspanObj: {}, //获取要合并的按驾驶员车辆行的数量及标记位
      fourthMergekeys: ['driver_name'] // 要纵向合并按驾驶员车辆的列单元格的key数组
    }
  },
  mounted() {
    // this.loadData();
    this.$refs.firstHead.onSubmit()
    this.$nextTick(() => {
      this.setHead()
      // window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
      //   this.setHead()
      // })
    })
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
      switch (tab.name) {
        case '1':
          this.$refs.firstHead.onSubmit()
          break
        case '2':
          this.$refs.secondHead.onSubmit()
          break
        case '3':
          this.$refs.thirdHead.onSubmit()
          break
        case '4':
          this.$refs.fourthHead.onSubmit()
          break
      }
    },
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    // 数据加载
    loadData() {
      this.loading = true
      let params = Object.assign({}, this.form)
      params.type = this.activeName
      this.$client
        .ViolationSummaryViolationReport(params)
        .then(res => {
          if (res.head.result == '200') {
            this.loading = false
            switch (this.activeName) {
              case '1':
                this.firstData = res.context
                break
              case '2':
                this.secondData = res.context
                break
              case '3':
                this.thirdData = res.context
                this.thirdRowspanObj = this.$handleTableSpan(this.thirdMergekeys, this.thirdData)
                break
              case '4':
                this.fourthData = res.context
                this.fourthRowspanObj = this.$handleTableSpan(this.fourthMergekeys, this.fourthData)
                break
            }
            // this.data = res.context;
          } else {
            this.loading = false
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: 'error'
          })
        })
    },
    // 导出
    onExport() {
      let params = Object.assign({}, this.form)
      params.type = this.activeName
      this.$client.ExportSumamryViolationReport(params).then(res => {
        if (res.head.result == '200') {
          window.location.href = res.context
          this.$message({ type: 'success', message: '导出成功' })
        } else {
          this.$message({ type: 'error', message: '导出失败' })
        }
      })
    },
    // 查看明细
    checkDetail(row) {
      let query = {
        date: this.form.violation_date ? [...this.form.violation_date] : []
      }
      if (query.date && query.date.length > 0) {
        query.date = this.$addTime(query.date)
        query.begin = query.date[0]
        query.end = query.date[1]
      } else {
        query.begin = ''
        query.end = ''
      }
      switch (this.activeName) {
        // 组织
        case '1':
          query.i_depts = [row.dept_id]
          break
        // 线路
        case '2':
          query.line_ids = [row.line_id]
          break
        // 车辆
        case '3':
          query.i_vehicle_ids = [row.vehicle_id]
          break
        // 驾驶员
        case '4':
          query.i_driver_id = [row.driver_id]
          break
      }
      this.detailDialogShow = true
      this.$refs.detailDialog.loadData(query)
      // this.$router.push({
      //   name: 'violation-manage',
      //   params: query
      // })
    },

    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.firstHead.$el.offsetHeight
        this.TableHeight = maxh - th - 50
      }, 60)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.illegal-summary-statistics {
  width: 100%;
  height: 100%;
}

.illegal-summary-statistics /deep/ .el-tabs__item {
  width: 160px;
  text-align: center;
}

.illegal-summary-statistics /deep/ .el-tabs__nav-wrap::after {
  height: 0px;
}
</style>
