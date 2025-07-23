<template>
  <div class="base-info">
    <div class="base-info-top">
      <el-carousel indicator-position="none" :interval="5000">
        <el-carousel-item>
          <div class="base-info-item" v-for="item in firstLoopData" :key="item.title">
            <div class="base-info-item-top" v-if="item.title === '同比'">
              <div class="base-info-item-num" :style="{'color': item.rate.includes('-') ? '#0F8CFF' : '#C61D29'}">{{ item.rate || 0 }}%</div>
              <el-image v-if="item.rate.includes('-')" :src="require('@/assets/home-image/down.png')"></el-image>
              <el-image v-else :src="require('@/assets/home-image/up.png')"></el-image>
            </div>
            <div class="base-info-item-top" v-else>
              <count-to class="base-info-item-num" :start-val="0" :end-val="item.value" :duration="2600"/>
            </div>
            <div class="base-info-item-bottom">{{item.title}}{{pageName === 'eleBaseInfo' ? '电耗' : pageName === 'gasBaseInfo' ? '气耗' : '氢耗'}}</div>
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <div class="base-info-item" v-for="item in secondLoopData" :key="item.title">
            <div class="base-info-item-top" v-if="item.title === '同比'">
              <div class="base-info-item-num" :style="{'color': item.rate.includes('-') ? '#0F8CFF' : '#C61D29'}">{{ item.rate || 0 }}%</div>
              <el-image v-if="item.rate.includes('-')" :src="require('@/assets/home-image/down.png')"></el-image>
              <el-image v-else :src="require('@/assets/home-image/up.png')"></el-image>
            </div>
            <div class="base-info-item-top" v-else>
              <count-to class="base-info-item-num" :start-val="0" :end-val="item.value" :duration="2600"/>
            </div>
            <div class="base-info-item-bottom">{{item.title}}{{pageName === 'eleBaseInfo' ? '电耗' : pageName === 'gasBaseInfo' ? '气耗' : '氢耗'}}</div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div v-if="pageName === 'eleBaseInfo'" class="base-info-bottom" id="base-info-bottom-ele"></div>
    <div v-else-if="pageName === 'gasBaseInfo'" class="base-info-bottom" id="base-info-bottom-gas"></div>
    <div v-else class="base-info-bottom" id="base-info-bottom-hy"></div>
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
    eleType: {
      type: Number,
      default: 2
    },
    gasType: {
      type: Number,
      default: 2
    },
    hyType: {
      type: Number,
      default: 2
    },
    pageName: {
      type: String,
      default: 'eleBaseInfo'
    }
  },
  data() {
    return {
      eleChart: null,
      gasChart: null,
      hyChart: null,
      firstLoopData: [
        {title: '本年累计', value: 0},
        {title: '去年同期', value: 0},
        {title: '同比',  rate: '0'},
      ],
      secondLoopData: [
        {title: '百公里', value: 0},
        {title: '同期', value: 0},
        {title: '同比', rate: '-0.21'},
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
      switch(this.pageName) {
        case 'eleBaseInfo':
          this.eleChart && this.eleChart.resize()
          break;
        case 'gasBaseInfo':
          this.gasChart && this.gasChart.resize()
          break;
        case 'hyBaseInfo':
          this.hyChart && this.hyChart.resize()
          break;
        default:
          break;
      }
    },
    loadData() {
      let params = {
        type: this.pageName === 'eleBaseInfo' ? this.eleType : this.pageName === 'gasBaseInfo' ? this.gasType : this.hyType,
        query_type: this.pageName === 'eleBaseInfo' ? 1 : this.pageName === 'gasBaseInfo' ? 2 : 3,
      }
      if(params.type === 1) {
        params.month = formatTime(new Date(),'yyyy-MM').slice(0,7)
      }
      this.$client.GetVehicleEnergy(params).then(res => {
        if (res.head.result == '200') {
          this.firstLoopData[0].value = res.context.now_val || 0
          this.firstLoopData[1].value = res.context.last_val || 0
          this.firstLoopData[2].rate = res.context.yoy || ''
          this.secondLoopData[0].value = res.context.kilometer_val || 0
          this.secondLoopData[1].value = res.context.kilometer_last_val || 0
          this.secondLoopData[2].rate = res.context.kilometer_yoy || ''
          let names = res.context.valTotals.map(item => item.year_month)
          let data = res.context.valTotals.map(item => item.val)
          this.loadChart(names || [], data || [], this.pageName)
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    loadChart(names = [], data = [], type='eleBaseInfo') {
      
      switch (type) {
        case 'eleBaseInfo':
          if (!this.eleChart) this.eleChart = echarts.init(document.getElementById('base-info-bottom-ele'));
          break;
        case 'gasBaseInfo':
          if (!this.gasChart) this.gasChart = echarts.init(document.getElementById('base-info-bottom-gas'));
          break;
        case 'hyBaseInfo':
          if (!this.hyChart) this.hyChart = echarts.init(document.getElementById('base-info-bottom-hy'));
          break;
        default:
          break;
      }
			let option = {
				color: ['#3869F4', '#37D6CE'],
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
						color: '#FFFFFF'
					}
				},
				legend: {
          bottom: '0',
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
						axisTick: {
							show: false,
						},
            data: names.length ? names : ['暂无数据'],
            axisLine:{
							lineStyle:{
								color:'#D1D1D1',
							}
						},
            axisLabel: {
              color: "#666666"
            },
						splitLine: {
							show: false,
						}
					}
				],
				yAxis: [
					{
						type: 'value',
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
						name: type === 'eleBaseInfo' ? '电耗' : type === 'gasBaseInfo' ? '气耗' : '氢耗',
						type: 'line',
            symbol: 'circle',
						smooth: true,
            areaStyle: {
							color: {
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [
									{
										offset: 0,
										color: '#7698F8' // 0% 处的颜色
									},
									{
										offset: 0.8,
										color: 'transparent' // 100% 处的颜色
									}
								]
							}
						},
						data: data.length ? data : [ 0, ],
					},
					// {
					// 	name: '百公里电耗',
					// 	type: 'line',
          //   symbol: 'circle',
					// 	smooth: true,
          //   areaStyle: {
					// 		color: {
					// 			x: 0,
					// 			y: 0,
					// 			x2: 0,
					// 			y2: 1,
					// 			colorStops: [
					// 				{
					// 					offset: 0,
					// 					color: '#37D6CE' // 0% 处的颜色
					// 				},
					// 				{
					// 					offset: 0.8,
					// 					color: 'transparent' // 100% 处的颜色
					// 				}
					// 			]
					// 		}
					// 	},
					// 	data:  data || [],
					// }
				]
			}
      switch (type) {
        case 'eleBaseInfo':
          this.eleChart.setOption(option, true)
          break;
        case 'gasBaseInfo':
          this.gasChart.setOption(option, true)
          break;
        case 'hyBaseInfo':
          this.hyChart.setOption(option, true)
          break;
        default:
          break;
      }
		}
	},
	beforeDestroy() {
    switch (this.pageName) {
      case 'eleBaseInfo':
        this.eleChart.dispose()
        break;
      case 'gasBaseInfo':
        this.gasChart.dispose()
        break;
      case 'hyBaseInfo':
        this.hyChart.dispose()
        break;
      default:
        break;
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