<template>
  <el-dialog
    :visible="dialogBool"
    title="里程明细"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    append-to-body
    width="820px"
  >
    <div style="display:flex;align-items:center;margin-bottom:10px;">
      <div>
        当前车辆: <span style="color:red">{{form.VehicleGrantCode}}</span>
      </div>
      <div style="margin:0 10px">
        日期范围: <span style="color:red">{{form.start_time + '至' + form.end_time}}</span>
      </div>
      <el-button type="primary" @click="exportFile" size="small" icon="el-icon-download">导出</el-button>
    </div>
    <tr-table
      :indexShow="true"
      :selectionShow="false"
      :data="data"
      :isShowSummary="true"
      :sumColumnIndex="[6,7,8,9,10,11]"
      :sumTotal="sumTotal"
      :tableHeaderList="customSettingList"
      :isShowBottomOptions="false"
      :spanMethodType="['column']"
      :rowspanObj="rowspanObj"
      :mergekeys="mergekeys"
      :TableHeight="500"
      :loading="loading">
    </tr-table>

    <el-pagination
      style="margin: 5px 0;display:flex; justify-content: flex-end;"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount">
    </el-pagination>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool:Boolean
  },
  data() {
    return {
      laoding:false,
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      data: [],
      form: {
        VehicleGrantCode: '',
        start_time: '',
        end_time: '',
      },
      loading: false,
      customSettingList: [
        {
          id: 1,
          label: "日期",
          prop: "Date",
          width: "130",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "自编号",
          prop: "VehicleCode",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "车牌号",
          prop: "VehicleGrantCode",
          width: "130",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "驾驶员",
          prop: "DriverName",
          width: "130",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "线路",
          prop: "LineName",
          width: "160",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "趟次",
          prop: "Count",
          width: "150",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "每趟里程（公里）",
          prop: "AvgMile",
          width: "180",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "额外里程（公里）",
          prop: "AdditionMile",
          width: "180",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "合计里程（公里）",
          prop: "TotalMile",
          width: "180",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "当天总里程数（公里）",
          prop: "SumMile",
          width: "200",
          align: "center",
          signIndex: 9,
        },
        {
          id: 11,
          label: "理论公里数",
          prop: "DispatchMile",
          width: "200",
          align: "center",
          signIndex: 10,
        },
      ],
      sumTotal: {
        6: '',
        7: '',
        8: '',
        9: '',
        10: '',
        11: '',
      },
      // 要纵向合并的单元格的key数组
      mergekeys: ['Date','VehicleCode','VehicleGrantCode','SumMile'],
      rowspanObj:{},
    };
  },
  mounted() {
    
  },
  methods: {
    setData(info) {
      this.form = info
      this.loadData()
    },
    // 获取数据
    loadData() {
      this.loading = true
      let params = {
        // vehicle_ids: [this.form.id],
        VehicleGrantCode: this.form.VehicleGrantCode,
        start_time: this.form.start_time,
        end_time: this.form.end_time,
        page_index: this.pageInfo.pageIndex,
        page_size: this.pageInfo.pageSize,
      }
      this.$client.MileDetailSummayVehicleOilRecordSummary(params).then(res => {
        this.loading = false
        if (res.head.result == "200") {
            this.data = res.context.list
            this.pageInfo.pageCount = res.context.total
            this.sumTotal = {
              6: res.context.summary['Count'],
              7: res.context.summary['AvgMile'],
              8: res.context.summary['AdditionMile'],
              9: res.context.summary['TotalMile'],
              10: res.context.summary['SumMile'],
              11: res.context.summary['DispatchMile'],
            }
            this.rowspanObj = this.$handleTableSpan(this.mergekeys, this.data,'Date',true)
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      })
    },
    // 分页切换事件
    handleCurrentChange(val) {
      this.pageInfo.pageIndex = val
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageCount = 0;
      this.loadData()
    },
    // 导出Excel
    exportFile() {
      let params = {
        // vehicle_ids: [this.form.id],
        VehicleGrantCode: this.form.VehicleGrantCode,
        start_time: this.form.start_time,
        end_time: this.form.end_time,
      }
      this.$client.MileDetailExportVehicleOilRecordSummary(params).then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


