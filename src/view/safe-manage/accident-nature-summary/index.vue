<template>
  <div class="accident-nature-summary">
    <sub-req @on-ok="onSubmit" @on-radio="onRadio" @on-export="exportFile"></sub-req>
    <el-row :gutter="20" ref="echart">
      <el-col :span="12">
        <div class="card-box-item">
          <pie-chart ref="pieChart"></pie-chart>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card-box-item">
          <bar-chart ref="barChart"></bar-chart>
        </div>
      </el-col>
    </el-row>
    <tr-table
      ref="table"
      :selectionShow="false"
      :indexShow="false"
      :data="data"
      :tableHeaderList="tableHeaderList"
      :TableHeight="TableHeight"
      :loading="loading"
      :isShowSummary="true"
    >
    </tr-table>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from './component/sub-req'
import barChart from './component/bar-chart'
import pieChart from './component/pie-chart'
import common from '@/mixin/exportToExcel'
export default {
  name: "accident-nature-summary",
  components: {
    subReq,
    barChart,
    pieChart
  },
  mixins: [common],
  data() {
    return {
      form: {},
      data: [],
      TableHeight: 500,
      tableHeaderList: [
        {
          id: 1,
          label: "事故类型",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
        },
      ],
      loading:false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    onSubmit(form) {
      this.form = JSON.parse(JSON.stringify(form))
      this.setTime()
      this.loadData()
    },
    onRadio(form) {
      this.form = JSON.parse(JSON.stringify(form))
      this.setTime()
      this.GetAccidentNatureSummaryByType()
    },
    setTime() {
      let year = new Date(this.form.end).getFullYear()
      let month = new Date(this.form.end).getMonth()
      let days = new Date(year,month+1,0).getDate()

      this.form.begin = this.form.begin + '-01' + " 00:00:00"
      this.form.end = this.form.end + '-' + days + " 23:59:59"
    },
    loadData() {
      this.GetAccidentNatureSummaryPie()
      this.GetAccidentNatureSummaryBar()
      this.GetAccidentNatureSummaryByType()
    },
    // 饼图 
    GetAccidentNatureSummaryPie() {
      this.$client.GetAccidentNatureSummaryPie(this.form).then(res => {
        if (res.head.result === '200') {
          let data = res.context.map(item => {
            return {
              value: item.count,
              name: item.name,
              rate: (item.rate * 100 ).toFixed(2) + '%',
            }
          })
          this.$refs.pieChart.setOptions({
            label: data,
            data: data
          })
        }
      })
    },
    // 柱状图 
    GetAccidentNatureSummaryBar() {
      this.$client.GetAccidentNatureSummaryBar(this.form).then(res => {
        if (res.head.result === '200') {
          let {counts,dept_names,nature_names} = res.context

          let data = []
          nature_names.forEach((item,index) => {
            data.push({
              name: item,
              data: counts[index],
              type: 'bar',
              stack: '事故'
            })
          });
          this.$refs.barChart.setOptions({
            label: dept_names,
            title: nature_names,
            data: data
          })
        }
      })
    },
    // 统计列表 
    GetAccidentNatureSummaryByType() {
      this.$client.GetAccidentNatureSummaryByType(this.form).then(res => {
        if (res.head.result === '200') {
          let list = res.context
          list.forEach(item => {
            if (this.form.type == 1) {
              let arr = item.arrs.map(child => {
                let year = new Date(child).getFullYear()
                let month = new Date(child).getMonth() + 1
                return year + '年' + month + '月'
              })
              item.arrs = arr
              // item.arrs.forEach(child => {
              //   let year = new Date(child).getFullYear()
              //   let month = new Date(child).getMonth() + 1
              //   child = year + '年' + month + '月'
              // })
            }
          })
          list.forEach(item => {
            item.arrs = item.arrs.concat(['合计'])
            item.counts = item.counts.concat([item.total])
          })
          this.getCustoms(list)
          this.getData(list)
        }
      })
    },
    getCustoms(list) {
      let customSettingList = []
      let headerArr = list[0].arrs
      headerArr.forEach((item,index) => {
        let obj = {
          label: item,
          prop: 'value' + index,
          width: "120",
          align: "center",
          id: index + 2,
          signIndex: index + 1,
        }
        customSettingList.push(obj)
      })
      let cus = [
        {
          id: 1,
          label: "事故类型",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
        },
      ]
      this.tableHeaderList = [...cus,...customSettingList]
    },
    getData(list) {
      let data = []
      list.forEach(item => {
        let obj = {
          name: item.name
        }
        item.counts.forEach((child,index) => {
          obj['value' + index] = child
        })
        data.push(obj)
      })

      this.data = data
    },
    exportFile() {
      let table_dom = this.$refs['table'].$refs.table.$el
      this.exportToExcel(table_dom,'事故性质汇总')
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.echart.$el.offsetHeight;
        this.TableHeight = maxh - th - 100;
      }, 60);
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$NumWidth: 100vw / 1920px;
.accident-nature-summary{
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  padding: 0 5px;
  .card-box-item{
    height: 300px * $NumWidth;
  }
}
</style>
