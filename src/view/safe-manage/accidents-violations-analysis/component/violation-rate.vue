<template>
  <div class="violation-rate">
    <tr-table
      ref="table"
      :selectionShow="false"
      :indexShow="false"
      :data="data"
      :tableHeaderList="tableHeaderList"
      :TableHeight="TableHeight"
      :loading="loading"
      :isShowSummary="true"
      :sumTotal="sumTotal"
      :sumColumnIndex="[2,3,5,7,8,9]"
    >
    <template slot-scope="scope" slot="color">
      <!-- <div :style="{'background-color': scope.data.color,height:'20px'}"></div> -->
      <div :class="scope.data.color"></div>
    </template>
    <template slot-scope="scope" slot="accident_count_change">
      <i class="el-icon-top" style="color: #D9001B;" v-if="scope.data.upordown == 1"></i>
      <i class="el-icon-bottom" style="color: #70B603;" v-if="scope.data.upordown == 2"></i>
      <span :style="{color: getColor(scope.data.upordown)}">{{ scope.data.accident_count_change }}</span>
    </template>
    <template slot-scope="scope" slot="accident_rate_change">
      <i class="el-icon-top" style="color: #D9001B;" v-if="scope.data.rate_upordown == 1"></i>
      <i class="el-icon-bottom" style="color: #70B603;" v-if="scope.data.rate_upordown == 2"></i>
      <span :style="{color: getColor(scope.data.rate_upordown)}">{{ scope.data.accident_rate_change }}</span>
    </template>
    </tr-table>
  </div>
</template> 

<script type="text/ecmascript-6">
import common from '@/mixin/exportToExcel'
  export default {
    data() {
      return {
        loading: false,
        TableHeight: 500,
        data: [],
        tableHeaderList: [
          {
            id: 1,
            label: "分公司",
            prop: "dept_name",
            width: "130",
            align: "center",
            signIndex: 0,
          },
          {
            id: 2,
            label: "风险等级",
            prop: "color",
            width: "80",
            align: "center",
            signIndex: 1,
          },
          {
            id: 3,
            label: "公里数",
            prop: "mile",
            width: "130",
            align: "center",
            signIndex: 2,
          },
          {
            id: 4,
            label: "违章数",
            prop: "accident_count",
            width: "130",
            align: "center",
            signIndex: 3,
          },
          {
            id: 5,
            label: "违章数与去年同期相比",
            prop: "accident_count_change",
            width: "130",
            align: "center",
            signIndex: 4,
          },
          {
            id: 6,
            label: "违章率(次/百万公里)",
            prop: "accident_rate",
            width: "130",
            align: "center",
            signIndex: 5,
          },
          {
            id: 7,
            label: "违章率与去年同期相比",
            prop: "accident_rate_change",
            width: "130",
            align: "center",
            signIndex: 6,
          },
          {
            id: 8,
            label: "去年同期公里数",
            prop: "last_mile",
            width: "130",
            align: "center",
            signIndex: 7,
          },
          {
            id: 9,
            label: "去年同期违章数",
            prop: "last_accident_count",
            width: "130",
            align: "center",
            signIndex: 8,
          },
          {
            id: 10,
            label: "去年同期违章率(次/百万公里)",
            prop: "last_accident_rate",
            width: "130",
            align: "center",
            signIndex: 9,
          },
        ],
        sumTotal: {
          2: '',
          3: '',
          5: '',
          7: '',
          8: '',
          9: '',
        }
      }
    },
    mixins: [common],
    methods: {
      // 获取事故率 
      loadData(form) {
        this.loading = true
        this.$client.GetViolationRateTotal({context:form}).then(res => {
          this.loading = false
          if (res.head.result === '200') {
            this.data = res.context.list
            this.sumTotal = {
              2: res.context.summary['mile'],
              3: res.context.summary['accident_count'],
              5: res.context.summary['accident_rate'],
              7: res.context.summary['last_mile'],
              8: res.context.summary['last_accident_count'],
              9: res.context.summary['last_accident_rate'],
            }
          }
        })
      },
      getColor(type) {
        switch (type) {
          case 0:
            return ''            
          case 1:
            return '#D9001B'   
          case 2:
            return '#70B603'   
          default:
            break;
        }
      },
      exportFile(form) {
        // let table_dom = this.$refs['table'].$refs.table.$el
        // this.exportToExcel(table_dom,'违章率')
        this.$client.ExportViolationRate({context:form})
        .then(res => {
          if(res.head.result == '200') {
            window.location.href = res.context
            this.$message({type: 'success', message: '导出成功'})
          }else{
            this.$message({type: 'error', message: res.head.describle})
          }
        })
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .violation-rate { 
    /deep/ .el-table__cell:has(.green) {
      background-color: #70B603
    }
    /deep/ .el-table__cell:has(.yellow) {
      background-color: #E1E600
    }
    /deep/ .el-table__cell:has(.red) {
      background-color: #D9001B
    }
    /deep/ .el-table__cell:has(.orange) {
      background-color: #F59A23
    }
  }
</style>
