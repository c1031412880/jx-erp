<template>
  <div class="base-info">
    <div class="base-info-top">
      <el-carousel indicator-position="none" :interval="5000">
        <el-carousel-item>
          <div class="base-info-item" v-for="item in firstLoopData" :key="item.title">
            <div class="base-info-item-top" v-if="item.title === '同比'">
              <div class="base-info-item-num" :style="{'color': item.rate.includes('-') ? '#0F8CFF' : '#C61D29'}">{{ item.rate }}%</div>
              <el-image v-if="item.rate.includes('-')" :src="require('@/assets/home-image/down.png')"></el-image>
              <el-image v-else :src="require('@/assets/home-image/up.png')"></el-image>
            </div>
            <div class="base-info-item-top" v-else>
              <count-to class="base-info-item-num" :start-val="0" :end-val="item.value" :duration="2600"/>
            </div>
            <div class="base-info-item-bottom">{{ item.title }}</div>
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <div class="base-info-item" v-for="item in secondLoopData" :key="item.title">
            <div class="base-info-item-top" v-if="item.title === '同比'">
              <div class="base-info-item-num" :style="{'color': item.rate.includes('-') ? '#0F8CFF' : '#C61D29'}">{{ item.rate }}%</div>
              <el-image v-if="item.rate.includes('-')" :src="require('@/assets/home-image/down.png')"></el-image>
              <el-image v-else :src="require('@/assets/home-image/up.png')"></el-image>
            </div>
            <div class="base-info-item-top" v-else>
              <div v-if="item.title === '违章率' || (pageName === 'vioBaseInfo' && item.title === '同期')" class="base-info-item-num">{{ item.value }}%</div>
              <count-to v-else class="base-info-item-num" :start-val="0" :end-val="item.value" :duration="2600"/>
            </div>
            <div class="base-info-item-bottom">{{ item.title }}</div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div v-if="pageName === 'accBaseInfo'" class="base-info-bottom" id="base-info-bottom-acc"></div>
    <div v-else class="base-info-bottom" id="base-info-bottom-vio"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import countTo from 'vue-count-to'
