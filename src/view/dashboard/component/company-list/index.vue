<template>
  <div class="company-list">
    <div class="company-list-top">
      <div class="company-list-item" v-for="item in data" :key="item.title">
        <div class="company-list-item-top">
          <count-to v-if="item.title !== '平均审批时长'" class="company-list-item-num" :start-val="0" :end-val="item.value" :duration="2600"/>
          <span v-else>{{ item.value }}</span>
          <span v-show="item.title == '平均审批时长'" class="company-list-item-day">天</span>
        </div>
        <div class="company-list-item-bottom">{{ item.title }}</div>
      </div>
    </div>
    <div class="company-list-bottom" id="company-list-bottom"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import echarts from 'echarts'
import countTo from 'vue-count-to'
import {debounce} from '@/utils/index'
export default {
  name: 'company-list',
  components: { countTo },
  data() {
    return {
      comChart: null,
      data: [
        {title: '全部审批', value: 0},
        {title: '审批中', value: 0},
        {title: '已完成', value: 0},
        {title: '平均审批时长', value: 0},
      ],
    }
  },
  mounted() {
    this.loadData()
		this.$nextTick(() => {
      window.addEventListener("resize",() => {
        debounce(this.resizeChart(), 1000)
      });
    })
  },
  methods: {
    resizeChart() {
      this.comChart && this.comChart.resize()
    },
    loadData() {
      this.$client.GetApprovalData().then(res => {
        if (res.head.result == '200') {
          this.data[0].value = res.context.all_approvals
          this.data[1].value = res.context.pending_approvals
          this.data[2].value = res.context.completed_approvals
          this.data[3].value = res.context.avg_approvalTime
          this.initChart(res.context.chart_datas)
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
      // let names = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
      // let data = [
      //   120, 132, 101, 134, 90, 230, 210,
      //   120, 132, 101, 134, 90
      // ]
      // this.initChart(names, data)
    },
    initChart(data = []) {
      this.comChart = echarts.init(document.getElementById('company-list-bottom'));
      let option = { 
        color: ['#72A1FA'],
        tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						crossStyle: {
							color: '#999'
						}
					},
					backgroundColor: '#222222',
					textStyle: {
						color: '#FFFFFF',
					}
				},
				legend: {
          show: false,
				},
				grid: {
					top: '30',
					bottom: '35',
					left: '30',
					right: '10',
					containLabel: false
				},
				xAxis: [
					{
						type: 'category',
						data: data.length ? data.map(item => item.type_name) : ['暂无数据'],
						axisTick: {
							show: false,
						},
            axisLine:{
							lineStyle:{
								color:'#D1D1D1',
							}
						},
            axisLabel: {
              color: "#666666",
              fontSize: 12,
              // rotate: 30,
              // interval: 0,
              // formatter: function(params) {
              //   if (params.length > 4) {
              //     return params.substring(0, 4) + '...'
              //   } else {
              //     return params
              //   }
              // }
            },
						splitLine: {
							show: false,
						}
					}
				],
				yAxis: [
					{
						type: 'value',
						name: '次',
						min: 0,
						axisLabel: {
              show: true
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitArea: {
              show: true,
              areaStyle: {
                color: ['#FFFFFF','#F9F9F9']
              }
            }
					},
				],
				series: [
					{
						name: '审批数量',
						type: 'bar',
            barMinWidth: 5,
            barMaxWidth: 10,
						data: data.length ? data.map(item => item.type_count) : [ 0,],
					}
				]
      }
      this.comChart.setOption(option, true)
    },
    beforeDestroy() {
      this.comChart.dispose()
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.company-list {
  height: 100%;
  width: 100%;
  .company-list-top {
    display: flex;
    justify-content: space-around;
    .company-list-item {
      text-align: center;
      .company-list-item-top {
        font-family: DIN, DIN;
        font-weight: bold;
        font-size: 22px * $NumWidth;
        color: #333333;
        .company-list-item-day {
          font-family: Source Han Sans CN, Source Han Sans CN;
          font-size: 12px * $NumWidth;
        }
      }
      .company-list-item-bottom {
        font-family: Source Han Sans CN, Source Han Sans CN;
        font-weight: 400;
        font-size: 12px * $NumWidth;
        color: #333333;
        padding: 5px * $NumWidth 0;
      }
    }
  }
  .company-list-bottom {
    width: 100%;
    height: 270px * $NumWidth;
  }
}
</style>