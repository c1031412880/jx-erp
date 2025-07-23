<template>
  <div class="accident-overview">
    <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
      <el-radio-group v-model="vioType" size="mini" :disabled="loading">
        <el-radio-button :label="1">按分公司</el-radio-button>
        <el-radio-button :label="2">按月</el-radio-button>
      </el-radio-group>
    </div>
    <el-carousel indicator-position="none" :interval="5000" :autoplay="false">
      <el-carousel-item v-for="(item, index) in list" :key="index">
        <div class="content-container-item" v-for="k in item.list" :key="k.name">
          <div class="content-container-top">
            <count-to 
              class="content-container-top-num" 
              :start-val="0" 
              :end-val="k.value" 
              :duration="2600" 
              :decimals="k.toFixed"
              :style="{ color: k.name !== '同比' ? '' : k.value >= 0 ? '#C61D29' : '#0F8CFF' }"
              />
            <span 
              class="content-container-top-unit" 
              :style="{ color: k.name !== '同比' ? '' : k.value >= 0 ? '#C61D29' : '#0F8CFF' }"
              >{{ k.unit }}</span>
            <el-image v-if="k.icon && k.value < 0" :src="require('@/assets/home-image/down.png')"></el-image>
            <el-image v-if="k.icon && k.value >= 0" :src="require('@/assets/home-image/up.png')"></el-image>
          </div>
          <div class="content-container-bottom">{{ k.name }}</div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <div class="chart-container" id="chart-container"></div>
  </div>
</template>
<script>
import countTo from 'vue-count-to'
import echarts from 'echarts'
import { formatTime, debounce } from '@/utils/index'
export default {
  name: 'accident-overview',
  components: {
    countTo
  },
  props: {
    dept_id: {
			type: Number,
			default: 0
		}
  },
  data() {
    return {
      chart: null,
      list: [],
      vioType: 1,
      loading: false,
      date: formatTime(new Date(),'yyyy-MM-dd'),
      dataList: [
				{
					name: '累计事故',
					value: 0,
					unit: '次',
					toFixed: 0
				},
				{
					name: '同期',
					value: 0,
					unit: '次',
					toFixed: 0
				},
				{
					name: '同比',
					value: 0,
					unit: '%',
          icon: true,
					toFixed: 1
				},
				{
					name: '累积经损',
					value: 0,
					unit: '元',
					toFixed: 0
				},
				{
					name: '同期',
					value: 0,
					unit: '元',
					toFixed: 0
				},
				{
					name: '同比',
					value: 0,
					unit: '%',
          icon: true,
					toFixed: 1
				}
			],
    }
  },
  created() {
    this.list = this.sliceArr(this.dataList, 3)
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
      this.chart && this.chart.resize()
    },
    // 拆分数组
    sliceArr(arr, split_len) {
			// arr: 待拆分数组 ； split_len: 拆分长度
			const res = []
			for (let i = 0; i < arr.length; i += split_len) {
				const chunk = arr.slice(i, i + split_len)
				let obj = {
					list: chunk
				}
				res.push(obj)
			}
			return res
		},
    // 加载数据
    loadData() { 
      this.loading = true
      // 文本信息
      this.getTextData()
      // // 图表信息
      this.getChartData(this.vioType)
    },
    // 获取文本信息
    getTextData() {
      let params = {
        begin: this.date.slice(0, 4) + '-01-01 00:00:00',
        end: this.date + ' 23:59:59',
        dept_id: this.dept_id,
      }
      this.$client.GetAccidentOverviewText(params).then(res => {
        if (res.head.result == '200') {
          this.dataList[0].value = res.context.accident_count
          this.dataList[1].value = res.context.accident_count_last
          this.dataList[2].value = res.context.accident_rate
          this.dataList[3].value = res.context.accident_loss
          this.dataList[4].value = res.context.accident_loss_last
          this.dataList[5].value = res.context.accident_loss_rate
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      }).finally(() => {
        this.loading = false
      })
    },
    getChartData(type) {
      let params = {
        begin: this.date.slice(0, 4) + '-01-01 00:00:00',
        end: this.date + ' 23:59:59',
        type: type,
        dept_id: this.dept_id,
      }
      this.$client.GetAccidentOverviewChart(params).then(res => {
        if (res.head.result == '200') {
          this.loadChart(res.context || {})
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      }).finally(() => {
        this.loading = false
        this.loadChart()
      })
    },
    loadChart(data = {}) {
      if (!this.chart) this.chart = echarts.init(document.getElementById('chart-container'));
			let option = {
				        color: [
          '#A0BEFF', '#CFA0FF', '#89C5F3', '#387CFF', '#FF6084', '#F8BB54', '#10DFD8',
          '#97FFFF', '#3399cc', '#339966', '#9AFF9A', '#B4EEB4', '#C9C9C9', '#cc66ff'
        ],
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
						data: data.duty_counts || [],
					},
					{
						name: '无责数量',
						type: 'bar',
						data:  data.noduty_counts || [],
					},
					{
						name: '有责同期',
						type: 'bar',
						data:  data.duty_last_counts || [],
					},
					{
						name: '无责同期',
						type: 'bar',
						data:  data.noduty_last_counts || [],
					}
				]
			}
      this.chart.setOption(option, true)
		}
  },
  beforeDestroy() {
    this.chart.dispose()
	}
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;

.accident-overview {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  // 单选按钮容器样式
  .el-radio-group {
    margin-bottom: 8px * $NumWidth;
  }
  
  /deep/ .el-carousel__container {
    height: 50px * $NumWidth;
    .el-carousel__item {
      display: flex;
      justify-content: space-around;
      .content-container-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .content-container-top {
          display: flex;
          align-items: center;
          .content-container-top-num {
            font-family: DIN, DIN;
            font-weight: bold;
            font-size: 22px * $NumWidth;
            color: #333333;
          }
          .content-container-top-unit {
            font-family: Source Han Sans CN, Source Han Sans CN;
            font-weight: 400;
            font-size: 12px * $NumWidth;
            color: #333333;
          }
          .el-image {
            width: 11px * $NumWidth;
            height: 15px * $NumWidth;
            margin-left: 5px * $NumWidth;
            flex-shrink: 0;
          }
        }
        .content-container-bottom {
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
  
  .chart-container {
    height: 205px * $NumWidth;
  }
}

// 单选按钮样式优化
/deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {
  background-color: #FFF1F2;
  border: 1px solid #C61D29;
  color: #C61D29;
  -webkit-box-shadow: -1px 0 0 0 #C61D29;
  box-shadow: -1px 0 0 0 #C61D29;
}

/deep/ .el-radio-button__inner:hover {
  color: #ee6069;
}

/deep/ .el-radio-button__inner {
  font-size: 12px * $NumWidth;
  padding: 6px * $NumWidth 10px * $NumWidth;
  border-radius: 3px * $NumWidth;
}

/deep/ .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 3px * $NumWidth 0 0 3px * $NumWidth;
}

/deep/ .el-radio-button:last-child .el-radio-button__inner {
  border-radius: 0 3px * $NumWidth 3px * $NumWidth 0;
}

/deep/ .el-radio-button:not(:first-child) .el-radio-button__inner {
  margin-left: -1px;
}
</style>