import {debounce, formatTime} from '@/utils/index'
export default {
  name: 'base-info',
  components: {countTo},
  props: {
    accType: {
      type: Number,
      default: 1
    },
    vioType: {
      type: Number,
      default: 1
    },
    pageName: {
      type: String,
      default: 'accBaseInfo'
    }
  },
  data() {
    return {
      firstChart: null,
      secondChart: null,
      firstLoopData: [
        {title: '累计事故', value: 1, change: 'up'},
        {title: '同期', value: 2, change: 'down'},
        {title: '同比',  rate: '0', change: 'up'},
      ],
      secondLoopData: [
        {title: '累计经损', value: 3, change: 'up'},
        {title: '同期', value: 4, change: 'down'},
        {title: '同比', rate: '-0.21', change: 'up'},
      ],
      date: formatTime(new Date(),'yyyy-MM-dd'),
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
      if(this.pageName === 'accBaseInfo') {
        this.firstChart && this.firstChart.resize()
      }else {
        this.secondChart && this.secondChart.resize()
      }
    },
    loadData() {
      // 文本信息
      this.getTextData()
      // // 图表信息
      let type = this.pageName === 'accBaseInfo' ? this.accType : this.vioType
      this.getChartData(type)
    },
    getTextData() {
      if(this.pageName === 'vioBaseInfo') {
        this.firstLoopData[0].title = '累计违章'
        this.secondLoopData[0].title = '违章率'
      }
      let objText = {
        'accBaseInfo': 'GetAccidentOverviewText',
        'vioBaseInfo': 'GetViolationAnalysisTextInfo',
      }
      let params = {
        begin: this.date.slice(0, 4) + '-01-01 00:00:00',
        end: this.date + ' 23:59:59',
      }
      this.$client[objText[this.pageName]](params).then(res => {
        if (res.head.result == '200') {
          this.firstLoopData[0].value = this.pageName === 'accBaseInfo' ? res.context.accident_count : res.context.violations_count
          this.firstLoopData[1].value = this.pageName === 'accBaseInfo' ? res.context.accident_count_last : res.context.violations_count_last
          this.firstLoopData[2].rate = this.pageName === 'accBaseInfo' ? res.context.accident_rate + '' : res.context.violations_count_yoy + ''
          this.secondLoopData[0].value = this.pageName === 'accBaseInfo' ? res.context.accident_loss : res.context.violations_rate
          this.secondLoopData[1].value = this.pageName === 'accBaseInfo' ? res.context.accident_loss_last : res.context.violations_rate_last
          this.secondLoopData[2].rate = this.pageName === 'accBaseInfo' ? res.context.accident_loss_rate + '' : res.context.violations_rate_yoy + ''
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    getChartData(type) {
      let objChart = {
        'accBaseInfo': 'GetAccidentOverviewChart',
        'vioBaseInfo': 'GetViolationAnalysisChartInfo',
      }
      let params = {
        begin: this.date.slice(0, 4) + '-01-01 00:00:00',
        end: this.date + ' 23:59:59',
        type: type
      }
      this.$client[objChart[this.pageName]](params).then(res => {
        if (res.head.result == '200') {
          this.loadChart(res.context || {}, this.pageName)
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    loadChart(data = {}, type='accBaseInfo') {
      if (type === 'accBaseInfo') {
        if (!this.firstChart) this.firstChart = echarts.init(document.getElementById('base-info-bottom-acc'));
      }else {
        if (!this.secondChart) this.secondChart = echarts.init(document.getElementById('base-info-bottom-vio'));
      }
			let option = {
				color: ['#A0BEFF', '#F8BB54', '#63A6FF', '#7BDEF1'],
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
          type: 'scroll',
          bottom: '0',
					itemWidth: 14,
				},
				grid: {
					top: '30',
					bottom: '45',
					left: '30',
					right: '10',
					containLabel: false
				},
				xAxis: [
					{
						type: 'category',
						data: data.names || [],
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
						// nameTextStyle: {
						// 	align: 'left',
						// 	color: '#fff',
						// 	fontSize: 14,
						// 	padding: [0, 0, 0, -20]
						// },
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
						name: '有责数量',
						type: 'bar',
						data: type==='accBaseInfo' ? data.duty_counts || [] : data.violations_counts || [],
					},
					{
						name: '无责数量',
						type: 'bar',
						data:  type==='accBaseInfo' ? data.noduty_counts || [] : data.violations_counts_last || [],
					},
					{
						name: '有责同期',
						type: 'bar',
						data:  type==='accBaseInfo' ? data.duty_last_counts || [] : data.violations_rates || [],
					},
					{
						name: '无责同期',
						type: 'bar',
						data:  type==='accBaseInfo' ? data.noduty_last_counts || [] : data.violations_rates_last || [],
					}
				]
			}
      if(type === 'accBaseInfo') {
        this.firstChart.setOption(option, true)
      }else {
        this.secondChart.setOption(option, true)
      }
		}
	},
	beforeDestroy() {
    if(this.pageName === 'accBaseInfo') {
      this.firstChart.dispose()
    }else {
      this.secondChart.dispose()
    }
	}
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.base-info {
  height: 100%;
  /deep/ .el-carousel__container {
    height: 50px * $NumWidth;
    .el-carousel__item {
      display: flex;
      justify-content: space-around;
      .base-info-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .base-info-item-top {
          display: flex;
          align-items: center;
          .base-info-item-num {
            font-family: DIN, DIN;
            font-weight: bold;
            font-size: 22px * $NumWidth;
            color: #333333;
          }
          .el-image {
            width: 11px * $NumWidth;
            height: 15px * $NumWidth;
            margin-left: 5px * $NumWidth;
            flex-shrink: 0;
          }
        }
        .base-info-item-bottom {
          font-family: Source Han Sans CN, Source Han Sans CN;
          font-weight: 400;
          font-size: 12px * $NumWidth;
          color: #333333;
          margin-top: 10px * $NumWidth;
        }
      }
    }
    .el-carousel__arrow {
      min-width: 20px * $NumWidth;
      min-height: 20px * $NumWidth;
    }
  }
  .base-info-bottom {
    height: 190px * $NumWidth;
  }
}
</style>