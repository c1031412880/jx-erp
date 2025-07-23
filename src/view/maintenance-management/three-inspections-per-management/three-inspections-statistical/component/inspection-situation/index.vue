<template>
  <div class="check-statistics">
    <el-row>
      <statistics-box @on-click="onStatistics"></statistics-box>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="echarts-box">
          <list-box @on-click="onList"></list-box>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="echarts-box">
          <pie-chart ref="pieChart1" id="pieChart1" title='检查正常、异常车辆数'></pie-chart>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="echarts-box">
          <pie-chart ref="pieChart2" id="pieChart2" title='风险情况'></pie-chart>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="echarts-box">
          <pie-chart ref="pieChart3" id="pieChart3" title='三检结果'></pie-chart>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="echarts-box">
          <line-chart ref="lineChart1" id="lineChart1" title='近七日三检风险趋势'></line-chart>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="echarts-box">
          <line-chart ref="lineChart2" id="lineChart2" title='近七日三检结果异常情况'></line-chart>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
import pieChart from './component/pie-chart'
import lineChart from './component/line-chart'
import listBox from './component/list-box'
import statisticsBox from './component/statistics-box'
export default {
  name: "check-statistics",
  components: {
    pieChart,
    listBox,
    statisticsBox,
    lineChart
  },
  data() {
    return {
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.GetDayCheckImageToal()
    })
  },
  methods: {
    // 数据加载
    GetDayCheckImageToal() {
      this.$client.GetDayCheckImageToal({})
        .then(res => {
          if (res.head.result == "200") {
            let {
              err_total,
              risk_total,
              vehicle_err,
              vehicle_res,
              vehicle_risk,
            } = res.context
            
            this.$refs.pieChart1.setOptions(vehicle_err)
            this.$refs.pieChart2.setOptions(vehicle_risk)
            this.$refs.pieChart3.setOptions(vehicle_res)

            let risk_data_y = risk_total.data_y.map(res => {
              return {
                name: res.name,
                data: res.data_y,
                type: 'line'
              }
            })
            this.$refs.lineChart1.setOptions(risk_total.data_x,risk_data_y)
            let err_data_y = err_total.data_y.map(res => {
              return {
                name: res.name,
                data: res.data_y,
                type: 'line'
              }
            })
            this.$refs.lineChart2.setOptions(err_total.data_x,err_data_y)
          } else {
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
    // 点击头部统计 
    onStatistics(info) {
      let type = ''
      switch (info.name) {
        case '首班检查':
          type = 1
          break;
        case '检查未排班车辆':
          type = 2
          break;
        case '已检车辆':
          type = 3
          break;
        case '低风险车辆':
          type = 4
          break;
        case '中风险车辆':
          type = 5
          break;
        case '高风险车辆':  
          type = 6
          break;
        case '检查异常车辆':
          type = 7
          break;
        case '检查异常结果':
          type = 8
          break;
      }
      this.jump(type)
    },
    // 点击待办事项 
    onList(info) {
      this.jump(9,info.id)
    },
    // 跳转 
    jump(type,val) {
      this.$emit('on-jump',type,val)
    },
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.check-statistics {
  height: 100%;
  width: 100%;
  .echarts-box {
    height: 400px;
    width: 100%
  }
}
</style>
