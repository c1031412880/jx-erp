<template>
  <el-row>
    <el-col :span="12">
      <tr-table
        ref="table"
        :selectionShow="false"
        :indexShow="false"
        :data="data"
        :tableHeaderList="tableHeaderList"
        :TableHeight="TableHeight"
        :loading="loading"
        :isShowSummary="true"
        :omitColumnIndex="[3,4]"
      >
        <template slot-scope="scope" slot="last_accident_rate">
          <i class="el-icon-top" style="color: #D9001B;" v-if="scope.data.last_accident_count < scope.data.accident_count"></i>
          <i class="el-icon-bottom" style="color: #70B603;" v-if="scope.data.last_accident_count > scope.data.accident_count"></i>
          <span :style="{color: getColor(scope.data)}">{{ scope.data.last_accident_rate }}</span>
        </template>
      </tr-table>
    </el-col>
    <el-col :span="12">
      <div class="card-box-item">
        <pie-chart ref="pie"></pie-chart>
      </div>
    </el-col>
  </el-row>
</template> 

<script type="text/ecmascript-6">
import pieChart from './pie-chart'
import common from '@/mixin/exportToExcel'
  export default {
    components: {
      pieChart,
    },
    mixins: [common],
    data() {
      return {
        loading: false,
        TableHeight: 500,
        data: [],
        tableHeaderList: [
          {
            id: 1,
            label: "事故类型",
            prop: "type_name",
            width: "130",
            align: "center",
            signIndex: 0,
          },
          {
            id: 2,
            label: "事故量",
            prop: "accident_count",
            width: "130",
            align: "center",
            signIndex: 1,
          },
          {
            id: 3,
            label: "去年同期事故量",
            prop: "last_accident_count",
            width: "130",
            align: "center",
            signIndex: 2,
          },
          {
            id: 4,
            label: "与去年同期相比",
            prop: "last_accident_rate",
            width: "130",
            align: "center",
            signIndex: 3,
          },
        ]
      }
    },
    methods: {
      // 获取事故率 
      loadData(form) {
        this.loading = true
        this.$client.GetAccidentTypeTotal({context:form}).then(res => {
          this.loading = false
          if (res.head.result === '200') {
            this.data = res.context
          }
        })

        this.$client.GetAccidentImage({context:form}).then(res => {
          if (res.head.result === '200') {
            let data = res.context.map(item => {
              return {
                value: item.count,
                name: item.name,
                rate: item.rate,
              }
            })
            this.$refs.pie.setOptions({
              label: data,
              data: data
            })
          }
        })
      },
      getColor(row) {
        let color = row.last_accident_count > row.accident_count ? '#70B603' : row.last_accident_count < row.accident_count ? '#D9001B' : ''
        return color
      },
      exportFile() {
        let table_dom = this.$refs['table'].$refs.table.$el
        this.exportToExcel(table_dom,'事故类型')
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .card-box-item {
    width: 100%;
    height: 300px;
  }
</style>
