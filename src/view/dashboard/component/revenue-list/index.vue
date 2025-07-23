<template>
  <div class="revenue-list">
		<div class="revenue-title">昨日客流总量</div>
		<div class="revenue-top">
			<div class="revenue-top-left">
				<count-to class="revenue-top-left-num" :start-val="0" :end-val="form.value" :duration="2600"/>
				<el-image :src="require('@/assets/home-image/down-1.png')" v-if="form.rate.includes('-')"></el-image>
				<el-image :src="require('@/assets/home-image/up-1.png')" v-else></el-image>
				<span class="revenue-top-left-rate" :style="{'color': form.rate.includes('-') ? '#0F8CFF' : '#C61D29'}">{{ form.rate }}</span>
			</div>
			<div class="revenue-top-right">
				<span class="revenue-top-right-title">日均客流量</span>
				<count-to class="revenue-top-right-ave" :start-val="0" :end-val="form.ave" :duration="2600"/>
			</div>
		</div>
		<div id="revenue-bottom" class="revenue-bottom"></div>
	</div>
</template>

<script>
import echarts from 'echarts'
import countTo from 'vue-count-to'
import {debounce} from '@/utils/index'
export default {
  name: 'revenue-list',
	components: {countTo},
  data() {
    return {
      revChart: null,
			form: {
				value: 0,
				rate: '0',
				ave: 0,
			}
    };
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
      this.revChart && this.revChart.resize()
    },
    loadData() {
			this.$client.GetKeLiu().then(res => {
        if (res.head.result == '200') {
          this.form.value = res.context.yesterday_data
          this.form.rate = res.context.rate + '%'
          this.form.ave = res.context.avg_data
					this.initChart(res.context.chart.xAxis, res.context.chart.data[0].data)
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    initChart(names = [], data = []) {
      this.revChart = echarts.init(document.getElementById('revenue-bottom'));
      let option = {
				color: ['#F57982'],
				grid: {
					left: '3%',
					right: '3%',
					bottom: '3%',
					top: '18%',
				},
				tooltip: {
					trigger: 'axis',
					backgroundColor: '#222222',
					textStyle: {
						color: '#FFFFFF'
					}
				},
				xAxis: [
					{
						type: 'category',
						axisLine:{
							lineStyle:{
								color:'#EBEEF5',
								width: 2
							}
						},
						axisTick: {
							show: false,
						},
						data: names.length ? names : ['暂无数据'],
						boundaryGap: false,
						splitLine: {
							show: true,
							lineStyle: {
								color: ['#EBEEF5'],
								width: 0.5,
								type: 'solid'
							}
						}
					}
				],
				yAxis:{
					axisLabel: {
						show: false
					},
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					splitLine: {
						show: true,
						lineStyle: {
							color: ['#EBEEF5'],
							width: 0.5,
							type: 'solid'
						}
					}
				},
				series: [
					{
						type: 'line',
						data: data.length ? data : [ 0, ],
						showSymbol: true,
						symbolSize: 4,
						smooth:true,
						colorBy: "series",
						lineStyle: {
							color: '#F57982'
						},
						// label: {
						// 	show: true,
						// 	position: 'top',
						// 	color: '#333333',
						// 	formatter: function(params) {
						// 		return params.value
						// 	}
						// },
						areaStyle: {
							color: {
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [
									{
										offset: 0,
										color: 'rgba(198,29,41,0.32)' // 0% 处的颜色
									},
									{
										offset: 1,
										color: 'rgba(198,29,41,0)' // 100% 处的颜色
									}
								]
							}
						}
					}
				]
			}
			this.revChart.setOption(option)
    },
		beforeDestroy() {
			if (this.revChart) this.revChart.dispose()
		}
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.revenue-list {
  height: 100%;
	.revenue-title {
		font-family: Source Han Sans CN, Source Han Sans CN;
		font-weight: 400;
		font-size: 14px * $NumWidth;
		color: #333333;
		padding: 10px * $NumWidth 0 10px * $NumWidth 15px * $NumWidth;
	}
	.revenue-top {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20px * $NumWidth;
		.revenue-top-left {
			flex-shrink: 0;
			.revenue-top-left-num {
				font-family: DIN, DIN;
				font-weight: bold;
				font-size: 50px * $NumWidth;
				color: #333333;
			}
			.el-image {
				width: 12px * $NumWidth;
				height: 11px * $NumWidth;
				// margin-right: 5px * $NumWidth;
				flex-shrink: 0;
			}
			.revenue-top-left-rate {
				font-family: DIN, DIN;
				font-weight: bold;
				font-size: 14px * $NumWidth;
			}
		}
		.revenue-top-right {
			display: flex;
			flex-shrink: 0;
			span {
				align-self: flex-end;
				color: #333333;
			}
			.revenue-top-right-title {
				font-family: Source Han Sans CN, Source Han Sans CN;
				font-weight: 400;
				font-size: 14px * $NumWidth;
				margin: 5px * $NumWidth;
			}
			.revenue-top-right-ave {
				font-family: DIN, DIN;
				font-weight: bold;
				font-size: 24px * $NumWidth;
			}
		}
	}
	.revenue-bottom {
		height: 190px * $NumWidth;
		width: 100%;
	}
}
</style>