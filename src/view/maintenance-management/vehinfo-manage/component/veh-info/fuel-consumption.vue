<template>
  <div class="table-data">
    <el-form ref="header" inline size="mini">
      <el-form-item label="日期:">
        <el-date-picker
          v-model="form.year_month"
          type="month"
          placeholder="请选择月份"
          value-format="yyyy-MM">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="loadData" type="primary">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-download" @click="exportExcel" type="primary">导出</el-button>
      </el-form-item>
    </el-form>
    <tr-table
      ref="table"
      :data="data"
      :tableHeaderList="tableHeaderList"
      :TableHeight="TableHeight"
      :loading="loading"
      style="margin-bottom:10px">
    </tr-table>
    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="form.page_index"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="form.page_size"
      layout="total,sizes, prev, pager, next, jumper"
      :total="form.total">
    </el-pagination>
  </div>
</template>
<script>
import { formatDate } from "@/utils/index"
export default {
  data() {
    return {
      form: {
        year_month: '',
        vehicle_ids: [],
        page_index: 1,
        page_size: 20,
        total: 0
      },
      TableHeight: 450,
      loading: false,
      data: [],
      tableHeaderList: [{
        id: 1,
        label: "自编号",
        prop: "vehicle_number",
        width: "140",
        align: "center",
        signIndex: 0
      }, {
        id: 2,
        label: "车牌号",
        prop: "lincense_plate_number",
        width: "140",
        align: "center",
        signIndex: 1
      }, {
        id: 3,
        label: "所属组织",
        prop: "department_name",
        width: "140",
        align: "center",
        signIndex: 2
      }, {
        id: 4,
        label: "线路",
        prop: "line_name",
        width: "140",
        align: "center",
        signIndex: 3
      }, {
        id: 5,
        label: "燃料类别",
        prop: "type",
        width: "140",
        align: "center",
        signIndex: 4
      }, {
        id: 6,
        label: "车辆型号",
        prop: "type_name",
        width: "140",
        align: "center",
        signIndex: 5
      }, {
        id: 7,
        label: "GPS里程（KM）",
        prop: "n_total_mile",
        width: "140",
        align: "center",
        signIndex: 6
      }, {
        id: 8,
        label: "油耗",
        prop: "oil_consume",
        width: "140",
        align: "center",
        signIndex: 7
      }, {
        id: 9,
        label: "电耗",
        prop: "eletric_consume",
        width: "140",
        align: "center",
        signIndex: 8
      }, {
        id: 10,
        label: "百公里油耗",
        prop: "per_oil_consume",
        width: "140",
        align: "center",
        signIndex: 9
      }, {
        id: 11,
        label: "百公里电耗",
        prop: "per_eletric_consume",
        width: "140",
        align: "center",
        signIndex: 10
      }],
    }
  },
  mounted() {
    this.setHeight()
  },
  methods: {
    onSetTime() {
      this.form.year_month = formatDate(new Date(), 'yyyy-MM')
    },
    loadData() {
      this.loading = true
      this.$client.VehicleOilSummaty(this.form).then(res => {
        this.loading = false
        if (res.head.result == '200') {
          this.data = res.context.list
          this.form.total = res.context.total
          // this.$message({type: 'success', message: res.head.describle})
        } else {
          this.data = []
          this.form.total = 0
          this.$message({type: 'error', message: res.head.describle})
        }
      }).catch(err => {
        this.loading = false
      })
    },
    handleCurrentChange(idx) {
      this.form.page_index = idx
      this.loadData()
    },
    handleSizeChange(sizes) {
      this.form.page_size = sizes
      this.loadData()
    },
    setHeight() {
      let t = setTimeout(() => {
        let th = this.$refs.header.$el.offsetHeight
        let paginationH = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = this.$el.offsetHeight - th - paginationH - 20
        clearTimeout(t)
      }, 60)
    },
    exportExcel() {
      this.$client.ExportVehicleOilSummaty(this.form).then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        } else {
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    setData(id) {
      this.form.vehicle_ids =[id]
      this.onSetTime()
      this.$nextTick(() => {
        this.loadData()
      })
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.table-data{
  width 100%;
  height: 100%;
}
</style>
