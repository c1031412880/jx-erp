<template>
  <div class="table-data">
    <el-form ref="header" inline size="mini">
      <el-form-item label="日期:">
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="请选择日期范围"
          end-placeholder="请选择日期范围"
          @change="selectedTime"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd">
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
import { getDate } from "@/utils/index"
export default {
  props: {
    TableHeight: {
      type: Number,
      default: 390
    },
    info: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      form: {
        from: '',
        end: '',
        vehicle_ids: [],
        page_index: 1,
        page_size: 20,
        total: 0
      },
      // TableHeight: 450,
      loading: false,
      data: [],
      date: [],
      tableHeaderList: [{
        id: 1,
        label: "自编号",
        prop: "self_id",
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
        label: "日期",
        prop: "date",
        width: "140",
        align: "center",
        signIndex: 2
      }, {
        id: 4,
        label: "里程（KM）",
        prop: "mile",
        width: "140",
        align: "center",
        signIndex: 3
      }, {
        id: 5,
        label: "来源",
        prop: "origitype",
        width: "140",
        align: "center",
        signIndex: 4
      }, {
        id: 6,
        label: "录入人员",
        prop: "create_user_name",
        width: "140",
        align: "center",
        signIndex: 5
      }, {
        id: 7,
        label: "录入时间",
        prop: "create",
        width: "140",
        align: "center",
        signIndex: 6
      }]
    }
  },
  mounted() {
    this.setData(this.info.id)
    // this.setHeight()
  },
  methods: {
    setHeight() {
      let t = setTimeout(() => {
        let th = this.$refs.header.$el.offsetHeight
        let paginationH = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = this.$el.offsetHeight - th - paginationH - 20
        clearTimeout(t)
      }, 60)
    },
    onSetTime() {
      let time = getDate("lastOneMonth")
      this.date = [time.startTime, time.endTime]
      this.form.from = this.date[0]
      this.form.end = this.date[1]
    },
    selectedTime(val) {
      this.form.from = val[0]
      this.form.end = val[1]
    },
    loadData() {
      this.loading = true
      this.$client.getVehicleMileManage(this.form).then(res => {
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
    exportExcel() {
      this.$client.exportVehicleMile(this.form).then(res => {
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